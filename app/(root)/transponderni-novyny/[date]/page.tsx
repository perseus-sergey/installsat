import EmptyData from '@/components/errors/EmptyData/EmptyData';
import TransNewsSingle from '@/components/TransNewsSingle/TransNewsSingle';
import { getTransNewsForSingleDay } from '@/controllers/satDigest.controller';
import { getDate } from '@/libs/utils/utils';
import { META_TRANS_NEWS_SINGLE } from '@/models/satDigest.model';
import { LANGUAGE, DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { notFound } from 'next/navigation';

const BASE_URL = process.env.BASE_URL;

interface IPageParams {
  params: { date: string };
}

export const generateMetadata = async ({ params: { date } }: IPageParams) => {
  const dateStr = getDate(date);
  const title = META_TRANS_NEWS_SINGLE.getTitle(dateStr);
  const description = META_TRANS_NEWS_SINGLE.getDescription(dateStr);

  return {
    // metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: META_TRANS_NEWS_SINGLE.getKeywords(dateStr),
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

  const dateStr = getDate(date);

  if (!dateStr) notFound();

  if (newsArray instanceof Error)
    return <EmptyData description={newsArray.message} />;

  return (
    <TransNewsSingle
      title={`${META_TRANS_NEWS_SINGLE.getH1()[LANGUAGE]}${dateStr}`}
      newsArray={newsArray}
    />
  );
}
