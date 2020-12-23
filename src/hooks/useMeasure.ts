import { useEffect, useState } from "react";

import { INITIAL_RECT } from "../lib";
import { Rect } from "../types";

export const useMeasure = (ref: React.RefObject<HTMLDivElement>): Rect => {
  const [rect, setRect] = useState<Rect>(INITIAL_RECT);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const { x, y, width, height } = rect;
      setRect({ x, y, width, height });
    }
  }, []);

  return rect;
};
