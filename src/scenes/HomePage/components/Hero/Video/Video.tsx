import React from "react";

//@ts-ignore
import styles from "./Video.module.scss";
import { useHomeHeroAssets } from "@hooks/queries";

const Video = () => {
  const { video } = useHomeHeroAssets();
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
