import { useContext, useState, useEffect } from "react";

import {
  WindowManagerContext,
  WindowEventType,
  WindowEventHandlers,
} from "../context";

export type UseWindowEventsConfig = {
  id?: string;
  handlers?: WindowEventHandlers;
};

export const useWindowEvents = (config?: UseWindowEventsConfig) => {
  const [state, setState] = useState<WindowEventType>("DESTROY");
  const { events } = useContext(WindowManagerContext);

  useEffect(() => {
    events.subscribe((payload) => {
      const { type, id } = payload;

      if (!config?.id || id === config?.id) {
        setState(type);
        if (type === "REQUEST_CLOSE") {
          config?.handlers?.onRequestClose?.();
        }

        if (type === "DESTROY") {
          config?.handlers?.onClose?.();
        }

        if (type === "SPAWN") {
          config?.handlers?.onSpawn?.();
        }
      }
    });

    return () => events.unsubscribe();
  }, []);

  return {
    state,
    isOpen: state === "SPAWN",
    isClosing: state === "REQUEST_CLOSE",
    isClosed: state === "DESTROY",
  };
};
