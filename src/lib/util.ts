import { Ref, MutableRefObject } from "react";
import { Vector2D, SpringVector2D } from "../types";

export const setStyleProperties = (
  element: HTMLElement | null,
  properties: { [style: string]: string }
) => {
  Object.entries(properties).map(([style, value]) => {
    element?.style.setProperty(style, value);
  });
};

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
