// import { useRef } from "react";
import { useSpring, animated } from "react-spring";

import { ElevatedElementTier } from "../context";
import { useCursorEvents, useElevatedElement } from "../hooks";
import "./cursor.scss";

const CURSOR_SIZE = 10;
const ClassPrefix = "cursor";

/* some utility functions */
// const getDiffX = (rect: Rect, x: number) => {
//   const { x: left, width } = rect;
//   return left + width / 2 - x;
// };

// const getDiffY = (rect: Rect, y: number) => {
//   const { y: top, height } = rect;
//   return top + height / 2 - y;
// };

// const getDiff = (rect: Rect, [x, y]: Point2D): Point2D => [
//   getDiffX(rect, x),
//   getDiffY(rect, y),
// ];

// const getCenter = (rect: Rect): Point2D => [
//   rect.left + rect.width / 2,
//   rect.top + rect.height / 2,
// ];

export const Cursor: React.FC = () => {
  // const targetWasDragged = useRef(false);
  const [cursorStyle] = useSpring(() => ({
    offsetX: 0,
    offsetY: 0,
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
  }));
  // const offsetX = useMotionValue(0);
  // const offsetY = useMotionValue(0);
  // const width = useMotionValue(CURSOR_SIZE);
  // const height = useMotionValue(CURSOR_SIZE);

  const { zIndex } = useElevatedElement(ElevatedElementTier.CURSOR);

  const { position } = useCursorEvents({
    // onLock: ({ target }) => {
    //   targetWasDragged.current = false;
    //   const { rect, scale = 1 } = target;
    //   const [x, y] = position.get();
    //   const [diffX, diffY] = getDiff(rect, [x, y]);
    //   const offsetX = cursorStyle.offsetX.get();
    //   const offsetY = cursorStyle.offsetY.get();
    //   console.log({ offsetX: offsetX - diffX, offsetY: offsetY - diffY });
    //   set({
    //     offsetX: offsetX - diffX,
    //     offsetY: offsetY - diffY,
    //     config: { duration: 0 },
    //   });
    //   set({
    //     offsetX: 0, //offsetX - diffX,
    //     offsetY: 0, //offsetY - diffY,
    //     height: rect.height * (scale + 0.1),
    //     width: rect.width * (scale + 0.1),
    //   });
    // },
    // onUnlock: ({ target }) => {
    //   targetWasDragged.current = false;
    //   const { rect } = target;
    //   const [x, y] = position.get();
    //   const [diffX, diffY] = getDiff(rect, [x, y]);
    //   const offsetX = cursorStyle.offsetX.get();
    //   const offsetY = cursorStyle.offsetY.get();
    //   set({
    //     offsetX: offsetX + diffX,
    //     offsetY: offsetY + diffY,
    //     config: { duration: 0 },
    //   });
    //   set({ offsetX: 0, offsetY: 0, height: CURSOR_SIZE, width: CURSOR_SIZE });
    //   // const diff = getDiff(rect, { x: x.get(), y: y.get() });
    //   // offsetX.set(offsetX.get() + diff.x);
    //   // offsetY.set(offsetY.get() + diff.y);
    //   // animate(offsetX, 0, offsetTransition);
    //   // animate(offsetY, 0, offsetTransition);
    //   // animate(height, CURSOR_SIZE, sizeTransition);
    //   // animate(width, CURSOR_SIZE, sizeTransition);
    // },
  });

  const transform = (prevX: number, prevY: number) => {
    // const rect = target.current?.rect;
    // const throttle = target.current?.throttle ?? true;
    // const draggable = target.current?.draggable;
    // const isPressed = !!pressed.current;

    let x = prevX;
    let y = prevY;

    // const offsetX = cursorStyle.offsetX.get();
    // const offsetY = cursorStyle.offsetY.get();

    return `translate(${x}px, ${y}px)`;
  };

  const lockedX = (x: number) => {
    return x;
  };

  const lockedY = (y: number) => {
    return y;
  };

  return (
    <animated.div
      className={`${ClassPrefix}__container`}
      // @ts-ignore
      style={{ zIndex, transform: position.to(transform), ...cursorStyle }}
    >
      <animated.div
        style={{
          translateX: cursorStyle.offsetX.to(lockedX),
          translateY: cursorStyle.offsetY.to(lockedY),
        }}
        className={`${ClassPrefix}__content`}
      />
    </animated.div>
  );
};
