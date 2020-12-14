import cn from "classnames";

import { Icons, ProjectAssets } from "../assets";
import { Project } from "../types";

import "./projects.scss";

const ClassPrefix = "project";

const Container: React.FC = ({ children }) => (
  <div className={`${ClassPrefix}__container`}>{children}</div>
);

export const projects: Project[] = [
  {
    title: "resume",
    icon: Icons.resume,
    aspectRatio: 1.294117647,
    content: (
      <img
        className="resume"
        alt="alexi-christakis-resume"
        src={ProjectAssets.resume}
      />
    ),
  },
  {
    title: "paint.party",
    icon: Icons.paintParty,
    content: <div>hello!</div>,
    link: "https://paintparty.io",
  },
  {
    title: "unexpected",
    icon: Icons.unexpected,
    content: <div>hello!</div>,
  },
  {
    title: "screentime",
    content: <div>hello!</div>,
    icon: Icons.screentime,
    link: "https://screentime-525d7.firebaseapp.com",
  },
  {
    title: "accordion",
    icon: Icons.accordion,
    content: <div>hello!</div>,
  },
  {
    title: "photos",
    content: <div>hello!</div>,
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
