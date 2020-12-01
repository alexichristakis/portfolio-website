import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const Close: React.FC<Props> = () => (
  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
    <line
      x1="0"
      y1="0"
      x2="7"
      y2="7"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <line
      x1="0"
      y1="7"
      x2="7"
      y2="0"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const Corner: React.FC<Props> = ({ className, transform }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    className={className}
    transform={transform}
  >
    <rect width="10" height="1" fill="currentColor" />
    <rect width="1" height="10" fill="currentColor" />
  </svg>
);

const Expand: React.FC<Props> = () => (
  <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
    <path
      d="M3.33071 13.6693L3.65799 7.57299L9.42698 13.342L3.33071 13.6693Z"
      fill="currentcolor"
    />
    <path
      d="M14.3422 3.33073L14.0149 9.427L8.24592 3.65801L14.3422 3.33073Z"
      fill="currentcolor"
    />
  </svg>
);

export const SVG = {
  Close,
  Corner,
  Expand,
};
