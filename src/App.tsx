import { CSSProperties } from "react";

import { useGestureOverrides } from "./hooks";
import {
  WindowManagerProvider,
  ProjectProvider,
  CursorStateProvider,
} from "./context";
import { ProjectIcon, projects, Cursor } from "./components";
import { PROJECT_SIZE, ICON_BORDER_RADIUS } from "./lib";

import "./App.scss";

const App: React.FC = () => {
  useGestureOverrides();

  return (
    <CursorStateProvider>
      <ProjectProvider>
        <div
          className="app-container"
          style={{
            ...({
              "--project-size": `${PROJECT_SIZE}px`,
              "--icon-border-radius": `${ICON_BORDER_RADIUS}px`,
            } as CSSProperties),
          }}
        >
          <WindowManagerProvider>
            {Object.keys(projects).map((id, idx) => (
              <ProjectIcon key={id} id={id} />
            ))}
          </WindowManagerProvider>
        </div>
        <Cursor />
      </ProjectProvider>
    </CursorStateProvider>
  );
};

export default App;
