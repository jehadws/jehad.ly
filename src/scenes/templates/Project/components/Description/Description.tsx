import type { Project } from '@data/projects';
import styles from './Description.module.scss';

type Props = {
  data: Project;
};
const Description = ({ data }: Props) => {
  const { content, technologies, excerpt, companies, site } = data;

  return (
    <div className={styles['project-description']}>
      <div className={styles['container']}>
        <p className={styles['technologies']}>{technologies.join(', ')}</p>

        <div className={styles['flex-wrap']}>
          <h3 className={styles['excerpts']}>{excerpt}</h3>

          <div className={styles['wrapper']}>
            <p className={styles['content']}>{content}</p>
            <div className={styles['line']}></div>

            <ul className={styles['companies-list']}>
              {companies.map(({ sourceImage, text }) => {
                return (
                  <li className={styles['company-item']} key={text}>
                    <div>
                      <img src={sourceImage} alt={text} />
                    </div>
                    <p className={styles['company-title']}>{text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className={styles['more-info']}>
          <a
            className={styles['more-info-link']}
            href={site.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.name}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Description;
