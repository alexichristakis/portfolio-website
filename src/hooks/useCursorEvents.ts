import { useContext } from "react";

import { CursorStateContext } from "../context";
import {
  CursorMoveEventPayload,
  CursorLockEventPayload,
  CursorUnlockEventPayload,
  CursorEventType,
} from "./useCursorState";

export const useCursorEvents = (handlers: {
  onMove?: (payload: CursorMoveEventPayload) => void;
  onLock?: (payload: CursorLockEventPayload) => void;
  onUnlock?: (payload: CursorUnlockEventPayload) => void;
}) => {
  const { emitter } = useContext(CursorStateContext);

  emitter.subscribe({
    next: (payload) => {
      if (payload.type === CursorEventType.LOCK) {
        handlers.onLock?.(payload);
      } else if (payload.type === CursorEventType.UNLOCK) {
        handlers.onUnlock?.(payload);
      } else if (payload.type === CursorEventType.MOVE) {
        handlers.onMove?.(payload);
      }
    },
  });

  return () => emitter.unsubscribe();
};
