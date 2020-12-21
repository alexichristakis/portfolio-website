import { useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import type { Tween, Point2D } from "framer-motion";

import { useCursorEvents } from "../hooks";
import "./cursor.scss";

const CURSOR_SIZE = 10;
const ClassPrefix = "cursor";

const offsetTransition: Tween = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
};

const sizeTransition: Tween = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
};

/* some utility functions */
const getDiffX = (rect: DOMRect, x: number) => {
  const { left, width } = rect;
  return left + width / 2 - x;
};

const getDiffY = (rect: DOMRect, y: number) => {
  const { top, height } = rect;
  return top + height / 2 - y;
};

const getDiff = (rect: DOMRect, { x, y }: Point2D): Point2D => ({
  x: getDiffX(rect, x),
  y: getDiffY(rect, y),
});

const getCenter = (rect: DOMRect): Point2D => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

export const Cursor: React.FC = () => {
  const targetWasDragged = useRef(false);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const width = useMotionValue(CURSOR_SIZE);
  const height = useMotionValue(CURSOR_SIZE);

  const { position, pressed, target } = useCursorEvents({
    onLock: ({ target }) => {
      targetWasDragged.current = false;
      const { rect, scale = 1 } = target;

      const diff = getDiff(rect, { x: x.get(), y: y.get() });
      offsetX.set(offsetX.get() - diff.x);
      offsetY.set(offsetY.get() - diff.y);

      animate(offsetX, 0, offsetTransition);
      animate(offsetY, 0, offsetTransition);
      animate(height, rect.height * (scale + 0.1), sizeTransition);
      animate(width, rect.width * (scale + 0.1), sizeTransition);
    },
    onUnlock: ({ target }) => {
      targetWasDragged.current = false;
      const { rect } = target;

      const diff = getDiff(rect, { x: x.get(), y: y.get() });
      offsetX.set(offsetX.get() + diff.x);
      offsetY.set(offsetY.get() + diff.y);

      animate(offsetX, 0, offsetTransition);
      animate(offsetY, 0, offsetTransition);
      animate(height, CURSOR_SIZE, sizeTransition);
      animate(width, CURSOR_SIZE, sizeTransition);
    },
  });

  const { x, y } = position;

  const transform = useTransform(
    // @ts-ignore
    [x, y, offsetX, offsetY],
    ([prevX, prevY, offsetX, offsetY]: number[]) => {
      const rect = target.current?.rect;
      const throttle = target.current?.throttle ?? true;
      const draggable = target.current?.draggable;
      const isPressed = !!pressed.current;

      // initial state: current position
      let x = prevX;
      let y = prevY;

      // if currently locked to target
      if (rect) {
        const { left, width, top, height } = rect;
        const center = getCenter(rect);

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const leftOffset = (x - left - halfWidth) / halfWidth;
        const topOffset = (y - top - halfHeight) / halfHeight;

        x = center.x;
        y = center.y;

        // add throttle
        if (throttle) {
          x += leftOffset * 4;
          y += topOffset * 4;
        } else if (draggable && (isPressed || targetWasDragged.current)) {
          targetWasDragged.current = true;

          // if pressed check for direction lock
          if (draggable.includes("y")) y = prevY;
          if (draggable.includes("x")) x = prevX;
        }
      }

      return `translate(${x + offsetX}px, ${y + offsetY}px)`;
    }
  );

  return (
    <motion.div
      className={`${ClassPrefix}__container`}
      style={{ transform, width, height }}
    >
      <motion.div className={`${ClassPrefix}__content`} />
    </motion.div>
  );
};
