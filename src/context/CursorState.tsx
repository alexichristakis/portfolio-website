import { createContext, useRef } from "react";
import { SpringValue, useSpring } from "react-spring";

import { Events, useEvents } from "../hooks";
import { useGesture } from "react-use-gesture";

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
  position: SpringValue<number[]>;
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

  const [mouse, set] = useSpring(() => ({
    xy: [-10, -10],
    pressed: false,
    config: { duration: 0 },
  }));

  const { send, subscribe } = useEvents<CursorEvent>();

  useGesture(
    {
      onMove: ({ xy }) => set({ xy }),
      onMouseDown: () => set({ pressed: true }),
      onMouseUp: () => set({ pressed: false }),
    },
    { domTarget: window }
  );

  const getCurrentPosition = () => ({
    x: mouse.xy.get()[0],
    y: mouse.xy.get()[1],
  });

  const lock = (lockedTarget: CursorTarget) => {
    if (!(pressed.current && target.current)) {
      target.current = lockedTarget;
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
      value={{ position: mouse.xy, pressed, subscribe, target, lock, unlock }}
    >
      {children}
    </CursorStateContext.Provider>
  );
};
