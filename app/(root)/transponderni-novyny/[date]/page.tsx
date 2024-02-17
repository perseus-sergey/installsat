import TransNewsSingle from '@/components/TransNewsSingle/TransNewsSingle';
import {
  getTransNewsForSingleDay,
  singleDaySql,
} from '@/controllers/satDigest.controller';
import { META_TRANS_NEWS_SINGLE } from '@/models/meta.model';

interface ISatNewsDatePageParams {
  params: { date: string };
}

export const generateMetadata = async ({
  params: { date },
}: ISatNewsDatePageParams) => ({
  // metadataBase: new URL(SITE_BASE_URL),
  title: META_TRANS_NEWS_SINGLE.getTitle(date),
  description: META_TRANS_NEWS_SINGLE.getDescription(date),
  keywords: META_TRANS_NEWS_SINGLE.getKeywords(date),
});

export default async function SatNewsDatePage({
  params,
}: ISatNewsDatePageParams) {
  const newsArray = await getTransNewsForSingleDay(params.date, singleDaySql);

  return (
    <TransNewsSingle
      title={META_TRANS_NEWS_SINGLE.getH1(params.date)}
      newsArray={newsArray}
    />
  );
}
