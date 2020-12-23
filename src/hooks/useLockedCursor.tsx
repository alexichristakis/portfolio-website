import { useCallback, useContext, useEffect, useRef } from "react";
import { useGesture } from "react-use-gesture";
import { useSpring } from "react-spring";

import {
  CursorStateContext,
  CursorTarget,
  CursorTargetConfig,
} from "../context";

type UseLockedCursorHandlers = {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export const useLockedCursor = (
  ref: React.RefObject<HTMLElement>,
  config: CursorTargetConfig,
  handlers?: UseLockedCursorHandlers
): [ReturnType<typeof useGesture>, any] => {
  const lockedTarget = useRef<CursorTarget | null>(null);
  const { position, pressed, lock, unlock } = useContext(CursorStateContext);

  const [style, setStyle] = useSpring(() => ({
    scale: 1,
  }));
  // const xOffset = useTransform(position.x, (x) => {
  //   if (isLocked.value && lockedRect.current) {
  //     const { width, left } = lockedRect.current;
  //     const halfWidth = width / 2;
  //     const leftOffset = ((x - left - halfWidth) / halfWidth) * 8;

  //     return leftOffset;
  //   }

  //   return 0;
  // });

  // const yOffset = useTransform(position.y, (y) => {
  //   if (isLocked.value && lockedRect.current) {
  //     const { height, top } = lockedRect.current;
  //     const halfHeight = height / 2;
  //     const topOffset = ((y - top - halfHeight) / halfHeight) * 8;

  //     return topOffset;
  //   }

  //   return 0;
  // });

  // useEffect(() => {
  //   const node = ref.current;
  //   node?.addEventListener("mouseenter", handleMouseEnter, {
  //     passive: true,
  //   });

  //   node?.addEventListener("mouseleave", handleMouseLeave, {
  //     passive: true,
  //   });

  //   return () => {
  //     handleMouseLeave();
  //     node?.removeEventListener("mouseenter", handleMouseEnter);
  //     node?.removeEventListener("mouseleave", handleMouseLeave);
  //   };
  // });

  const bind = useGesture({
    onMouseEnter: ({ event }) => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        const target: CursorTarget = { rect, ...config };
        lockedTarget.current = target;
        lock(target);
      }

      handlers?.onMouseEnter?.();
    },
    onMouseLeave: ({ event }) => {
      const target = lockedTarget.current;
      if (
        target &&
        (!target.draggable || (target.draggable && !pressed.current))
      ) {
        // try to get the new element location if available
        const rect = ref.current?.getBoundingClientRect();

        unlock({
          ...target,
          rect: rect ?? target.rect,
        });

        // reset state
        lockedTarget.current = null;
      }

      handlers?.onMouseLeave?.();
    },
  });

  // const transform = useTranslate({
  //   x: useSpring(xOffset),
  //   y: useSpring(yOffset),
  // });

  return [bind, style];

  // return {
  //   // cursorPosition: position,
  //   // isLocked: isLocked.value,
  //   style: {
  //     // transform,
  //     scale,
  //     zIndex,
  //   },
  // };
};
