// import {} from "react";
import { motion, MotionValue, PanInfo } from "framer-motion";
import memoize from "fast-memoize";
import cn from "classnames";

import { SVG } from "../assets/icons";
import { Button } from "./button";
import "./boundingBox.scss";

interface ResizeProps {
  onLeave?: () => void;
  onEnter?: () => void;
  onResize: (info: PanInfo, direction: Direction) => void;
}

interface BoundingBoxProps extends ResizeProps {
  title: string;
  opacity: MotionValue<number>;
  onClose: () => void;
}

interface ResizeControlProps extends ResizeProps {
  type: "handle" | "rail";
  direction: Direction;
}

const RailDirection = ["n", "e", "s", "w"] as const;
const HandleDirection = ["nw", "ne", "se", "sw"] as const;
const Directions = [...RailDirection, ...HandleDirection] as const;

export type Direction = typeof Directions[number];
export type RailDirection = typeof RailDirection[number];

export const hasDirection = memoize(
  (direction: Direction, char: RailDirection) => direction.includes(char)
);

const ResizeControl: React.FC<ResizeControlProps> = ({
  onResize,
  type,
  direction,
  onEnter,
  onLeave,
}) => {
  const handleOnResize = (_: MouseEvent, info: PanInfo) =>
    onResize(info, direction);

  const Prefix = "resize-control";
  return (
    <motion.div
      className={cn(
        Prefix,
        `${Prefix}__${type}`,
        `${Prefix}__${type}-${direction}`
      )}
      onPan={handleOnResize}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    />
  );
};

const BoundingBox: React.FC<BoundingBoxProps> = ({
  title,
  opacity,
  children,
  onClose,
  ...resizeProps
}) => {
  const Prefix = "bounding-box";
  return (
    <div className={Prefix}>
      <motion.div className={`${Prefix}__title`} style={{ opacity }}>
        <Button className={`${Prefix}__close`} onClick={onClose}>
          <SVG.Close />
        </Button>
        {title}
      </motion.div>
      {children}
      <motion.div className={cn(`${Prefix}__box`)} style={{ opacity }}>
        {RailDirection.map((direction) => (
          <ResizeControl
            key={direction}
            type="rail"
            direction={direction}
            {...resizeProps}
          />
        ))}
        {HandleDirection.map((direction) => (
          <ResizeControl
            key={direction}
            type="handle"
            direction={direction}
            {...resizeProps}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default BoundingBox;
