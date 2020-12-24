import { useContext } from "react";

import { ProjectContext } from "../context";
import { Project, Vector2D } from "../types";

export const useProject = (id: string): [Project, Vector2D] => {
  const { projects, initialPositions } = useContext(ProjectContext);
  return [projects[id], initialPositions[id]];
};
