import { useContext, useEffect, useRef, useState } from "react";

import {
  WindowConfig,
  WindowEventHandlers,
  WindowManagerContext,
  WindowState,
} from "../context";

export type UseWindowConfig = {
  window: Omit<WindowConfig, "sourceRef">;
  handlers?: WindowEventHandlers;
};

export const useWindows = ({ window, handlers }: UseWindowConfig) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const [windowState, setWindowState] = useState(WindowState.CLOSED);
  const { openWindow, registerWindow, subscribe } = useContext(
    WindowManagerContext
  );

  useEffect(() => {
    registerWindow({ ...window, sourceRef });

    const unsubscribe = subscribe((payload) => {
      const { type, id } = payload;

      if (id === window.id) {
        setWindowState(type);
        if (type === WindowState.OPEN) {
          handlers?.onOpen?.();
        }
        if (type === WindowState.CLOSING) {
          handlers?.onRequestClose?.();
        }
        if (type === WindowState.CLOSED) {
          handlers?.onClose?.();
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    openWindow: () => openWindow(window.id),
    sourceRef,
    windowState,
  };
};
