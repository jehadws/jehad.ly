import Image from 'next/image';
import classNames from 'classnames';

import Categories from './components/Categories';
import GradientText from '@components/GradientText';
import styles from './Headline.module.scss';
import type { Project } from '@data/projects';

const NextProjectCategory = () => (
  <div className={styles['next-project-category']}>Next Project</div>
);

type Props = {
  data: Project;
  truncated?: boolean;
};

const Headline = ({ data, truncated }: Props) => {
  const { categories, title } = data;

  const styleImageBox = classNames(styles['image-box'], {
    [styles['next-image-box']]: truncated,
  });

  const styleHeadline = truncated
    ? styles['headline-truncated']
    : styles['headline'];

  const links = truncated ? (
    <NextProjectCategory />
  ) : (
    <Categories items={categories} />
  );

  return (
    <div className={styleHeadline}>
      <div className={styles['container']}>
        <div className={styles['planets-wrapper']}>
          <div className={styles['title-category-wrap']}>
            {links}
            <h1 className={styles['title']}>
              <GradientText text={title} />
            </h1>
          </div>
        </div>
        <div className={styleImageBox}>
          <Image
            src={data.featured_media.source_url}
            alt="project picture"
            width={1120}
            height={700}
            className={styles['picture']}
          />
        </div>
      </div>
    </div>
  );
};

export default Headline;
