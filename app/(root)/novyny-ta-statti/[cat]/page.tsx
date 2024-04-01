import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import type { Metadata } from 'next';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { ARTICLES, ISingleCatArticlesModel } from '@/models/articles.model';
import {
  getArticleCatList,
  getChunkOfNews,
} from '@/controllers/articles.controller';
import { imagePathValidate } from '@/libs/utilsServer';
import { getFormattedDateStr } from '@/libs/utils';
import { cache } from 'react';
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import ArticleList from '@/components/ArticleList/ArticleList';
import { notFound } from 'next/navigation';
import Pagination from '@/components/Pagination/Pagination';
import { defaultMetaData } from '@/models/ui.model';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';

export const dynamic = 'force-dynamic';

export interface IPageParams {
  params: { cat: string };
  searchParams: { [key: string]: string | string[] | undefined };
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
      url: `${SITE_BASE_URL}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${cpu}`,
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

  let page = 0;
  let start = 0;
  const { perPage } = ARTICLES.articleList.pagination;

  if (searchParams && Object.keys(searchParams).length) {
    page = parseInt(`${searchParams.page}`, 10);
    if (isNaN(page)) notFound();
    start = (page - 1) * perPage;
  }

  const allNews = await getChunkOfNews(perPage, start, id);
  if (allNews instanceof Error)
    return <EmptyData description={allNews.message} />;

  if (!allNews.length) return <EmptyData description={`Couldn't find data`} />;

  const totalPages = Math.ceil(allNews[0].total_count / perPage);

  if (page > totalPages) notFound();

  const articleTitleImg = imagePathValidate(
    ARTICLES.articleList.images.titleImg,
    ARTICLES.articleList.images.titleImg.alternativeStr.title
  );

  return (
    <>
      <Title>
        {ARTICLES.articleSingleCatList.meta.getH1(currDateStr, description).ua}
        <FillingValidImage
          image={ARTICLES.articleList.images.h1Image}
          alternativeImgString={
            ARTICLES.articleList.images.h1Image.alternativeStr
          }
          alt={ARTICLES.articleList.images.h1Image.alt.ua}
          isBlur
        />
      </Title>

      <TextUnderH1>{text}</TextUnderH1>

      {totalPages > 1 && (
        <Pagination
          page={page || 1}
          offsetNumber={ARTICLES.articleList.pagination.offsetNumber}
          totalPages={totalPages}
          searchParams={searchParams}
        />
      )}
      <ArticleList articleList={allNews} articleTitleImg={articleTitleImg} />
    </>
  );
}
