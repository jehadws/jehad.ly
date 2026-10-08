import React from "react";
// @ts-ignore
import styles from "./Item.module.scss";

type Image = {
  src: string;
};

type Props = {
  title: string;
  text: string;
  image: Image;
};

const Item = ({ title, text, image }: Props) => {
  return (
    <div className={styles.container}>
      <img src={image.src} alt="services item icon" loading="lazy" />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
};

export default Item;
