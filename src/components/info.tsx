import React from "react";
import styled from "styled-components";

import { ResumeLauncher } from "./resumeLauncher";
import { Resume } from "./resume";
import { Links } from "./links";

const Container = styled.div`
  flex-direction: column;
  margin-right: ${({ theme }) => theme.space[64]}px;
`;

export const Info: React.FC = () => {
  return (
    <Container>
      <ResumeLauncher />
      <Links />
      <Resume isOpen={true} onRequestClose={() => {}} />
    </Container>
  );
};
