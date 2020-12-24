import { useCallback, useEffect, memo, useRef } from "react";
import { animated, useSpring, to } from "react-spring";
import { useGesture } from "react-use-gesture";

import { SVG } from "../assets/icons";
import { useSkewAnimation } from "../hooks";
import { WindowConfig } from "../context";
import { clamp, PROJECT_SIZE } from "../lib";
import "./window.scss";

interface WindowProps extends WindowConfig {
  onRequestClose: () => void;
  destroyWindow: () => void;
}

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 400;

export const Window: React.FC<WindowProps> = memo(
  ({
    id,
    onRequestClose,
    destroyWindow,
    sourceRef,
    content,
    aspectRatio,
    icon,
    backgroundColor,
    foregroundColor,
  }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const isClosing = useRef(false);

    const getSourceRect = () => sourceRef.current?.getBoundingClientRect()!;

    const initialWidth = WINDOW_WIDTH;
    const initialHeight = aspectRatio
      ? initialWidth * aspectRatio
      : WINDOW_HEIGHT;

    const initialRect = getSourceRect();
    const [
      { openAmount, width, height, scaleX, scaleY, offsetX, offsetY },
      set,
    ] = useSpring(() => ({
      openAmount: 0,
      offsetX: initialRect.left,
      offsetY: initialRect.top,
      scaleX: initialRect.width / initialWidth,
      scaleY: initialRect.height / initialHeight,
      width: initialWidth,
      height: initialHeight,
    }));

    useEffect(() => {
      set({
        openAmount: 1,
        offsetX: (window.innerWidth - width.get()) / 2,
        offsetY: (window.innerHeight - height.get()) / 2,
        scaleX: 1,
        scaleY: 1,
      });
    }, []);

    const { resetRotation, rotation, onMove, onHover } = useSkewAnimation({
      ref: windowRef,
      throttle: 7,
    });

    useGesture(
      {
        onHover,
        onMove: (ev) => {
          if (!isClosing.current) {
            onMove(ev);
          }
        },
        onDrag: ({ first, delta: [x, y] }) => {
          if (first) {
            resetRotation();
          }

          const nextOffsetX = offsetX.get() + x;
          const nextOffsetY = offsetY.get() + y;
          const currentWidth = width.get();
          const currentHeight = height.get();

          if (
            currentWidth + nextOffsetX < window.innerWidth &&
            nextOffsetX > 0
          ) {
            offsetX.set(nextOffsetX);
          }

          if (
            currentHeight + nextOffsetY < window.innerHeight &&
            nextOffsetY > 0
          ) {
            offsetY.set(nextOffsetY);
          }
        },
      },
      { domTarget: contentRef, eventOptions: { passive: true } }
    );

    useGesture(
      {
        onPinch: ({ delta: [, d], velocities: [vd], canceled, cancel }) => {
          if (canceled || isClosing.current) return;

          const prevWidth = width.get();
          const prevHeight = height.get();
          const scale = 1 - d / 5;

          const nextWidth = clamp(
            prevWidth * scale,
            initialWidth,
            aspectRatio
              ? aspectRatio * window.innerWidth > window.innerHeight
                ? (window.innerHeight - 20) / aspectRatio
                : window.innerWidth - 20
              : window.innerWidth - 20
          );

          const nextHeight = clamp(
            prevHeight * scale,
            initialHeight,
            aspectRatio
              ? aspectRatio * window.innerWidth > window.innerHeight
                ? window.innerHeight - 20
                : aspectRatio * (window.innerWidth - 20)
              : window.innerHeight - 20
          );

          if (
            vd < 0 &&
            nextHeight === initialHeight &&
            nextWidth === initialWidth
          ) {
            close();
            cancel();
          } else {
            set({
              offsetX: (window.innerWidth - nextWidth) / 2,
              offsetY: (window.innerHeight - nextHeight) / 2,
              width: nextWidth,
              height: nextHeight,
            });
          }
        },
      },
      { domTarget: contentRef, eventOptions: { passive: false } }
    );

    const close = useCallback(() => {
      isClosing.current = true;
      onRequestClose();
      resetRotation();
      requestAnimationFrame(() => {
        const destRect = getSourceRect();
        if (destRect) {
          const scaleXDest = destRect.width / width.get();
          const scaleYDest = destRect.height / height.get();

          set({
            openAmount: 0,
            offsetX: destRect.left,
            offsetY: destRect.top,
            scaleX: scaleXDest,
            scaleY: scaleYDest,
          }).then(destroyWindow);
        }
      });
    }, []);

    const translate = to(
      [offsetX, offsetY],
      (x, y) => `translate(${x}px, ${y}px)`
    );

    const contentTransform = to(
      [scaleX, scaleY],
      (scaleX, scaleY) => `scale(${scaleX}, ${scaleY})`
    );

    const iconTransform = to(
      [width, height, scaleX, scaleY],
      (width, height, scaleX, scaleY) =>
        `scale(
          ${(width / PROJECT_SIZE) * scaleX}, 
          ${(height / PROJECT_SIZE) * scaleY}
        )`
    );

    const iconOpacity = openAmount.to({
      range: [0, 0.75],
      output: [1, 0],
    });

    const contentOpacity = openAmount.to({
      range: [0, 0.1, 0.5],
      output: [0, 0, 1],
    });

    const Prefix = "window";
    return (
      <animated.div
        ref={windowRef}
        className={`${Prefix}__container`}
        style={{ width, height, transform: translate }}
      >
        <animated.img
          className={`${Prefix}__icon`}
          alt={`${id} project-icon`}
          style={{
            // @ts-ignore
            opacity: iconOpacity,
            transform: iconTransform,
          }}
          src={icon}
        />
        <animated.div
          className={Prefix}
          style={{ transform: contentTransform }}
        >
          <animated.div
            ref={contentRef}
            className={`${Prefix}__content`}
            style={{
              // @ts-ignore
              opacity: contentOpacity,
              transform: rotation,
              "--project-background": backgroundColor,
              "--project-foreground": foregroundColor,
            }}
          >
            {content}
            <SVG.Close className={`${Prefix}__close`} onClick={close} />
          </animated.div>
        </animated.div>
      </animated.div>
    );
  },
  (p, n) => p.id === n.id
);
