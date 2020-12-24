import { Interpolation, SpringValue } from "react-spring";

export type Project = {
  foregroundColor: string;
  backgroundColor: string;
  icon?: string;
  iconContent?: React.ReactNode;
  content: React.ReactNode;
  aspectRatio?: number;
};

export type Point2D = [x: number, y: number];
export type Vector2D = [number, number];
export type Vector3D = [number, number, number];
export type SpringPoint2D = [x: SpringValue<number>, y: SpringValue<number>];

export type Rect = {
  y: number;
  x: number;
  width: number;
  height: number;
};

export type SpringVector2D =
  | SpringValue<number[]>
  | Interpolation<any, number[]>
  | [SpringValue<number>, SpringValue<number>];
