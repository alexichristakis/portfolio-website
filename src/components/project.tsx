import React, { useMemo, useRef, useContext, useCallback } from "react";
import styled from "styled-components";

import { useLockedCursor, useCursorEvents, LockedElementStyle } from "../hooks";
import { FocusedProjectContext } from "../context";
import { setStyleProperties, BOX_SIZE } from "../lib";
import { H2 } from "./text";
import { Project as ProjectType } from "../types";

const Container = styled.div`
  ${LockedElementStyle}

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  width: ${BOX_SIZE}px;
  height: ${BOX_SIZE}px;
  background-color: aliceblue;
`;

const ProjectName = styled(H2)`
  margin: ${({ theme }) => theme.space[16]}px;
`;

export const Project: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isLocked = useRef(false);

  const { open } = useContext(FocusedProjectContext);

  const handlers = useLockedCursor({
    onMouseEnter: () => (isLocked.current = true),
    onMouseLeave: () => (isLocked.current = false),
  });

  useCursorEvents({
    onLock: () => {
      if (!isLocked.current) {
        setStyleProperties(ref.current, {
          opacity: "0.5",
        });
      }
    },
    onUnlock: () => {
      setStyleProperties(ref.current, {
        opacity: "1",
      });
    },
  });

  const handleOnClick = useCallback(() => {
    open({} as ProjectType);
  }, []);

  return useMemo(
    () => (
      <Container ref={ref} onClick={handleOnClick} {...handlers}>
        <ProjectName>this is a test project</ProjectName>
      </Container>
    ),
    [handlers]
  );
};
