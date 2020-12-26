import { useCallback, useContext, useState } from "react";
import { useSpring } from "react-spring";
// @ts-ignore
import uuid from "uuid/v4";

import {
  ElevatedElementTier,
  ElevationManagerContext,
} from "../context/ElevationManager";
import { useMountEffect } from "./useMountEffect";

export const useElevatedElement = (tier: ElevatedElementTier) => {
  const {
    registerElement,
    removeElement,
    floor,
    subscribe,
    raise: handleRaise,
    lower: handleLower,
  } = useContext(ElevationManagerContext);
  const [{ zIndex }, set] = useSpring(() => ({ zIndex: tier }));
  const [id] = useState<string>(() => uuid());

  useMountEffect(() => {
    const { initial } = registerElement({ tier, id });
    set({ zIndex: initial, immediate: true });

    const unsubscribe = subscribe((ev) => {
      if (ev.raise || ev.id === id) {
        const { index } = ev;

        zIndex.set(index + floor.current * tier);
      }
    });

    return () => {
      removeElement({ id, tier });
      unsubscribe();
    };
  });

  const raise = useCallback(
    (amount?: number) => handleRaise({ id, tier }, amount),
    [handleRaise, id, tier]
  );
  const lower = useCallback(
    (amount?: number) => handleLower({ id, tier }, amount),
    [handleLower, id, tier]
  );

  return {
    zIndex,
    raise,
    lower,
  };
};
