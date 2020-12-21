import { Context, memo, useContext, useEffect, useMemo, useRef } from "react";
import {
  AnimateSharedLayout,
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionTemplate,
  SharedLayoutContext,
  SharedLayoutSyncMethods,
} from "framer-motion";

import { Project } from "../types";
import { WindowState } from "../context";
import { ICON_ZINDEX, TWEEN_ANIMATION, setMultipleRefs } from "../lib";
import { useLockedCursor, useWindowEvents, useWindows } from "../hooks";
import { projects } from "./projects";

import "./projectIcons.scss";

interface IconProps extends Project {
  id: string;
}

export const Icon: React.FC<IconProps> = ({ title, icon, ...rest }) => {
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
    scale: 1.3,
  });

  const boxShadowSpread = useTransform(openAnimation, [0, 1], [5, 0]);
  const boxShadow = useMotionTemplate`0 0 ${boxShadowSpread}px 0px var(--lighter-gray)`;

  const ClassPrefix = "project";

  console.log("render icon:", title);

  if (windowState === WindowState.OPEN) return null;
  return (
    <motion.div
      layout="position"
      layoutId={title}
      className={ClassPrefix}
      style={{ opacity: windowState === WindowState.CLOSED ? 1 : 0 }}
    >
      <motion.div
        ref={setMultipleRefs(sourceRef, ref)}
        className={`${ClassPrefix}__icon-container`}
        onClick={openWindow}
        style={{ ...style, boxShadow }}
      >
        <img draggable={false} alt={`${title} icon`} src={icon} />
      </motion.div>
    </motion.div>
  );
};

export const ProjectIcons: React.FC = () => {
  const { state } = useWindowEvents({
    events: [WindowState.OPEN, WindowState.CLOSING],
  });

  console.log("render icons");
  return (
    <div className="projects">
      <AnimateSharedLayout>
        {projects.map(({ title, ...rest }) => (
          <Icon key={title} id={title} title={title} {...rest} />
        ))}
      </AnimateSharedLayout>
    </div>
  );
};
