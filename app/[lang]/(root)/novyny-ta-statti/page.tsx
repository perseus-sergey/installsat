import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';

import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import ArticleList from '@/components/article/ArticleList/ArticleList';
import Pagination from '@/components/ui/Pagination/Pagination';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { getELangKey } from '@/libs/utils/getLanguage';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import Filter from '@/components/ui/Filter/Filter';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import h1Img from 'public/Images/articles/all_news_64.png';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import {
  ARTICLE_LIST_MODEL,
  ARTICLE_PAGINATION_PARAMS,
} from '@/models/articles/articleList.model';
import { SEARCH_FIELD } from '@/models/ui/searchField.model';
import { ELanguage } from '@/models/language.model';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { getChunkOfNews } from '@/controllers/articleList.controller';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { images, articlesCountCaption } = ARTICLE_LIST_MODEL;

const { placeholder, labelTitle } = SEARCH_FIELD;

const META_ALL_ARTICLES = {
  h1Start: {
    [ELanguage.UA]: `Останні новини ТБ, статті та огляди на`,
    [ELanguage.EN]: `Latest TV news, articles and reviews as of`,
  },
  title: {
    [ELanguage.UA]: 'Останні новини та статті про цифрове телебачення',
    [ELanguage.EN]: 'Latest news and articles about digital television',
  },
  description: {
    [ELanguage.UA]:
      'Список статей про новини в сфері цифрового телебачення, статей про налаштування обладнання для прийому та перегляду телевізійних та радіо каналів, статей про новини від провайдерів платного телебачення',
    [ELanguage.EN]:
      'List of articles about news in the field of digital television, articles about setting up equipment for receiving and viewing tv and radio channels, articles about news from pay TV providers',
  },
};

export const revalidate = 43200; // 3600 * 12 invalidate cache every 12 hours

interface IProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams: TSearchParams;
}

export const generateMetadata = ({ params }: IProps): Metadata => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const { title, description } = META_ALL_ARTICLES;

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
      canonical: `/${lang}/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
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
  const { h1Start } = META_ALL_ARTICLES;

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
      <ArticleWrapper lang={lang}>
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
      </ArticleWrapper>
    </>
  );
}
