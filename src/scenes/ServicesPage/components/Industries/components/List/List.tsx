import React from 'react';

import { servicesIndustriesImages } from '@constants/images/servicesIndustriesImages';

// @ts-ignore
import styles from './List.module.scss';

const List = () => {
  const {
    eCommerce,
    fintech,
    healthCare,
    internetOfThings,
  } = servicesIndustriesImages;

  const items = [
    {
      title: 'Health care',
      image: healthCare,
    },
    { title: 'Fintech', image: fintech },
    {
      title: 'Internet of Things',
      image: internetOfThings,
    },
    { title: 'E-commerce', image: eCommerce },
  ];

  return (
    <ul className={styles.container}>
      {items.map(({ title, image }) => {
        return (
          <li key={title} className={styles.item}>
            <img
              src={image.src}
              alt="industries item icon"
              loading="lazy"
              draggable="false"
            />
            <span>{title}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default List;
