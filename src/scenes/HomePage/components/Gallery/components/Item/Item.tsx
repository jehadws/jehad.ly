import React from 'react';

// @ts-ignore
import styles from './Item.module.scss';

type Props = {
  childImageSharp: {
    fluid: {
      src?: string;
      width?: number;
      height?: number;
    };
  };
};

const Item = ({ childImageSharp }: Props) => {
  const imageStyle = {
    width: childImageSharp.fluid.width,
    height: childImageSharp.fluid.height,
  };

  return (
    <div style={imageStyle} className={styles.container}>
      <img src={childImageSharp.fluid.src} alt="our team photo" />
    </div>
  );
};

export default Item;
