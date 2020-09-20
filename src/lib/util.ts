export const setStyleProperties = (
  element: HTMLElement | null,
  properties: { [style: string]: string }
) => {
  Object.entries(properties).map(([style, value]) => {
    element?.style.setProperty(style, value);
  });
};
