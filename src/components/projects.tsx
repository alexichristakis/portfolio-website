import React from "react";
import styled from "styled-components";

import { Project } from "./project";
import { BOX_SIZE } from "../lib";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, ${BOX_SIZE}px);
  grid-template-rows: repeat(3, ${BOX_SIZE}px) auto;
  grid-column-gap: ${({ theme }) => theme.space[64]}px;
  grid-row-gap: ${({ theme }) => theme.space[64]}px;
`;

export const Projects: React.FC = () => {
  return (
    <Container>
      <Project />
      <Project />
      <Project />

      <Project />
      <Project />
      <Project />

      <Project />
      <Project />
      <Project />
    </Container>
  );
};
