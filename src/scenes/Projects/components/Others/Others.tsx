import React from "react";
import { Link } from "gatsby";

import styles from "./Others.module.scss";
import Corel from "@assets/icons/CorelInline";
import Mobalytics from "@assets/icons/MobalyticsInline";
import Udemy from "@assets/icons/UdemyNewInline";
import Auth from "@assets/icons/Auth0Inline";
import Jbl from "@assets/icons/JblInline";

const Others = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>And a lot </span>
        <br />
        <span>more we help </span>
        <br />
        <span>to achieve</span>
      </div>
      <ul className={styles.list}>
        <li>
          <div>
            <p className={styles.listItemDescription}>
              The future vision
              <br />
              for WinZip family
              <br />
              products
            </p>
            <a
              href="https://www.corel.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Corel"
            >
              <Corel />
            </a>
          </div>
        </li>
        <li>
          <div>
            <p className={styles.listItemDescription}>
              Game analytics wins
              <br />
              TechCrunch Disrupt
              <br />& raise $2.6M
            </p>
            <a
              href="https://mobalytics.gg/"
              target="_blank"
              rel="noopener noreferrer"
              title="mobalytics"
            >
              <Mobalytics />
            </a>
          </div>
        </li>
        <li>
          <div>
            <p className={styles.listItemDescription}>
              Exploring new
              <br />
              course player
              <br />
              experience
            </p>
            <a
              href="https://www.udemy.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="udemy"
            >
              <Udemy />
            </a>
          </div>
        </li>
        <li>
          <div>
            <p className={styles.listItemDescription}>
              Using our expertise
              <br />
              to boost Auth0
              <br />
              processes
            </p>
            <a
              href="https://auth0.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="auth0"
            >
              <Auth />
            </a>
          </div>
        </li>
        <li>
          <div>
            <p className={styles.listItemDescription}>
              Promo campaign for
              <br />
              the hi-end audio
              <br />
              lovemark brand
            </p>
            <a
              href="https://jbl.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="jbl"
            >
              <Jbl />
            </a>
          </div>
        </li>
        <li>
          <Link to="/contacts" className={styles.link}>
            <span className={styles.linkText}>
              Want
              <br />
              to be
              <br />
              here?
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Others;
