import React from "react";
import styled, { ThemeProvider } from "styled-components";

import { FocusedProjectProvider, CursorStateProvider } from "./context";
import { Projects, ProjectDetail, Slide, Cursor, Info } from "./components";
import { theme } from "./lib";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  flex-direction: row;
  user-select: none;
  cursor: none;
`;

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <FocusedProjectProvider>
      <CursorStateProvider>
        <Container>
          <Slide>
            {/* <ProjectDetail /> */}
            <Info />
            <Projects />
          </Slide>
        </Container>
        <Cursor />
      </CursorStateProvider>
    </FocusedProjectProvider>
  </ThemeProvider>
);

export default App;
