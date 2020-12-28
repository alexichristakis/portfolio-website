import { useEffect, useLayoutEffect, EffectCallback } from "react";

export const useMountEffect = (effect: EffectCallback) => {
  // eslint-disable-next-line
  useEffect(effect, []);
};

export const useLayoutMountEffect = (effect: EffectCallback) => {
  // eslint-disable-next-line
  useLayoutEffect(effect, []);
};
