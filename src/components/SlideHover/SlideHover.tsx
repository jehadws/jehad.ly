import React from "react";

// @ts-ignore
import styles from "./SlideHover.module.scss";

type SlideHoverProps = {
  children: React.ReactNode;
};

const ProjectScene = ({ children }: SlideHoverProps) => {
  return <div className={styles.descriptionLink}>{children}</div>;
};

export default ProjectScene;
