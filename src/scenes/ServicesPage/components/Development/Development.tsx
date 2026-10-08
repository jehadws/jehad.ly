import React from "react";

import { servicesDevelopmentImages } from "@constants/images/servicesDevelopmentImages";
import ServicesItem from "../ServicesItem";
// @ts-ignore
import styles from "./Development.module.scss";

const Development = () => {
  const {
    hybridAppsDevelopment,
    projectManagement,
    qualityAssurance,
    webDevelopment,
  } = servicesDevelopmentImages;

  const message = {
    text: "Front-end & back-end expertise from development to delivery.",
    link: "NEED A DEVELOPER?",
  };

  const items = [
    {
      title: "Web Development",
      text: "We provide back-end and front-end development to your needs.",
      image: webDevelopment,
    },
    {
      title: "Hybrid Apps Development",
      text: "Effective solutions for iOS and Android platforms with focus on performance.",
      image: hybridAppsDevelopment,
    },
    {
      title: "Project Management",
      text: "Quality-driven web development according latest technology standards.",
      image: projectManagement,
    },
    {
      title: "Quality Assurance",
      text: "Effective solutions for iOS and Android platforms with focus on performance.",
      image: qualityAssurance,
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Development</h2>
      <ServicesItem items={items} message={message} />
    </div>
  );
};

export default Development;
