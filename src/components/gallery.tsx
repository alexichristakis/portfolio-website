import { animated } from "react-spring";
import "./gallery.scss";

type Image = {
  src: string;
  caption?: string;
};

export interface GalleryProps {
  images: Image[];
}

const ClassPrefix = "gallery";

const GalleryImage: React.FC<Image> = ({ src, caption = "" }) => {
  return (
    <img
      className={`${ClassPrefix}__image`}
      draggable={false}
      src={src}
      alt={caption}
    />
  );
};

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <animated.div className={ClassPrefix}>
      {images.map((image, idx) => (
        <GalleryImage key={idx} {...image} />
      ))}
    </animated.div>
  );
};

export default Gallery;
