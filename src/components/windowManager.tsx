import {
  animate,
  motion,
  PanInfo,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  createContext,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import cn from "classnames";

import { WINDOW_ZINDEX } from "../lib";
import "./windowManager.scss";
import { useTranslate } from "../hooks";

enum Direction {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
}

export type WindowConfig = {
  id: string;
  // the element that the window opened from
  sourceRef: React.RefObject<HTMLElement>;
  // content for the window
  content: React.ComponentType;
};

interface WindowProps extends WindowConfig {
  destroyWindow: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface DraggableCornerProps {
  direction: Direction;
  containerRef: React.RefObject<HTMLDivElement>;
  onDrag: (info: PanInfo, direction: Direction) => void;
}

type WindowManagerContext = {
  spawnWindow: (newWindow: WindowConfig) => void;
  destroyWindow: (id: string) => void;
  windows: WindowConfig[];
};

export const WindowManagerContext = createContext<WindowManagerContext>(
  {} as WindowManagerContext
);

const DraggableCorner: React.FC<DraggableCornerProps> = ({
  onDrag,
  containerRef,
  direction,
}) => {
  const handleOnDrag = (_: MouseEvent, info: PanInfo) =>
    onDrag(info, direction);

  const Prefix = "draggable-corner";
  const className = cn(Prefix, `${Prefix}-${direction}`);
  return (
    <motion.div
      drag
      className={className}
      dragElastic={false}
      dragMomentum={false}
      dragConstraints={containerRef}
      onDrag={handleOnDrag}
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
const INITIAL_WINDOW_POSITION = 10;

const Window: React.FC<WindowProps> = ({
  containerRef,
  destroyWindow,
  sourceRef,
  content: Content,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const positionCache = useRef<{ x: number; y: number }>({
    x: INITIAL_WINDOW_POSITION,
    y: INITIAL_WINDOW_POSITION,
  });
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
    duration: 1,
  } as const;

  useLayoutEffect(() => {
    animate(offsetX, 10, transitionConfig);
    animate(offsetY, 10, transitionConfig);
    animate(scaleX, 1, transitionConfig);
    animate(scaleY, 1, transitionConfig);
  }, []);

  const handleOnDragEnd = useCallback((_: MouseEvent, info: PanInfo) => {
    const { offset } = info;
    positionCache.current = {
      x: positionCache.current.x + offset.x,
      y: positionCache.current.y + offset.y,
    };
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
    const sourceRect = sourceRef.current?.getBoundingClientRect();
    if (sourceRect) {
      const { x, y } = positionCache.current;
      const scaleXDest = sourceRect.width / width.get();
      const scaleYDest = sourceRect.height / height.get();

      console.log(x, y);
      animate(
        offsetX,
        sourceRect.left, // - x + INITIAL_WINDOW_POSITION,
        transitionConfig
      );
      animate(
        offsetY,
        sourceRect.top, //- y + INITIAL_WINDOW_POSITION,
        transitionConfig
      );
      animate(scaleX, scaleXDest, transitionConfig);
      animate(scaleY, scaleYDest, transitionConfig);
    }

    setTimeout(() => {
      destroyWindow();
    }, transitionConfig.duration * 1000);
  }, []);

  const transform = useMotionTemplate`translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})`;
  // const transform = useMotionTemplate`\
  //  translate(${offsetX}px, ${offsetY}px) \
  //  scale(${scaleX}, ${scaleY}) \
  //  translate(${offsetX)}px, ${offsetY}px)`;

  const Prefix = "window";
  return (
    <motion.div className={`${Prefix}__container`} style={{ transform }}>
      <motion.div
        className={Prefix}
        ref={windowRef}
        drag
        dragElastic={false}
        dragMomentum={false}
        onDragEnd={handleOnDragEnd}
        dragConstraints={containerRef}
        style={{ width, height, zIndex }}
      >
        <div className={`${Prefix}__header`}>
          <button onClick={handleOnClickClose}>close</button>
        </div>
        <div className={`${Prefix}__content`}>
          <Content />
        </div>
        {Object.values(Direction).map((direction) => (
          <DraggableCorner
            key={direction}
            direction={direction as Direction}
            containerRef={windowRef}
            onDrag={handleOnDragCorner}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export const WindowManager: React.FC = ({ children }) => {
  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnWindow = useCallback((newWindow: WindowConfig) => {
    setWindows((prev) => [...prev, newWindow]);
  }, []);

  const destroyWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((window) => window.id !== id));
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        spawnWindow,
        destroyWindow,
        windows,
      }}
    >
      {children}
      <div className="window-manager" ref={containerRef}>
        {windows.map((window) => (
          <Window
            key={window.id}
            destroyWindow={() => destroyWindow(window.id)}
            containerRef={containerRef}
            {...window}
          />
        ))}
      </div>
    </WindowManagerContext.Provider>
  );
};
