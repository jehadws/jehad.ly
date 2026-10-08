import React from "react";
import Link from "next/link";

// @ts-ignore
import styles from "./PostThumbnail.module.scss";
import type { Post } from "@app-types/Post";

type Props = Pick<Post, "title" | "slug" | "image" | "category">;

const PostThumbnail = ({ title, slug, image, category }: Props) => {

  const link = `/blog/${slug}`;

  return (
    <article className={styles.container}>
      <Link href={link} className={styles.link}>
        <div className={styles.thumbnail}>
          <img
            src={image}
            className={styles.image}
            alt="post preview"
            loading="lazy"
          />
        </div>
        <span className={styles.hiddenTitle}>{title}</span>
      </Link>
      <div className={styles.wrapper}>
        <p className={styles.tag} key={category}>
          #{category}
        </p>
        <h3 className={styles.title}>
          <Link href={link}>{title}</Link>
        </h3>
      </div>
    </article>
  );
};

export default PostThumbnail;
