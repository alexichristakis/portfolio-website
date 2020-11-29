import {
  createRef,
  memo,
  RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimateSharedLayout, motion } from "framer-motion";

import Icons from "../assets/icons";
import { Project as ProjectType } from "../types";
import { WindowState, WindowManagerContext } from "../context";
import "./projects.scss";
import { ICON_ZINDEX, setMultipleRefs } from "../lib";
import { useLockedCursor } from "../hooks";

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
    // icon: "",
  },
  {
    id: "4",
    title: "herd",
    icon: Icons.herd,
    content: <div>hello!</div>,
  },
  {
    id: "5",
    title: "evently",
    icon: Icons.evently,
    content: <div>hello!</div>,
  },
  {
    id: "6",
    title: "accordion",
    // icon: "",
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

interface ProjectIconProps extends ProjectType {
  onClick: () => void;
  iconRef: RefObject<HTMLDivElement>;
}

export const ProjectIcon: React.FC<ProjectIconProps> = ({
  id,
  title,
  icon,
  iconRef,
  onClick,
}) => {
  const [windowState, setWindowState] = useState<WindowState>(
    WindowState.CLOSED
  );
  const ref = useRef<HTMLDivElement>(null);

  const { events } = useContext(WindowManagerContext);

  useLayoutEffect(() => {
    const subscription = events.subscribe((payload) => {
      if (payload.id === id) {
        console.log("newState", payload.type);
        setWindowState(payload.type);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const { style } = useLockedCursor(ref, {
    zIndex: ICON_ZINDEX,
    scale: 1.5,
  });

  const ClassPrefix = "project";
  if (windowState === WindowState.OPEN) return null;
  return (
    <motion.div
      layout="position"
      layoutId={title}
      className={ClassPrefix}
      style={{ opacity: windowState === WindowState.CLOSED ? 1 : 0 }}
    >
      <motion.div
        ref={setMultipleRefs(iconRef, ref)}
        className={`${ClassPrefix}__icon-container`}
        onClick={onClick}
        style={style}
      >
        <motion.div className={`${ClassPrefix}__icon`}>
          {icon && <img alt={`${title} icon`} src={icon} />}
        </motion.div>
      </motion.div>
      <div className={`${ClassPrefix}__title`}>{title}</div>
    </motion.div>
  );
};

type RefMap = { [id: string]: React.RefObject<HTMLDivElement> };

const projectRefMap = PROJECTS.reduce((acc, { id }) => {
  acc[id] = createRef();
  return acc;
}, {} as RefMap);

export const Projects: React.FC = () => {
  const [_, setRenderKey] = useState(0);
  const sourceRefs = useRef<RefMap>(projectRefMap);
  const { openWindow, registerWindow, events } = useContext(
    WindowManagerContext
  );

  useLayoutEffect(() => {
    PROJECTS?.forEach((project) => {
      registerWindow({ ...project, sourceRef: sourceRefs.current[project.id] });
    });

    const subscription = events.subscribe((payload) => {
      const { type } = payload;
      if (type === WindowState.OPEN || type === WindowState.CLOSING) {
        setRenderKey((prev) => prev + 1);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="projects">
      <AnimateSharedLayout>
        {PROJECTS.map(({ id, ...rest }) => (
          <ProjectIcon
            key={id}
            id={id}
            onClick={() => openWindow(id)}
            iconRef={sourceRefs.current[id]}
            {...rest}
          />
        ))}
      </AnimateSharedLayout>
    </div>
  );
};
