import { useState, useRef } from "react";
import { animated, to, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";
import cn from "classnames";

import { Project } from "../types";
import { WindowState } from "../context";
import { setMultipleRefs, PROJECT_SIZE } from "../lib";
import { useMeasure, useSkewAnimation, useWindows } from "../hooks";
import { projects } from "./projects";
import ScrollBar from "./scrollbar";

import "./projectIcons.scss";

const PROJECT_MARGIN = 40;
const HOVER_SCALE = 1.4;
const CLICK_SCALE = 1.2;
const INITIAL_SCALE = 1;

interface IconProps extends Project {
  index: number;
}

const NUM_PER_ROW = Math.floor(
  window.innerWidth / (PROJECT_SIZE + PROJECT_MARGIN * 2)
);
const getInitialPosition = (index: number) => [
  (index % NUM_PER_ROW) * (PROJECT_SIZE + PROJECT_MARGIN * 2) + PROJECT_MARGIN,
  Math.floor(index / NUM_PER_ROW) * (PROJECT_SIZE + PROJECT_MARGIN * 2) +
    PROJECT_MARGIN,
];

export const Icon: React.FC<IconProps> = ({
  id,
  icon,
  iconContent,
  index,
  backgroundColor,
  foregroundColor,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDragSession = useRef(false);

  const { height: contentHeight } = useMeasure(contentRef);

  const [{ visible }, setVisible] = useSpring(() => ({ visible: true }));
  const [{ xy, rz, scroll, zoom, scale }, set] = useSpring(() => ({
    xy: [0, 0],
    rz: 0,
    zoom: 0,
    scroll: 0,
    scale: INITIAL_SCALE,
  }));

  const { sourceRef, openWindow } = useWindows({
    window: { id, icon, backgroundColor, foregroundColor, ...rest },
    handlers: {
      onOpen: () => setVisible({ visible: false, immediate: true }),
      onClose: () => setVisible({ visible: true, immediate: true }),
    },
  });

  const handleOnClick = () => {
    if (!isDragSession.current) {
      openWindow();
    }
  };

  const [initialX, initialY] = getInitialPosition(index);

  const position = xy.to((x, y) => [x + initialX, y + initialY]);

  const { rotation, resetRotation, onHover, onMove } = useSkewAnimation({
    ref: containerRef,
  });

  useGesture(
    {
      onMove,
      onHover: ({ active, ...rest }) => {
        if (!active) {
          setIsHovered(false);
          set({ scroll: 0, scale: INITIAL_SCALE });
        } else {
          setIsHovered(true);
          set({
            scale: HOVER_SCALE,
          });
        }

        onHover({ active, ...rest });
      },
      onDrag: ({ offset: [x, y], first }) => {
        if (first) {
          isDragSession.current = true;
          resetRotation();
        }

        set({ xy: [x, y] });
      },
      onDragEnd: () => {
        set({ scale: HOVER_SCALE });
      },
      onMouseDown: () => {
        set({ scale: CLICK_SCALE });
      },
      onMouseUp: () => {
        set({ scale: HOVER_SCALE });
        setTimeout(() => {
          isDragSession.current = false;
        }, 1);
      },
      onWheel: ({ hovering, delta: [, dy] }) => {
        if (hovering) {
          const next = Math.min(
            Math.max(scroll.get() - dy * 5, -contentHeight + PROJECT_SIZE),
            0
          );
          set({ scroll: next });
        }
      },
    },
    {
      domTarget: containerRef,
      eventOptions: { passive: true },
      drag: { threshold: 5 },
    }
  );

  useGesture(
    {
      onPinch: ({ offset: [d, a] }) => {
        set({ zoom: d / 200, rz: a });
      },
    },
    { domTarget: containerRef, eventOptions: { passive: false } }
  );

  const contentTransform = scroll.to((val) => `translateY(${val}px)`);
  const containerTransform = to(
    [
      position.to((x, y) => `translate(${x}px, ${y}px)`),
      to([zoom, scale], (z, s) => `scale(${z + s})`),
      to([rotation, rz], (rxy, rz) => `${rxy} rotateZ(${rz}deg)`),
    ],
    (t, s, r) => `${t} ${s} ${r}`
  );

  const pointerEvents = visible.to((visible) => (visible ? "all" : "none"));
  const opacity = visible.to((visible) => (visible ? 1 : 0));

  const ClassPrefix = "project-icon";
  return (
    <animated.div
      ref={setMultipleRefs(sourceRef, containerRef)}
      className={cn(ClassPrefix, isHovered && `${ClassPrefix}__shadow`)}
      onClick={handleOnClick}
      style={{
        transform: containerTransform,
        pointerEvents,
        // @ts-ignore
        opacity,
        "--project-background": backgroundColor,
        "--project-foreground": foregroundColor,
      }}
    >
      <animated.div
        className={`${ClassPrefix}__content`}
        ref={contentRef}
        style={{ transform: contentTransform }}
      >
        <img
          className={`${ClassPrefix}__image`}
          draggable={false}
          alt={`${id} icon`}
          src={icon}
        />
        {iconContent}
      </animated.div>
      <ScrollBar
        offset={scroll}
        contentHeight={contentHeight - PROJECT_SIZE}
        visible={isHovered}
      />
    </animated.div>
  );
};

export const ProjectIcons: React.FC = () => (
  <div className="projects">
    {projects.map(({ id, ...rest }, idx) => (
      <Icon key={id} id={id} index={idx} {...rest} />
    ))}
  </div>
);
