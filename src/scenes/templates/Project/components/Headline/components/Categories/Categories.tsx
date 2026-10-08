import { Fragment } from 'react';
import Link from 'next/link';
import styles from './Categories.module.scss';

type Props = {
  items: {
    count: number;
    id: string;
    name: string;
    slug: string;
  }[];
};

const Categories = ({ items }: Props) => {
  if (items && items.length < 1) return null;

  return (
    <ul className={styles['category-list']}>
      <li key="All projects">
        <Link href="/portfolio/" className={styles['category-link']}>
          Portfolio
        </Link>
      </li>
      {items.map((item) => {
        const link = `/portfolio/?category=${item.slug}`;

        return (
          <Fragment key={item.slug}>
            <li className={styles['category-separator']}>/</li>
            <li key={item.id}>
              <Link href={link} className={styles['category-link']}>
                {item.name}
              </Link>
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
};

export default Categories;
