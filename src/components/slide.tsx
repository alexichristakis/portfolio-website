import React, { useCallback, useContext } from "react";
import styled from "styled-components";

import { FocusedProjectContext } from "../context";

const Container = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background-color: white;
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.space[128]}px;

  transform: translate(0, ${({ $isOpen }) => ($isOpen ? `-100vh` : 0)});
  transition: transform 500ms ease-in-out;
`;

export const Slide: React.FC = ({ children }) => {
  const { isOpen } = useContext(FocusedProjectContext);

  return <Container $isOpen={isOpen}>{children}</Container>;
};
