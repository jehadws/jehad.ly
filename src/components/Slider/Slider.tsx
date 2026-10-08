'use client';

import React, { Children, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// @ts-ignore
import styles from "./Slider.module.scss";

type Settings = {
  dots?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
};

type Props = {
  children: ReactNode;
  settings?: Settings;
};

const Slider = ({ children, settings = {} }: Props) => {
  const {
    dots = false,
    infinite = false,
    speed,
    slidesToShow = 1,
    slidesToScroll = 1,
  } = settings;

  return (
    <Swiper
      modules={[Pagination]}
      slidesPerView={slidesToShow}
      slidesPerGroup={slidesToScroll}
      loop={infinite}
      speed={speed}
      pagination={
        dots
          ? {
              el: `.${styles.dots}`,
              clickable: true,
              bulletClass: styles.button,
              bulletActiveClass: styles.active,
            }
          : false
      }
    >
      {Children.toArray(children).map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
      {dots ? <div className={styles.dots} /> : null}
    </Swiper>
  );
};

export default Slider;
