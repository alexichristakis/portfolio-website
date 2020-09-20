import React, { useCallback, useRef, useMemo } from "react";
import { Subject } from "rxjs";

import { setStyleProperties } from "../lib";

export type Position = {
  x: number;
  y: number;
};

export enum CursorEventType {
  MOVE = "move",
  LOCK = "lock",
  UNLOCK = "unlock",
}

export type CursorStateEmitterPayload =
  | CursorMoveEventPayload
  | CursorLockEventPayload
  | CursorUnlockEventPayload;

export type CursorMoveEventPayload =
  | UnlockedMoveEventPayload
  | LockedMoveEventPayload;

type PositionEventPayload = {
  type: CursorEventType.MOVE;
  position: Position;
};

type UnlockedMoveEventPayload = {
  isLocked: false;
} & PositionEventPayload;

type LockedMoveEventPayload = {
  isLocked: true;
  rect: DOMRect;
  target: Target;
} & PositionEventPayload;

export type CursorLockEventPayload = {
  type: CursorEventType.LOCK;
  target: Target;
  rect: DOMRect;
};

export type CursorUnlockEventPayload = {
  type: CursorEventType.UNLOCK;
  position: Position;
  target: Target;
};

export type Target = EventTarget & HTMLElement;

export type CursorPositionState = {
  emitter: Subject<CursorStateEmitterPayload>;
  isLocked: React.MutableRefObject<boolean>;
  lock: (target: Target) => void;
  updateLock: (target: Target, x: number, y: number) => void;
  unlock: (target: Target, x: number, y: number) => void;
};

export type CursorMoveHandlers = {
  handler: {
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;
  };
};

export const useCursorState = (): CursorPositionState & CursorMoveHandlers => {
  const isLocked = useRef<boolean>(false);
  const rect = useRef<DOMRect | null>(null);

  const emitter = useMemo(() => new Subject<CursorStateEmitterPayload>(), []);

  const lock = useCallback(
    (target: Target) => {
      isLocked.current = true;
      rect.current = target.getBoundingClientRect();

      emitter.next({
        type: CursorEventType.LOCK,
        target,
        rect: rect.current,
        isLocked: isLocked.current,
      });

      setStyleProperties(target, { "--scale": "1.05" });
    },
    [emitter, isLocked, rect]
  );

  const updateLock = useCallback((target: Target, x: number, y: number) => {
    if (!rect.current) return;
    if (!isLocked.current) return;

    emitter.next({
      target,
      type: CursorEventType.MOVE,
      position: { x, y },
      rect: rect.current,
      isLocked: true,
    });
  }, []);

  const unlock = useCallback((target: Target, x: number, y: number) => {
    isLocked.current = false;

    emitter.next({ type: CursorEventType.UNLOCK, position: { x, y }, target });

    setStyleProperties(target, {
      "--translateX": "0",
      "--translateY": "0",
      "--scale": "1",
    });
  }, []);

  const emitPosition = useCallback(
    (position: Position) => {
      if (!isLocked.current) {
        emitter.next({
          type: CursorEventType.MOVE,
          position,
          isLocked: false,
        });
      }
    },
    [emitter, isLocked]
  );

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY } = event;

      emitPosition({ x: clientX, y: clientY });
    },
    [emitPosition]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const { clientX, clientY } = event.touches[0];

      emitPosition({ x: clientX, y: clientY });
    },
    [emitPosition]
  );

  return {
    emitter,
    isLocked,
    lock,
    updateLock,
    unlock,
    handler: {
      onMouseMove: handleMove,
      onTouchMove: handleTouchMove,
    },
  };
};
