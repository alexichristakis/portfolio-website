import React, { useRef } from "react";
import styled from "styled-components";

import {
  setStyleProperties,
  DEFAULT_CURSOR_SIZE,
  LOCKED_CURSOR_BUFFER,
} from "../lib";
import { useCursorEvents } from "../hooks";

const CursorContent = styled.div``;

const StyledCursor = styled.div`
  pointer-events: none;
  transform: translate(-50%, -50%) scale(var(--scale));
  transition-property: width, height;
  width: var(--width);
  height: var(--height);
  left: var(--left);
  top: var(--top);

  --top: -${DEFAULT_CURSOR_SIZE}px;
  --left: -${DEFAULT_CURSOR_SIZE}px;
  --width: ${DEFAULT_CURSOR_SIZE}px;
  --height: ${DEFAULT_CURSOR_SIZE}px;
  --scale: 1;
  --translateX: 0;
  --translateY: 0;

  &,
  ${CursorContent} {
    position: absolute;
    transition-duration: 250ms;
    transition-timing-function: ease-out;
  }

  ${CursorContent} {
    background-color: #000;
    border-radius: 0.6em;
    bottom: 0;
    left: 0;
    opacity: 0.3;
    right: 0;
    top: 0;
    opacity: 0.3;
    transform: translate(var(--translateX), var(--translateY));
    transition-property: opacity;
  }

  &.locked {
    transition-property: width, height, left, top;
    ${CursorContent} {
      background-color: transparent;
      border: solid #000 5px;
      opacity: 0.06;
    }
  }
`;

export const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const unlockTimeout = useRef<number | undefined>(undefined);

  useCursorEvents({
    onMove: (payload) => {
      const { x, y } = payload.position;

      if (!payload.isLocked) {
        requestAnimationFrame(() => {
          setStyleProperties(cursorRef.current, {
            "--top": `${y}px`,
            "--left": `${x}px`,
          });
        });
      } else {
        const { rect, target } = payload;
        const { height, top, width, left } = rect;

        const halfHeight = height / 2;
        const topOffset = (y - top - halfHeight) / halfHeight;

        const halfWidth = width / 2;
        const leftOffset = (x - left - halfWidth) / halfWidth;

        requestAnimationFrame(() => {
          setStyleProperties(cursorRef.current, {
            "--translateX": `${leftOffset * 3}px`,
            "--translateY": `${topOffset * 3}px`,
          });

          setStyleProperties(target, {
            "--translateX": `${leftOffset * 6}px`,
            "--translateY": `${topOffset * 4}px`,
          });
        });
      }
    },
    onLock: (payload) => {
      const { rect } = payload;
      const { top, left, height, width } = rect;

      clearTimeout(unlockTimeout.current);

      requestAnimationFrame(() => {
        cursorRef.current?.classList.add("locked");
        setStyleProperties(cursorRef.current, {
          "--top": `${top + height / 2}px`,
          "--left": `${left + width / 2}px`,
          "--width": `${width + 2 * LOCKED_CURSOR_BUFFER}px`,
          "--height": `${height + 2 * LOCKED_CURSOR_BUFFER}px`,
        });
      });
    },
    onUnlock: () => {
      unlockTimeout.current = setTimeout(() => {
        cursorRef.current?.classList.remove("locked");
      }, 250);

      requestAnimationFrame(() => {
        setStyleProperties(cursorRef.current, {
          "--width": `${DEFAULT_CURSOR_SIZE}px`,
          "--height": `${DEFAULT_CURSOR_SIZE}px`,
          "--translateX": "0",
          "--translateY": "0",
        });
      });
    },
  });

  return (
    <StyledCursor ref={cursorRef}>
      <CursorContent />
    </StyledCursor>
  );
};
