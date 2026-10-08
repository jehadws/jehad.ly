import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// @ts-ignore
import styles from './Switcher.module.scss';

type FlowItem = {
  title: string;
  message: string;
};

type Props = {
  items?: FlowItem[];
};

const Switcher = ({ items = [] }: Props) => {
  return (
    <Tabs>
      <TabList className={styles.tabList}>
        {items.map(({ title }, index) => {
          return (
            <Tab
              className={styles.tabListItem}
              key={index}
              style={{ flexBasis: `${100 / items.length}px` }}
            >
              <div className={styles.tabListIcon}>{index + 1}</div>
              <div className={styles.tabListTitle}>{title}</div>
            </Tab>
          );
        })}
      </TabList>

      {items.map(({ message }, index) => {
        return (
          <TabPanel key={index}>
            <div className={styles.tabContent}>{message}</div>
          </TabPanel>
        );
      })}
    </Tabs>
  );
};

export default Switcher;
