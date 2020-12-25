import { usePinch } from "react-use-gesture";
import { useMountEffect } from "./useMountEffect";

export const useGestureOverrides = (ref: React.RefObject<HTMLElement>) => {
  // hack here to prevent user from zooming the main viewport
  usePinch(() => {}, { domTarget: ref, eventOptions: { passive: false } });

  useMountEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);

    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
    };
  });
};
