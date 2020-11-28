import React from "react";

import { FocusedProjectProvider, CursorStateProvider } from "./context";
import { Projects, Cursor, WindowManager } from "./components";

import "./App.scss";

const App: React.FC = () => (
  <FocusedProjectProvider>
    <CursorStateProvider>
      <div className="app-container">
        <WindowManager>
          <Projects />
        </WindowManager>
      </div>
      <Cursor />
    </CursorStateProvider>
  </FocusedProjectProvider>
);

export default App;
