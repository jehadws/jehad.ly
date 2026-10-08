import React from 'react';

// @ts-ignore
import styles from './Title.module.scss';

type Props = {
  icon: { src?: string };
  signature: { src?: string };
};

const Title = ({ icon, signature }: Props) => {
  return (
    <h2 className={styles.container}>
      Design that inspires
      <a
        className={styles.link}
        href="https://dribbble.com/jehadabdulwafi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={signature.src}
          alt="applications mobile illustrations websites"
          loading="lazy"
          className={styles.icon}
        />
        <img
          src={icon.src}
          alt="dribbble logotype"
          loading="lazy"
          className={styles.image}
        />
      </a>
    </h2>
  );
};

export default Title;
