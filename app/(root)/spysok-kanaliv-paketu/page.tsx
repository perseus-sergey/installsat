import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { EUrlBaseParam } from '@/models/url.model';
import { LANGUAGE as L, DEFAULT_META_DATA } from '@/models/ui.model';
import { getChannelPackages } from '@/controllers/channelList.controller';
import PackageList from '@/components/article/ArticleList/PackageList';
import { META_PACKAGES } from '@/models/channelList.model';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

const BASE_URL = process.env.BASE_URL;

const { metaDescription, metaH1, metaKeywords, metaTitle } = META_PACKAGES;

export const metadata: Metadata = {
  title: metaTitle[L],
  description: metaDescription[L],
  keywords: metaKeywords[L],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: metaTitle[L],
    description: metaDescription[L],
    url: `${BASE_URL}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
    publishedTime: getFormattedDateStrYearFirst(),
  },
};
export default async function Page() {
  const packages = await getChannelPackages();

  return (
    <>
      <BreadCrumbServer />
      <article className="article">
        <Title>{metaH1[L]}</Title>

        <PackageList packageList={packages instanceof Error ? [] : packages} />
      </article>
    </>
  );
}
