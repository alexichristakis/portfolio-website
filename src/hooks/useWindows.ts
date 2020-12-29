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

export const useWindows = ({ id, handlers = {} }: UseWindowConfig) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const { openWindow, registerWindow, subscribe } = useContext(
    WindowManagerContext
  );

  useMountEffect(() => {
    registerWindow({ id, sourceRef });

    const { onOpen, onRequestClose, onClose } = handlers;
    const unsubscribe = subscribe((payload) => {
      const { type, id: windowId } = payload;
      if (id === windowId) {
        switch (type) {
          case WindowState.OPEN:
            return onOpen?.();
          case WindowState.CLOSING:
            return onRequestClose?.();
          case WindowState.CLOSED:
            return onClose?.();
          default:
            break;
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
