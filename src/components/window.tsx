import { memo, useRef } from "react";
import { animated, useSpring, to } from "react-spring";
import { useGesture } from "react-use-gesture";

import { SVG } from "../assets/icons";
import {
  useSkewAnimation,
  useElevatedElement,
  useMeasure,
  useMountEffect,
} from "../hooks";
import { WindowConfig, ElevatedElementTier } from "../context";
import { clamp, PROJECT_SIZE } from "../lib";
import "./window.scss";

interface WindowProps extends WindowConfig {
  onRequestClose: () => void;
  destroyWindow: () => void;
}

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 400;
const WINDOW_MARGIN = 20;

const getNextOffset = (
  prevOffset: number,
  prevSize: number,
  nextSize: number,
  container: number
) => {
  const diff = (nextSize - prevSize) / 2;
  let nextOffset = prevOffset - diff;
  if (nextOffset + nextSize > container) {
    nextOffset = nextOffset - diff;
  }
  return nextOffset < 0 ? prevOffset : nextOffset;
};

const cn = "window";
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
    const isOpening = useRef(true);

    const [, measureSourceRect] = useMeasure(sourceRef, false);

    const initialWidth = WINDOW_WIDTH;
    const initialHeight = aspectRatio
      ? initialWidth * aspectRatio
      : WINDOW_HEIGHT;

    /* functions in case the window size changes*/
    const getMaxSize = (innerWidth: number, innerHeight: number) => [
      aspectRatio
        ? aspectRatio * innerWidth > innerHeight
          ? (innerHeight - WINDOW_MARGIN) / aspectRatio
          : innerWidth - WINDOW_MARGIN
        : innerWidth - WINDOW_MARGIN,
      aspectRatio
        ? aspectRatio * innerWidth > innerHeight
          ? innerHeight - WINDOW_MARGIN
          : aspectRatio * (innerWidth - WINDOW_MARGIN)
        : innerHeight - WINDOW_MARGIN,
    ];

    const initialRect = measureSourceRect();
    const [
      { openAmount, width, height, scaleX, scaleY, offsetX, offsetY },
      set,
      stop,
    ] = useSpring(() => ({
      openAmount: 0,
      offsetX: initialRect.x,
      offsetY: initialRect.y,
      scaleX: initialRect.width / initialWidth,
      scaleY: initialRect.height / initialHeight,
      width: initialWidth,
      height: initialHeight,
    }));

    useMountEffect(() => {
      set({
        openAmount: 1,
        offsetX: (window.innerWidth - width.get()) / 2,
        offsetY: (window.innerHeight - height.get()) / 2,
        scaleX: 1,
        scaleY: 1,
      }).then(() => (isOpening.current = false));
    });

    const { zIndex, raise, lower } = useElevatedElement(
      ElevatedElementTier.WINDOW
    );

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
        onMouseDown: () => raise(),
      },
      { domTarget: contentRef, eventOptions: { passive: true } }
    );

    useGesture(
      {
        onPinch: ({
          offset: [d],
          lastOffset: [ld],
          velocities: [vd],
          canceled,
          cancel,

          first,
        }) => {
          if (canceled || isClosing.current || isOpening.current) {
            return;
          }
          if (first) {
            raise();
          }

          const delta = ld - d;

          const prevWidth = width.get();
          const prevHeight = height.get();

          const s = 1 - delta / 5000;

          const { innerWidth, innerHeight } = window;
          const [maxWidth, maxHeight] = getMaxSize(innerWidth, innerHeight);
          const nextWidth = clamp(prevWidth * s, initialWidth, maxWidth);
          const nextHeight = clamp(prevHeight * s, initialHeight, maxHeight);

          if (
            vd < 0 &&
            nextHeight === initialHeight &&
            nextWidth === initialWidth
          ) {
            close();
            cancel();
          } else {
            set({
              offsetX: getNextOffset(
                offsetX.get(),
                prevWidth,
                nextWidth,
                innerWidth
              ),
              offsetY: getNextOffset(
                offsetY.get(),
                prevHeight,
                nextHeight,
                innerHeight
              ),
              width: nextWidth,
              height: nextHeight,
              immediate: true,
            });
          }
        },
      },
      { domTarget: contentRef, eventOptions: { passive: false } }
    );

    const close = () => {
      isClosing.current = true;

      // stop width and height to get proper measurements below.
      stop(["width", "height"]);
      lower();
      onRequestClose();
      resetRotation();
      requestAnimationFrame(() => {
        const destRect = measureSourceRect();
        if (destRect) {
          const scaleXDest = destRect.width / width.get();
          const scaleYDest = destRect.height / height.get();

          set({
            openAmount: 0,
            offsetX: destRect.x,
            offsetY: destRect.y,
            scaleX: scaleXDest,
            scaleY: scaleYDest,
          }).then(destroyWindow);
        }
      });
    };

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

    return (
      <animated.div
        ref={windowRef}
        className={`${cn}__container`}
        // @ts-ignore
        style={{ width, height, transform: translate, zIndex }}
      >
        <animated.img
          className={`${cn}__icon`}
          alt={`${id} window`}
          style={{
            // @ts-ignore
            opacity: iconOpacity,
            transform: iconTransform,
          }}
          src={icon}
        />
        <animated.div className={cn} style={{ transform: contentTransform }}>
          <animated.div
            ref={contentRef}
            className={`${cn}__content`}
            style={{
              // @ts-ignore
              opacity: contentOpacity,
              transform: rotation,
              "--project-background": backgroundColor,
              "--project-foreground": foregroundColor,
            }}
          >
            {content}
            <SVG.Close className={`${cn}__close`} onClick={close} />
          </animated.div>
        </animated.div>
      </animated.div>
    );
  },
  (p, n) => p.id === n.id
);
