import type { Metadata } from 'next';
import React from 'react';
import { EUrlAdminParam, EUrlBaseParam } from '@/models/url.model';
import {
  LANGUAGE,
  EDBTableTitles,
  SIMILAR_ARTICLES,
  DEFAULT_META_DATA,
} from '@/models/ui.model';
import {
  getArticle,
  getSimilarArticles,
  updateViewCount,
} from '@/controllers/articles.controller';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommentsNumber } from '@/controllers/comments.controller';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import EditLinkButton from '@/components/admin/EditLinkButton/EditLinkButton';

interface IArticleParams {
  children: React.ReactNode;
  params: { article: string };
}

const BASE_URL = process.env.BASE_URL || '';

export const generateMetadata = async ({
  params: { article },
}: IArticleParams): Promise<Metadata> => {
  const sqlResult = await getArticle(article);

  if (sqlResult instanceof Error || !sqlResult.length)
    return DEFAULT_META_DATA[LANGUAGE];

  const { title, description, date, slug } = sqlResult[0];

  return {
    title,
    description,
    keywords: description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `${BASE_URL}/${EUrlBaseParam.ARTICLE}/${slug}`,
      publishedTime: getFormattedDateStrYearFirst(date),
    },
  };
};

export default async function layout({
  children,
  params: { article },
}: IArticleParams) {
  const sqlResult = await getArticle(article);

  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;
  if (!sqlResult.length) notFound();

  const { id, logo, view, title, slug, cat_slug, cat_name } = sqlResult[0];

  const similarArticles = await getSimilarArticles(logo, id);
  if (similarArticles instanceof Error)
    return <EmptyData description={similarArticles.message} />;

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_ARTICLE,
    `${id}`
  );

  updateViewCount(EDBTableTitles.ARTICLE, `${id}`, view);

  return (
    <>
      <EditLinkButton
        href={`/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit/${id}`}
      />
      <BreadCrumbServer
        breadCrumbList={[
          BREAD_CRUMBS.NEWS_AND_ARTICLES,
          {
            title: cat_name,
            href: `${EUrlBaseParam.NEWS_AND_ARTICLES}/${cat_slug}`,
          },
          title,
        ]}
      />
      <article className="article">{children}</article>

      {similarArticles.length ? (
        <SimilarArticles
          similarTitle={SIMILAR_ARTICLES.title[LANGUAGE]}
          similarArticlesMapped={similarArticles.map((art) => (
            <li key={art.cpu}>
              <Link href={`/${EUrlBaseParam.ARTICLE}/${art.cpu}`}>
                {art.title}
              </Link>
              <span>{` (${getFormattedDateStrYearFirst(art.date)})`}</span>
            </li>
          ))}
        />
      ) : null}

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.ARTICLE}/${slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
        articleId={`${id}`}
        articleName={title}
      />
    </>
  );
}
