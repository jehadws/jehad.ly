import React from "react";
import Image, { type StaticImageData } from "next/image";
// @ts-ignore
import styles from "./Item.module.scss";
import SlideHover from "@components/SlideHover";
type Techs = { name: string; icon: any };

type Props = {
  link: string;
  linkTitle: string;
  preview: StaticImageData;
  tags: string;
  title: string;
  alt: string;
  imgTitle: string;
  technologies: Techs[];
};


const Item = ({
  title,
  tags,
  preview,
  link,
  alt,
  linkTitle,
  imgTitle,
  technologies,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={`${styles.description}`}>
            <div className={styles.tags}>{tags}</div>
            <div className={styles.title}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            </div>

            <div className={styles.descriptionLink}>
              <SlideHover>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {linkTitle}
                </a>
              </SlideHover>
            </div>

            <ul className={styles.technologies}>
              {technologies.map(({ name, icon }, index) => (
                <li key={index} className={styles.technologiesItem}>
                  <img
                    src={icon.src}
                    alt="technologies item icon"
                    loading="lazy"
                    className={styles.technologyIcon}
                  />
                  <div className={styles.technologyName}>{name}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.image}>
          <div
            className={`${styles.preview}`}
          >
            <a href={link} target="_blank" rel="noopener noreferrer">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  aspectRatio: "41 / 30",
                }}
              >
                <Image
                  src={preview}
                  alt={alt}
                  title={imgTitle}
                  draggable={false}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className={styles.hiddenTitle}>{title}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
