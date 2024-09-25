import { getSimilarArticles } from '@/controllers/articles.controller';
import SeoLink from '../ui/SeoLink/SeoLink';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { EUrlBaseParam } from '@/models/url.model';
import { ELanguage } from '@/models/ui.model';
import SimilarBlock from './SimilarBlock';

interface ISimilarArticlesProps {
  similarTitle: string;
  logoSrc: string;
  lang: ELanguage;
  articleId?: number;
}

const { ARTICLE } = EUrlBaseParam;

const SimilarArticles = async ({
  similarTitle,
  logoSrc,
  lang,
  articleId,
}: ISimilarArticlesProps) => {
  const similarArticles = await getSimilarArticles(logoSrc, articleId);

  if (similarArticles.length === 0) return null;

  return (
    <SimilarBlock blockTitle={similarTitle}>
      {similarArticles.map((art) => (
        <li key={art.cpu}>
          <SeoLink
            className="text-indigo-700 hover:text-red-500"
            href={`/${lang}/${ARTICLE}/${art.cpu}`}
            title={
              lang === ELanguage.UA
                ? `Перейти до перегляду статті "${art.title}"`
                : `Go to the view of the article "${art.title_en || art.title}"`
            }
          >
            {lang === ELanguage.UA ? art.title : art.title_en || art.title}
          </SeoLink>
          <span>{` (${getFormattedDateStrYearFirst(art.date)})`}</span>
        </li>
      ))}
    </SimilarBlock>
  );
};

export default SimilarArticles;
