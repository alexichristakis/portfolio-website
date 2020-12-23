import cn from "classnames";

import { Icons, ProjectAssets } from "../assets";
import { Project } from "../types";

import Gallery from "./gallery";
import "./projects.scss";

const ClassPrefix = "project";

const IconContentContainer: React.FC = ({ children }) => (
  <div className={`${ClassPrefix}__icon-content`}>
    {children}
    <div className={`${ClassPrefix}__icon-content-banner`}>
      <h2>Click for more</h2>
    </div>
  </div>
);

const Container: React.FC = ({ children }) => (
  <div className={`${ClassPrefix}__container`}>{children}</div>
);

export const projects: Project[] = [
  {
    title: "resume",
    icon: Icons.resume,
    aspectRatio: 1.294117647,
    backgroundColor: "#FFD60A",
    foregroundColor: "white",
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
    backgroundColor: "#6236FF",
    foregroundColor: "#D8D8D8",
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
    backgroundColor: "#49E020",
    foregroundColor: "",
    iconContent: (
      <IconContentContainer>
        <h1>Unexpected</h1>
        <h2>March 2020</h2>
        <p>
          Senior thesis project. A photo sharing app that limits how often
          {" & "}
          when users can post. React Native, TypeScript, NodeJS, MongoDB.
        </p>
      </IconContentContainer>
    ),
    content: <div>hello!</div>,
  },
  {
    title: "screentime",
    backgroundColor: "#007FFF",
    foregroundColor: "#D6EAFF",
    icon: Icons.screentime,
    links: [{ title: "live", uri: "https://screentime-525d7.firebaseapp.com" }],
    content: <div>hello!</div>,
    iconContent: (
      <IconContentContainer>
        <h1>Screentime</h1>
        <h2>October 2019</h2>
        <p>
          Class project that generates a visualization of iOS screentime
          metrics. To better illustrate our behaviors.
        </p>
      </IconContentContainer>
    ),
  },
  {
    title: "accordion",
    icon: Icons.accordion,
    backgroundColor: "",
    foregroundColor: "",
    content: <div>hello!</div>,
    iconContent: (
      <IconContentContainer>
        <h1>Accordion</h1>
        <h2>March 2019</h2>
        <p>
          Advanced Graphic Design mid-term project. An interactive accordion
          fold to view panes in many different combinations.
        </p>
      </IconContentContainer>
    ),
  },
  {
    title: "photos",
    backgroundColor: "",
    foregroundColor: "",
    content: <div>hello!</div>,
  },
  {
    title: "herd",
    icon: Icons.herd,
    backgroundColor: "#872BD2",
    foregroundColor: "",
    content: <div>hello!</div>,
    iconContent: (
      <IconContentContainer>
        <h1>Herd</h1>
        <h2>Summer 2019</h2>
        <p>Socialized location sharing.</p>
      </IconContentContainer>
    ),
  },
  {
    title: "evently",
    icon: Icons.evently,
    backgroundColor: "",
    foregroundColor: "",
    content: <div>hello!</div>,
  },
  {
    title: "sesh",
    icon: Icons.sesh,
    backgroundColor: "",
    foregroundColor: "",
    content: <div>hello!</div>,
  },
  // {
  //   title: "twitterlytics",
  //   backgroundColor: "",
  //   foregroundColor: "",
  //   content: <div>hello!</div>,
  //   // icon: "",
  // },
];
