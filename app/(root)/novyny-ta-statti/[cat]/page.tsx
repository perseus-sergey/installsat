import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Title/Title';
import type { Metadata } from 'next';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { ARTICLES, ISingleCatArticlesModel } from '@/models/articles.model';
import {
  getArticleCatList,
  getChunkOfNews,
} from '@/controllers/articles.controller';
import { imagePathValidate } from '@/libs/utilsServer';
import { getFormattedDateStr, validSearchParam } from '@/libs/utils';
import { cache } from 'react';
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import ArticleList from '@/components/article/ArticleList/ArticleList';
import { notFound } from 'next/navigation';
import Pagination from '@/components/Pagination/Pagination';
import { LANGUAGE, TSearchParams, defaultMetaData } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';

const { BASE_URL } = process.env;

const {
  articleList: { pagination, images, articlesCountCaption },
  articleSingleCatList: {
    meta: { getH1 },
  },
} = ARTICLES;

const articleTitleImg = imagePathValidate(
  images.titleImg,
  images.titleImg.alternativeStr.title
);

export const dynamic = 'force-dynamic';

export interface IPageParams {
  params: { cat: string };
  searchParams: TSearchParams;
}

const currDateStr = getFormattedDateStr(new Date());

const allCatResponse = await getArticleCatList();

const getCurrentCatParams = cache((catCpu: string): ISingleCatArticlesModel => {
  const catParams =
    allCatResponse instanceof Error
      ? ''
      : allCatResponse.find((cat) => cat.cpu === catCpu);

  return catParams
    ? {
        title: catParams.title,
        id: catParams.id,
        cpu: catParams.cpu,
        description: catParams.description,
        text: catParams.text,
      }
    : { title: '', description: '', id: -1, cpu: '', text: '' };
});

export const generateMetadata = ({
  params: { cat },
}: IPageParams): Metadata => {
  const { title, description, cpu } = getCurrentCatParams(cat);

  return {
    title,
    description,
    keywords: description,
    openGraph: {
      ...defaultMetaData.openGraph,
      title,
      description,
      url: `${BASE_URL}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${cpu}`,
      publishedTime: getFormattedDateStr(currDateStr),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    cat: string;
  }[]
> {
  if (allCatResponse instanceof Error) return [{ cat: '' }];

  return allCatResponse.map((cat) => ({ cat: cat.cpu }));
}

export const dynamicParams = false;

export default async function Page({
  params: { cat },
  searchParams,
}: IPageParams) {
  const { id, description, text } = getCurrentCatParams(cat);

  const { perPage } = pagination;

  const page = validSearchParam(EUrlSearchParam.PAGE, searchParams) || '1';

  const searchQuery = validSearchParam(EUrlSearchParam.ARTICLE, searchParams);

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const allNews = await getChunkOfNews(
    perPage,
    (pageNumber - 1) * perPage,
    id,
    searchQuery
  );

  if (allNews instanceof Error)
    return <EmptyData description={allNews.message} />;

  if (!allNews.length) return <EmptyData description={`Couldn't find data`} />;

  const totalPages = Math.ceil(allNews[0].total_count / perPage);

  return (
    <>
      <Title>
        {getH1(currDateStr, description)[LANGUAGE]}

        <FillingValidImage
          image={images.h1Image}
          alternativeImgString={images.h1Image.alternativeStr}
          alt={images.h1Image.alt[LANGUAGE]}
          isBlur
        />
      </Title>

      <TextUnderH1>{text}</TextUnderH1>

      <p className="text-blue-600 font-bold text-center text-lg">{`${articlesCountCaption[LANGUAGE]}${allNews[0].total_count}`}</p>

      {totalPages > 1 && (
        <Pagination
          page={pageNumber || 1}
          offsetNumber={pagination.offsetNumber}
          totalPages={totalPages}
          searchParams={searchParams}
        />
      )}
      <ArticleList articleList={allNews} articleTitleImg={articleTitleImg} />
    </>
  );
}
