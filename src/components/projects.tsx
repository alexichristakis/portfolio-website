import cn from "classnames";

import { Icons, ProjectAssets } from "../assets";
import { Project } from "../types";

import Gallery from "./gallery";
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
    color: "",
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
    color: "",
    content: (
      <Gallery
        images={[
          { src: ProjectAssets.paintpartyCanvases, caption: "canvases" },
          { src: ProjectAssets.paintpartyColorEditor, caption: "canvases" },
          { src: ProjectAssets.paintpartyDraw, caption: "canvases" },
          { src: ProjectAssets.paintpartyGallery, caption: "canvases" },
          { src: ProjectAssets.paintpartyCanvases, caption: "canvases" },
          { src: ProjectAssets.paintpartyColorEditor, caption: "canvases" },
          { src: ProjectAssets.paintpartyDraw, caption: "canvases" },
          { src: ProjectAssets.paintpartyGallery, caption: "canvases" },
        ]}
      />
    ),
    link: "https://paintparty.io",
  },
  {
    title: "unexpected",
    icon: Icons.unexpected,
    color: "",
    content: <div>hello!</div>,
  },
  {
    title: "screentime",
    color: "",
    content: <div>hello!</div>,
    icon: Icons.screentime,
    link: "https://screentime-525d7.firebaseapp.com",
  },
  {
    title: "accordion",
    icon: Icons.accordion,
    color: "",
    content: <div>hello!</div>,
  },
  {
    title: "photos",
    color: "",
    content: <div>hello!</div>,
  },
  {
    title: "herd",
    icon: Icons.herd,
    color: "",
    content: <div>hello!</div>,
  },
  {
    title: "evently",
    icon: Icons.evently,
    color: "",
    content: <div>hello!</div>,
  },
  {
    title: "sesh",
    icon: Icons.sesh,
    color: "",
    content: <div>hello!</div>,
  },
  {
    title: "twitterlytics",
    color: "",
    content: <div>hello!</div>,
    // icon: "",
  },
];
