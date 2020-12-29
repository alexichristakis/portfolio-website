import { useRef, memo } from "react";
import { animated, SpringValue, useSpring } from "react-spring";

import { useMeasure } from "../hooks";
import "./scrollbar.scss";

export interface ScrollBarProps {
  offset: SpringValue<number>;
  contentHeight: number;
  visible?: boolean;
}

const BAR_HEIGHT = 50;

const ClassPrefix = "scrollbar";
const ScrollBar: React.FC<ScrollBarProps> = memo(
  ({ offset, contentHeight, visible = true }) => {
    const ref = useRef<HTMLDivElement>(null);

    const { opacity } = useSpring({ opacity: visible ? 1 : 0 });
    const [{ height }] = useMeasure(ref, { ignoreTransform: true });

    const scroll = offset
      .to({
        range: [-contentHeight, 0],
        output: [height - BAR_HEIGHT, 0],
        extrapolate: "clamp",
      })
      .to((val) => `translateY(${val}px)`);

    return (
      // @ts-ignore
      <animated.div ref={ref} className={ClassPrefix} style={{ opacity }}>
        <animated.div
          className={`${ClassPrefix}__bar`}
          style={{ transform: scroll, height: BAR_HEIGHT }}
        />
      </animated.div>
    );
  }
);

export default ScrollBar;
