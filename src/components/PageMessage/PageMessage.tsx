import React from "react";
import Link from "next/link";

import siteMetadata from "@constants/siteMetadata";
import styles from "./PageMessage.module.scss";

type Props = {
  title: string;
  message: string;
  large?: boolean;
  mail?: boolean;
};

const PageMessage = ({ title, large, mail, message }: Props) => {
  const largeStyles = large ? styles.large : null;

  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} ${largeStyles}`}>{title}</h2>
      <p className={`${styles.description} ${largeStyles}`}>{message}</p>

      {mail ? (
        <p className={styles.description}>
          If you have any additional questions, mail us:{" "}
          <a className={styles.link} href={`mailto:${siteMetadata.email}`}>
            {siteMetadata.email}
          </a>
        </p>
      ) : null}

      <Link className={styles.button} href="/portfolio/">
        view projects
      </Link>
    </div>
  );
};

export default PageMessage;
