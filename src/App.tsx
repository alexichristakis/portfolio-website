import React from "react";

import { useGestureOverrides } from "./hooks";
import { WindowManagerProvider, CursorStateProvider } from "./context";
import { ProjectIcons, Cursor } from "./components";

import "./App.scss";

const App: React.FC = () => {
  useGestureOverrides();
  return (
    <CursorStateProvider>
      <div className="app-container">
        <WindowManagerProvider>
          <ProjectIcons />
        </WindowManagerProvider>
      </div>
      <Cursor />
    </CursorStateProvider>
  );
};

export default App;
