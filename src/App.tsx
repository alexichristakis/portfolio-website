import React from "react";

import { WindowManagerProvider, CursorStateProvider } from "./context";
import { ProjectIcons, Cursor } from "./components";

import "./App.scss";

const App: React.FC = () => (
  <CursorStateProvider>
    <div className="app-container">
      <WindowManagerProvider>
        <ProjectIcons />
      </WindowManagerProvider>
    </div>
    <Cursor />
  </CursorStateProvider>
);

export default App;
