import styles from './SimilarArticles.module.scss';
import { ReactNode } from 'react';

interface ISimilarArticlesProps {
  similarArticlesMapped: ReactNode[];
  similarTitle: string;
}

const SimilarArticles = ({
  similarArticlesMapped,
  similarTitle,
}: ISimilarArticlesProps) => (
  <nav className={styles.SimilarArticles} data-testid="SimilarArticles">
    <h2 className={styles.title}>{similarTitle}</h2>
    <ul className={styles.list}>{similarArticlesMapped}</ul>
  </nav>
);

export default SimilarArticles;
