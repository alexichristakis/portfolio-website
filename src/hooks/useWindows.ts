import { useContext, useEffect, useRef, useState } from "react";

import { WindowConfig, WindowManagerContext, WindowState } from "../context";

export type UseWindowConfig = {
  window: Omit<WindowConfig, "sourceRef">;
};

export const useWindows = ({ window }: UseWindowConfig) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const [windowState, setWindowState] = useState(WindowState.CLOSED);
  const { openWindow, registerWindow, events } = useContext(
    WindowManagerContext
  );

  useEffect(() => {
    registerWindow({ ...window, sourceRef });

    const subscription = events.subscribe((payload) => {
      const { type, id } = payload;

      if (id === window.id) {
        setWindowState(type);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    openWindow: () => openWindow(window.id),
    sourceRef,
    windowState,
  };
};
