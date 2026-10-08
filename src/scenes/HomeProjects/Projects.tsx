import React, { Fragment } from "react";

import { projectsImages } from "@constants/images/projectsImages";
import List from "./components/List";
import Others from "./components/Others";
// @ts-ignore
import styles from "./Projects.module.scss";

type props = {
  title: string;
  navigation: boolean;
};

const Projects = ({ title, navigation }: props) => {
  const listAssets = projectsImages;

  return (
    <Fragment>
      <div className={styles.sliderWrapper}>
      <List {...listAssets} />
      </div>

      {navigation ? <Others /> : null}
    </Fragment>
  );
};


export default Projects;
