import React, { SVGProps, useEffect } from "react";
import classNames from "classnames";
//@ts-ignore
import styles from "./Folder.module.scss";
import { homeHeroImages } from "@constants/images/homeHeroImages";
import Image from "next/image";
import Link from "next/link";
const words = [
  {
    text: "smart",
    color: "#FF0000",
    char: ["s", "m", "a", "r", "t"],
  },
  {
    text: "big",
    color: "#00FFFF",
    char: ["b", "i", "g"],
  },
  {
    text: "tech",
    color: "#00FFFF",
    char: ["t", "e", "c", "h"],
  },
  {
    text: "buzz",
    color: "#FFFF00",
    char: ["b", "u", "z", "z"],
  },

  {
    text: "COOL",
    color: "#00FF00",
    char: ["c", "o", "o", "l"],
  },
];

const Folder = () => {
  const { hero_01, hero_02, hero_03, hero_04, hero_05 } = homeHeroImages;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isDone, setIsDone] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [animationKey, setAnimationKey] = React.useState(0);

  const IMAGES = [hero_01, hero_02, hero_03, hero_04, hero_05];
  const activeWord = words[activeIndex];
  const activeImage = IMAGES[activeIndex];

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      setIsVisible(visible);

      if (visible) {
        setIsDone(false);
        setAnimationKey((key) => key + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (isDone) {
        setActiveIndex((index) => (index + 1) % words.length);
        setIsDone(false);
        setAnimationKey((key) => key + 1);
        return;
      }

      setIsDone(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isDone, isVisible]);

  return (
    <div className={styles.folderContainer}>
      <div className={styles.folderWrapper}>
        <div className={styles.folder}>
          <h1>
            LET'S BUILD THE NEXT
            <br />
            <div className={styles.wordsWrapper}>
              <span className={styles.words}>
                <strong
                  key={`${activeIndex}-${animationKey}`}
                  className={classNames(styles.word, styles.wordActive, {
                    [styles.wordDone]: isDone,
                  })}
                >
                  {activeWord.char.map((char, index) => (
                    <span
                      key={`${char}-${index}`}
                      className={classNames(styles.char, styles.active, {
                        [styles.done]: isDone,
                      })}
                    >
                      {char}
                    </span>
                  ))}
                </strong>
                &nbsp;
              </span>
              <span className={styles.thing}>THING</span>
            </div>
          </h1>
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <div
                key={`${activeIndex}-${animationKey}`}
                className={classNames(styles.img, styles.imgActive, {
                  [styles.imgDone]: isDone,
                })}
              >
                <Image
                  src={activeImage}
                  alt="hero"
                  preload={activeIndex === 0}
                  placeholder="blur"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.line} />
          <div className={styles.folderFooter}>
            <div className={styles.folderFooterWrapper}>
              <div className={styles.text}>
                <h1>10Y</h1>
                <span>
                  OF DESIGN-DRIVEN <br /> PRODUCT DEVELOPMENT
                </span>
              </div>
              <Link href="/contacts" className={styles.button}>
                <LightingIcon
                  className={classNames(styles.lightingLeft, styles.lighting)}
                />
                <span>Let's talk</span>
                <LightingIcon
                  className={classNames(styles.lightingRight, styles.lighting)}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LightingIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M215.79 118.17a8 8 0 0 0-5-5.66L153.18 90.9l14.66-73.33a8 8 0 0 0-13.69-7l-112 120a8 8 0 0 0 3 13l57.63 21.61l-14.62 73.25a8 8 0 0 0 13.69 7l112-120a8 8 0 0 0 1.94-7.26ZM109.37 214l10.47-52.38a8 8 0 0 0-5-9.06L62 132.71l84.62-90.66l-10.46 52.38a8 8 0 0 0 5 9.06l52.8 19.8Z"
      ></path>
    </svg>
  );
};

export default Folder;
