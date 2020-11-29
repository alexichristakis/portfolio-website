import { useContext, useEffect, useState } from "react";

import {
  WindowConfig,
  WindowManagerContext,
  WindowEventType,
  WindowEventHandlers,
} from "../context";
import { useWindowEvents } from "./useWindowEvents";

export type UseWindowConfig = {
  window?: WindowConfig;
  handlers?: WindowEventHandlers;
};

export const useWindows = ({ window, handlers }: UseWindowConfig) => {
  const [state, setState] = useState<WindowEventType>("DESTROY");
  const { spawnWindow, registerWindow, events } = useContext(
    WindowManagerContext
  );

  useEffect(() => {
    const subscription = events.subscribe((payload) => {
      const { type, id } = payload;

      if (!window?.id || id === window?.id) {
        setState(type);
        if (type === "REQUEST_CLOSE") {
          handlers?.onRequestClose?.();
        }

        if (type === "DESTROY") {
          handlers?.onClose?.();
        }

        if (type === "SPAWN") {
          handlers?.onSpawn?.();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (window) registerWindow(window.id, window.sourceRef);
  }, [window]);

  //   const { isOpen, isClosed, isClosing } = useWindowEvents({
  //     id: window.id,
  //     handlers,
  //   });

  const handleSpawnWindow = () => {
    if (window) spawnWindow(window);
  };

  return {
    spawnWindow: handleSpawnWindow,
    state,
    isOpen: state === "SPAWN",
    isClosed: state === "DESTROY",
    // isOpen: windows.findIndex(({ title }) => window.id === title) > -1,
    // isOpen,
    // isClosed,
    // isClosing,
  };
};
