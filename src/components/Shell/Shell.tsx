'use client';

import { useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import classNames from 'classnames';
import { HeaderGradientContext, MenuContext } from '@contexts/index';
import { DEFAULT_SHELL_OPTIONS, ShellOptionsContext } from '@contexts/ShellOptionsContext';
import Header from '@components/Header';
import styles from './Shell.module.scss';

export default function Shell({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { isOpened } = useContext(MenuContext);
  const [options, setOptions] = useState(DEFAULT_SHELL_OPTIONS);
  const [isHeaderShow, setIsHeaderShow] = useState(true);
  const [isHeaderWithoutGradient, setIsHeaderWithoutGradient] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsHeaderShow(y - lastY.current <= 0);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const mainClasses = classNames(styles.main, styles.hidden);
  const footerClasses = classNames(styles.footer, styles.hidden);

  return (
    <ShellOptionsContext.Provider value={{ options, setOptions }}>
      <HeaderGradientContext.Provider value={{ setIsHeaderWithoutGradient }}>
        <div className={classNames(styles.container, { [styles.glow]: options.isGlow })}>
          <header className={styles.header}>
            <Header
              headerIsWhite={options.headerIsWhite}
              withoutGradient={options.withoutGradient || isHeaderWithoutGradient}
              headerShow={isOpened ? true : isHeaderShow}
              forwardedRef={headerRef}
            />
          </header>
          <main className={mainClasses}>{children}</main>
          {footer && <footer className={footerClasses}>{footer}</footer>}
        </div>
      </HeaderGradientContext.Provider>
    </ShellOptionsContext.Provider>
  );
}
