import { AnimateSharedLayout, motion } from "framer-motion";

import Icons from "../assets/icons";
import { Project as ProjectType } from "../types";
import { useWindowEvents, useWindows } from "../hooks";
import { Project } from "./project";
import "./projects.scss";
import { useContext } from "react";
import { WindowManagerContext } from "../context";

const PROJECTS: ProjectType[] = [
  {
    title: "resume",
    icon: Icons.resume,
    content: <div>hello!</div>,
  },
  {
    title: "paint.party",
    icon: Icons.paintParty,
    content: <div>hello!</div>,
  },
  {
    title: "unexpected",
    icon: Icons.unexpected,
    content: <div>hello!</div>,
  },
  {
    title: "screentime",
    content: <div>hello!</div>,
    // icon: "",
  },
  {
    title: "herd",
    icon: Icons.herd,
    content: <div>hello!</div>,
  },
  {
    title: "evently",
    icon: Icons.evently,
    content: <div>hello!</div>,
  },
  {
    title: "accordion",
    // icon: "",
    content: <div>hello!</div>,
  },
  {
    title: "sesh",
    icon: Icons.sesh,
    content: <div>hello!</div>,
  },
  {
    title: "twitterlytics",
    content: <div>hello!</div>,
    // icon: "",
  },
];

export const Projects: React.FC = () => {
  // const { state } = useWindows({});
  const { state } = useWindowEvents();
  const { windows, openWindows } = useContext(WindowManagerContext);

  // // console.log("render projects", state);
  const projects = PROJECTS.filter(({ title }) => !openWindows.includes(title));

  console.log("render projects", state);
  return (
    <div className="projects">
      <AnimateSharedLayout _dependency={state}>
        {projects.map((project) => (
          // <motion.div
          //   key={project.title}
          //   layout="position"
          //   layoutId={project.title}
          // >
          <Project key={project.title} {...project} />
          // </motion.div>
        ))}
      </AnimateSharedLayout>
    </div>
  );
};
