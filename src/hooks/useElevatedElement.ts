import { useCallback, useContext, useState } from "react";
import { useSpring } from "react-spring";

import { uuid } from "../lib";
import { ElevatedElementTier, ElevationManagerContext } from "../context";
import { useMountEffect } from "./useMountEffect";

export const useElevatedElement = (tier: ElevatedElementTier) => {
  const {
    registerElement,
    removeElement,
    subscribe,
    raise: handleRaise,
    lower: handleLower,
  } = useContext(ElevationManagerContext);
  const [{ zIndex }] = useSpring(() => ({ zIndex: tier }));
  const [id] = useState<string>(() => uuid());

  useMountEffect(() => {
    const { initial } = registerElement({ id, tier });
    zIndex.set(initial);

    const unsubscribe = subscribe(({ tier: updatedTier, elevations }) => {
      if (tier === updatedTier) {
        zIndex.set(elevations[id]);
      }
    });

    return () => {
      removeElement({ id, tier });
      unsubscribe();
    };
  });

  const raise = useCallback(() => handleRaise({ id, tier }), [
    handleRaise,
    id,
    tier,
  ]);

  const lower = useCallback(() => handleLower({ id, tier }), [
    handleLower,
    id,
    tier,
  ]);

  return {
    zIndex,
    raise,
    lower,
  };
};
