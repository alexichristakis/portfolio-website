import { useState } from "react";

export const useForcedUpdate = () => {
  const [_, setRenderKey] = useState(0);
  return () => setRenderKey((prev) => prev + 1);
};
