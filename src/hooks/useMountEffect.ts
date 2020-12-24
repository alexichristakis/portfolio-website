import { useEffect, EffectCallback } from "react";

export const useMountEffect = (effect: EffectCallback) => {
  // eslint-disable-next-line
  useEffect(effect, []);
};
