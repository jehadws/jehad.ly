import React, { Fragment } from "react";

import styles from "./Info.module.scss";

type Laurel = {
  src?: string;
};

type Props = {
  clutchLaurel?: Laurel;
  dribbbleLaurel?: Laurel;
  upworkLaurel?: Laurel;
};

const Info = ({ clutchLaurel, dribbbleLaurel, upworkLaurel }: Props) => {
  const items = [
    {
      icon: upworkLaurel,
      iconAlt: "Upwork logo",
      classes: styles.upwork,
      textStrings: "Awarded as Best Design & Creative",
    },
    {
      icon: dribbbleLaurel,
      iconAlt: "Dribbble logo",
      classes: styles.dribbble,
      textStrings: "We regularly hit Top-5 Trending Teams",
    },
    {
      icon: clutchLaurel,
      iconAlt: "Clutch logo",
      classes: styles.clutch,
      textStrings: "Top User Experience Agency",
    },
  ];

  return (
    <>
      {items.map(({ icon, textStrings, classes, iconAlt }) => {
        return (
          <div key={iconAlt} className={`${styles.item} ${classes}`}>
            <img className={styles.images} src={icon?.src} alt={iconAlt} />
            <span className={styles.text}>{textStrings}</span>
          </div>
        );
      })}
    </>
  );
};

export default Info;
