'use client';

import React from "react";
import Testimonials from "./components/Testimonials";
import Works from "./components/Works";

import "swiper/css";
// @ts-ignore
import styles from "./HomePage.module.scss";
import WhatWeDo from "./components/WhatWeDo";
import Hero from "./components/Hero";
import Projects from "@scenes/HomeProjects";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Hero />
      <div className="pageWrapper">
        <WhatWeDo />
      </div>
      <Works />
      <div className="pageWrapper">
        <Projects title="Projects" navigation={true} />
      </div>
      <Testimonials />
    </div>
  );
};

export default HomePage;
