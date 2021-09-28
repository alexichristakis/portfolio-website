import { useState, useRef, useContext } from "react";
import { animated, to, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";
import classNames from "classnames";

import { setMultipleRefs, clamp, PROJECT_SIZE } from "../lib";
import { ElevatedElementTier, ProjectContext } from "../context";
import {
  useMeasure,
  useMountEffect,
  useProject,
  useElevatedElement,
  useSkewAnimation,
  useWindows,
} from "../hooks";
import ScrollBar from "./scrollbar";

import "./projectIcon.scss";

const HOVER_SCALE = 1.4;
const CLICK_SCALE = 1.2;
const INITIAL_SCALE = 1;

interface ProjectIconProps {
  id: string;
  index: number;
}

export const ProjectIcon: React.FC<ProjectIconProps> = ({ id, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDragSession = useRef(false);

  const [
    { icon, iconContent, backgroundColor, foregroundColor },
    [initialX, initialY, initialZoom],
  ] = useProject(id);

  const [{ height: contentHeight }] = useMeasure(contentRef, {
    ignoreTransform: true,
  });

  const [{ xy, scroll, zoom, scale, visible }, set] = useSpring(() => ({
    xy: [0, 0],
    scroll: 0,
    zoom: -INITIAL_SCALE,
    scale: INITIAL_SCALE,
    visible: true,
  }));

  const { zIndex, raise } = useElevatedElement(ElevatedElementTier.ICON);
  useMountEffect(() => {
    set({ zoom: initialZoom, delay: index * 100 });
  });

  const { sourceRef, openWindow } = useWindows({
    id,
    handlers: {
      onOpen: () => {
        visible.set(false);
      },
      onClose: () => {
        raise();
        visible.set(true);
      },
    },
  });

  const position = xy.to((x, y) => [x + initialX, y + initialY]);

  const { rotation, resetRotation, onHover, onMove } = useSkewAnimation({
    ref: containerRef,
  });

  const minScroll = -contentHeight + PROJECT_SIZE;
  useGesture(
    {
      onMove,
      onHover: ({ active, ...rest }) => {
        if (!active) {
          setIsHovered(false);
          set({ scroll: 0, scale: INITIAL_SCALE });
        } else {
          raise();
          setIsHovered(true);

          set({ scroll: minScroll, scale: HOVER_SCALE });
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
        if (!isDragSession.current) {
          openWindow();
        }
        isDragSession.current = false;
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
      onPinch: ({ velocities: [vd], cancel, canceled }) => {
        if (canceled) return;

        const nextZoom = clamp(zoom.get() + vd / 10, -0.5, 0.25);
        if (nextZoom === 0.25) {
          openWindow();
          cancel();
        } else {
          set({ zoom: nextZoom, immediate: true });
        }
      },
      onWheel: ({ pinching, delta: [, dy] }) => {
        if (isHovered && !pinching) {
          set({ scroll: clamp(scroll.get() - dy * 5, minScroll, 0) });
        }
      },
    },
    { domTarget: containerRef, eventOptions: { passive: false } }
  );

  const contentTransform = scroll.to((val) => `translateY(${val}px)`);
  const containerTransform = to(
    [
      position.to((x, y) => `translate(${x}px, ${y}px)`),
      to([zoom, scale], (z, s) => `scale(${z + s})`),
    ],
    (t, s) => `${t} ${s}`
  );

  const pointerEvents = visible.to((visible) => (visible ? "all" : "none"));
  const opacity = visible.to((visible) => (visible ? 1 : 0));

  const cn = "project-icon";
  return (
    <animated.div
      className={`${cn}__container`}
      // @ts-ignore
      style={{ transform: containerTransform, opacity, pointerEvents, zIndex }}
    >
      <animated.div
        ref={setMultipleRefs(sourceRef, containerRef)}
        className={classNames(cn, isHovered && `${cn}__shadow`)}
        style={{
          transform: rotation,
          // @ts-ignore
          "--project-background": backgroundColor,
          "--project-foreground": foregroundColor,
        }}
      >
        <animated.div
          className={`${cn}__content`}
          ref={contentRef}
          style={{ transform: contentTransform }}
        >
          <img
            className={`${cn}__image`}
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
    </animated.div>
  );
};

export const ProjectIcons: React.FC = () => {
  const { projectIds } = useContext(ProjectContext);
  return (
    <>
      {projectIds.map((id, index) => (
        <ProjectIcon key={id} id={id} index={index} />
      ))}
    </>
  );
};
