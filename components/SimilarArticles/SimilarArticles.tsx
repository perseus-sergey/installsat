import styles from './SimilarArticles.module.scss';
import { SIMILAR_ARTICLES } from '@/models/ui.model';
import { ReactNode } from 'react';

interface ISimilarArticlesProps {
  similarArticlesMapped: ReactNode[];
}

const SimilarArticles = ({ similarArticlesMapped }: ISimilarArticlesProps) => (
  <nav className={styles.SimilarArticles} data-testid="SimilarArticles">
    <h2 className={styles.title}>{SIMILAR_ARTICLES.title.ua}</h2>
    <ul className={styles.list}>{similarArticlesMapped}</ul>
  </nav>
);

export default SimilarArticles;
