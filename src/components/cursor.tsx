import {
  animate,
  motion,
  Tween,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { useCursorEvents } from "../hooks";
import "./cursor.scss";

const ClassPrefix = "cursor";

const DEFAULT_CURSOR_SIZE = 20;

export const Cursor: React.FC = () => {
  const cursorWidth = useMotionValue(DEFAULT_CURSOR_SIZE);
  const cursorHeight = useMotionValue(DEFAULT_CURSOR_SIZE);

  const transitionConfig: Tween = {
    type: "tween",
    ease: "circOut",
    duration: 0.2,
  };

  const { cursorRef, position, zIndex, isLocked, lockedRect } = useCursorEvents(
    {
      onLock: ({ rect, scaleFactor }) => {
        if (rect) {
          const { width, height } = rect;
          const scale = scaleFactor ? scaleFactor + 0.1 : 1;
          animate(cursorWidth, width * scale, transitionConfig);
          animate(cursorHeight, height * scale, transitionConfig);
        }
      },
      onUnlock: ({ rect }) => {
        animate(cursorWidth, DEFAULT_CURSOR_SIZE, transitionConfig);
        animate(cursorHeight, DEFAULT_CURSOR_SIZE, transitionConfig);
      },
    }
  );

  const { x, y } = position;
  const translateX = useTransform(x, (x) => {
    if (lockedRect.current && isLocked) {
      const { left, width } = lockedRect.current;

      const halfWidth = width / 2;
      const leftOffset = (x - left - halfWidth) / halfWidth;

      return left + halfWidth + leftOffset * 4;
    }
    return x;
  });

  const translateY = useTransform(y, (y) => {
    if (lockedRect.current && isLocked) {
      const { top, height } = lockedRect.current;

      const halfHeight = height / 2;
      const topOffset = (y - top - halfHeight) / halfHeight;

      return top + halfHeight + topOffset * 4;
    }
    return y;
  });

  const transform = useMotionTemplate`translate(${translateX}px, ${translateY}px)`;
  return (
    <motion.div
      ref={cursorRef}
      className={`${ClassPrefix}__container`}
      style={{
        width: cursorWidth,
        height: cursorHeight,
        transform,
        zIndex,
      }}
    >
      <motion.div className={`${ClassPrefix}__content`} />
    </motion.div>
  );
};
