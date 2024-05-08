import type { Metadata } from 'next';
import React from 'react';
import { EUrlBaseParam } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { LANGUAGE, EDBTableTitles, DEFAULT_META_DATA } from '@/models/ui.model';
import {
  getSatMap,
  getSatMapList,
  updateViewCount,
} from '@/controllers/articles.controller';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import Link from 'next/link';
import { getCommentsNumber } from '@/controllers/comments.controller';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { SAT_MAPS_MODEL } from '@/models/articles.model';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';

interface IArticleParams {
  children: React.ReactNode;
  params: { slug: string };
}

const BASE_URL = process.env.BASE_URL || '';

const {
  metaSingleMap: { metaKeywords, metaTitle, getDescription },
  similar: { similarStart, similarTitle },
} = SAT_MAPS_MODEL;

export const generateMetadata = async ({
  params: { slug },
}: IArticleParams): Promise<Metadata> => {
  const sqlResult = await getSatMap(slug);

  if (!sqlResult.length) return DEFAULT_META_DATA[LANGUAGE];

  const { sat_title, position, beam_description } = sqlResult[0];

  return {
    title: `${metaTitle[LANGUAGE]} ${sat_title} ${position}`,
    description: `${
      getDescription(`${sat_title} ${position}`)[LANGUAGE]
    }. ${beam_description}`,
    keywords: metaKeywords[LANGUAGE],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: `${metaTitle[LANGUAGE]} ${sat_title} ${position}`,
      description: `${
        getDescription(`${sat_title} ${position}`)[LANGUAGE]
      }. ${beam_description}`,
      url: `${BASE_URL}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${slug}`,
      publishedTime: getFormattedDateStr(),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    slug: string;
  }[]
> {
  const allMaps = await getSatMapList();

  return !allMaps.length
    ? [{ slug: '' }]
    : allMaps.map((item) => ({ slug: item.cpu }));
}

export const dynamicParams = false;

export default async function layout({
  children,
  params: { slug },
}: IArticleParams) {
  const sqlResult = await getSatMap(slug);

  const { sat_id, view, sat_title, position } = sqlResult[0];

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_MAPS,
    `${sat_id}`
  );
  //================================================
  // Check view in Packages
  //================================================
  updateViewCount(EDBTableTitles.CHANNEL_SAT, `${sat_id}`, view);

  return (
    <>
      <BreadCrumbServer
        breadCrumbList={[
          BREAD_CRUMBS.SAT_COVERAGE_MAP,
          `${metaTitle[LANGUAGE]} ${sat_title} ${position}`,
        ]}
      />
      <article className="article">{children}</article>

      <SimilarArticles
        similarTitle={similarTitle[LANGUAGE]}
        similarArticlesMapped={[
          <li key={0}>
            <Link href={`/${EUrlBaseParam.SAT_CHANNEL_LIST}/${slug}`}>
              {similarStart[LANGUAGE]} {sat_title} {position}
            </Link>
          </li>,
        ]}
      />

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.SAT_COVERAGE_MAP}/${slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_MAPS}
        articleId={`${sat_id}`}
        articleName={`${metaTitle[LANGUAGE]} ${sat_title} ${position}`}
      />
    </>
  );
}
