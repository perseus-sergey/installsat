import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import {
  getArticleCatList,
  getChunkOfNews,
  getCurrentCatParams,
} from '@/controllers/articles.controller';
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import ArticleList from '@/components/article/ArticleList/ArticleList';
import { notFound } from 'next/navigation';
import Pagination from '@/components/ui/Pagination/Pagination';
import { TSearchParams, DEFAULT_META_DATA, ELanguage } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import Filter from '@/components/ui/Filter/Filter';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { Suspense } from 'react';
import {
  ARTICLE_LIST_MODEL,
  ARTICLE_PAGINATION_PARAMS,
} from '@/models/articles.model';
import Image from 'next/image';
import h1Img from 'public/Images/articles/all_news_64.png';
import { BREAD_NEWS_AND_ARTICLES } from '@/models/breadCrumbs.model';
import ArticleWrapper from '@/components/article/ArticleWrapper';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  images,
  articlesCountCaption,
  search: { placeholder, labelTitle },
} = ARTICLE_LIST_MODEL;

export const revalidate = 43200; // 3600 * 12 invalidate cache every 12 hours

export interface IPageParams {
  params: { [key in EUrlBaseParam]: string };
  searchParams: TSearchParams;
}

export const generateMetadata = async ({
  params,
}: IPageParams): Promise<Metadata> => {
  const cat = params[EUrlBaseParam.CATEGORY];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const { title, description, title_en, description_en, cpu } =
    await getCurrentCatParams(cat);

  const slugPath = `${EUrlBaseParam.NEWS_AND_ARTICLES}/${cpu}`;
  const t = lang === ELanguage.UA ? title : title_en || title;
  const d = lang === ELanguage.UA ? description : description_en || description;

  return {
    metadataBase: new URL(BASE_URL),
    title: t,
    description: d,
    keywords: description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: t,
      description: d,
      url: `/${lang}/${slugPath}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}/${slugPath}`,
      languages: {
        en: `/${ELanguage.EN}/${slugPath}`,
        uk: `/${ELanguage.UA}/${slugPath}`,
      },
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    [EUrlBaseParam.CATEGORY]: string;
  }[]
> {
  const allCatResponse = await getArticleCatList();
  if (allCatResponse instanceof Error)
    return [{ [EUrlBaseParam.CATEGORY]: '' }];

  return allCatResponse.map((cat) => ({ [EUrlBaseParam.CATEGORY]: cat.cpu }));
}

export const dynamicParams = false;

export default async function Page({ params, searchParams }: IPageParams) {
  const cat = params[EUrlBaseParam.CATEGORY];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const { id, description, text, description_en, text_en } =
    await getCurrentCatParams(cat);

  const descriptionLang =
    lang === ELanguage.UA ? description : description_en || description;
  const textLang = lang === ELanguage.UA ? text : text_en || text;

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
        breadCrumbList={[BREAD_NEWS_AND_ARTICLES, descriptionLang]}
        lang={lang}
      />
      <ArticleWrapper lang={lang}>
        <Title>
          {descriptionLang}
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

        <TextUnderH1>{textLang}</TextUnderH1>

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
