import { MotionValue, useMotionValue } from "framer-motion";
import { createContext, useCallback, useRef, useEffect } from "react";
import { CURSOR_ZINDEX } from "../lib";

export type CursorMoveHandlers = {
  handler: {
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;
  };
};

export type CursorEventPayload = {
  position: { x: number; y: number };
  rect: DOMRect | null;
  scaleFactor: number | null;
};

type CursorEventType = "LOCK" | "UNLOCK";
export type CursorEventListenerCallback = (payload: CursorEventPayload) => void;
export type CursorEventListener = {
  type: CursorEventType;
  cb: CursorEventListenerCallback;
};

export type CursorPositionState = {
  position: { x: MotionValue<number>; y: MotionValue<number> };
  isLocked: MotionValue<boolean>;
  zIndex: MotionValue<number>;
  cursorRef: React.RefObject<HTMLDivElement>;
  scaleFactor: React.RefObject<number>;
  lockedRect: React.RefObject<DOMRect>;
  lock: (rect: DOMRect, scale?: number, zIndex?: number) => void;
  unlock: () => void;
  subscribeListener: (config: CursorEventListener) => void;
  unsubscribeListener: (cb?: CursorEventListenerCallback) => void;
};

export const CursorStateContext = createContext({} as CursorPositionState);

export const CursorStateProvider: React.FC = ({ children }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lockedRect = useRef<DOMRect | null>(null);
  const scaleFactor = useRef<number>(1);
  const eventCallbacks = useRef<CursorEventListener[]>([]);
  const zIndex = useMotionValue(CURSOR_ZINDEX);
  const isLocked = useMotionValue(false);
  const x = useMotionValue(-10);
  const y = useMotionValue(-10);

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      x.set(clientX);
      y.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const lock = useCallback(
    (rect: DOMRect, scale?: number, lockedElementZIndex?: number) => {
      if (scale) scaleFactor.current = scale;
      if (lockedElementZIndex) zIndex.set(lockedElementZIndex - 1);
      lockedRect.current = rect;
      isLocked.set(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cursorRef.current?.classList.add("locked");

      updateListeners("LOCK");
    },
    []
  );

  const unlock = useCallback(() => {
    updateListeners("UNLOCK");

    lockedRect.current = null;
    scaleFactor.current = 1;
    isLocked.set(false);

    timeoutRef.current = setTimeout(() => {
      cursorRef.current?.classList.remove("locked");
      zIndex.set(CURSOR_ZINDEX);
    }, 200);
  }, []);

  // listener handling
  const updateListeners = useCallback((type: CursorEventType) => {
    const payload = {
      position: { x: x.get(), y: y.get() },
      rect: lockedRect.current,
      scaleFactor: scaleFactor.current,
    };

    eventCallbacks.current.forEach((listener) => {
      if (listener.type === type) {
        listener.cb(payload);
      }
    });
  }, []);

  const subscribeListener = (listener: CursorEventListener) =>
    eventCallbacks.current.push(listener);

  const unsubscribeListener = (cb?: CursorEventListenerCallback) =>
    (eventCallbacks.current = eventCallbacks.current.filter(
      (listener) => listener.cb !== cb
    ));

  return (
    <CursorStateContext.Provider
      value={{
        position: { x, y },
        cursorRef,
        lockedRect,
        scaleFactor,
        zIndex,
        isLocked,
        lock,
        unlock,
        subscribeListener,
        unsubscribeListener,
      }}
    >
      {children}
    </CursorStateContext.Provider>
  );
};
