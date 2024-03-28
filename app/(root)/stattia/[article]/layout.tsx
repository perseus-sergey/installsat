import type { Metadata } from 'next';
import React from 'react';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils';
import { defaultMetaData } from '@/models/ui.model';
import {
  getArticle,
  getArticleSlugList,
  getSimilarArticles,
} from '@/controllers/articles.controller';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import EmptyData from '@/components/EmptyData/EmptyData';
import { IArticleParams } from './page';

export interface IArticleLayoutParams extends IArticleParams {
  children: React.ReactNode;
}

export const generateMetadata = async ({
  params: { article },
}: IArticleLayoutParams): Promise<Metadata> => {
  const sqlResult = await getArticle(article);
  if (sqlResult instanceof Error) return defaultMetaData.ua;

  const { title, description, date, slug } = sqlResult[0];

  return {
    title,
    description,
    keywords: description,
    openGraph: {
      ...defaultMetaData.openGraph,
      title,
      description,
      url: SITE_BASE_URL + EUrlBaseParam.ARTICLE + slug,
      publishedTime: getFormattedDateStr(date),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    article: string;
  }[]
> {
  const articleSlugList = await getArticleSlugList();

  if (articleSlugList instanceof Error) return [{ article: '' }];

  return articleSlugList.map((article) => ({ article: article.cpu }));
}

export const dynamicParams = false;

export default async function layout({
  children,
  params: { article },
}: IArticleLayoutParams) {
  const sqlResult = await getArticle(article);
  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;

  const { id, logo } = sqlResult[0];

  const similarArticles = await getSimilarArticles(logo, id);
  if (similarArticles instanceof Error)
    return <EmptyData description={similarArticles.message} />;

  return (
    <>
      <article className="article">{children}</article>
      <SimilarArticles similarArticles={similarArticles} />
    </>
  );
}
