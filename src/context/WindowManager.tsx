import { createContext, useCallback, useMemo, useRef, useState } from "react";

import { Project as ProjectType } from "../types";
import { useEvents, Events } from "../hooks";
import { Window } from "../components";

export type WindowConfig = ProjectType & {
  id: string;
  sourceRef: React.RefObject<HTMLElement>;
};

export type WindowEventHandlers = {
  onRequestClose?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
};

type WindowManagerState = {
  registerWindow: (window: WindowConfig) => void;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  subscribe: Events<WindowEvent>["subscribe"];
};

export enum WindowState {
  OPEN,
  CLOSING,
  CLOSED,
}

type WindowEvent = {
  type: WindowState;
  id: string;
};

type WindowMap = {
  [id: string]: WindowConfig & { state: WindowState };
};

export const WindowManagerContext = createContext({} as WindowManagerState);

export const WindowManagerProvider: React.FC = ({ children }) => {
  const registeredWindows = useRef<WindowMap>({});
  const [openWindows, setOpenWindows] = useState<string[]>([]);

  const { send, subscribe } = useEvents<WindowEvent>();

  const registerWindow = useCallback((window: WindowConfig) => {
    if (!registeredWindows.current[window.id]) {
      registeredWindows.current[window.id] = {
        ...window,
        state: WindowState.CLOSED,
      };
    }
  }, []);

  const handleWindowOpen = useCallback(
    (id: string) => {
      send({ type: WindowState.OPEN, id });
      registeredWindows.current[id].state = WindowState.OPEN;
      requestAnimationFrame(() => {
        setOpenWindows((prev) => [...prev, id]);
      });
    },
    [send]
  );

  const openWindow = useCallback(
    (id: string) => {
      const window = registeredWindows.current[id];
      if (window) {
        const { state } = window;
        if (state !== WindowState.OPEN) {
          handleWindowOpen(id);
        }
      }
    },
    [handleWindowOpen]
  );

  const requestClose = useCallback(
    (id: string) => {
      send({ type: WindowState.CLOSING, id });
      registeredWindows.current[id].state = WindowState.CLOSING;
    },
    [send]
  );

  const closeWindow = useCallback(
    (id: string) => {
      send({ type: WindowState.CLOSED, id });
      registeredWindows.current[id].state = WindowState.CLOSED;
      requestAnimationFrame(() => {
        setOpenWindows((prev) => prev.filter((window) => window !== id));
      });
    },
    [send]
  );

  const state = useMemo(
    () => ({
      subscribe,
      openWindow,
      closeWindow,
      registerWindow,
    }),
    [subscribe, openWindow, closeWindow, registerWindow]
  );

  return (
    <WindowManagerContext.Provider value={state}>
      {children}
      <div className="absolute-fill pointer-none">
        {openWindows.map((id) => (
          <Window
            key={id}
            onRequestClose={() => requestClose(id)}
            destroyWindow={() => closeWindow(id)}
            // topWindow={topWindow}
            {...registeredWindows.current[id]}
          />
        ))}
      </div>
    </WindowManagerContext.Provider>
  );
};
