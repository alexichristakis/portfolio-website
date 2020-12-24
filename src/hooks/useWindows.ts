import { useContext, useRef } from "react";

import {
  WindowConfig,
  WindowEventHandlers,
  WindowManagerContext,
  WindowState,
} from "../context";
import { useMountEffect } from "./useMountEffect";

export type UseWindowConfig = {
  window: Omit<WindowConfig, "sourceRef">;
  handlers?: WindowEventHandlers;
};

export const useWindows = ({ window, handlers }: UseWindowConfig) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const { openWindow, registerWindow, subscribe } = useContext(
    WindowManagerContext
  );

  useMountEffect(() => {
    registerWindow({ ...window, sourceRef });

    const unsubscribe = subscribe((payload) => {
      const { type, id } = payload;

      if (id === window.id) {
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
  });

  return {
    openWindow: () => openWindow(window.id),
    sourceRef,
  };
};
