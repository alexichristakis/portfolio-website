import { useCallback, useLayoutEffect, memo, useRef } from "react";
import {
  animate,
  motion,
  MotionValue,
  PanInfo,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { TWEEN_ANIMATION, WINDOW_ZINDEX } from "../lib";
import { WindowConfig } from "../context";
import BoundingBox, { hasDirection, Direction } from "./boundingBox";
import "./window.scss";

interface WindowProps extends WindowConfig {
  topWindow: MotionValue<string>;
  onRequestClose: () => void;
  destroyWindow: () => void;
}

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 400;

export const Window: React.FC<WindowProps> = memo(
  ({
    topWindow,
    id,
    onRequestClose,
    destroyWindow,
    sourceRef,
    content,
    title,
    aspectRatio,
    icon,
  }) => {
    const windowRef = useRef<HTMLDivElement>(null);
    const boundingBoxOpacityTimeout = useRef<NodeJS.Timeout | null>(null);
    const isDragging = useRef(false);
    const isClosing = useRef(false);
    const animation = useMotionValue(0);

    const width = useMotionValue(WINDOW_WIDTH);
    const height = useMotionValue(
      aspectRatio ? WINDOW_WIDTH * aspectRatio : WINDOW_HEIGHT
    );
    const boundingBoxOpacity = useMotionValue(0);

    const zIndex = useTransform(topWindow, (windowId) =>
      windowId === id ? WINDOW_ZINDEX + 1 : WINDOW_ZINDEX
    );

    const getSourceRect = () => sourceRef.current?.getBoundingClientRect()!;

    const initialRect = getSourceRect();
    const offsetX = useMotionValue(initialRect.left);
    const offsetY = useMotionValue(initialRect.top);
    const scaleX = useMotionValue(initialRect.width / width.get());
    const scaleY = useMotionValue(initialRect.height / height.get());

    useLayoutEffect(() => {
      const initialX = (window.innerWidth - WINDOW_WIDTH) / 2;
      const initialY = (window.innerHeight - WINDOW_HEIGHT) / 2;

      animate(animation, 1, TWEEN_ANIMATION);
      animate(offsetX, initialX, TWEEN_ANIMATION);
      animate(offsetY, initialY, TWEEN_ANIMATION);
      animate(scaleX, 1, TWEEN_ANIMATION);
      animate(scaleY, 1, TWEEN_ANIMATION);
    }, []);

    const flashBoundingBox = () => {
      if (!isClosing.current) {
        if (boundingBoxOpacityTimeout.current) {
          clearTimeout(boundingBoxOpacityTimeout.current);
        }

        animate(boundingBoxOpacity, 1, TWEEN_ANIMATION);
        boundingBoxOpacityTimeout.current = setTimeout(() => {
          animate(boundingBoxOpacity, 0, TWEEN_ANIMATION);
        }, 1000);
      }
    };

    const handleOnMouseMove = () => {
      if (!isDragging.current) {
        flashBoundingBox();
      }
    };

    const handleOnDragEnd = () => {
      isDragging.current = false;
      flashBoundingBox();
    };

    const handleOnDrag = useCallback((ev: MouseEvent, info: PanInfo) => {
      isDragging.current = true;
      if (boundingBoxOpacityTimeout.current) {
        clearTimeout(boundingBoxOpacityTimeout.current);
      }

      const { x, y } = info.delta;
      const nextOffsetX = offsetX.get() + x;
      const nextOffsetY = offsetY.get() + y;
      const currentWidth = width.get();
      const currentHeight = height.get();

      if (currentWidth + nextOffsetX < window.innerWidth && nextOffsetX > 0) {
        offsetX.set(nextOffsetX);
      }

      if (currentHeight + nextOffsetY < window.innerHeight && nextOffsetY > 0) {
        offsetY.set(nextOffsetY);
      }
    }, []);

    const handleOnResize = useCallback(
      (info: PanInfo, direction: Direction) => {
        const { x, y } = info.delta;
        let nextWidth = width.get();
        let nextHeight = height.get();
        let nextOffsetX = offsetX.get();
        let nextOffsetY = offsetY.get();
        if (hasDirection(direction, "n")) {
          nextHeight -= y;
          nextOffsetY += y;
        }

        if (hasDirection(direction, "e")) {
          nextWidth += x;
        }

        if (hasDirection(direction, "s")) {
          nextHeight += y;
        }

        if (hasDirection(direction, "w")) {
          nextWidth -= x;
          nextOffsetX += x;
        }

        width.set(nextWidth);
        offsetX.set(nextOffsetX);
        height.set(nextHeight);
        offsetY.set(nextOffsetY);
      },
      []
    );

    const handleOnClose = useCallback(() => {
      onRequestClose();
      isClosing.current = true;
      boundingBoxOpacity.set(0);
      requestAnimationFrame(() => {
        const destRect = getSourceRect();
        if (destRect) {
          const scaleXDest = destRect.width / width.get();
          const scaleYDest = destRect.height / height.get();

          animate(animation, 0, TWEEN_ANIMATION);
          animate(offsetX, destRect.left, TWEEN_ANIMATION);
          animate(offsetY, destRect.top, TWEEN_ANIMATION);
          animate(scaleX, scaleXDest, TWEEN_ANIMATION);
          animate(scaleY, scaleYDest, TWEEN_ANIMATION);
        }
        setTimeout(destroyWindow, TWEEN_ANIMATION.duration * 1000);
      });
    }, []);

    const Prefix = "window";
    const transform = useMotionTemplate`
      translate(${offsetX}px, ${offsetY}px)
      scale(${scaleX}, ${scaleY})
    `;

    const iconOpacity = useTransform(
      animation,
      [0, 0.4, 0.75, 1],
      [1, 0.4, 0, 0]
    );

    const contentOpacity = useTransform(iconOpacity, [0, 1], [1, 0]);
    const backgroundOpacity = useTransform(animation, [0, 0.5, 1], [0, 1, 0]);

    const boxShadowSpread = useTransform(animation, [0, 1], [0, 5]);
    const boxShadow = useMotionTemplate`0 0 ${boxShadowSpread}px 0px var(--lighter-gray)`;
    const background = useMotionTemplate`rgba(255,255,255,${backgroundOpacity})`;

    return (
      <motion.div
        className={Prefix}
        ref={windowRef}
        onMouseDown={() => topWindow.set(id)}
        onMouseMove={handleOnMouseMove}
        onMouseLeave={() => animate(boundingBoxOpacity, 0, TWEEN_ANIMATION)}
        style={{ width, height, zIndex, boxShadow, background, transform }}
      >
        <BoundingBox
          title={title}
          opacity={boundingBoxOpacity}
          onResize={handleOnResize}
          onClose={handleOnClose}
        >
          <motion.div
            className={`${Prefix}__content`}
            style={{ opacity: contentOpacity }}
            onPan={handleOnDrag}
            onPanEnd={handleOnDragEnd}
          >
            {content}
          </motion.div>
        </BoundingBox>
        {icon && (
          <motion.img
            className={`${Prefix}__icon`}
            alt={`${title} project-icon`}
            style={{ opacity: iconOpacity }}
            src={icon}
          />
        )}
      </motion.div>
    );
  },
  (p, n) => p.id === n.id
);
