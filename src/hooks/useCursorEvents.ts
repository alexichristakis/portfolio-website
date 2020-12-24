import { useContext } from "react";
import { CursorStateContext, CursorEvent, CursorEventType } from "../context";
import { useMountEffect } from "./useMountEffect";

type CursorEventHandlers = {
  onLock?: (ev: CursorEvent) => void;
  onUnlock?: (ev: CursorEvent) => void;
};

export const useCursorEvents = (handlers: CursorEventHandlers) => {
  const { subscribe, ...rest } = useContext(CursorStateContext);

  useMountEffect(() => {
    const unsubscribe = subscribe(({ type, target, position }) => {
      if (type === CursorEventType.LOCK) {
        handlers.onLock?.({ type, target, position });
      }

      if (type === CursorEventType.UNLOCK) {
        handlers.onUnlock?.({ type, target, position });
      }
    });

    return () => unsubscribe();
  });

  return rest;
};
