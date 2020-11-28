import { useContext } from "react";

import { WindowConfig, WindowManagerContext } from "../context";

export type UseWindowConfig = {
  config: WindowConfig;
  onClose: () => void;
};

export const useWindows = ({ config, onClose }: UseWindowConfig) => {
  const { spawnWindow, windows } = useContext(WindowManagerContext);

  const handleSpawnWindow = () => spawnWindow(config);

  return {
    spawnWindow: handleSpawnWindow,
  };
};
