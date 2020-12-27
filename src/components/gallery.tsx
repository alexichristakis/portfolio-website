import "./gallery.scss";

type Image = {
  src: string;
  caption?: string;
};

export interface GalleryProps {
  images: Image[];
}

const cn = "gallery";

const GalleryImage: React.FC<Image> = ({ src, caption = "" }) => (
  <img className={`${cn}__image`} draggable={false} src={src} alt={caption} />
);

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className={cn}>
      {images.map((image, idx) => (
        <GalleryImage key={idx} {...image} />
      ))}
    </div>
  );
};

export default Gallery;
