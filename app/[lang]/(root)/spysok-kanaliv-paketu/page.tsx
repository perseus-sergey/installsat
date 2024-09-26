import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { DEFAULT_META_DATA, ELanguage } from '@/models/ui.model';
import { getChannelPackages } from '@/controllers/channelList.controller';
import PackageList from '@/components/article/ArticleList/PackageList';
import { META_PACKAGES } from '@/models/channelList.model';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';
import ArticleWrapper from '@/components/article/ArticleWrapper';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

export interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
}

const { metaDescription, metaH1, metaKeywords, metaTitle } = META_PACKAGES;

export const revalidate = 86400; // 3600 * 24 invalidate cache every 1 day

export const generateMetadata = ({ params }: IPageProps): Metadata => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle[lang],
      description: metaDescription[lang],
      url: `/${lang}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
      },
    },
  };
};
export default async function Page({ params }: IPageProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const packages = await getChannelPackages();

  return (
    <>
      <BreadCrumbServer breadCrumbList={[metaH1[lang]]} lang={lang} />
      <ArticleWrapper lang={lang}>
        <Title>{metaH1[lang]}</Title>

        <PackageList lang={lang} packageList={packages} />
      </ArticleWrapper>
    </>
  );
}
