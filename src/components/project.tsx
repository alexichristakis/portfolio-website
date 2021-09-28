import { useRef, useState, useContext } from "react";
import { animated, to, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";
import classNames from "classnames";

import { SVG } from "../assets/icons";
import {
  useProject,
  useSkewAnimation,
  useElevatedElement,
  useMountEffect,
  useMeasure,
} from "../hooks";
import ScrollBar from "./scrollbar";
import { clamp, PROJECT_SIZE } from "../lib";
import { ElevatedElementTier, ProjectContext } from "../context";
import { Vector2D } from "../types";

import "./project.scss";

type ProjectProps = {
  id: string;
  index: number;
};

type ProjectState = "open" | "opening" | "closed" | "closing";

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 400;
const WINDOW_MARGIN = 20;

const HOVER_SCALE = 1.4;
const CLICK_SCALE = 1.2;
const INITIAL_SCALE = 1;

/* functions in case the window size changes*/
const getMaxWindowSize = (aspectRatio?: number): Vector2D => [
  aspectRatio
    ? aspectRatio * window.innerWidth > window.innerHeight
      ? (window.innerHeight - WINDOW_MARGIN) / aspectRatio
      : window.innerWidth - WINDOW_MARGIN
    : window.innerWidth - WINDOW_MARGIN,
  aspectRatio
    ? aspectRatio * window.innerWidth > window.innerHeight
      ? window.innerHeight - WINDOW_MARGIN
      : aspectRatio * (window.innerWidth - WINDOW_MARGIN)
    : window.innerHeight - WINDOW_MARGIN,
];

const getInitialWindowSize = (aspectRatio?: number): Vector2D => [
  WINDOW_WIDTH,
  aspectRatio ? WINDOW_WIDTH * aspectRatio : WINDOW_HEIGHT,
];

const cn = "project";
export const Project: React.FC<ProjectProps> = ({ id, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const iconContainerRef = useRef<HTMLDivElement>(null);
  const iconContentRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [showWindow, setShowWindow] = useState(false);
  const [showIcon, setShowIcon] = useState(true);

  const state = useRef<ProjectState>("closed");
  const isDragSession = useRef(false);

  const [
    {
      content,
      icon,
      iconContent,
      backgroundColor,
      foregroundColor,
      aspectRatio,
    },
    [initialX, initialY, initialZoom],
  ] = useProject(id);

  const [initialWindowWidth, initialWindowHeight] = getInitialWindowSize(
    aspectRatio
  );

  const [
    {
      offsetX,
      offsetY,
      iconScaleX,
      iconScaleY,
      windowScaleX,
      windowScaleY,
      scroll,
      zoom,
      width,
      height,
    },
    set,
  ] = useSpring(() => ({
    scroll: 0,
    offsetX: initialX,
    offsetY: initialY,
    iconScaleX: INITIAL_SCALE,
    iconScaleY: INITIAL_SCALE,
    windowScaleX: INITIAL_SCALE,
    windowScaleY: INITIAL_SCALE,
    zoom: -INITIAL_SCALE,
    width: initialWindowWidth,
    height: initialWindowHeight,
  }));

  const { rotation, resetRotation, onHover, onMove } = useSkewAnimation({
    ref: containerRef,
  });

  const getDimensions = (): Vector2D => {
    if (state.current === "open") {
      return [width.get(), height.get()];
    }

    const currentZoom = zoom.get();
    return [
      PROJECT_SIZE * (currentZoom + iconScaleX.get()),
      PROJECT_SIZE * (currentZoom + iconScaleY.get()),
    ];
  };

  useMountEffect(() => {
    set({ zoom: initialZoom, delay: index * 100 });
  });

  const [{ height: contentHeight }] = useMeasure(iconContentRef, {
    ignoreTransform: true,
  });

  const { zIndex, raise, lower } = useElevatedElement(ElevatedElementTier.ICON);

  const openWindow = () => {
    const windowWidth = width.get();
    const windowHeight = height.get();
    const iconSize = PROJECT_SIZE * (zoom.get() + 1);

    setShowWindow(true);
    setIsHovered(false);
    state.current = "opening";

    // setup animation
    windowScaleX.set(PROJECT_SIZE / windowWidth);
    windowScaleY.set(PROJECT_SIZE / windowHeight);

    // run animation
    set({
      offsetX: (window.innerWidth - windowWidth) / 2,
      offsetY: (window.innerHeight - windowHeight) / 2,
      iconScaleX: windowWidth / iconSize,
      iconScaleY: windowHeight / iconSize,
      windowScaleX: 1,
      windowScaleY: 1,
    }).then(() => {
      scroll.set(0);
      setShowIcon(false);
      state.current = "open";
    });
  };

  const closeWindow = () => {
    setShowIcon(true);
    state.current = "closing";

    const windowWidth = width.get();
    const windowHeight = height.get();
    const iconSize = PROJECT_SIZE * (zoom.get() + 1);

    set({
      offsetX: 5 * WINDOW_MARGIN,
      offsetY: 5 * WINDOW_MARGIN,
      iconScaleX: INITIAL_SCALE,
      iconScaleY: INITIAL_SCALE,
      windowScaleX: iconSize / windowWidth,
      windowScaleY: iconSize / windowHeight,
    }).then(() => {
      setShowWindow(false);
      state.current = "closed";
    });
  };

  useGesture(
    {
      onHover: (ev) => {
        const { active } = ev;
        if (state.current === "closed") {
          if (active) {
            raise();
            setIsHovered(true);
            set({
              scroll: minScroll,
              iconScaleX: HOVER_SCALE,
              iconScaleY: HOVER_SCALE,
            });
          } else {
            setIsHovered(false);
            set({
              scroll: 0,
              iconScaleX: INITIAL_SCALE,
              iconScaleY: INITIAL_SCALE,
            });
          }
        }

        onHover(ev);
      },
      onMove: (ev) => {
        if (state.current === "closed" || state.current === "open") {
          onMove(ev);
        }
      },
      onDrag: ({ first, delta: [x, y] }) => {
        if (first) {
          resetRotation();
          isDragSession.current = true;
        }

        const [currentWidth, currentHeight] = getDimensions();
        const nextX = offsetX.get() + x;
        const nextY = offsetY.get() + y;

        if (
          nextX + currentWidth <= window.innerWidth - WINDOW_MARGIN &&
          nextX >= WINDOW_MARGIN
        ) {
          offsetX.set(nextX);
        }

        if (
          nextY + currentHeight <= window.innerHeight - WINDOW_MARGIN &&
          nextY >= WINDOW_MARGIN
        ) {
          offsetY.set(nextY);
        }
      },
      onMouseDown: (ev) => {
        raise();
        if (state.current === "closed") {
          set({ iconScaleX: CLICK_SCALE, iconScaleY: CLICK_SCALE });
        }
      },
      onMouseUp: (ev) => {
        if (state.current === "closed") {
          set({ iconScaleX: HOVER_SCALE, iconScaleY: HOVER_SCALE });
          if (!isDragSession.current) openWindow();
        }

        isDragSession.current = false;
      },
    },
    {
      domTarget: containerRef,
      drag: { threshold: 5 },
      eventOptions: { passive: true },
    }
  );

  const minScroll = -contentHeight + PROJECT_SIZE;
  useGesture(
    {
      onPinch: ({ velocities: [vd], cancel, canceled }) => {
        // if (canceled) return;
        // const nextZoom = clamp(zoom.get() + vd / 10, -0.5, 0.25);
        // if (nextZoom === 0.25) {
        //   openWindow();
        //   cancel();
        // } else {
        //   set({ zoom: nextZoom, immediate: true });
        // }
      },
      onWheel: ({ pinching, delta: [, dy] }) => {
        if (isHovered && !pinching) {
          set({ scroll: clamp(scroll.get() - dy * 5, minScroll, 0) });
        }
      },
    },
    { domTarget: containerRef, eventOptions: { passive: false } }
  );

  const translate = to(
    [offsetX, offsetY],
    (x, y) => `translate(${x}px, ${y}px)`
  );

  const iconContainerTransform = to(
    [zoom, iconScaleX, iconScaleY, rotation],
    (zoom, scaleX, scaleY, r) =>
      `scale(${zoom + scaleX}, ${zoom + scaleY}) ${r}`
  );

  const windowContainerTransform = to(
    [windowScaleX, windowScaleY],
    (scaleX, scaleY) => `scale(${scaleX}, ${scaleY})`
  );

  const contentTransform = scroll.to((scroll) => `translateY(${scroll}px`);

  return (
    <animated.div
      ref={containerRef}
      className={cn}
      style={{
        transform: translate,
        // @ts-ignore
        zIndex,
        "--project-background": backgroundColor,
        "--project-foreground": foregroundColor,
      }}
    >
      {/* {showIcon && ( */}
      <animated.div
        ref={iconContainerRef}
        className={`${cn}__icon`}
        style={{ transform: iconContainerTransform }}
      >
        <animated.div
          className={`${cn}__icon-content`}
          ref={iconContentRef}
          style={{ transform: contentTransform }}
        >
          <img draggable={false} alt={`${id} icon`} src={icon} />
          {iconContent}
        </animated.div>
        <ScrollBar
          offset={scroll}
          contentHeight={contentHeight - PROJECT_SIZE}
          visible={isHovered}
        />
      </animated.div>
      {/*  )} */}
      {/* {showWindow && ( */}
      <animated.div
        ref={windowRef}
        className={`${cn}__window`}
        style={{ transform: windowContainerTransform, width, height }}
      >
        <animated.div
          className={`${cn}__window-content`}
          style={{ transform: rotation }}
        >
          {content}
          <SVG.Close className={`${cn}__window-close`} onClick={closeWindow} />
        </animated.div>
      </animated.div>
      {/* )} */}
    </animated.div>
  );
};

export const Projects: React.FC = () => {
  const { projectIds } = useContext(ProjectContext);

  return <Project id={"resume"} index={0} />;
  // return (
  //   <>
  //     {projectIds.map((id, index) => (

  //     ))}
  //   </>
  // );
};
