import React from 'react';

import Dribbble from '@assets/icons/DribbbleInline';
import Instagram from '@assets/icons/InstagramInline';
import Behance from '@assets/icons/BehanceInline';
import Github from '@assets/icons/GithubInline';
import NPM from '@assets/icons/NpmInline';

import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <div className={`oldPageWrapper ${styles.container}`}>
      <ul className={styles.socials}>
        <li>
          <a
            href="https://github.com/JehadAbdulwafi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
            <Github />
          </a>
        </li>
        <li>
          <a
            href="https://www.npmjs.com/~JehadAbdulwafi"
            target="_blank"
            rel="noopener noreferrer"
          >
            NPM
            <NPM />
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/j7h3dx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
            <Instagram />
          </a>
        </li>
        {/* <li>
          <a
            href="https://www.behance.net/JehadAbdulwafi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Behance
            <Behance />
          </a>
        </li> */}
        <li>
          <a
            href="https://dribbble.com/J7H3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dribbble
            <Dribbble />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
