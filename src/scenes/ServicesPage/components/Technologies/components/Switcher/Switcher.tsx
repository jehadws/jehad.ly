import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// @ts-ignore
import styles from "./Switcher.module.scss";

type Image = {
  src: string;
};

type TechnologyItem = {
  title: string;
  image: Image;
};

type TabItem = {
  title: string;
  items: TechnologyItem[];
};

type Props = {
  items?: TabItem[];
};

const Switcher = ({ items = [] }: Props) => {
  return (
    <Tabs>
      <TabList className={styles.tabList}>
        {items.map((item, index) => {
          return (
            <Tab className={styles.tabListItem} key={index}>
              <div >{item.title}</div>
            </Tab>
          );
        })}
      </TabList>

      {items.map(({ items }, index) => {
        return (
          <TabPanel key={index}>
            <ul className={styles.tabContentList}>
              {items.map(({ title, image }, index) => {
                const inlineStyles = { animationDelay: `0.${index}s` };
                return (
                  <li
                    key={index}
                    className={styles.tabContentItem}
                    style={inlineStyles}
                  >
                    <div className={styles.tabContentIcon}>
                      <img
                        src={image.src}
                        alt="technologies item icon"
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.tabContentTitle}>{title}</div>
                  </li>
                );
              })}
            </ul>
          </TabPanel>
        );
      })}
    </Tabs>
  );
};

export default Switcher;
