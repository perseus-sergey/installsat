import { Title } from '@/components/Title/Title';
import { ISatChannelListParams } from './layout';

// export const generateMetadata = async ({
//   params: { sat },
// }: ISatChannelListParams) => {
//   const dateStr = getDate(sat);

//   return {
//     // metadataBase: new URL(SITE_BASE_URL),
//     title: META_TRANS_NEWS_SINGLE.getTitle(dateStr),
//     description: META_TRANS_NEWS_SINGLE.getDescription(dateStr),
//     keywords: META_TRANS_NEWS_SINGLE.getKeywords(dateStr),
//   };
// };

export default async function SatNewsDatePage({
  params,
}: ISatChannelListParams) {
  // const dateStr = getDate(params.sat);

  // if (!dateStr) notFound();

  // const newsArray = await getTransNewsForSingleDay(params.sat, singleDaySql);
  // if (newsArray instanceof Error)
  //   return <EmptyData description={newsArray.message} />;

  return <Title>{params.sat}</Title>;
}
