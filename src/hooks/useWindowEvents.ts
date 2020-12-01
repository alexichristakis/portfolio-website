import { useContext, useEffect } from "react";

import { WindowManagerContext, WindowState } from "../context";
import { useForcedUpdate } from "./useForcedUpdate";

type UseWindowEventsConfig = {
  events: WindowState[];
  id?: string;
};

export const useWindowEvents = ({ events, id }: UseWindowEventsConfig) => {
  const update = useForcedUpdate();
  const { events: eventEmitter } = useContext(WindowManagerContext);

  useEffect(() => {
    const subscription = eventEmitter.subscribe((payload) => {
      const { type } = payload;
      if (events.includes(type) && (!id || id === payload.id)) {
        update();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return;
};
