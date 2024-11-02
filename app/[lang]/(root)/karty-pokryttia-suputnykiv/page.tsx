import Image from 'next/image';

import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import MapList from '@/components/article/ArticleList/MapList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/getLanguage';
import h1Img from 'public/Images/articles/signal-satellite.png';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { META_ALL_SAT_MAPS_MODEL } from '@/models/mapCoverage.model';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { getSatMapList } from '@/controllers/mapCoverage.controller';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  metaDescription,
  metaKeywords,
  metaTitle,
  images: { h1ImageAlt },
} = META_ALL_SAT_MAPS_MODEL;

interface IProps {
  params: { [key in EUrlBaseParam]: string };
}

const { LANG, SAT_COVERAGE_MAP } = EUrlBaseParam;

export const revalidate = 604800; // 3600 * 24 * 7 invalidate cache every 7 days

export const generateMetadata = ({ params }: IProps): Metadata => {
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
      url: `/${lang}/${SAT_COVERAGE_MAP}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
    alternates: {
      canonical: `/${lang}/${SAT_COVERAGE_MAP}`,
      languages: {
        en: `/${EN}/${SAT_COVERAGE_MAP}`,
        uk: `/${UA}/${SAT_COVERAGE_MAP}`,
        ru: `/${RU}/${SAT_COVERAGE_MAP}`,
        es: `/${ES}/${SAT_COVERAGE_MAP}`,
        ar: `/${AR}/${SAT_COVERAGE_MAP}`,
        de: `/${DE}/${SAT_COVERAGE_MAP}`,
        fr: `/${FR}/${SAT_COVERAGE_MAP}`,
        it: `/${IT}/${SAT_COVERAGE_MAP}`,
      },
    },
  };
};

export default async function Page({ params }: IProps) {
  const lang = getELangKey(params[LANG]);

  const allMaps = await getSatMapList();

  return (
    <>
      <BreadCrumbServer breadCrumbList={[metaDescription[lang]]} lang={lang} />
      <ArticleWrapper lang={lang}>
        <Title>
          {metaDescription[lang]}

          <Image src={h1Img} alt={h1ImageAlt[lang]} className="flex-shrink-0" />
        </Title>

        <MapList lang={lang} articleList={allMaps} />
      </ArticleWrapper>
    </>
  );
}
