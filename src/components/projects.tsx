import cn from "classnames";

import { Icons, ProjectAssets } from "../assets";
import { Project } from "../types";
import Gallery, { GalleryProps } from "./gallery";
import "./projects.scss";

const ClassPrefix = "project";

const IconContentContainer: React.FC = ({ children }) => (
  <div className={`${ClassPrefix}__icon-content`}>{children}</div>
);

const Container: React.FC = ({ children }) => (
  <div className={`${ClassPrefix}__container`}>{children}</div>
);

type HeaderProps = {
  title: string;
  subtitle: string;
} & LinksProps;

const Header: React.FC<HeaderProps> = ({ title, subtitle, links }) => (
  <div className={`${ClassPrefix}__header`}>
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
    <Links links={links} />
  </div>
);

type LinksProps = { links: { title: string; uri: string }[] };
const Links: React.FC<LinksProps> = ({ links }) => (
  <div className={`${ClassPrefix}__links`}>
    {links.map(({ title, uri }) => (
      <h2
        key={title}
        className={`${ClassPrefix}__link`}
        onClick={() => window.open(uri)}
      >
        {title}
      </h2>
    ))}
  </div>
);

type ProjectContentProps = HeaderProps & GalleryProps & { copy?: string[] };
const ProjectContent: React.FC<ProjectContentProps> = ({
  images,
  links,
  title,
  subtitle,
  copy = [],
}) => (
  <Container>
    <Gallery images={images} />
    <Header title={title} subtitle={subtitle} links={links} />
    <div className={`${ClassPrefix}__body`}>
      {copy.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
    </div>
  </Container>
);

type ProjectIconContentProps = {
  title?: string;
  subtitle?: string;
  copy?: string[];
};
const ProjectIconContent: React.FC<ProjectIconContentProps> = ({
  title,
  subtitle,
  copy = [],
}) => (
  <IconContentContainer>
    {title && <h2>{title}</h2>}
    {subtitle && <h3>{subtitle}</h3>}
    {copy.map((p, idx) => (
      <p key={idx}>{p}</p>
    ))}
  </IconContentContainer>
);

export const projects: Project[] = [
  {
    id: "resume",
    icon: Icons.resume,
    aspectRatio: 1.294117647,
    backgroundColor: "#FFD60A",
    foregroundColor: "white",
    iconContent: (
      <ProjectIconContent
        copy={[
          "Graduated from Yale in May 2020, currently a software engineer at Retool.",
          "Previously at TrialSpark, Zillow, Snackpass.",
        ]}
      />
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
    id: "paint.party",
    icon: Icons.paintParty,
    backgroundColor: "#6236FF",
    foregroundColor: "#D8D8D8",
    iconContent: (
      <ProjectIconContent
        title={"Paint Party"}
        subtitle={"April 2020"}
        copy={[
          "Collaborative mobile drawing game. Winner of Yale's Lohmann Design Prize.",
          "TypeScript, React Native, Firebase.",
        ]}
      />
    ),
    content: (
      <ProjectContent
        title={"PaintParty"}
        subtitle={"April 2020"}
        images={[
          { src: ProjectAssets.paintpartyDeepSea, caption: "canvases" },
          { src: ProjectAssets.paintpartyCanvases, caption: "canvases" },
          { src: ProjectAssets.paintpartyColorEditor, caption: "canvases" },
          { src: ProjectAssets.paintpartyDraw, caption: "canvases" },
          { src: ProjectAssets.paintpartyGallery, caption: "canvases" },
          { src: ProjectAssets.paintpartyJoin, caption: "canvases" },
        ]}
        links={[
          { title: "website", uri: "https://paintparty.io" },
          {
            title: "appstore",
            uri: "https://apps.apple.com/tt/app/paint-party/id1504830265",
          },
        ]}
        copy={[
          "Draw pixel art with your friends in real time. Every canvas offers a unique experience with customizable size, background color, duration, and draw interval",
          "Drawing only colors a single pixel. Each canvas limits how frequently authors draw, so it helps to communicate a plan!",
          "Canvases can be exported to gifs that plot each pixel as it was drawn.",
        ]}
      />
    ),
  },
  {
    id: "unexpected",
    icon: Icons.unexpected,
    backgroundColor: "#49E020",
    foregroundColor: "",
    iconContent: (
      <ProjectIconContent
        title={"Unexpected"}
        subtitle={"March 2020"}
        copy={[
          "Senior thesis project. A photo sharing app that limits how often & when users can post.",
          "TypeScript, React Native, NodeJS, MongoDB.",
        ]}
      />
    ),
    content: (
      <ProjectContent
        title={"Unexpected"}
        subtitle={"March 2020"}
        images={[]}
        links={[
          {
            uri: "https://github.com/alexichristakis/unexpected",
            title: "code",
          },
        ]}
      />
    ),
  },
  {
    id: "screentime",
    backgroundColor: "#007FFF",
    foregroundColor: "#D6EAFF",
    icon: Icons.screentime,
    content: (
      <ProjectContent
        title={"Screentime"}
        subtitle={"October 2019"}
        images={[
          { src: ProjectAssets.screentimeForm1, caption: "canvases" },
          { src: ProjectAssets.screentimeViz1, caption: "canvases" },
          { src: ProjectAssets.screentimeTooltip1, caption: "canvases" },
          { src: ProjectAssets.screentimeGenerate, caption: "canvases" },
          { src: ProjectAssets.screentimeViz2, caption: "canvases" },
          { src: ProjectAssets.screentimeTooltip2, caption: "canvases" },
        ]}
        links={[
          {
            title: "website",
            uri: "https://screentime-525d7.firebaseapp.com",
          },
          {
            title: "code",
            uri: "https://screentime-525d7.firebaseapp.com",
          },
        ]}
      />
    ),
    iconContent: (
      <ProjectIconContent
        title={"Screentime"}
        subtitle={"October 2019"}
        copy={[
          "Class project that generates a visualization of iOS screentime metrics. To better illustrate our behaviors.",
          "React, Processing.",
        ]}
      />
    ),
  },
  {
    id: "accordion",
    icon: Icons.accordion,
    backgroundColor: "",
    foregroundColor: "",
    content: (
      <ProjectContent
        title="Accordion"
        subtitle="March 2019"
        images={[
          { src: ProjectAssets.accordionCover },
          { src: ProjectAssets.accordion1 },
          { src: ProjectAssets.accordion2 },
          { src: ProjectAssets.accordion3 },
          { src: ProjectAssets.accordion4 },
          { src: ProjectAssets.accordion5 },
          { src: ProjectAssets.accordion6 },
          { src: ProjectAssets.accordion7 },
          { src: ProjectAssets.accordion8 },
          { src: ProjectAssets.accordionFull },
        ]}
        links={[
          {
            uri:
              "https://drive.google.com/open?id=15JZi0SyjlQCUvVDhd-Ar48Kdcz5iSe1w",
            title: "pdf",
          },
        ]}
        copy={[
          "Project done for ART 469b: Advanced Graphic Design. Students chose a designer to write about in an 'accordion' format restricted only by the limitation of printing on a single side.",
          "My accordion (on Ralph Schraivogel) contains 5 sections: training & work, stylistic regularities, influence & context, Henry Van de Velde, and grayscale series. I designed the folding to accomodate a variety of opening possibilities which each allow for a different experience. The final product was produced on an Epson Inkjet large-format printer.",
        ]}
      />
    ),
    iconContent: (
      <ProjectIconContent
        title={"Accordion"}
        subtitle={"March 2019"}
        copy={[
          "Advanced Graphic Design mid-term project. An interactive accordion fold to view panes in many different combinations.",
        ]}
      />
    ),
  },
  {
    id: "photos",
    backgroundColor: "#008CA6",
    foregroundColor: "",
    icon: Icons.photography,
    content: <div>hello!</div>,
    iconContent: (
      <ProjectIconContent title="Photography" copy={["Selected photos."]} />
    ),
  },
  {
    id: "herd",
    icon: Icons.herd,
    backgroundColor: "#872BD2",
    foregroundColor: "",
    content: <div>hello!</div>,
    iconContent: (
      <ProjectIconContent
        title={"Herd"}
        subtitle={"Summer 2019"}
        copy={[
          "Socialized location sharing. Emphasis on large groups & anonymous background location sharing.",
          "React Native, Firebase.",
        ]}
      />
    ),
  },
  {
    id: "evently",
    icon: Icons.evently,
    backgroundColor: "",
    foregroundColor: "",
    content: <div>hello!</div>,
    iconContent: (
      <ProjectIconContent
        title="Evently"
        subtitle={"Spring 2018"}
        copy={[
          "Software Engineering class project. Event API aggregator with card-swiping interface.",
          "React Native, NodeJS, Firebase.",
        ]}
      />
    ),
  },
  {
    id: "sesh",
    icon: Icons.sesh,
    backgroundColor: "#865EFF",
    foregroundColor: "",
    content: <div>hello!</div>,
    iconContent: (
      <ProjectIconContent
        title="Sesh"
        subtitle="Summer 2018"
        copy={[
          "Event-based social app. Quickly notify friends of adhoc events.",
          "React Native, Firebase.",
        ]}
      />
    ),
  },
  {
    id: "twitterlytics",
    backgroundColor: "",
    foregroundColor: "",
    icon: Icons.twitterlytics,
    content: (
      <ProjectContent
        title="Twitterlytics"
        subtitle="December 2018"
        images={[]}
        links={[
          { uri: "https://bertha-ecf12.firebaseapp.com", title: "website" },
          {
            uri: "https://github.com/alexichristakis/project-bertha",
            title: "code",
          },
        ]}
      />
    ),
    iconContent: (
      <ProjectIconContent
        title="Twitterlytics"
        subtitle="December 2018"
        copy={[
          "Dashboard for generating NLP reports on a twitter user. Sentiment score and content analysis.",
          "React, Python, NLTK.",
        ]}
      />
    ),
  },
  {
    id: "website",
    backgroundColor: "",
    foregroundColor: "",
    icon: Icons.website,
    content: (
      <ProjectContent
        title="Portfolio"
        subtitle="January 2018"
        images={[
          { src: ProjectAssets.websiteGraphics, caption: "graphics" },
          { src: ProjectAssets.websiteDesign, caption: "design" },
          { src: ProjectAssets.websitePhotos, caption: "photos" },
        ]}
        links={[
          { uri: "https://alexi.site", title: "website" },
          {
            uri: "https://github.com/alexichristakis/personal-site",
            title: "code",
          },
        ]}
      />
    ),
    iconContent: (
      <ProjectIconContent
        title="Personal Site"
        copy={["The old version of this website."]}
      />
    ),
  },
];
