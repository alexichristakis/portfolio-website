import { AnimateSharedLayout, motion } from "framer-motion";

import Icons from "../assets/icons";
import { Project as ProjectType } from "../types";
import { Project } from "./project";
import "./projects.scss";

const ClassPrefix = "projects";

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

export const Projects: React.FC = () => (
  <motion.div layout="position" className={ClassPrefix}>
    <AnimateSharedLayout>
      {PROJECTS.map((project) => (
        <Project key={project.title} {...project} />
      ))}
    </AnimateSharedLayout>
  </motion.div>
);
