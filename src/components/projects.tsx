import React from "react";
import styled from "styled-components";

import { Project } from "./project";
import { Project as ProjectType } from "../types";
import { BOX_SIZE } from "../lib";

import "./projects.scss";

const ClassPrefix = "projects";

// const Container = styled.div`
//   padding: 50px;
//   display: grid;
//   grid-template-columns: repeat(3, ${BOX_SIZE}px);
//   grid-template-rows: repeat(3, ${BOX_SIZE}px) auto;
//   grid-column-gap: 64px;
//   grid-row-gap: 64px;
// `;

const PROJECTS: ProjectType[] = [
  { title: "paint party" },
  { title: "unexpected" },
  { title: "screentime" },
  { title: "herd" },
  { title: "evently" },
  { title: "resume" },
  { title: "accordion" },
  { title: "sesh" },
  { title: "twitterlytics" },
];

export const Projects: React.FC = () => {
  return (
    <div className={ClassPrefix}>
      {PROJECTS.map((project) => (
        <Project {...project} />
      ))}
    </div>
  );
};
