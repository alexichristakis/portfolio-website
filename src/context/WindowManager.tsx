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
  onSpawn?: () => void;
};

type WindowManagerState = {
  spawnWindow: (newWindow: WindowConfig) => void;
  destroyWindow: (id: string) => void;
  registerWindow: (id: string, ref: React.RefObject<HTMLElement>) => void;
  windows: WindowConfig[];
  openWindows: string[];
  events: Subject<WindowManagerEventPayload>;
};

export type WindowEventType = "SPAWN" | "REQUEST_CLOSE" | "DESTROY";
type WindowManagerEventPayload = {
  type: WindowEventType;
  id: string;
};

export const WindowManagerContext = createContext({} as WindowManagerState);

export const WindowManagerProvider: React.FC = ({ children }) => {
  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const sourceRefs = useRef<{
    [id: string]: React.RefObject<HTMLElement>;
  }>({});
  const events = useMemo(() => new Subject<WindowManagerEventPayload>(), []);

  const registerWindow = useCallback(
    (id: string, ref: React.RefObject<HTMLElement>) => {
      console.log("register window", id, ref);
      sourceRefs.current[id] = ref;
    },
    []
  );

  const spawnWindow = useCallback((newWindow: WindowConfig) => {
    events.next({ type: "SPAWN", id: newWindow.id });
    setWindows((prev) => [...prev, newWindow]);
    setOpenWindows((prev) => [...prev, newWindow.id]);
  }, []);

  const requestClose = useCallback((idToClose: string) => {
    setOpenWindows((prev) => prev.filter((id) => id !== idToClose));
    events.next({ type: "REQUEST_CLOSE", id: idToClose });
  }, []);

  const destroyWindow = useCallback((id: string) => {
    events.next({ type: "DESTROY", id });
    setWindows((prev) => prev.filter((window) => window.id !== id));
  }, []);

  // expose to context the controls to spawn, destroy, and subscribe
  // to window events
  const state = {
    windows,
    openWindows,
    events,
    spawnWindow,
    destroyWindow,
    registerWindow,
  };

  return (
    <WindowManagerContext.Provider value={state}>
      {children}
      <div className="absolute-fill pointer-none">
        {windows.map((window) => (
          <Window
            key={window.id}
            sourceRefs={sourceRefs}
            onRequestClose={() => requestClose(window.id)}
            destroyWindow={() => destroyWindow(window.id)}
            {...window}
          />
        ))}
      </div>
    </WindowManagerContext.Provider>
  );
};
