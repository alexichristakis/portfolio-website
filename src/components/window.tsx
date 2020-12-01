import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import {
  animate,
  motion,
  MotionValue,
  PanInfo,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import cn from "classnames";

import { SVG } from "../assets/icons";
import { ICON_BORDER_RADIUS, TWEEN_ANIMATION, WINDOW_ZINDEX } from "../lib";
import { WindowConfig } from "../context";
import { Button } from "./button";
import "./window.scss";

enum Direction {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
}

interface WindowProps extends WindowConfig {
  topWindow: MotionValue<string>;
  onRequestClose: () => void;
  destroyWindow: () => void;
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
      <SVG.Corner
        className={className}
        transform={`rotate(${direction * 90})`}
      />
    </motion.div>
  );
};

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 400;

export const Window: React.FC<WindowProps> = ({
  topWindow,
  id,
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
  const zIndex = useTransform(topWindow, (windowId) =>
    windowId === id ? WINDOW_ZINDEX + 1 : WINDOW_ZINDEX
  );

  const sourceRect = useMemo(
    () => sourceRef.current?.getBoundingClientRect()!,
    []
  );

  const offsetX = useMotionValue(sourceRect.left);
  const offsetY = useMotionValue(sourceRect.top);
  const scaleX = useMotionValue(sourceRect.width / WINDOW_WIDTH);
  const scaleY = useMotionValue(sourceRect.height / WINDOW_HEIGHT);
  const borderRadius = useMotionValue(
    ICON_BORDER_RADIUS / sourceRect.width / WINDOW_WIDTH
  );

  useLayoutEffect(() => {
    const initialX = (window.innerWidth - WINDOW_WIDTH) / 2;
    const initialY = (window.innerHeight - WINDOW_HEIGHT) / 2;

    animate(animation, 1);
    animate(offsetX, initialX, TWEEN_ANIMATION);
    animate(offsetY, initialY, TWEEN_ANIMATION);
    animate(scaleX, 1, TWEEN_ANIMATION);
    animate(scaleY, 1, TWEEN_ANIMATION);
    animate(borderRadius, 5, TWEEN_ANIMATION);
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
    requestAnimationFrame(() => {
      const destRect = sourceRef.current?.getBoundingClientRect();
      if (destRect) {
        const scaleXDest = destRect.width / width.get();
        const scaleYDest = destRect.height / height.get();

        animate(animation, 0);
        animate(offsetX, destRect.left, TWEEN_ANIMATION);
        animate(offsetY, destRect.top, TWEEN_ANIMATION);
        animate(scaleX, scaleXDest, TWEEN_ANIMATION);
        animate(scaleY, scaleYDest, TWEEN_ANIMATION);
        animate(borderRadius, ICON_BORDER_RADIUS / scaleXDest, TWEEN_ANIMATION);
      }
      setTimeout(destroyWindow, TWEEN_ANIMATION.duration * 1000);
    });
  }, []);

  const handleOnClickExpand = useCallback(() => {
    if (
      width.get() === window.innerWidth &&
      height.get() === window.innerHeight
    ) {
      animate(width, WINDOW_WIDTH, TWEEN_ANIMATION);
      animate(height, WINDOW_HEIGHT, TWEEN_ANIMATION);
    } else {
      animate(width, window.innerWidth, TWEEN_ANIMATION);
      animate(height, window.innerHeight, TWEEN_ANIMATION);
      animate(offsetX, 0, TWEEN_ANIMATION);
      animate(offsetY, 0, TWEEN_ANIMATION);
    }
  }, []);

  const Prefix = "window";
  const transform = useMotionTemplate`\
    translate(${offsetX}px, ${offsetY}px)\
    scale(${scaleX}, ${scaleY})`;

  const iconOpacity = useTransform(animation, [0, 0.2, 0.75, 1], [1, 1, 0, 0]);
  return (
    <motion.div
      className={Prefix}
      ref={windowRef}
      onPan={handleOnDrag}
      onMouseDown={() => topWindow.set(id)}
      style={{ width, height, zIndex, borderRadius, transform }}
    >
      <div className={`${Prefix}__header`}>
        <div className={`${Prefix}__buttons`}>
          <Button className="red" onClick={handleOnClickClose}>
            <SVG.Close />
          </Button>
          <Button className="green" onClick={handleOnClickExpand}>
            <SVG.Expand />
          </Button>
        </div>
        {title}
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
      {icon && (
        <motion.img
          className={`${Prefix}__icon`}
          alt="project-icon"
          style={{ opacity: iconOpacity }}
          src={icon}
        />
      )}
    </motion.div>
  );
};
