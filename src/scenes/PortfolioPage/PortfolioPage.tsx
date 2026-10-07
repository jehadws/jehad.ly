import React from 'react';

import Projects from '@scenes/Projects';
import Clients from './components/Clients';
import Works from './components/Works';
// @ts-ignore
import styles from './PortfolioPage.module.scss';

const PortfolioPage = () => {
  return (
    <div className={`${styles.container}`}>
      <div className="pageWrapper">
        <Projects title="Projects" navigation={false} />
        <Clients />
        {/* <Works /> */}
      </div>
    </div>
  );
};

export default PortfolioPage;
