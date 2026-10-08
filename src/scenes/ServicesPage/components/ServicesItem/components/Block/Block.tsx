import React from "react";

import siteMetadata from "@constants/siteMetadata";
// @ts-ignore
import styles from "./Block.module.scss";

type Message = {
  text: string;
  link: string;
};

type Props = {
  message: Message;
};

const Block = ({ message }: Props) => {
  const metadata = siteMetadata;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <p className={styles.infoMessage}>{message.text}</p>
        <a href={`mailto:${metadata.email}`} className={styles.infoLink}>
          {message.link}
        </a>
      </div>
    </div>
  );
};

export default Block;
