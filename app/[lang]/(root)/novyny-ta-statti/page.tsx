import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { getChunkOfNews } from '@/controllers/articles.controller';
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
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import Filter from '@/components/ui/Filter/Filter';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { Suspense } from 'react';
import {
  ARTICLE_LIST_MODEL,
  ARTICLE_PAGINATION_PARAMS,
  META_ALL_ARTICLES,
} from '@/models/articles.model';
import Image from 'next/image';
import h1Img from 'public/Images/articles/all_news_64.png';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  search: { placeholder, labelTitle },
  images,
  articlesCountCaption,
} = ARTICLE_LIST_MODEL;

const { description, h1Start, title } = META_ALL_ARTICLES;

export const revalidate = 3600 * 12; // invalidate cache every 12 hours

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
  const { perPage } = ARTICLE_PAGINATION_PARAMS;

  const page = validSearchParam(EUrlSearchParam.PAGE, searchParams) || '1';

  const searchQuery = validSearchParam(EUrlSearchParam.ARTICLE, searchParams);

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const allNews = await getChunkOfNews({
    quantity: perPage,
    start: (pageNumber - 1) * perPage,
    searchQuery,
    lang,
  });

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
          <Image
            src={h1Img}
            alt={images.h1Image.alt[lang]}
            className="flex-shrink-0"
          />
        </Title>

        <Suspense>
          <Filter
            lang={lang}
            idName="article-search-input"
            placeholder={placeholder[lang]}
            labelTitle={labelTitle[lang]}
            searchQueryTitle={EUrlSearchParam.ARTICLE}
          />
        </Suspense>
        <p className="text-blue-600 font-bold text-center text-lg">{`${articlesCountCaption[lang]}${mapsCount}`}</p>

        <Pagination
          lang={lang}
          page={pageNumber || 1}
          offsetNumber={ARTICLE_PAGINATION_PARAMS.offsetNumber}
          totalPages={totalPages}
          searchParams={searchParams}
        />

        <ArticleList articleList={allNews} lang={lang} />

        <Pagination
          lang={lang}
          page={pageNumber || 1}
          offsetNumber={ARTICLE_PAGINATION_PARAMS.offsetNumber}
          totalPages={totalPages}
          searchParams={searchParams}
        />
      </article>
    </>
  );
}
