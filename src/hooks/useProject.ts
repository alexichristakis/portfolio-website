import { useContext } from "react";

import { ProjectContext } from "../context";
import { Project, Vector3D } from "../types";

export const useProject = (id: string): [Project, Vector3D] => {
  const { projects, initialPositions } = useContext(ProjectContext);
  return [projects[id], initialPositions[id]];
};
