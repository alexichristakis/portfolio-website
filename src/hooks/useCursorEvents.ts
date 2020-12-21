import { useContext, useEffect } from "react";
import { CursorStateContext, CursorEvent, CursorEventType } from "../context";

type CursorEventHandlers = {
  onLock?: (ev: CursorEvent) => void;
  onUnlock?: (ev: CursorEvent) => void;
};

export const useCursorEvents = (handlers: CursorEventHandlers) => {
  const { subscribe, ...rest } = useContext(CursorStateContext);

  useEffect(() => {
    const unsubscribe = subscribe(({ type, target, position }) => {
      if (type === CursorEventType.LOCK) {
        handlers.onLock?.({ type, target, position });
      }

      if (type === CursorEventType.UNLOCK) {
        handlers.onUnlock?.({ type, target, position });
      }
    });

    return () => unsubscribe();
  }, []);

  return rest;
};
