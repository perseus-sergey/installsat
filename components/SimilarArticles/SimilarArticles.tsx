import SeoLink from '../ui/SeoLink/SeoLink';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { EUrlBaseParam } from '@/models/url/url.model';
import { ELanguage } from '@/models/language.model';
import SimilarBlock from './SimilarBlock';
import { getSimilarArticles } from '@/controllers/similarArticles.controller';
import { getSeoCardLinkTitle } from '@/models/articles/article.model';

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
  const similarArticles = await getSimilarArticles(logoSrc, articleId, lang);

  if (similarArticles.length === 0) return null;

  return (
    <SimilarBlock blockTitle={similarTitle} lang={lang}>
      {similarArticles.map((art) => (
        <li key={art.cpu}>
          <SeoLink
            className="text-indigo-700 hover:text-red-500"
            href={`/${lang}/${ARTICLE}/${art.cpu}`}
            title={getSeoCardLinkTitle(art.title)[lang]}
          >
            {art.title}
          </SeoLink>
          <span>{` (${getFormattedDateStrYearFirst(art.date, lang)})`}</span>
        </li>
      ))}
    </SimilarBlock>
  );
};

export default SimilarArticles;
