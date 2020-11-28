import { useContext, useRef } from "react";
import { motion } from "framer-motion";

import { useLockedCursor } from "../hooks";
import { Project as ProjectType } from "../types";
import { ICON_ZINDEX } from "../lib";
import { WindowManagerContext } from "./windowManager";
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

  const handleOnTap = () =>
    spawnWindow({
      id: "1",
      sourceRef: iconRef,
      content: () => <div>hello!</div>,
    });

  return (
    <div className={`${ClassPrefix}`}>
      <motion.div
        className={`${ClassPrefix}__icon-container`}
        onTap={handleOnTap}
        style={style}
      >
        <motion.div
          ref={iconRef}
          className={`${ClassPrefix}__icon`}
          whileHover={{ scale: PROJECT_SCALE_FACTOR }}
          whileTap={{ scale: PROJECT_SCALE_FACTOR - 0.1, opacity: 0.9 }}
        ></motion.div>
      </motion.div>
      <div className={`${ClassPrefix}__title`}>{title}</div>
    </div>
  );
};
