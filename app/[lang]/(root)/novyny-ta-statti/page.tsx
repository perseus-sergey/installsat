import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { ARTICLES } from '@/models/articles.model';
import { getChunkOfNews } from '@/controllers/articles.controller';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import ArticleList from '@/components/article/ArticleList/ArticleList';
import Pagination from '@/components/ui/Pagination/Pagination';
import { notFound } from 'next/navigation';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import {
  DEFAULT_LANG,
  TSearchParams,
  DEFAULT_META_DATA,
  ELanguage,
} from '@/models/ui.model';
import { imagePathValidate } from '@/libs/utils/imagePathValidate';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import Filter from '@/components/ui/Filter/Filter';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  search: { placeholder, labelTitle },
  articleList: {
    meta: { description, h1Start, title },
    pagination,
    images,
    articlesCountCaption,
  },
} = ARTICLES;

const articleTitleImg = imagePathValidate(
  images.titleImg,
  images.titleImg.alternativeStr.title
);

export const dynamic = 'force-dynamic';

interface IProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams: TSearchParams;
}

export const generateMetadata = ({ params }: IProps): Metadata => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return {
    metadataBase: new URL(BASE_URL),
    title: title[lang],
    description: description[lang],
    keywords: description[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: title[lang],
      description: description[lang],
      url: `/${lang}/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${DEFAULT_LANG}/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
      },
    },
  };
};
export default async function Page({ searchParams, params }: IProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const { perPage } = pagination;

  const page = validSearchParam(EUrlSearchParam.PAGE, searchParams) || '1';

  const searchQuery = validSearchParam(EUrlSearchParam.ARTICLE, searchParams);

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const allNews = await getChunkOfNews(
    perPage,
    (pageNumber - 1) * perPage,
    undefined,
    searchQuery
  );

  const mapsCount = !allNews.length ? 0 : allNews[0].total_count;

  const totalPages = Math.ceil(mapsCount / perPage);

  const currDate = getFormattedDateStrYearFirst();

  return (
    <>
      <BreadCrumbServer
        breadCrumbList={[`${h1Start[lang]} ${currDate}`]}
        lang={lang}
      />
      <article className="article">
        <Title>
          {h1Start[lang]} {currDate}
          <FillingValidImage
            image={images.h1Image}
            alternativeImgString={images.h1Image.alternativeStr}
            alt={images.h1Image.alt[lang]}
            isBlur
          />
        </Title>

        <Filter
          lang={lang}
          idName="article-search-input"
          placeholder={placeholder[lang]}
          labelTitle={labelTitle[lang]}
          searchQueryTitle={EUrlSearchParam.ARTICLE}
        />
        <p className="text-blue-600 font-bold text-center text-lg">{`${articlesCountCaption[lang]}${mapsCount}`}</p>

        <Pagination
          lang={lang}
          page={pageNumber || 1}
          offsetNumber={pagination.offsetNumber}
          totalPages={totalPages}
          searchParams={searchParams}
        />

        <ArticleList
          articleList={allNews}
          articleTitleImg={articleTitleImg}
          lang={lang}
        />
      </article>
    </>
  );
}
