import React, { useState, useCallback } from "react";

import { Project } from "../types";

export type FocusedProjectState = {
  isOpen: boolean;
  project: Project | null;
  close: () => void;
  open: (project: Project) => void;
};

export const FocusedProjectContext = React.createContext(
  {} as FocusedProjectState
);

const useFocusedProjectState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const open = useCallback(
    (project: Project) => {
      setIsOpen(true);
      setProject(project);
    },
    [setIsOpen, setProject]
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    project,
    open,
    close,
  };
};

export const FocusedProjectProvider: React.FC = ({ children }) => {
  const state = useFocusedProjectState();

  return (
    <FocusedProjectContext.Provider value={state}>
      {children}
    </FocusedProjectContext.Provider>
  );
};
