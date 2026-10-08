import React from 'react';

import styles from './Partners.module.scss';

type Props = {
  items: { publicURL: string }[];
  reversed?: boolean;
};

const Partners = ({ items, reversed }: Props) => {
  return (
    <ul className={`${styles.container} ${reversed ? styles.reversed : ''}`}>
      {items.map(({ publicURL }) => {
        return (
          <li key={publicURL}>
            <img src={publicURL} alt="partner logotype" loading="lazy" />
          </li>
        );
      })}
    </ul>
  );
};

export default Partners;
