import { CSSProperties, useRef } from "react";

import { useGestureOverrides } from "./hooks";
import {
  WindowManagerProvider,
  ProjectProvider,
  CursorStateProvider,
} from "./context";
import { ProjectIcons, Cursor } from "./components";
import { PROJECT_SIZE, ICON_BORDER_RADIUS } from "./lib";

import "./App.scss";

const App: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGestureOverrides(ref);

  return (
    <CursorStateProvider>
      <ProjectProvider>
        <div
          ref={ref}
          className="app-container"
          style={{
            ...({
              "--project-size": `${PROJECT_SIZE}px`,
              "--icon-border-radius": `${ICON_BORDER_RADIUS}px`,
            } as CSSProperties),
          }}
        >
          <WindowManagerProvider>
            <ProjectIcons />
          </WindowManagerProvider>
        </div>
        <Cursor />
      </ProjectProvider>
    </CursorStateProvider>
  );
};

export default App;
