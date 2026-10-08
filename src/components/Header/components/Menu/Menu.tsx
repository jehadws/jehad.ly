'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

import { MenuContext } from '@contexts/index';
import { menuImages } from '@constants/images/menuImages';

import styles from './Menu.module.scss';

const Menu = () => {
  const pathname = usePathname();
  const { handleTogglingIsOpened } = useContext(MenuContext);

  const {
    contactsIcon,
    contactsStars,
    portfolioIcon,
    portfolioStars,
    servicesIcon,
    servicesStars,
  } = menuImages;

  const items = [
    {
      title: 'Projects',
      link: '/portfolio/',
      icon: portfolioIcon,
      stars: portfolioStars,
    },
    {
      title: 'Services',
      link: '/services/',
      icon: servicesIcon,
      stars: servicesStars,
    },
    {
      title: 'Contacts',
      link: '/contacts/',
      icon: contactsIcon,
      stars: contactsStars,
    },
  ];

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {items.map(({ stars, icon, link, title }, index) => {
          const isActive =
            pathname === link || (link !== '/' && pathname.startsWith(link.replace(/\/$/, '')));

          return (
            <li
              key={title}
              style={{ animationDelay: `0.${index}s` }}
              className={styles.item}
            >
              <Link
                href={link}
                onClick={handleTogglingIsOpened}
                className={classNames(styles.link, {
                  [styles.active]: isActive,
                })}
              >
                <div className={styles.circle} data-circle={index + 1}></div>
                <div className={styles.title}>{title}</div>
                <div
                  style={{ backgroundImage: `url('${stars.src}')` }}
                  className={styles.stars}
                ></div>
                <div
                  style={{ backgroundImage: `url('${icon.src}')` }}
                  className={styles.icon}
                  data-icon={index + 1}
                ></div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Menu;
