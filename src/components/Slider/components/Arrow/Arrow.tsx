import React from "react";
// @ts-ignore
import styles from "./Arrow.module.scss";

type Props = {
  onClick?: () => void;
  children?: React.ReactNode;
  direction?: string;
};

const Arrow = ({ onClick, children, direction }: Props) => {
  const directionStyles =
    direction && direction === "next" ? styles.next : styles.previous;

  return (
    <button
      className={`${styles.container} ${directionStyles}`}
      onClick={onClick}
    >
      {children}
      <span className={styles.titleHidden}>Arrow</span>
    </button>
  );
};

export default Arrow;
