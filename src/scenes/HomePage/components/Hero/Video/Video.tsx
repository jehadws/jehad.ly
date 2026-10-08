import React from "react";

//@ts-ignore
import styles from "./Video.module.scss";
import { homeHeroImages } from "@constants/images/homeHeroImages";

const Video = () => {
  const { video } = homeHeroImages;
  return (
    <div className={styles.folderContainer}>
      <div className={styles.folderWrapper}>
        <div
          className={styles.folder}
          // style={{ backgroundImage: `url(${imageUrl.src})` }}
        >
          <video autoPlay muted loop src={video.src}></video>
        </div>
      </div>
    </div>
  );
};

export default Video;
