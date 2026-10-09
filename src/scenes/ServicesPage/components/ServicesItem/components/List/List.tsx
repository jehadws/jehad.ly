import React from "react";

import Slider from "@components/Slider";
import Item from "./components/Item";

// @ts-ignore
import styles from "./List.module.scss";
import useBreakPoints from "@hooks/useBreakPoints";

type Image = {
  src: string;
};

export type ListItem = {
  title: string;
  text: string;
  image: Image;
};

type Props = {
  items: ListItem[];
};

const List = ({ items }: Props) => {
  const { isTablet, isDesktop } = useBreakPoints();

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      {isDesktop || isTablet ? (
        <ul className={styles.list}>
          {items.map((item, index) => {
            return (
              <li key={index} className={styles.listItem}>
                <Item {...item} />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.wrapper}>
          <Slider settings={settings}>
            {items.map((item, index) => {
              return <Item key={index} {...item} />;
            })}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default List;
