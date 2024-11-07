import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { getChannelPackages } from '@/controllers/channelList.controller';
import PackageList from '@/components/article/ArticleList/PackageList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/getLanguage';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { META_PACKAGES } from '@/models/channels/packageChannelListMeta.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

export interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
}

const { metaDescription, metaH1, metaKeywords, metaTitle } = META_PACKAGES;

const { LANG, PACKAGE_CHANNEL_LIST } = EUrlBaseParam;

export const revalidate = 86400; // 3600 * 24 invalidate cache every 1 day

export const generateMetadata = ({ params }: IPageProps): Metadata => {
  const lang = getELangKey(params[LANG]);

  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle[lang],
      description: metaDescription[lang],
      url: `/${lang}/${PACKAGE_CHANNEL_LIST}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
    alternates: {
      canonical: `/${lang}/${PACKAGE_CHANNEL_LIST}`,
      languages: {
        en: `/${EN}/${PACKAGE_CHANNEL_LIST}`,
        uk: `/${UA}/${PACKAGE_CHANNEL_LIST}`,
        ru: `/${RU}/${PACKAGE_CHANNEL_LIST}`,
        es: `/${ES}/${PACKAGE_CHANNEL_LIST}`,
        ar: `/${AR}/${PACKAGE_CHANNEL_LIST}`,
        de: `/${DE}/${PACKAGE_CHANNEL_LIST}`,
        fr: `/${FR}/${PACKAGE_CHANNEL_LIST}`,
        it: `/${IT}/${PACKAGE_CHANNEL_LIST}`,
      },
    },
  };
};
export default async function Page({ params }: IPageProps) {
  const lang = getELangKey(params[LANG]);
  const packages = await getChannelPackages(lang);

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
