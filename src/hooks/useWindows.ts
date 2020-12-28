import { useContext, useRef } from "react";

import {
  WindowEventHandlers,
  WindowManagerContext,
  WindowState,
} from "../context";
import { useMountEffect } from "./useMountEffect";

export type UseWindowConfig = {
  id: string;
  handlers?: WindowEventHandlers;
};

export const useWindows = ({ id, handlers }: UseWindowConfig) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const { openWindow, registerWindow, subscribe } = useContext(
    WindowManagerContext
  );

  useMountEffect(() => {
    registerWindow({ id, sourceRef });
    const unsubscribe = subscribe((payload) => {
      const { type, id: windowId } = payload;
      if (id === windowId) {
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
    openWindow: () => openWindow(id),
    sourceRef,
  };
};
