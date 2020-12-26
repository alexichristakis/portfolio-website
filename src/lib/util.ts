import { Ref, MutableRefObject } from "react";
import { Vector2D, SpringVector2D } from "../types";

export const setMultipleRefs = <RefType = any>(
  ...refs: ReadonlyArray<Ref<RefType>>
) => (element: RefType) => {
  for (const ref of refs) {
    if (typeof ref === "function") {
      ref(element);
    } else if (ref != null) {
      (ref as MutableRefObject<any>).current = element;
    }
  }
};

export const getVectorVal = (v: SpringVector2D): Vector2D => {
  let x, y;
  if (v instanceof Array) {
    x = v[0].get();
    y = v[1].get();
  } else {
    [x, y] = v.get();
  }
  return [x, y];
};

export const clamp = (val: number, min: number = 0, max: number = 1) =>
  Math.min(max, Math.max(val, min));

export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

export const invlerp = (x: number, y: number, a: number) =>
  clamp((a - x) / (y - x));

export const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number
) => lerp(x2, y2, invlerp(x1, y1, a));

export const peekLast = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

export const uuid = () => btoa(Math.random().toString()).substring(0, 12);
