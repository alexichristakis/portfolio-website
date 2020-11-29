import { useCallback, useContext, useEffect } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

import { CursorStateContext } from "../context";
import { useToggle } from "./useToggle";
import { useTranslate } from "./useTranslate";

type UseLockedCursorHandlers = {
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
};

export const useLockedCursor = (
  ref: React.RefObject<HTMLElement>,
  config: {
    zIndex?: number;
    scale?: number;
    handlers?: UseLockedCursorHandlers;
  }
) => {
  const { handlers } = config;
  // const isLocked = useToggle(false);
  const zIndex = useMotionValue(0);
  const scale = useSpring(1);
  const { position, lockedRect, lock, unlock } = useContext(CursorStateContext);

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

  const handleMouseEnter = useCallback((ev: MouseEvent) => {
    // isLocked.setTrue();
    const rect = ref.current?.getBoundingClientRect();
    if (rect) lock(rect, config.scale, config.zIndex);
    if (config.zIndex) zIndex.set(config.zIndex);
    if (config.scale) scale.set(config.scale);
    handlers?.onMouseEnter?.(ev);
  }, []);

  const handleMouseLeave = useCallback((ev?: MouseEvent) => {
    // isLocked.setFalse();
    unlock();

    scale.set(1);
    zIndex.set(0);
    handlers?.onMouseLeave?.(ev!);
  }, []);

  useEffect(() => {
    const node = ref.current;
    node?.addEventListener("mouseenter", handleMouseEnter, {
      passive: true,
    });

    node?.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });

    return () => {
      handleMouseLeave();
      node?.removeEventListener("mouseenter", handleMouseEnter);
      node?.removeEventListener("mouseleave", handleMouseLeave);
    };
  });

  // const transform = useTranslate({
  //   x: useSpring(xOffset),
  //   y: useSpring(yOffset),
  // });

  return {
    cursorPosition: position,
    // isLocked: isLocked.value,
    style: {
      // transform,
      scale,
      zIndex,
    },
  };
};
