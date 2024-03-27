import { ISimilarArticleModel } from '@/models/articles.model';
import styles from './SimilarArticles.module.scss';

interface ISimilarArticlesProps {
  similarArticles: ISimilarArticleModel[];
}

const SimilarArticles = ({ similarArticles }: ISimilarArticlesProps) => (
  <ul className={styles.SimilarArticles} data-testid="SimilarArticles">
    {similarArticles.map((art) => (
      <li key={art.cpu}>{art.title}</li>
    ))}
  </ul>
);

export default SimilarArticles;
