import { Rect } from "../types";

export const BOX_SIZE = 250;

export const DEFAULT_CURSOR_SIZE = 10;
export const LOCKED_CURSOR_BUFFER = 15;

export const CURSOR_ZINDEX = 4;
export const ICON_ZINDEX = 2;
export const WINDOW_ZINDEX = 3;
export const FOCUSED_ZINDEX = 4;

export const TWEEN_ANIMATION = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
} as const;

export const TWEEN_ANIMATION_2 = {
  type: "tween",
  ease: "easeOut",
  duration: 2,
} as const;

export const EASING = {
  easeOutCirc: (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2)),
};

export const INITIAL_RECT: Rect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
