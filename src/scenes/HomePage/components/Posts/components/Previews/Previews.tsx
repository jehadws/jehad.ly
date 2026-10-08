import React from "react";
import Link from "next/link";

import Item from "./components/Item";
import SlideHover from "@components/SlideHover";
// @ts-ignore
import styles from "./Previews.module.scss";
import preview1 from "@assets/images/sections/home-blog/how-design.webp";
import preview2 from "@assets/images/sections/home-blog/spa-mpa.webp";
import preview3 from "@assets/images/sections/home-blog/seo.webp";

const Previews = () => {
  const items = [
    {
      path: "/ma-ho-tsmym-almntg-oaamly-tsmym-almntg-bshkl-aaam",
      title:
        "What is the product design and the product design process in general?",
      preview: preview1,
      tag: "design",
    },
    {
      path: "/ttbyk-alsfh-aloahd-spa-mkabl-ttbyk-alsfhat-almtaadd-mpa-matha-tkhtar",
      title:
        "The one page (SPA) for the multi-page application (MPA): What do you choose?",
      preview: preview2,
      tag: "frontend",
    },
    {
      path: "/7-nsayh-lthsyn-mhrkat-albhth-ltaazyz-tsnyfat-mokaa-aloyb-algdyd-alkhas-bk",
      title: "7 SEO Tips to Boost Your New Website's Rankings",
      preview: preview3,
      tag: "SEO",
    },
  ];

  return (
    <div>
      <div>
        {items.map((item) => {
          return <Item key={item.path} {...item} />;
        })}
      </div>
      <SlideHover>
        <Link href="/blog" className={styles.link}>
          MORE BLOG POSTS
        </Link>
      </SlideHover>
    </div>
  );
};

export default Previews;
