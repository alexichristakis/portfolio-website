import { createContext, useRef } from "react";

import { Events, useEvents } from "../hooks";

export enum ElevatedElementTier {
  ICON,
  WINDOW,
  CURSOR,
}

type PartialElevatedElement = {
  id: string;
  tier: ElevatedElementTier;
};

export type ElevatedElement = PartialElevatedElement & {
  index: number;
};

type ElevatedElementEvent = {
  raise?: boolean;
  id: string;
  index: number;
};

type ElementMap = {
  [key in ElevatedElementTier]: ElevatedElement[];
};

type ElevationManagerState = {
  elements: React.MutableRefObject<ElementMap>;
  registerElement: (
    el: PartialElevatedElement
  ) => { id: string; initial: number };
  removeElement: (el: PartialElevatedElement) => void;
  raise: (el: PartialElevatedElement, amount?: number) => void;
  lower: (el: PartialElevatedElement, amount?: number) => void;
  floor: React.MutableRefObject<number>;
  subscribe: Events<ElevatedElementEvent>["subscribe"];
};

export const ElevationManagerContext = createContext(
  {} as ElevationManagerState
);

export const ElevationManagerProvider: React.FC = ({ children }) => {
  const floor = useRef(100);
  const elements = useRef<ElementMap>({
    [ElevatedElementTier.ICON]: [],
    [ElevatedElementTier.WINDOW]: [],
    [ElevatedElementTier.CURSOR]: [],
  });

  const { subscribe, send } = useEvents<ElevatedElementEvent>();

  const registerElement = ({ id, tier }: PartialElevatedElement) => {
    elements.current[tier].unshift({ id, tier, index: 0 });

    const highest =
      elements.current[tier][elements.current[tier].length - 1].index;
    if (highest > floor.current) {
      // handle raise
      floor.current *= 2;
      send({ raise: true, id, index: highest });
    }

    console.log("register", { id, tier, highest });
    return { initial: highest + floor.current * tier, id };
  };

  const removeElement = ({ id, tier }: PartialElevatedElement) => {
    elements.current[tier] = elements.current[tier].filter((e) => e.id !== id);
  };

  const raise = ({ id, tier }: PartialElevatedElement, amount?: number) => {
    if (!amount) {
      // raise to top
      const otherElements = elements.current[tier].filter((e) => e.id !== id);

      const highest = otherElements[otherElements.length - 1]?.index ?? 0;

      const index = highest + 1;

      elements.current[tier] = otherElements.concat({
        id,
        tier,
        index,
      });
      let raise = false;

      if (highest >= floor.current) {
        // handle raise
        floor.current *= 2;
        raise = true;
      }

      send({ id, index, raise });
    }
  };

  const lower = ({ id, tier }: PartialElevatedElement, amount?: number) => {
    if (!amount) {
      // lower to bottom
      const otherElements = elements.current[tier].filter((e) => e.id !== id);
      const lowest = otherElements[0]?.index ?? 0;

      elements.current[tier] = otherElements.concat({
        id,
        tier,
        index: Math.max(lowest - 1, 0),
      });

      send({ id, index: lowest });
    }
  };

  return (
    <ElevationManagerContext.Provider
      value={{
        subscribe,
        elements,
        floor,
        raise,
        registerElement,
        removeElement,
        lower,
      }}
    >
      {children}
    </ElevationManagerContext.Provider>
  );
};
