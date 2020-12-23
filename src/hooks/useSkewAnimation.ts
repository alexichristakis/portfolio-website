import { useRef } from "react";
import { Interpolation, to, useSpring } from "react-spring";
import { GestureKey, Handler } from "react-use-gesture/dist/types";

import { invlerp, INITIAL_RECT } from "../lib";
import { Vector2D, Rect } from "../types";

type GestureHander<T extends GestureKey> = Handler<
  T,
  React.PointerEvent<Element> | PointerEvent
>;

type Config = {
  ref: React.RefObject<HTMLDivElement>;
  throttle?: number;
};

type Return = {
  resetRotation: () => void;
  rect: React.RefObject<Rect>;
  rotation: Interpolation<string, any>;
  onHover: GestureHander<"hover">;
  onMove: GestureHander<"move">;
};

const calc = ([px, py]: Vector2D, rect: Rect, throttle: number = 1) => [
  -(py - rect.y - rect.height / 2) / (20 * throttle),
  (px - rect.x - rect.width / 2) / (20 * throttle),
];

export const useSkewAnimation = ({ ref, throttle = 1 }: Config): Return => {
  const containerRect = useRef<Rect>(INITIAL_RECT);
  const sizeThrottle = useRef(0);

  const [{ rotateX, rotateY }, set] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
  }));

  const resetRotation = () => set({ rotateX: 0, rotateY: 0 });

  const updateRect = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const { width, height, x, y } = rect;

      // when items are larger than 750px even small rotations
      // are quite jarring
      sizeThrottle.current =
        invlerp(
          750,
          Math.min(window.innerHeight, window.innerWidth),
          Math.max(width, height)
        ) * 100;

      containerRect.current = { x, y, width, height };
    }
  };

  const rotation = to(
    [rotateX, rotateY],
    (rx, ry) => `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`
  );

  return {
    resetRotation,
    rect: containerRect,
    rotation,
    onHover: ({ active }) => {
      if (!active) {
        set({ rotateX: 0, rotateY: 0 });
      }
    },
    onMove: ({ hovering, dragging, first, xy: [px, py] }) => {
      if (first) updateRect();
      if (hovering && !dragging) {
        const [rotateX, rotateY] = calc(
          [px, py],
          containerRect.current,
          throttle + sizeThrottle.current
        );
        set({ rotateX, rotateY });
      }
    },
  };
};
