import { createContext, useRef, useEffect } from "react";
import { MotionValue, Point2D, useMotionValue } from "framer-motion";

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

export type CursorTargetConfig = {
  scale?: number;
  zIndex?: number;
  throttle?: boolean;
  draggable?: "x" | "y" | "xy";
};

export type CursorTarget = CursorTargetConfig & {
  rect: DOMRect;
};

export type CursorEvent = {
  type: CursorEventType;
  target: CursorTarget;
  position: { x: number; y: number };
};

export type CursorPositionState = {
  position: { x: MotionValue<number>; y: MotionValue<number> };
  target: React.RefObject<CursorTarget>;
  pressed: React.RefObject<boolean>;
  lock: (target: CursorTarget) => void;
  unlock: (target: CursorTarget) => void;
  subscribe: Events<CursorEvent>["subscribe"];
};

export const CursorStateContext = createContext({} as CursorPositionState);

export const CursorStateProvider: React.FC = ({ children }) => {
  const pressed = useRef(false);
  const target = useRef<CursorTarget | null>(null);
  const x = useMotionValue(-10);
  const y = useMotionValue(-10);

  const { send, subscribe } = useEvents<CursorEvent>();

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      x.set(clientX);
      y.set(clientY);
    };

    const handleMouseDown = (ev: MouseEvent) => {
      pressed.current = true;
    };

    const handleMouseUp = (ev: MouseEvent) => {
      pressed.current = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const getCurrentPosition = (): Point2D => ({ x: x.get(), y: y.get() });

  const lock = (lockedTarget: CursorTarget) => {
    if (!(pressed.current && target.current)) {
      target.current = lockedTarget;
      console.log("LOCK");
      send({
        type: CursorEventType.LOCK,
        target: lockedTarget,
        position: getCurrentPosition(),
      });
    }
  };

  const unlock = (lockedTarget: CursorTarget) => {
    target.current = null;
    send({
      type: CursorEventType.UNLOCK,
      target: lockedTarget,
      position: getCurrentPosition(),
    });
  };

  return (
    <CursorStateContext.Provider
      value={{ position: { x, y }, pressed, subscribe, target, lock, unlock }}
    >
      {children}
    </CursorStateContext.Provider>
  );
};
