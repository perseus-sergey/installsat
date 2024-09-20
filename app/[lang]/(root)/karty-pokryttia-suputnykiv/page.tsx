import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { getSatMapList } from '@/controllers/articles.controller';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { DEFAULT_META_DATA, ELanguage } from '@/models/ui.model';
import MapList from '@/components/article/ArticleList/MapList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { META_ALL_SAT_MAPS_MODEL } from '@/models/articles.model';
import Image from 'next/image';
import h1Img from 'public/Images/articles/signal-satellite.png';

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

export const revalidate = 3600 * 24 * 7; // invalidate cache every 7 days

export const generateMetadata = ({ params }: IProps): Metadata => {
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
      url: `/${lang}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
      },
    },
  };
};

export default async function Page({ params }: IProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const allMaps = await getSatMapList();

  return (
    <>
      <BreadCrumbServer breadCrumbList={[metaDescription[lang]]} lang={lang} />
      <article className="article">
        <Title>
          {metaDescription[lang]}

          <Image src={h1Img} alt={h1ImageAlt[lang]} className="flex-shrink-0" />
        </Title>

        <MapList lang={lang} articleList={allMaps} />
      </article>
    </>
  );
}
