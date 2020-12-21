import { ComponentProps, useRef } from "react";
import cn from "classnames";
import { motion } from "framer-motion";

import { useLockedCursor } from "../hooks";

export interface ButtonProps extends ComponentProps<typeof motion.div> {
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
  style: styleProp,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { style } = useLockedCursor(ref, {});

  return (
    <motion.div
      ref={ref}
      className={cn("button", className)}
      style={{ ...style, ...styleProp }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
