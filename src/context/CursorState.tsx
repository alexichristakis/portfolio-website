import React from "react";
import styled from "styled-components";

import { useCursorState } from "../hooks";
import { CursorPositionState } from "../hooks/useCursorState";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const CursorStateContext = React.createContext(
  {} as CursorPositionState
);

export const CursorStateProvider: React.FC = ({ children }) => {
  const { handler, ...rest } = useCursorState();

  return (
    <CursorStateContext.Provider value={rest}>
      <Container {...handler}>{children}</Container>
    </CursorStateContext.Provider>
  );
};
