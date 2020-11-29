import { useCallback, useLayoutEffect, useRef } from "react";
import {
  animate,
  motion,
  PanInfo,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import cn from "classnames";

import { WindowConfig } from "../context";
import { WINDOW_ZINDEX } from "../lib";
import { Button } from "./button";
import "./window.scss";

enum Direction {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
}

interface WindowProps extends WindowConfig {
  onRequestClose: () => void;
  destroyWindow: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface DraggableCornerProps {
  direction: Direction;
  containerRef: React.RefObject<HTMLDivElement>;
  onDrag: (info: PanInfo, direction: Direction) => void;
}

const DraggableCorner: React.FC<DraggableCornerProps> = ({
  onDrag,
  containerRef,
  direction,
}) => {
  const handleOnDrag = (ev: MouseEvent, info: PanInfo) => {
    ev.preventDefault();
    onDrag(info, direction);
  };

  const Prefix = "draggable-corner";
  const className = cn(Prefix, `${Prefix}-${direction}`);
  return (
    <motion.div
      className={className}
      dragConstraints={containerRef}
      onPan={handleOnDrag}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        className={className}
        transform={`rotate(${90 * direction})`}
      >
        <rect width="10" height="2" fill="#C4C4C4" />
        <rect width="2" height="10" fill="#C4C4C4" />
      </svg>
    </motion.div>
  );
};

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 400;

export const Window: React.FC<WindowProps> = ({
  containerRef,
  onRequestClose,
  destroyWindow,
  sourceRef,
  content,
  title,
  icon,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const animation = useMotionValue(0);

  const width = useMotionValue(WINDOW_WIDTH);
  const height = useMotionValue(WINDOW_HEIGHT);

  const sourceRect = sourceRef.current?.getBoundingClientRect()!;
  const offsetX = useMotionValue(sourceRect.left);
  const offsetY = useMotionValue(sourceRect.top);
  const scaleX = useMotionValue(sourceRect.width / WINDOW_WIDTH);
  const scaleY = useMotionValue(sourceRect.height / WINDOW_HEIGHT);
  const zIndex = useMotionValue(WINDOW_ZINDEX);

  const transitionConfig = {
    type: "tween",
    ease: "easeOut",
    duration: 0.3,
  } as const;

  useLayoutEffect(() => {
    const initialX = (window.innerWidth - WINDOW_WIDTH) / 2;
    const initialY = (window.innerHeight - WINDOW_HEIGHT) / 2;

    animate(animation, 1);
    animate(offsetX, initialX, transitionConfig);
    animate(offsetY, initialY, transitionConfig);
    animate(scaleX, 1, transitionConfig);
    animate(scaleY, 1, transitionConfig);
  }, []);

  const handleOnDrag = useCallback((ev: MouseEvent, info: PanInfo) => {
    if (!ev.defaultPrevented) {
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
    }
  }, []);

  const handleOnDragCorner = useCallback(
    (info: PanInfo, direction: Direction) => {
      const { x, y } = info.delta;
      const prevWidth = width.get();
      const prevHeight = height.get();

      if (direction === Direction.TOP_LEFT) {
        width.set(prevWidth - x);
        height.set(prevHeight - y);
        offsetX.set(offsetX.get() + x);
        offsetY.set(offsetY.get() + y);
      } else if (direction === Direction.TOP_RIGHT) {
        width.set(prevWidth + x);
        height.set(prevHeight - y);
        offsetY.set(offsetY.get() + y);
      } else if (direction === Direction.BOTTOM_RIGHT) {
        width.set(prevWidth + x);
        height.set(prevHeight + y);
      } else if (direction === Direction.BOTTOM_LEFT) {
        width.set(prevWidth - x);
        height.set(prevHeight + y);
        offsetX.set(offsetX.get() + x);
      }
    },
    []
  );

  const handleOnClickClose = useCallback(() => {
    onRequestClose();
    const sourceRect = sourceRef.current?.getBoundingClientRect();
    if (sourceRect) {
      const scaleXDest = sourceRect.width / width.get();
      const scaleYDest = sourceRect.height / height.get();

      animate(animation, 0);
      animate(offsetX, sourceRect.left, transitionConfig);
      animate(offsetY, sourceRect.top, transitionConfig);
      animate(scaleX, scaleXDest, transitionConfig);
      animate(scaleY, scaleYDest, transitionConfig);
    }

    setTimeout(() => {
      destroyWindow();
    }, transitionConfig.duration * 1000);
  }, []);

  const Prefix = "window";
  const transform = useMotionTemplate`\
    translate(${offsetX}px, ${offsetY}px)\
    scale(${scaleX}, ${scaleY})`;

  const iconOpacity = useTransform(animation, [0, 0.1, 0.75, 1], [1, 1, 0, 0]);
  const borderRadius = useTransform(animation, [0, 1], [50, 5]);
  return (
    <motion.div
      className={Prefix}
      ref={windowRef}
      onPan={handleOnDrag}
      dragConstraints={containerRef}
      style={{ width, height, transform, borderRadius, zIndex }}
    >
      {icon && (
        <motion.img
          className={`${Prefix}__icon`}
          alt="project-icon"
          style={{ opacity: iconOpacity }}
          src={icon}
        />
      )}
      <div className={`${Prefix}__header`}>
        <div className={`${Prefix}__title`}>{title}</div>
        <Button onClick={handleOnClickClose}>
          <div className={`${Prefix}__close-button`}>&#215;</div>
        </Button>
      </div>
      <div className={`${Prefix}__content`}>{content}</div>
      {Object.values(Direction).map((direction) => (
        <DraggableCorner
          key={direction}
          direction={direction as Direction}
          containerRef={windowRef}
          onDrag={handleOnDragCorner}
        />
      ))}
    </motion.div>
  );
};
