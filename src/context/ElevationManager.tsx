import { createContext, useRef } from "react";

import { Events, useEvents } from "../hooks";

export enum ElevatedElementTier {
  ICON,
  WINDOW,
  CURSOR,
}

type PartialElevatedElement = {
  tier: ElevatedElementTier;
  id: string;
};

type ElevatedElementEvent = {
  tier: ElevatedElementTier;
  elevations: { [key: string]: number };
};

type ElementMap = {
  [key in ElevatedElementTier]: string[];
};

type ElevationManagerState = {
  elements: React.MutableRefObject<ElementMap>;
  registerElement: (el: PartialElevatedElement) => { initial: number };
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

  const getElevation = (tier: ElevatedElementTier, idx: number) =>
    idx + floor.current * tier;

  const updateElements = (
    { id, tier }: PartialElevatedElement,
    newIndex: number
  ) => {
    const newElements = elements.current[tier].filter((e) => e !== id);
    newElements.splice(newIndex, 0, id);

    // update with the new location
    elements.current = {
      ...elements.current,
      [tier]: newElements,
    };

    // if we breach the floor of the next tier, raise it
    const highest = elements.current[tier].length;
    if (highest > floor.current) {
      floor.current *= 2;
    }

    // generate elevations map
    const elevations = elements.current[tier].reduce((acc, id, idx) => {
      acc[id] = getElevation(tier, idx);
      return acc;
    }, {} as { [key: string]: number });

    send({ tier, elevations });
    return elevations[id];
  };

  const registerElement = ({ id, tier }: PartialElevatedElement) => {
    const initial = updateElements({ id, tier }, elements.current[tier].length);
    return { initial };
  };

  const removeElement = ({ id, tier }: PartialElevatedElement) => {
    elements.current[tier] = elements.current[tier].filter((e) => e !== id);
  };

  const raise = ({ id, tier }: PartialElevatedElement, amount?: number) => {
    if (!amount) {
      updateElements({ id, tier }, elements.current[tier].length - 1);
    }
  };

  const lower = ({ id, tier }: PartialElevatedElement, amount?: number) => {
    if (!amount) {
      updateElements({ id, tier }, 0);
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
