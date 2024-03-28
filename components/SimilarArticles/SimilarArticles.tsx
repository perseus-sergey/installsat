import { ISimilarArticleModel } from '@/models/articles.model';
import styles from './SimilarArticles.module.scss';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';

interface ISimilarArticlesProps {
  similarArticles: ISimilarArticleModel[];
}

const SimilarArticles = ({ similarArticles }: ISimilarArticlesProps) => (
  <ul className={styles.SimilarArticles} data-testid="SimilarArticles">
    {similarArticles.map((art) => (
      <li key={art.cpu}>
        <Link href={`/${EUrlBaseParam.ARTICLE}/${art.cpu}`}>{art.title}</Link>
      </li>
    ))}
  </ul>
);

export default SimilarArticles;
