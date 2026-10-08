import React from "react";
import Link from "next/link";

// @ts-ignore
import styles from "./Item.module.scss";

type Props = {
  path: string;
  title: string;
  preview: { src: string };
  tag: string;
};

const Item = ({ path, title, preview, tag }: Props) => {
  const link = path;
  const postUrl = "/blog" + link;

  return (
    <div className={styles.container} data-automation="post-preview">
      <div className={styles.imageBox}>
        <Link href={postUrl}>
          <img
            src={preview.src}
            draggable={false}
            alt={title}
            title={title}
          />
        </Link>
      </div>
      <div className={styles.description}>
        <div className={styles.tag}>#{tag}</div>
        <div className={styles.title}>
          <Link href={postUrl}>{title}</Link>
        </div>
      </div>
    </div>
  );
};

export default Item;
