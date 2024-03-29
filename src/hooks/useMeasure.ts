import { useState } from "react";

import { INITIAL_RECT } from "../lib";
import { Rect } from "../types";
import { useLayoutMountEffect } from "./useMountEffect";

type UseMeasureReturn = [Rect, () => Rect];

export const useMeasure = (
  ref: React.RefObject<HTMLElement>,
  forceRender: boolean = true
): UseMeasureReturn => {
  const [rect, setRect] = useState<Rect>(INITIAL_RECT);

  useLayoutMountEffect(() => {
    measure();
  });

  const measure = () => {
    const newRect = ref.current?.getBoundingClientRect();
    if (newRect) {
      const { x, y, width, height } = newRect;
      if (forceRender) setRect({ x, y, width, height });
    }

    return newRect ?? rect;
  };

  return [rect, measure];
};
