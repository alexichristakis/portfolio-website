import { useRef, useLayoutEffect } from "react";

export function useRaf(
  callback: (timeElapsed: number) => void,
  isActive: boolean
): void {
  const savedCallback = useRef<typeof callback>();

  // save the latest function.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    let startTime: number, animationFrame: number;

    const tick = () => {
      const timeElapsed = Date.now() - startTime;
      startTime = Date.now();
      loop();
      savedCallback.current && savedCallback.current(timeElapsed);
    };

    const loop = () => {
      animationFrame = requestAnimationFrame(tick);
    };

    if (isActive) {
      startTime = Date.now();
      loop();
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [isActive]);
}
