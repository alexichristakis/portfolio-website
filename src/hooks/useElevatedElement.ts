import { useCallback, useContext, useState } from "react";
import { useSpring } from "react-spring";

import { uuid } from "../lib";
import { ElevatedElementTier, ElevationManagerContext } from "../context";
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
  const [{ zIndex }] = useSpring(() => ({ zIndex: tier }));
  const [id] = useState<string>(() => uuid());

  useMountEffect(() => {
    const { initial } = registerElement({ id, tier });
    zIndex.set(initial);

    const unsubscribe = subscribe((ev) => {
      if (ev.tier === tier) {
        zIndex.set(ev.elevations[id]);
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
