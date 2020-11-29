import { memo, useContext, useRef } from "react";
import { motion } from "framer-motion";

import { useLockedCursor, useWindows } from "../hooks";
import { Project as ProjectType } from "../types";
import { ICON_ZINDEX } from "../lib";
import "./project.scss";

const ClassPrefix = "project";

const PROJECT_SCALE_FACTOR = 1.5;

export const Project: React.FC<ProjectType> = memo(
  ({ title, content, icon }) => {
    const ref = useRef<HTMLDivElement>(null);

    const { spawnWindow, isOpen, isClosed } = useWindows({
      window: {
        id: title,
        icon,
        title,
        content,
        sourceRef: ref,
      },
    });
    console.log("renderproject", title, isOpen, isClosed);

    // const { style } = useLockedCursor(ref, {
    //   zIndex: ICON_ZINDEX,
    //   scale: PROJECT_SCALE_FACTOR,
    // });

    if (isOpen) return null;
    return (
      <motion.div
        layout="position"
        layoutId={title}
        className={ClassPrefix}
        style={{ opacity: isClosed ? 1 : 0 }}
      >
        <motion.div
          ref={ref}
          className={`${ClassPrefix}__icon-container`}
          onClick={spawnWindow}
          // style={style}
        >
          <motion.div className={`${ClassPrefix}__icon`}>
            {icon && <img alt={`${title} icon`} src={icon} />}
          </motion.div>
        </motion.div>
        <div className={`${ClassPrefix}__title`}>{title}</div>
      </motion.div>
    );
  }
);
