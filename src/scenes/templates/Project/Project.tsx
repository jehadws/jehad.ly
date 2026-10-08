import Link from 'next/link';
import type { Project } from '@data/projects';

import Description from './components/Description';
import Headline from './components/Headline';
import styles from './Project.module.scss';

type Props = {
  data: Project;
  next: Project;
};

const ProjectPage = ({ data, next }: Props) => {
  const nextLink = `/portfolio/${next.slug}/`;

  return (
    <>
      <Headline data={data} />

      <Description data={data} />

      <Link href={nextLink} className={styles['headline-wrap-link']}>
        <Headline data={next} truncated />
      </Link>
    </>
  );
};

export default ProjectPage;
