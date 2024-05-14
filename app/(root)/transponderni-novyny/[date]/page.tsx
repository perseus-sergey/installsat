import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import TransNewsSingle from '@/components/TransNewsSingle/TransNewsSingle';
import { getTransNewsForSingleDay } from '@/controllers/satDigest.controller';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { META_TRANS_NEWS_SINGLE } from '@/models/satDigest.model';
import { LANGUAGE as L, DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const BASE_URL = process.env.BASE_URL;

const { metaDescriptionStart, metaH1start, metaKeywordsStart, metaTitleStart } =
  META_TRANS_NEWS_SINGLE;

const getCurrDateCached = cache(getFormattedDateStrYearFirst);

interface IPageParams {
  params: { date: string };
}

export const generateMetadata = async ({ params: { date } }: IPageParams) => {
  const formattedDate = getCurrDateCached(date);
  const title = `${metaTitleStart[L]} ${formattedDate}`;
  const description = `${metaDescriptionStart[L]} ${formattedDate}`;

  return {
    // metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: `${metaKeywordsStart[L]} ${formattedDate}`,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `${BASE_URL}/${EUrlBaseParam.TRANSPONDER_NEWS}/${date}`,
      publishedTime: date,
    },
  };
};

export default async function Page({ params: { date } }: IPageParams) {
  const newsArray = await getTransNewsForSingleDay(date);

  const formattedDate = getCurrDateCached(date);

  if (!formattedDate) notFound();

  return (
    <>
      <BreadCrumbServer />
      <article className="article">
        <TransNewsSingle
          title={`${metaH1start[L]} ${formattedDate}`}
          newsArray={newsArray}
        />
      </article>
    </>
  );
}
