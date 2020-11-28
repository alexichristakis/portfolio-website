import React from "react";

import { WindowManagerProvider, CursorStateProvider } from "./context";
import { Projects, Cursor } from "./components";

import "./App.scss";

const App: React.FC = () => (
  <CursorStateProvider>
    <div className="app-container">
      <WindowManagerProvider>
        <Projects />
      </WindowManagerProvider>
    </div>
    <Cursor />
  </CursorStateProvider>
);

export default App;
