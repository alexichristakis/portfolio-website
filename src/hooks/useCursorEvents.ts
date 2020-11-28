import { useContext, useEffect } from "react";
import {
  CursorStateContext,
  CursorEventPayload,
  CursorEventListenerCallback,
} from "../context";

type CursorEventHandlers = {
  onLock?: CursorEventListenerCallback;
  onUnlock?: CursorEventListenerCallback;
};

export const useCursorEvents = (handlers: CursorEventHandlers) => {
  const { subscribeListener, unsubscribeListener, ...rest } = useContext(
    CursorStateContext
  );

  useEffect(() => {
    if (handlers.onLock) {
      subscribeListener({ cb: handlers.onLock, type: "LOCK" });
    }

    if (handlers.onUnlock) {
      subscribeListener({ cb: handlers.onUnlock, type: "UNLOCK" });
    }

    return () => {
      unsubscribeListener(handlers.onLock);
      unsubscribeListener(handlers.onUnlock);
    };
  }, []);

  return rest;
};
