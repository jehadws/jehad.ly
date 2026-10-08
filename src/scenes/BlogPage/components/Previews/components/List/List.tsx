import React, { useState } from "react";

import PostThumbnail from "@scenes/PostThumbnail";
import type { Post } from "@app-types/Post";

// @ts-ignore
import styles from "./List.module.scss";

const STEP_VALUE = 6;

type Props = {
  items: Post[];
};

const List = ({ items }: Props) => {
  const [numberOfRendered, setNumberOfRendered] = useState(STEP_VALUE);
  const postsToRender: React.ReactElement[] = [];
  const handleClick = () => {
    const value = numberOfRendered + STEP_VALUE;
    setNumberOfRendered(value > items.length ? items.length : value);
  };

  for (let i = 0; i < numberOfRendered; i++) {
    const inlineStyles = { animationDelay: `0.${i}s` };

    postsToRender.push(
      <li
        data-automation="articles"
        key={items[i].id}
        style={inlineStyles}
        className={styles.item}
      >
        <PostThumbnail {...items[i]} />
      </li>
    );
  }

  return (
    <div className={styles.container}>
      <ul className={styles.list}>{postsToRender}</ul>
      {numberOfRendered < items.length ? (
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={handleClick}>
            Show More
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default List;
