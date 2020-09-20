import React from "react";
import styled from "styled-components";

import { BOX_SIZE } from "../lib";
import { H1 } from "./text";
import { useLockedCursor, LockedElementStyle } from "../hooks";

const Container = styled.div`
  ${LockedElementStyle}

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.colors.blue10};
  width: ${BOX_SIZE}px;
  height: ${BOX_SIZE}px;
`;

const Name = styled(H1)`
  margin: ${({ theme }) => theme.space[16]}px;
`;

export const ResumeLauncher: React.FC = () => {
  const handlers = useLockedCursor();

  return (
    <Container {...handlers}>
      <Name>Alexi Christakis</Name>
    </Container>
  );
};
