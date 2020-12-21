import { useCallback, useRef } from "react";

type BasePayload = {};

type Listener<Payload extends BasePayload> = (payload: Payload) => void;

export type Events<Payload extends BasePayload> = {
  send: Listener<Payload>;
  subscribe: (l: Listener<Payload>) => () => void;
};

export const useEvents = <Payload extends BasePayload>(): Events<Payload> => {
  const listeners = useRef<Listener<Payload>[]>([]);

  const send = useCallback((payload: Payload) => {
    listeners.current.forEach((listener) => listener?.(payload));
  }, []);

  const unsubscribe = (listener?: Listener<Payload>) => {
    listeners.current = listeners.current.filter((l) => l !== listener);
  };

  const subscribe = useCallback((listener: Listener<Payload>) => {
    listeners.current.push(listener);
    return () => unsubscribe(listener);
  }, []);

  return {
    send,
    subscribe,
  };
};
