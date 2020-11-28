import { useContext, useRef } from "react";
import { motion } from "framer-motion";

import { useLockedCursor } from "../hooks";
import { Project as ProjectType } from "../types";
import { ICON_ZINDEX } from "../lib";
import { WindowManagerContext } from "../context";
import "./project.scss";

const ClassPrefix = "project";

const PROJECT_SCALE_FACTOR = 1.5;

export const Project: React.FC<ProjectType> = ({ title }) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const { spawnWindow } = useContext(WindowManagerContext);
  const { style } = useLockedCursor(iconRef, {
    zIndex: ICON_ZINDEX,
    scale: PROJECT_SCALE_FACTOR,
    handlers: {
      onMouseEnter: () => {},
      onMouseLeave: () => {},
    },
  });

  const handleOnClick = () =>
    spawnWindow({
      id: title,
      title,
      sourceRef: iconRef,
      content: <div>{title}</div>,
    });

  return (
    <div className={`${ClassPrefix}`}>
      <motion.div
        ref={iconRef}
        className={`${ClassPrefix}__icon-container`}
        onClick={handleOnClick}
        style={style}
      >
        <motion.div
          className={`${ClassPrefix}__icon`}
          // whileHover={{ scale: PROJECT_SCALE_FACTOR }}
          // whileTap={{ scale: PROJECT_SCALE_FACTOR - 0.1, opacity: 0.9 }}
        />
      </motion.div>
      <div className={`${ClassPrefix}__title`}>{title}</div>
    </div>
  );
};
