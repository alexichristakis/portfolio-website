import { useRef } from "react";
import { motion } from "framer-motion";

import { useLockedCursor } from "../hooks";

export interface ButtonProps {
  className?: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { style } = useLockedCursor(ref, {});

  return (
    <motion.div ref={ref} className={className} style={style} onClick={onClick}>
      {children}
    </motion.div>
  );
};
