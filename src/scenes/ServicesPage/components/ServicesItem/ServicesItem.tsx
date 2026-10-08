import React from "react";

import Block from "./components/Block";
import List from "./components/List";

// @ts-ignore
import styles from "./ServicesItem.module.scss";

import type { ListItem } from "./components/List/List";

type Message = {
  text: string;
  link: string;
};

type Props = {
  items: ListItem[];
  message: Message;
};

const ServicesItem = ({ items, message }: Props) => {
  return (
    <div className={styles.container}>
      <Block message={message} />
      <List items={items} />
    </div>
  );
};

export default ServicesItem;
