import React from "react";
import Image, { type StaticImageData } from "next/image";
// @ts-ignore
import styles from "./Item.module.scss";

type props = {
  images: StaticImageData[];
};

const Item = ({ images }: props) => {
  return (
    <div className={`${styles.item} swiper-slide`}>
      {images.map((image, i) => {
        return (
          <div key={i} className={styles.image}>
            <Image
              src={image}
              alt="dribbble portfolio pic"
              draggable={false}
              placeholder="blur"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Item;
