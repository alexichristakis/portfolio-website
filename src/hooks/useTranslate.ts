import { MotionValue, useMotionTemplate } from "framer-motion";

export const useTranslate = (config: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale?: MotionValue<number>;
}) => {
  if (config.scale)
    return useMotionTemplate`translate(${config.x}px, ${config.y}px) scale(${config.scale})`;

  return useMotionTemplate`translate(${config.x}px, ${config.y}px)`;
};
