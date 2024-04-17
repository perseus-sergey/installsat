import type { Metadata } from 'next';
import React from 'react';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils';
import {
  LANGUAGE,
  EDBTableTitles,
  SIMILAR_ARTICLES,
  defaultMetaData,
} from '@/models/ui.model';
import {
  getArticle,
  getSimilarArticles,
  updateViewCount,
} from '@/controllers/articles.controller';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { IArticleParams } from './page';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export interface IArticleLayoutParams extends IArticleParams {
  children: React.ReactNode;
}

export const generateMetadata = async ({
  params: { article },
}: IArticleLayoutParams): Promise<Metadata> => {
  const sqlResult = await getArticle(article);

  if (sqlResult instanceof Error || !sqlResult.length)
    return defaultMetaData[LANGUAGE];

  const { title, description, date, slug } = sqlResult[0];

  return {
    title,
    description,
    keywords: description,
    openGraph: {
      ...defaultMetaData.openGraph,
      title,
      description,
      url: `${SITE_BASE_URL}/${EUrlBaseParam.ARTICLE}/${slug}`,
      publishedTime: getFormattedDateStr(date),
    },
  };
};

export default async function layout({
  children,
  params: { article },
}: IArticleLayoutParams) {
  const sqlResult = await getArticle(article);

  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;
  if (!sqlResult.length) notFound();

  const { id, logo, view } = sqlResult[0];

  const similarArticles = await getSimilarArticles(logo, id);
  if (similarArticles instanceof Error)
    return <EmptyData description={similarArticles.message} />;

  updateViewCount(EDBTableTitles.ARTICLE, id, view);

  return (
    <>
      <article className="article">{children}</article>

      {similarArticles.length ? (
        <SimilarArticles
          similarTitle={SIMILAR_ARTICLES.title[LANGUAGE]}
          similarArticlesMapped={similarArticles.map((art) => (
            <li key={art.cpu}>
              <Link href={`/${EUrlBaseParam.ARTICLE}/${art.cpu}`}>
                {art.title}
              </Link>
              <span>{` (${getFormattedDateStr(art.date)})`}</span>
            </li>
          ))}
        />
      ) : null}
    </>
  );
}
