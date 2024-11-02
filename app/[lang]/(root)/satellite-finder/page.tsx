import Image from 'next/image';

import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import SatFinder from '@/components/mapComponents/SatFinder/SatFinder';
import { Title } from '@/components/ui/Titles/Title';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { Metadata } from 'next';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
// import { getCommentsNumber } from '@/controllers/comments.controller';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/getLanguage';
import h1Img from 'public/Images/starthere_6100.png';
import SatelliteSelector from '@/components/CustomSelectors/SatelliteSelector';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { ELanguage } from '@/models/language.model';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { getSatFinderArticle } from '@/controllers/satFinder.controller';
import { updateViewCount } from '@/controllers/viewUpdate.controller';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import { INFO_PANEL_TITLES } from '@/models/ui/infoPanel.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

export interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
}

const { LANG, SAT_FINDER } = EUrlBaseParam;

const { views: viewsTitle } = INFO_PANEL_TITLES;

const {
  // keywords,
  images: { h1Image },
  dbArticleId,
} = SAT_FINDER_META_DATA;

export const revalidate = 604800; // 3600 * 24 * 7 invalidate cache every 7 days

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const lang = getELangKey(params[LANG]);

  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  const { title, description, keywords } = await getSatFinderArticle(lang);

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `/${lang}/${SAT_FINDER}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
    alternates: {
      canonical: `/${lang}/${SAT_FINDER}`,
      languages: {
        en: `/${EN}/${SAT_FINDER}`,
        uk: `/${UA}/${SAT_FINDER}`,
        ru: `/${RU}/${SAT_FINDER}`,
        es: `/${ES}/${SAT_FINDER}`,
        ar: `/${AR}/${SAT_FINDER}`,
        de: `/${DE}/${SAT_FINDER}`,
        fr: `/${FR}/${SAT_FINDER}`,
        it: `/${IT}/${SAT_FINDER}`,
      },
    },
  };
};

export default async function Page({ params }: IPageProps) {
  const lang = getELangKey(params[LANG]);

  const { title, text, view } = await getSatFinderArticle(lang);

  const satsForFormFn = () => getSatsForForm(false, lang);

  // const numberOfComments = await getCommentsNumber(
  //   EDBTableTitles.COMMENTS_ARTICLE,
  //   dbArticleId
  // );

  updateViewCount(EDBTableTitles.ARTICLE, dbArticleId, view);

  return (
    <>
      <BreadCrumbServer breadCrumbList={[title]} lang={lang} />

      <ArticleWrapper lang={lang}>
        <Title style={{ padding: '4rem 1rem' }}>
          {title}
          <Image
            src={h1Img}
            alt={h1Image.alt[lang]}
            className="flex-shrink-0"
          />
        </Title>

        <SatFinder
          lang={lang}
          searchQueryName={EUrlSearchParam.SAT}
          apiKey={process.env.GOOGLE_MAP_API_KEY || ''}
          mapId={process.env.GOOGLE_MAP_ID || ''}
          satelliteSelector={
            <SatelliteSelector lang={lang} requestFn={satsForFormFn} />
          }
        />

        <DangerHtml text={text} className="article-text" />

        <BottomInfoPanel
          lang={lang}
          items={[{ name: viewsTitle[lang], value: view + 1 }]}
        />
      </ArticleWrapper>
    </>
  );
}

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${SAT_FINDER}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
//   articleId={dbArticleId}
//   articleName={title}
// />
