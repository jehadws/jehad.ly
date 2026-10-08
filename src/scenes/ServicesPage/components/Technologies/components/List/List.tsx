import React from "react";
// @ts-ignore
import styles from "./List.module.scss";

type Image = {
  src: string;
};

type TechnologyItem = {
  title: string;
  image: Image;
};

type GroupItem = {
  title: string;
  items: TechnologyItem[];
};

type Props = {
  items?: GroupItem[];
};

const List = ({ items = [] }: Props) => {
  return (
    <ul className={styles.container}>
      {items.map(({ title, items }, index) => {
        return (
          <li key={index} className={styles.item}>
            <h3 className={styles.itemTitle}>{title}</h3>
            <ul className={styles.sublist}>
              {items.map(({ title, image }, index) => {
                return (
                  <li key={index} className={styles.subitem}>
                    <div className={styles.icon}>
                      <img
                        src={image.src}
                        alt="technologies item icon"
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.subitemTitle}>{title}</div>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default List;
