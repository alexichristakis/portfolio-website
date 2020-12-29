import { useState } from "react";

import { INITIAL_RECT } from "../lib";
import { Rect } from "../types";
import { useLayoutMountEffect } from "./useMountEffect";

type UseMeasureReturn = [Rect, () => Rect];

type Config = {
  forceRender?: boolean;
  ignoreTransform?: boolean;
};

export const useMeasure = (
  ref: React.RefObject<HTMLElement>,
  config: Config = {}
): UseMeasureReturn => {
  const [rect, setRect] = useState<Rect>(INITIAL_RECT);

  const { forceRender = true, ignoreTransform = false } = config;

  useLayoutMountEffect(() => {
    measure();
  });

  const getRect = (): Rect => {
    const node = ref.current;
    if (ignoreTransform && node) {
      const { offsetHeight, offsetWidth, offsetLeft, offsetTop } = node;
      return {
        height: offsetHeight,
        width: offsetWidth,
        x: offsetLeft,
        y: offsetTop,
      };
    }

    const domRect = node?.getBoundingClientRect();
    if (domRect) {
      const { x, y, width, height } = domRect;
      return { x, y, width, height };
    }

    return rect;
  };

  const measure = () => {
    const newRect = getRect();
    if (forceRender) setRect(newRect);

    return newRect;
  };

  return [rect, measure];
};
