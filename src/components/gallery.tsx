import { animated } from "react-spring";
import "./gallery.scss";

type Image = {
  src: string;
  caption: string;
};

export interface GalleryProps {
  images: Image[];
}

const ClassPrefix = "gallery";

const GalleryImage: React.FC<Image> = ({ src, caption }) => {
  return (
    <animated.div className={`${ClassPrefix}__image-container`}>
      <img
        className={`${ClassPrefix}__image`}
        draggable={false}
        src={src}
        alt="project image"
      />
      <div className={`${ClassPrefix}__image-caption`}>{caption}</div>
    </animated.div>
  );
};

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  console.log({ images });
  return (
    <animated.div className={ClassPrefix}>
      {images.map((image, idx) => (
        <GalleryImage key={idx} {...image} />
      ))}
    </animated.div>
  );
};

export default Gallery;
