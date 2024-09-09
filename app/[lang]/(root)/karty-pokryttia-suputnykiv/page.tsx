import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { SAT_MAPS_MODEL } from '@/models/articles.model';
import { getSatMapList } from '@/controllers/articles.controller';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { DEFAULT_META_DATA, DEFAULT_LANG, ELanguage } from '@/models/ui.model';
import FillingImg from '@/components/ui/Images/FillingImage';
import MapList from '@/components/article/ArticleList/MapList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

// export const dynamic = 'force-dynamic';

const {
  metaAllMaps: { metaDescription, metaKeywords, metaTitle },
  images: { allMaps: allMapsImg },
} = SAT_MAPS_MODEL;

interface IProps {
  params: { [key in EUrlBaseParam]: string };
}

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
      canonical: `/${DEFAULT_LANG}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
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

          <FillingImg
            width={allMapsImg.h1Image.width}
            height={allMapsImg.h1Image.height}
            src={allMapsImg.h1Image.src}
            alt={allMapsImg.h1Image.alt[lang]}
            isBlur
          />
        </Title>

        <MapList lang={lang} articleList={allMaps} />
      </article>
    </>
  );
}
