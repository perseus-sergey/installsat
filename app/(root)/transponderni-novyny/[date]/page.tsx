import EmptyData from '@/components/EmptyData/EmptyData';
import TransNewsSingle from '@/components/TransNewsSingle/TransNewsSingle';
import {
  getTransNewsForSingleDay,
  singleDaySql,
} from '@/controllers/satDigest.controller';
import { getDate } from '@/libs/utils';
import { META_TRANS_NEWS_SINGLE } from '@/models/meta.model';
import { notFound } from 'next/navigation';

interface ISatNewsDatePageParams {
  params: { date: string };
}

export const generateMetadata = async ({
  params: { date },
}: ISatNewsDatePageParams) => {
  const dateStr = getDate(date);

  return {
    // metadataBase: new URL(SITE_BASE_URL),
    title: META_TRANS_NEWS_SINGLE.getTitle(dateStr),
    description: META_TRANS_NEWS_SINGLE.getDescription(dateStr),
    keywords: META_TRANS_NEWS_SINGLE.getKeywords(dateStr),
  };
};

export default async function SatNewsDatePage({
  params,
}: ISatNewsDatePageParams) {
  const newsArray = await getTransNewsForSingleDay(params.date, singleDaySql);

  const dateStr = getDate(params.date);

  if (!dateStr) notFound();

  if (newsArray instanceof Error)
    return <EmptyData description={newsArray.message} />;

  return (
    <TransNewsSingle
      title={META_TRANS_NEWS_SINGLE.getH1(dateStr)}
      newsArray={newsArray}
    />
  );
}
