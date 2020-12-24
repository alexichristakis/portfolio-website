import { useContext, useState } from "react";

import { WindowManagerContext, WindowState } from "../context";
import { useForcedUpdate } from "./useForcedUpdate";
import { useMountEffect } from "./useMountEffect";

type UseWindowEventsConfig = {
  events: WindowState[];
  handlers?: WindowEventHandlers;
  id?: string;
};

export const useWindowEvents = ({
  events,
  id: windowId,
}: UseWindowEventsConfig) => {
  const [state, setState] = useState(WindowState.CLOSED);
  const update = useForcedUpdate();
  const { subscribe } = useContext(WindowManagerContext);

  useMountEffect(() => {
    const unsubscribe = subscribe((payload) => {
      const { type, id } = payload;

      if ((!windowId || id === windowId) && events.includes(type)) {
        setState(type);
        update();
      }
    });

    return () => unsubscribe();
  });

  return { state };
};
