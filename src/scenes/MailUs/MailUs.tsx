import React, { useEffect, useState, useContext } from "react";
import type { CSSProperties } from "react";
import classNames from "classnames";

import siteMetadata from "@constants/siteMetadata";
import { HeaderGradientContext } from "@contexts/index";

// @ts-ignore
import styles from "./MailUs.module.scss";

type ParallaxStyle = CSSProperties;

const MailUs = () => {
  const metadata = siteMetadata;
  const elRef = React.useRef<HTMLDivElement>(null);
  let elParams: DOMRect | null = null;
  let elPosition: number | null = null;

  const [backgroundParallax, setBackgroundParallax] = useState<
    ParallaxStyle | undefined
  >(undefined);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const moveBackground = () => {
    if (!elRef.current) return;
    elParams = elRef.current.getBoundingClientRect();
    elPosition = elParams.top - window.innerHeight;
    if (elPosition + elParams.height / 2 <= 0) {
      setBackgroundParallax({
        transform: `translate3d(0, ${elParams.height + elPosition}px, 0)`,
      });
    }
  };

  useEffect(() => {
    if (!elRef.current) return;
    elParams = elRef.current.getBoundingClientRect();
    setBackgroundParallax({
      transform: `translate3d(0, ${elParams.height / 2}px, 0)`,
    });
    window.addEventListener("scroll", moveBackground);
    return () => window.removeEventListener("scroll", moveBackground);
  }, []);

  const { setIsHeaderWithoutGradient } = useContext(HeaderGradientContext) as {
    setIsHeaderWithoutGradient: (value: boolean) => void;
  };

  useEffect(() => {
    function removeGradient(MailUsRef: React.RefObject<HTMLDivElement | null>) {
      const el = MailUsRef.current?.getBoundingClientRect().top;
      if (el === undefined) return false;
      return el < 120
        ? setIsHeaderWithoutGradient(true)
        : setIsHeaderWithoutGradient(false);
    }

    let removeGradientOnScroll = removeGradient(elRef);
    window.addEventListener("scroll", () => removeGradientOnScroll);
    return () =>
      window.removeEventListener(
        "scroll",
        removeGradientOnScroll as unknown as EventListener
      );
  });

  const linkIsHovered = classNames(styles.container, {
    [styles.ishovered]: isHovered,
  });

  return (
    <div ref={elRef} className={linkIsHovered}>
      <span className={styles.background} style={backgroundParallax} />
      <p className={styles.title}>
        Ready to create
        <br />
        <span>your star?</span>
      </p>
      <a
        href={`mailto:${metadata.email}`}
        className={styles.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        contact us
      </a>
    </div>
  );
};

export default MailUs;
