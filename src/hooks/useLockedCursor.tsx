import React, { useCallback, useContext } from "react";
import { css } from "styled-components";

import { CursorStateContext } from "../context";

export const LockedElementStyle = css`
  transform: translate(var(--translateX), var(--translateY)) scale(var(--scale));
  transition-duration: 250ms;
  transition-timing-function: ease-out;
  transition-property: opacity;

  --scale: 1;
  --translateX: 0;
  --translateY: 0;

  &:not(:hover) {
    transition-property: transform, opacity;
  }

  &:active {
    opacity: 0.5;
    transition-property: transform, opacity;
    transform: translate(var(--translateX), var(--translateY)) scale(1);
  }
`;

type UseLockedCursorProps = {
  onMouseEnter?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export const useLockedCursor = (parentHandlers?: UseLockedCursorProps) => {
  const { lock, updateLock, unlock } = useContext(CursorStateContext);

  const onMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const { currentTarget } = event;

      parentHandlers?.onMouseEnter?.(event);

      lock(currentTarget);
    },
    [lock]
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const { currentTarget, clientX, clientY } = event;

      parentHandlers?.onMouseMove?.(event);

      updateLock(currentTarget, clientX, clientY);
    },
    [updateLock]
  );

  const onMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const { currentTarget, clientX, clientY } = event;

      parentHandlers?.onMouseLeave?.(event);

      unlock(currentTarget, clientX, clientY);
    },
    [unlock]
  );

  return {
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
  };
};
