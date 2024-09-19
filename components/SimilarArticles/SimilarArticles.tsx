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
  <nav
    className="my-1 mx-auto w-full rounded-lg"
    style={{
      border: 'thick inset #cccccc',
      background:
        'linear-gradient(to bottom, #fceabb 0%, #fccd4d 35%, #f8b500 36%, #fbdf93 100%)',
    }}
    data-testid="SimilarArticles"
  >
    <h2
      className="text-3xl font-bold font-verdana py-2 text-indigo-900 text-center"
      style={{ textShadow: '1px 1px 0px white' }}
    >
      {similarTitle}
    </h2>
    <ul
      className={`${styles.list} p-4 pl-12 font-georgia text-xl`}
      style={{ listStyleImage: 'url(/Images/galka_blue.png)' }}
    >
      {similarArticlesMapped}
    </ul>
  </nav>
);

export default SimilarArticles;
