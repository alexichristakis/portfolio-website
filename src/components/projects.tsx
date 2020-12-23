import cn from "classnames";

import { Icons, ProjectAssets } from "../assets";
import { Project } from "../types";

import Gallery from "./gallery";
import "./projects.scss";

const ClassPrefix = "project";

const IconContentContainer: React.FC = ({ children }) => (
  <div className={`${ClassPrefix}__icon-content`}>{children}</div>
);

const Container: React.FC = ({ children }) => (
  <div className={`${ClassPrefix}__container`}>{children}</div>
);

export const projects: Project[] = [
  {
    title: "resume",
    icon: Icons.resume,
    aspectRatio: 1.294117647,
    color: "",
    iconContent: (
      <IconContentContainer>
        <p>
          Graduated from Yale in 2020, currently a software engineer at Retool.
        </p>
        <p>Previously at TrialSpark, Zillow, Snackpass.</p>
      </IconContentContainer>
    ),
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
    iconContent: (
      <IconContentContainer>
        <h1>Paint Party</h1>
        <h2>April 2020</h2>
        <p>
          Collaborative mobile drawing game. TypeScript, React Native, Firebase.
          Winner of Yale's Lohmann Design Prize.
        </p>
      </IconContentContainer>
    ),
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
    links: [{ title: "website", uri: "https://paintparty.io" }],
  },
  {
    title: "unexpected",
    icon: Icons.unexpected,
    color: "",
    iconContent: (
      <IconContentContainer>
        <h1>Unexpected</h1>
        <h2>March 2020</h2>
        <p>
          Senior thesis project. A photo sharing app that limits how often {"&"}
          when users can post.
        </p>
      </IconContentContainer>
    ),
    content: <div>hello!</div>,
  },
  {
    title: "screentime",
    color: "",
    content: <div>hello!</div>,
    icon: Icons.screentime,
    links: [{ title: "live", uri: "https://screentime-525d7.firebaseapp.com" }],
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
