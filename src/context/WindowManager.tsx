import { createContext, useCallback, useMemo, useRef, useState } from "react";
import { Subject } from "rxjs";

import { Project as ProjectType } from "../types";
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
  events: Subject<WindowManagerEventPayload>;
  getWindowState: (id: string) => WindowState;
  registerWindow: (window: WindowConfig) => void;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
};

type WindowManagerEventPayload = {
  type: WindowState;
  id: string;
};

export const WindowManagerContext = createContext({} as WindowManagerState);

export enum WindowState {
  OPEN,
  CLOSING,
  CLOSED,
}

type WindowMap = {
  [id: string]: WindowConfig & { state: WindowState };
};

export const WindowManagerProvider: React.FC = ({ children }) => {
  const registeredWindows = useRef<WindowMap>({});
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const events = useMemo(() => new Subject<WindowManagerEventPayload>(), []);

  const registerWindow = useCallback((window: WindowConfig) => {
    if (!registeredWindows.current[window.id]) {
      registeredWindows.current[window.id] = {
        ...window,
        state: WindowState.CLOSED,
      };
    }
  }, []);

  const handleWindowOpen = useCallback((id: string) => {
    events.next({ id, type: WindowState.OPEN });
    registeredWindows.current[id].state = WindowState.OPEN;
    setOpenWindows((prev) => [...prev, id]);
  }, []);

  const openWindow = useCallback((id: string) => {
    const window = registeredWindows.current[id];
    if (window) {
      const { state } = window;
      if (state !== WindowState.OPEN) {
        handleWindowOpen(id);
      }
    }
  }, []);

  const requestClose = useCallback((id: string) => {
    events.next({ id, type: WindowState.CLOSING });
    registeredWindows.current[id].state = WindowState.CLOSING;
  }, []);

  const closeWindow = useCallback((id: string) => {
    events.next({ id, type: WindowState.CLOSED });
    registeredWindows.current[id].state = WindowState.CLOSED;
    setOpenWindows((prev) => prev.filter((window) => window !== id));
  }, []);

  const getWindowState = useCallback(
    (id: string) => registeredWindows.current[id]?.state ?? WindowState.CLOSED,
    []
  );

  const state = useMemo(
    () => ({
      events,
      getWindowState,
      openWindow,
      closeWindow,
      registerWindow,
    }),
    []
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
            {...registeredWindows.current[id]}
          />
        ))}
      </div>
    </WindowManagerContext.Provider>
  );
};
