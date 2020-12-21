import { motion } from "framer-motion";

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
    <motion.div className={`${ClassPrefix}__image-container`}>
      <img
        className={`${ClassPrefix}__image`}
        draggable={false}
        src={src}
        alt="project image"
      />
      <div className={`${ClassPrefix}__image-caption`}>{caption}</div>
    </motion.div>
  );
};

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  console.log({ images });
  return (
    <motion.div className={ClassPrefix}>
      {images.map((image, idx) => (
        <GalleryImage key={idx} {...image} />
      ))}
    </motion.div>
  );
};

export default Gallery;
