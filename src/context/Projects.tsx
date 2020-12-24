import { createContext, useMemo } from "react";

import { Project, Vector2D, Vector3D } from "../types";
import { projects } from "../components";
import { clamp, PROJECT_SIZE } from "../lib";

type Projects = {
  [key: string]: Project;
};

type Positions = {
  [key: string]: Vector3D;
};

type ProjectContext = {
  projects: Projects;
  initialPositions: Positions;
};

export const ProjectContext = createContext({} as ProjectContext);

const INITIAL_SCALE = 1;
const MARGIN = 40;

const NUM_PER_ROW = Math.floor(window.innerWidth / (PROJECT_SIZE + MARGIN * 2));

const b = (val: number, low: number, high: number) => val >= low && val <= high;

const overlap = ([x1, y1, z1]: Vector3D, [x2, y2, z2]: Vector3D): boolean => {
  const right = x1 + PROJECT_SIZE * (z1 + 1);
  const right2 = x2 + PROJECT_SIZE * (z2 + 1);

  const bottom = y1 + PROJECT_SIZE * (z1 + 1);
  const bottom2 = y2 + PROJECT_SIZE * (z2 + 1);

  if (
    (b(right, x2, right2) || b(x1, x2, right2)) &&
    (b(bottom, y2, bottom2) || b(y1, y2, bottom2))
  ) {
    return true;
  }

  return false;
};

const getDiff = (
  [left1, top1, z1]: Vector3D,
  [left2, top2, z2]: Vector3D
): Vector2D => {
  const right1 = left1 + PROJECT_SIZE * (z1 + 1);
  const right2 = left2 + PROJECT_SIZE * (z2 + 1);

  const bottom1 = top1 + PROJECT_SIZE * (z1 + 1);
  const bottom2 = top2 + PROJECT_SIZE * (z2 + 1);

  return [
    left2 > left1 && left2 < right1
      ? Math.min(left2 - left1, left2 - right1)
      : right2 > left1 && right2 < right1
      ? Math.min(right2 - left1, right2 - right1)
      : 0,
    top2 > top1 && top2 < bottom1
      ? Math.min(top2 - top1, top2 - bottom1)
      : bottom2 > top1 && bottom2 < bottom1
      ? Math.min(bottom2 - top1, bottom2 - bottom1)
      : 0,
  ];
};

const random = (scale: number) => (Math.random() - 0.5) * scale;

const getPosition = (index: number, positions: Positions): Vector3D => {
  const z = random(0.5);

  // get the grid position
  let [x, y] = getInitialPosition(index);

  const size = (z + 1) * PROJECT_SIZE;
  const maxX = window.innerWidth - MARGIN - size;
  const maxY = window.innerHeight - MARGIN - size;

  // move it randomly
  const p1: Vector3D = [
    clamp(x + random(100), MARGIN, maxX),
    clamp(y + random(100), MARGIN, maxY),
    z,
  ];

  Object.values(positions).forEach((p2) => {
    if (overlap(p1, p2)) {
      // nudge
      const [diffX, diffY] = getDiff(p1, p2);
      p1[0] = clamp(x + diffX, MARGIN, maxX);
      p1[1] = clamp(y + diffY, MARGIN, maxY);
    }
  });

  return p1;
};

/**
 * converts a project index into it's position in a grid
 */
const getInitialPosition = (index: number): Vector2D => [
  // x grid coordinate
  (index % NUM_PER_ROW) * (PROJECT_SIZE + MARGIN * 2) + MARGIN,
  // y grid coordinate
  Math.floor(index / NUM_PER_ROW) * (PROJECT_SIZE + MARGIN * 2) + MARGIN,
];

export const ProjectProvider: React.FC = ({ children }) => {
  const initialPositions = useMemo(
    () =>
      Object.keys(projects).reduce((positions, id, idx) => {
        positions[id] = getPosition(idx, positions);

        return positions;
      }, {} as Positions),
    []
  );

  return (
    <ProjectContext.Provider value={{ projects, initialPositions }}>
      {children}
    </ProjectContext.Provider>
  );
};
