import React, { useCallback } from "react";
import styled from "styled-components";

import { useLockedCursor, LockedElementStyle } from "../hooks";
import { H3 } from "./text";
import { BOX_SIZE } from "../lib";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${BOX_SIZE / 2}px;
  margin-top: ${({ theme }) => theme.space[64]}px;
`;

const Link = styled(H3)`
  ${LockedElementStyle}

  max-width: fit-content;
`;

export const Links: React.FC = () => {
  const handlers = useLockedCursor();

  const makeOnClickLink = useCallback(
    (link: string) => () => window.open(link),
    []
  );

  return (
    <Container>
      <Link onClick={makeOnClickLink("https://google.com")} {...handlers}>
        github
      </Link>
      <Link onClick={makeOnClickLink("https://google.com")} {...handlers}>
        linkedIn
      </Link>
      <Link onClick={makeOnClickLink("https://google.com")} {...handlers}>
        contact
      </Link>
    </Container>
  );
};
