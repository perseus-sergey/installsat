import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { EUrlBaseParam } from '@/models/url.model';
import { LANGUAGE as L, DEFAULT_META_DATA } from '@/models/ui.model';
import { getChannelPackages } from '@/controllers/channelList.controller';
import PackageList from '@/components/article/ArticleList/PackageList';
import { META_PACKAGES } from '@/models/channelList.model';

const BASE_URL = process.env.BASE_URL;

const { metaDescription, metaH1, metaKeywords, metaTitle } = META_PACKAGES;

// const articleTitleImg = imagePathValidate(
//   images.titleImg,
//   images.titleImg.alternativeStr.title
// );
//================================================================
// Add static pages
//================================================================
export const metadata: Metadata = {
  title: metaTitle[L],
  description: metaDescription[L],
  keywords: metaKeywords[L],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: metaTitle[L],
    description: metaDescription[L],
    url: `${BASE_URL}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};
export default async function Page() {
  const packages = await getChannelPackages();

  if (packages instanceof Error)
    return <EmptyData description={packages.message} />;

  if (!packages.length) return <EmptyData description={`Couldn't find data`} />;

  return (
    <article className="article">
      <Title>{metaH1[L]}</Title>

      <PackageList packageList={packages} />
    </article>
  );
}
