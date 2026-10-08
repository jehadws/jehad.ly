import React from "react";

import { portfolioWorksImages } from "@constants/images/portfolioWorksImages";
import Title from "./components/Title";
// @ts-ignore
import styles from "./Works.module.scss";

const Works = () => {
  const { dribbbleRed, textCircled } = portfolioWorksImages;

  return (
    <div className={styles.container}>
      <Title icon={dribbbleRed} signature={textCircled} />
      {/* <List items={data} icon={arrowDown} /> */}
    </div>
  );
};

export default Works;
