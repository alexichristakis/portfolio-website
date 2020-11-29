import { useContext, useState, useEffect } from "react";

import {
  WindowConfig,
  WindowManagerContext,
  WindowEventType,
} from "../context";

export type UseWindowConfig = {
  window: WindowConfig;
  onRequestClose?: () => void;
  onClose?: () => void;
  onSpawn?: () => void;
};

export const useWindows = ({
  window,
  onClose,
  onRequestClose,
  onSpawn,
}: UseWindowConfig) => {
  const [state, setState] = useState<WindowEventType>("DESTROY");
  const { spawnWindow, events } = useContext(WindowManagerContext);

  useEffect(() => {
    events.subscribe((payload) => {
      const { type, id } = payload;
      if (id === window.id) {
        setState(type);
        if (type === "REQUEST_CLOSE") {
          onRequestClose?.();
        }

        if (type === "DESTROY") {
          onClose?.();
        }

        if (type === "SPAWN") {
        }
      }
    });

    return () => events.unsubscribe();
  }, []);

  const handleSpawnWindow = () => {
    spawnWindow(window);
    onSpawn?.();
  };

  return {
    spawnWindow: handleSpawnWindow,
    windowState: state,
  };
};
