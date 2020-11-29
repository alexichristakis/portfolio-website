import { Ref, MutableRefObject } from "react";

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
