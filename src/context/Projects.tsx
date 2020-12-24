import { createContext } from "react";

import { Project, Vector2D, Vector3D } from "../types";
import { projects } from "../components/projects";
import { PROJECT_SIZE } from "../lib";

type Projects = {
  [key: string]: Project;
};

type Positions = {
  [key: string]: Vector2D;
};

type ProjectContext = {
  projects: Projects;
  initialPositions: Positions;
};

export const ProjectContext = createContext({} as ProjectContext);

const INITIAL_SCALE = 1;
const PROJECT_MARGIN = 40;

const NUM_PER_ROW = Math.floor(
  window.innerWidth / (PROJECT_SIZE + PROJECT_MARGIN * 2)
);

const getInitialPosition = (index: number): Vector2D => [
  (index % NUM_PER_ROW) * (PROJECT_SIZE + PROJECT_MARGIN * 2) + PROJECT_MARGIN,
  Math.floor(index / NUM_PER_ROW) * (PROJECT_SIZE + PROJECT_MARGIN * 2) +
    PROJECT_MARGIN,
];

export const ProjectProvider: React.FC = ({ children }) => {
  const initialPositions = Object.keys(projects).reduce(
    (positions, id, idx) => {
      positions[id] = getInitialPosition(idx);
      return positions;
    },
    {} as Positions
  );

  return (
    <ProjectContext.Provider value={{ projects, initialPositions }}>
      {children}
    </ProjectContext.Provider>
  );
};
