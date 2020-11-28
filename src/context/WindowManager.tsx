import {} from "framer-motion";
import { createContext, useRef, useState } from "react";

import { Window } from "../components";

export type WindowConfig = {
  id: string;
  title: string;
  sourceRef: React.RefObject<HTMLElement>;
  content: JSX.Element;
};

type WindowManagerContext = {
  spawnWindow: (newWindow: WindowConfig) => void;
  destroyWindow: (id: string) => void;
  windows: WindowConfig[];
};

export const WindowManagerContext = createContext<WindowManagerContext>(
  {} as WindowManagerContext
);

export const WindowManagerProvider: React.FC = ({ children }) => {
  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnWindow = (newWindow: WindowConfig) =>
    setWindows((prev) => [...prev, newWindow]);

  const destroyWindow = (id: string) =>
    setWindows((prev) => prev.filter((window) => window.id !== id));

  const requestClose = (id: string) => {};

  return (
    <WindowManagerContext.Provider
      value={{
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
