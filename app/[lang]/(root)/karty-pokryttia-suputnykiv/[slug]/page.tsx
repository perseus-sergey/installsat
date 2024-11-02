import React from 'react';
import type { Metadata } from 'next';

import { EDBTableTitles } from '@/models/dbTblNames.model';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { Title } from '@/components/ui/Titles/Title';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import BeamMapList from '@/components/BeamMapList/BeamMapList';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/getLanguage';
import SeoLink from '@/components/ui/SeoLink/SeoLink';
import { EUrlSearchParam } from '@/cron/libs/commons.mjs';
import { getSatMapsSideBar } from '@/controllers/sidebar.controller';
import SimilarBlock from '@/components/SimilarArticles/SimilarBlock';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import {
  BREAD_SAT_COVERAGE_MAP,
  META_SINGLE_SAT_MAP,
  SINGLE_SAT_MAP_DATA,
} from '@/models/mapCoverage.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { getSatMap } from '@/controllers/mapCoverage.controller';
import { updateViewCount } from '@/controllers/viewUpdate.controller';
import { INFO_PANEL_TITLES } from '@/models/ui/infoPanel.model';

interface IArticleParams {
  params: { [key in EUrlBaseParam]: string };
}

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

const BASE_URL = process.env.BASE_URL || MAIN_URL;

export const revalidate = 604800; // 3600 * 24 * 7 invalidate cache every 7 days

const {
  similar: { similarStart, similarTitle, similarLinkTitle },
} = SINGLE_SAT_MAP_DATA;

const { images: singleMapImg } = SINGLE_SAT_MAP_DATA;

const { metaKeywords, metaTitle, getDescription, getH1 } = META_SINGLE_SAT_MAP;

const { views: viewsTitle } = INFO_PANEL_TITLES;
// const { views: viewsTitle, comments: commentsTitle } = INFO_PANEL_TITLES;

export const generateMetadata = async ({
  params,
}: IArticleParams): Promise<Metadata> => {
  const slug = params[EUrlBaseParam.SLUG];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const sqlResult = await getSatMap(slug);

  if (!sqlResult.length) return DEFAULT_META_DATA[lang];

  const { sat_title, position, beam_description } = sqlResult[0];

  const title = `${metaTitle[lang]} ${sat_title} ${position}`;
  const description = `${getDescription(`${sat_title} ${position}`)[lang]}. ${beam_description}`;
  const slugPath = `${EUrlBaseParam.SAT_COVERAGE_MAP}/${slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: metaKeywords[lang],
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

export async function generateStaticParams(): Promise<
  {
    slug: string;
  }[]
> {
  const allMaps = await getSatMapsSideBar();

  return !allMaps.length
    ? [{ slug: '' }]
    : allMaps.map((item) => ({ slug: item.cpu }));
}

export const dynamicParams = false;

export default async function Page({ params }: IArticleParams) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const slug = params[EUrlBaseParam.SLUG];

  const sqlResult = await getSatMap(slug);

  const { sat_id, view, sat_title, position, logo, grade } = sqlResult[0];

  // const numberOfComments = await getCommentsNumber(
  //   EDBTableTitles.COMMENTS_MAPS,
  //   `${sat_id}`
  // );

  const h1Title = getH1(`${sat_title}, ${position}`)[lang];

  const relatedSatHref = `/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}?${new URLSearchParams({ [EUrlSearchParam.SAT]: grade })}`;

  updateViewCount(EDBTableTitles.CHANNEL_SAT, `${sat_id}`, view);

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          BREAD_SAT_COVERAGE_MAP,
          `${metaTitle[lang]} ${sat_title} ${position}`,
        ]}
      />
      <ArticleWrapper lang={lang}>
        <Title>
          {h1Title}
          <FillingValidImage
            className="hidden: sm:block"
            image={{
              ...singleMapImg.h1Image.currentImg,
              src: `${singleMapImg.h1Image.currentImg.path}${logo}`,
            }}
            defaultImage={singleMapImg.h1Image.defaultImg}
            alt={`${singleMapImg.h1Image.altStart[lang]} ${h1Title}`}
            isFillParent
          />
        </Title>

        {sqlResult.length > 0 ? (
          <BeamMapList lang={lang} beamList={sqlResult} />
        ) : (
          <EmptyData lang={lang} />
        )}
        <BottomInfoPanel
          lang={lang}
          items={[
            { name: viewsTitle[lang], value: view + 1 },
            // { name: commentsTitle[lang], value: numberOfComments },
          ]}
        />
      </ArticleWrapper>

      <SimilarBlock blockTitle={similarTitle[lang]} lang={lang}>
        <li key={0}>
          <SeoLink
            className="text-indigo-700 hover:text-red-500"
            title={`${similarLinkTitle[lang]} "${sat_title} ${position}"`}
            href={relatedSatHref}
          >
            {similarStart[lang]} {sat_title} {position}
          </SeoLink>
        </li>
      </SimilarBlock>
    </>
  );
}

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${slug}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_MAPS}
//   articleId={`${sat_id}`}
//   articleName={`${metaTitle[lang]} ${sat_title} ${position}`}
// />
