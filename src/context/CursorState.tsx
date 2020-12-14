import { createContext, useCallback, useRef, useEffect } from "react";
import { MotionValue, useMotionValue } from "framer-motion";

import { CURSOR_ZINDEX } from "../lib";
import { Events, useEvents } from "../hooks";

export type CursorMoveHandlers = {
  handler: {
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;
  };
};

export enum CursorEventType {
  "LOCK",
  "UNLOCK",
}

export type CursorEvent = {
  type: CursorEventType;
  position: { x: number; y: number };
  rect: DOMRect | null;
  scaleFactor: number | null;
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
  subscribe: Events<CursorEvent>["subscribe"];
};

export const CursorStateContext = createContext({} as CursorPositionState);

export const CursorStateProvider: React.FC = ({ children }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lockedRect = useRef<DOMRect | null>(null);
  const scaleFactor = useRef<number>(1);
  const zIndex = useMotionValue(CURSOR_ZINDEX);
  const isLocked = useMotionValue(false);
  const x = useMotionValue(-10);
  const y = useMotionValue(-10);

  const { send, subscribe } = useEvents<CursorEvent>();

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      x.set(clientX);
      y.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const makeEventPayload = (type: CursorEventType): CursorEvent => ({
    type,
    position: { x: x.get(), y: y.get() },
    rect: lockedRect.current,
    scaleFactor: scaleFactor.current,
  });

  const lock = useCallback(
    (rect: DOMRect, scale?: number, lockedElementZIndex?: number) => {
      if (scale) scaleFactor.current = scale;
      if (lockedElementZIndex) zIndex.set(lockedElementZIndex - 1);
      lockedRect.current = rect;
      isLocked.set(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cursorRef.current?.classList.add("locked");

      send(makeEventPayload(CursorEventType.LOCK));
    },
    []
  );

  const unlock = useCallback(() => {
    send(makeEventPayload(CursorEventType.UNLOCK));

    lockedRect.current = null;
    scaleFactor.current = 1;
    isLocked.set(false);

    timeoutRef.current = setTimeout(() => {
      cursorRef.current?.classList.remove("locked");
      zIndex.set(CURSOR_ZINDEX);
    }, 200);
  }, []);

  return (
    <CursorStateContext.Provider
      value={{
        position: { x, y },
        subscribe,
        cursorRef,
        lockedRect,
        scaleFactor,
        zIndex,
        isLocked,
        lock,
        unlock,
      }}
    >
      {children}
    </CursorStateContext.Provider>
  );
};
