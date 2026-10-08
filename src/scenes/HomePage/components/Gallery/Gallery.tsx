import React from "react";
import ScrollGallery from "../../../../components/ScrollGallery/ScrollGallery";

// @ts-ignore
import styles from "./Gallery.module.scss";
import photo1 from "@assets/images/sections/home-gallery/1.jpg";
import photo2 from "@assets/images/sections/home-gallery/2.jpg";
import photo3 from "@assets/images/sections/home-gallery/3.jpg";
import photo4 from "@assets/images/sections/home-gallery/4.jpg";
import photo5 from "@assets/images/sections/home-gallery/5.jpg";
import photo6 from "@assets/images/sections/home-gallery/6.jpg";

type Photo = {
  src: string;
  width?: number;
  height?: number;
};

const photos: Photo[] = [photo1, photo2, photo3, photo4, photo5, photo6];

const Gallery = () => {
  const photosList = photos.map((photo) => {
    return {
      name: photo.src,
      element: (
        <div className={styles.item} key={photo.src}>
          <div className={styles.card}>
            <img
              src={photo.src}
              alt="creative atmosphere photo"
              style={{
                width: photo.width,
                height: photo.height,
              }}
            />
          </div>
        </div>
      ),
    };
  });

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Creative Atmosphere</h2>
      <ScrollGallery step={5}>
        {photosList.map(({ element }) => {
          return element;
        })}
      </ScrollGallery>
    </section>
  );
};

export default Gallery;
