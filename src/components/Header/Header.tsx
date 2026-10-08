'use client';

import React, { RefObject, useContext } from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { MenuContext } from '@contexts/index';
import { headerImages } from '@constants/images/headerImages';
import Menu from './components/Menu';

import styles from './Header.module.scss';

type HeaderProps = {
  headerIsWhite: boolean;
  forwardedRef: RefObject<HTMLDivElement | null>;
  withoutGradient: boolean;
  headerShow: boolean;
};

const Header = ({
  headerIsWhite,
  forwardedRef,
  withoutGradient,
  headerShow,
}: HeaderProps) => {
  const { isOpened, handleTogglingIsOpened } = useContext(MenuContext);

  const menuStatus = isOpened ? 'opened' : 'closed';
  const barStyles = classNames(styles.bar, 'pageWrapper');
  const headerStyles = classNames(styles.container, {
    [styles.isWhite]: headerIsWhite && !isOpened,
    [styles['gradient-is-removed']]: withoutGradient,
    [styles.isShow]: headerShow,
  });

  return (
    <div className={headerStyles} ref={forwardedRef}>
      <div className={barStyles}>
        <div className={styles.logotype}>
          <Link href="/" id="logoHomePage" title="JS Station logo">
            <img
              src={headerImages.logotype.src}
              alt="JS Station logo"
              height={60}
            />
          </Link>
        </div>

        <ul className={styles.navItems}>
          <li>
            <Link
              href="/services/"
              className={styles.contact}
              data-status={menuStatus}
            >
              services
            </Link>
          </li>
          <li>
            <Link
              href="/portfolio/"
              className={styles.contact}
              data-status={menuStatus}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/contacts/"
              className={styles.contact}
              data-status={menuStatus}
            >
              Contact
            </Link>
          </li>
        </ul>

        {isOpened ? <Menu /> : null}

        <div className={styles.menuBar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={handleTogglingIsOpened}
          >
            <span className={styles.menuIcon} data-status={menuStatus}></span>
            <span className={styles.hiddenTitle}>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
