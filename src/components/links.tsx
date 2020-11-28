import React, { useCallback } from "react";
import styled from "styled-components";

import { useLockedCursor } from "../hooks";
import { BOX_SIZE } from "../lib";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${BOX_SIZE / 2}px;
  margin-top: ${({ theme }) => theme.space[64]}px;
`;

export const Links: React.FC = () => {
  const makeOnClickLink = useCallback(
    (link: string) => () => window.open(link),
    []
  );

  return (
    <Container>
      <a onClick={makeOnClickLink("https://google.com")}>github</a>
      <a onClick={makeOnClickLink("https://google.com")}>linkedIn</a>
      <a onClick={makeOnClickLink("https://google.com")}>contact</a>
    </Container>
  );
};
