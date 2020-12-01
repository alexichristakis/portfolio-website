import { useMemo, useRef } from "react";
import {
  AnimateSharedLayout,
  motion,
  MotionStyle,
  useMotionValue,
  useTransform,
  animate,
  useMotionTemplate,
} from "framer-motion";

import Icons from "../assets/icons";
import { Project as ProjectType } from "../types";
import { WindowState } from "../context";
import {
  ICON_BORDER_RADIUS,
  ICON_ZINDEX,
  setMultipleRefs,
  TWEEN_ANIMATION,
} from "../lib";
import { useLockedCursor, useWindowEvents, useWindows } from "../hooks";

import "./projects.scss";

const PROJECTS: ProjectType[] = [
  {
    id: "0",
    title: "resume",
    icon: Icons.resume,
    content: <div>hello!</div>,
  },
  {
    id: "1",
    title: "paint.party",
    icon: Icons.paintParty,
    content: <div>hello!</div>,
    link: "https://paintparty.io",
  },
  {
    id: "2",
    title: "unexpected",
    icon: Icons.unexpected,
    content: <div>hello!</div>,
  },
  {
    id: "3",
    title: "screentime",
    content: <div>hello!</div>,
    icon: Icons.screentime,
    link: "https://screentime-525d7.firebaseapp.com",
  },
  {
    id: "4",
    title: "accordion",
    icon: Icons.accordion,
    content: <div>hello!</div>,
  },
  {
    id: "5",
    title: "herd",
    icon: Icons.herd,
    content: <div>hello!</div>,
  },
  {
    id: "6",
    title: "evently",
    icon: Icons.evently,
    content: <div>hello!</div>,
  },
  {
    id: "7",
    title: "sesh",
    icon: Icons.sesh,
    content: <div>hello!</div>,
  },
  {
    id: "8",
    title: "twitterlytics",
    content: <div>hello!</div>,
    // icon: "",
  },
];

interface ProjectIconProps extends ProjectType {}

export const ProjectIcon: React.FC<ProjectIconProps> = ({
  title,
  icon,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const openAnimation = useMotionValue(0);

  const { windowState, sourceRef, openWindow } = useWindows({
    window: { title, icon, ...rest },
    handlers: {
      onOpen: () => openAnimation.set(1),
      onClose: () => animate(openAnimation, 0, TWEEN_ANIMATION),
    },
  });

  const { style } = useLockedCursor(ref, {
    zIndex: ICON_ZINDEX,
    scale: 1.5,
  });

  const titleAnimatedStyle: MotionStyle = {
    translateY: useTransform(openAnimation, [0, 1], [0, -20]),
  };

  const boxShadowSpread = useTransform(openAnimation, [0, 1], [10, 0]);
  const boxShadow = useMotionTemplate`0 0 ${boxShadowSpread}px 0px var(--lighter-gray)`;

  const ClassPrefix = "project";
  const content = useMemo(
    () => (
      <>
        <motion.div
          ref={setMultipleRefs(sourceRef, ref)}
          className={`${ClassPrefix}__icon-container`}
          onClick={openWindow}
          style={style}
        >
          <motion.div
            className={`${ClassPrefix}__icon`}
            style={{ borderRadius: ICON_BORDER_RADIUS, boxShadow }}
          >
            {icon && <img alt={`${title} icon`} src={icon} />}
          </motion.div>
        </motion.div>
        <motion.div
          className={`${ClassPrefix}__title`}
          style={titleAnimatedStyle}
        >
          {title}
        </motion.div>
      </>
    ),
    []
  );

  if (windowState === WindowState.OPEN) return null;
  return (
    <motion.div
      layout="position"
      layoutId={title}
      className={ClassPrefix}
      style={{ opacity: windowState === WindowState.CLOSED ? 1 : 0 }}
    >
      {content}
    </motion.div>
  );
};

export const Projects: React.FC = () => {
  // subscribe to window open and close events to update the shared layout
  // at the appropriate times
  useWindowEvents({ events: [WindowState.OPEN, WindowState.CLOSING] });

  return (
    <div className="projects">
      <AnimateSharedLayout>
        {PROJECTS.map(({ id, ...rest }) => (
          <ProjectIcon key={id} id={id} {...rest} />
        ))}
      </AnimateSharedLayout>
    </div>
  );
};
