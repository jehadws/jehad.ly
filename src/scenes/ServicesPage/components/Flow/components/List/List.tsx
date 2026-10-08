import React from "react";
// @ts-ignore
import styles from "./List.module.scss";

type FlowItem = {
  title: string;
  message: string;
};

type Props = {
  items?: FlowItem[];
};

const List = ({ items = [] }: Props) => {
  return (
    <ul className={styles.container}>
      {items.map(({ title, message }, index) => {
        return (
          <li key={index} className={styles.item}>
            <div className={styles.title}>
              <span className={styles.icon}>{index + 1}</span>
              <span>{title}</span>
            </div>
            <div className={styles.message}>{message}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default List;
