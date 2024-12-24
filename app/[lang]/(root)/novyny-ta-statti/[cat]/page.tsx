import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';

import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import ArticleList from '@/components/article/ArticleList/ArticleList';
import Pagination from '@/components/ui/Pagination/Pagination';
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
  BREAD_NEWS_AND_ARTICLES,
} from '@/models/articles/articleList.model';
import { SEARCH_FIELD } from '@/models/ui/searchField.model';
import { ELanguage } from '@/models/language.model';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import {
  getChunkOfNews,
  getCurrentCatParams,
} from '@/controllers/articleList.controller';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { images, articlesCountCaption } = ARTICLE_LIST_MODEL;

const { placeholder, labelTitle } = SEARCH_FIELD;

export const revalidate = 43200; // 3600 * 12 invalidate cache every 12 hours

export interface IPageParams {
  params: { [_key in EUrlBaseParam]: string };
  searchParams: TSearchParams;
}

export const generateMetadata = async ({
  params,
}: IPageParams): Promise<Metadata> => {
  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  const cat = params[EUrlBaseParam.CATEGORY];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const dbCatRes = await getCurrentCatParams(cat, lang);
  if (!dbCatRes) return DEFAULT_META_DATA[lang];

  const { title, description, cpu } = dbCatRes;

  const slugPath = `${EUrlBaseParam.NEWS_AND_ARTICLES}/${cpu}`;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `/${lang}/${slugPath}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
    alternates: {
      canonical: `/${lang}/${slugPath}`,
      languages: {
        en: `/${EN}/${slugPath}`,
        uk: `/${UA}/${slugPath}`,
        ru: `/${RU}/${slugPath}`,
        es: `/${ES}/${slugPath}`,
        ar: `/${AR}/${slugPath}`,
        de: `/${DE}/${slugPath}`,
        fr: `/${FR}/${slugPath}`,
        it: `/${IT}/${slugPath}`,
      },
    },
  };
};

export default async function Page({ params, searchParams }: IPageParams) {
  const cat = params[EUrlBaseParam.CATEGORY];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const dbCatRes = await getCurrentCatParams(cat, lang);
  if (!dbCatRes) notFound();

  const { id, description, text } = dbCatRes;

  const { perPage } = ARTICLE_PAGINATION_PARAMS;

  const page = validSearchParam(EUrlSearchParam.PAGE, searchParams) || '1';

  const searchQuery = validSearchParam(EUrlSearchParam.ARTICLE, searchParams);

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const allNews = await getChunkOfNews({
    quantity: perPage,
    start: (pageNumber - 1) * perPage,
    catId: id,
    searchQuery,
    lang,
  });

  const mapsCount = !allNews.length ? 0 : allNews[0].total_count;

  const totalPages = Math.ceil(mapsCount / perPage);

  return (
    <>
      <BreadCrumbServer
        breadCrumbList={[BREAD_NEWS_AND_ARTICLES, description]}
        lang={lang}
      />
      <ArticleWrapper lang={lang}>
        <Title>
          {description}
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

        <TextUnderH1>{text}</TextUnderH1>

        <p className="text-blue-600 font-bold text-center text-lg">{`${articlesCountCaption[lang]}${mapsCount}`}</p>

        <Pagination
          lang={lang}
          page={pageNumber || 1}
          offsetNumber={ARTICLE_PAGINATION_PARAMS.offsetNumber}
          totalPages={totalPages}
          searchParams={searchParams}
        />

        <ArticleList lang={lang} articleList={allNews} />

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
