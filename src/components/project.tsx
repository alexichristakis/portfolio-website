import { useMemo, useRef } from "react";
import { motion } from "framer-motion";

import { useLockedCursor, useWindows } from "../hooks";
import { Project as ProjectType } from "../types";
import { ICON_ZINDEX } from "../lib";
import "./project.scss";

const ClassPrefix = "project";

const PROJECT_SCALE_FACTOR = 1.5;

export const Project: React.FC<ProjectType> = ({ title, content, icon }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  const { spawnWindow, windowState } = useWindows({
    window: {
      id: title,
      icon,
      title,
      content,
      sourceRef: iconRef,
    },
  });

  const { style } = useLockedCursor(iconRef, {
    zIndex: ICON_ZINDEX,
    scale: PROJECT_SCALE_FACTOR,
  });

  return useMemo(() => {
    const windowClosed = windowState === "DESTROY";
    const windowOpen = windowState === "SPAWN";
    return (
      <motion.div
        layout="position"
        className={`${ClassPrefix}`}
        style={{
          width: windowOpen ? 0 : 150,
          opacity: windowClosed ? 1 : 0,
        }}
      >
        <motion.div
          ref={iconRef}
          className={`${ClassPrefix}__icon-container`}
          onClick={spawnWindow}
          style={{
            ...style,
            pointerEvents: windowOpen ? "none" : "all",
            translateX: windowOpen ? 75 : 0,
          }}
        >
          <motion.div className={`${ClassPrefix}__icon`}>
            {icon && <img alt="project-icon" src={icon} />}
          </motion.div>
        </motion.div>
        <div className={`${ClassPrefix}__title`}>{title}</div>
      </motion.div>
    );
  }, [windowState]);
};
