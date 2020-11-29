import { createContext, useMemo, useRef, useState } from "react";
import { Subject } from "rxjs";

import { Project as ProjectType } from "../types";
import { Window } from "../components";

export type WindowConfig = ProjectType & {
  id: string;
  sourceRef: React.RefObject<HTMLElement>;
};

type WindowManagerContext = {
  spawnWindow: (newWindow: WindowConfig) => void;
  destroyWindow: (id: string) => void;
  windows: WindowConfig[];
  events: Subject<WindowManagerEventPayload>;
};

export type WindowEventType = "SPAWN" | "REQUEST_CLOSE" | "DESTROY";
type WindowManagerEventPayload = {
  type: WindowEventType;
  id: string;
};

export const WindowManagerContext = createContext<WindowManagerContext>(
  {} as WindowManagerContext
);

export const WindowManagerProvider: React.FC = ({ children }) => {
  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const events = useMemo(() => new Subject<WindowManagerEventPayload>(), []);

  const spawnWindow = (newWindow: WindowConfig) => {
    events.next({ type: "SPAWN", id: newWindow.id });
    setWindows((prev) => [...prev, newWindow]);
  };

  const requestClose = (id: string) => {
    events.next({ type: "REQUEST_CLOSE", id });
  };

  const destroyWindow = (id: string) => {
    events.next({ type: "DESTROY", id });
    setWindows((prev) => prev.filter((window) => window.id !== id));
  };

  return (
    <WindowManagerContext.Provider
      value={{
        events,
        spawnWindow,
        destroyWindow,
        windows,
      }}
    >
      {children}
      <div className="absolute-fill pointer-none" ref={containerRef}>
        {windows.map((window) => (
          <Window
            key={window.id}
            onRequestClose={() => requestClose(window.id)}
            destroyWindow={() => destroyWindow(window.id)}
            containerRef={containerRef}
            {...window}
          />
        ))}
      </div>
    </WindowManagerContext.Provider>
  );
};
