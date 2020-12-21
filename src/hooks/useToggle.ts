import { useState } from "react";

export const useToggle = (initial: boolean) => {
  const [value, setValue] = useState(initial);
  return {
    toggle: () => setValue((prev) => !prev),
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
    value,
  };
};
