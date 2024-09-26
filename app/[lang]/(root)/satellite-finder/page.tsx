import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import SatFinder from '@/components/mapComponents/SatFinder/SatFinder';
import { Title } from '@/components/ui/Titles/Title';
import {
  getSatFinderArticle,
  updateViewCount,
} from '@/controllers/articles.controller';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import {
  EDBTableTitles,
  DEFAULT_META_DATA,
  ELanguage,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import { Metadata } from 'next';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
// import { getCommentsNumber } from '@/controllers/comments.controller';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';
import h1Img from 'public/Images/starthere_6100.png';
import Image from 'next/image';
import { INFO_PANEL_TITLES } from '@/models/articles.model';
import SatelliteSelector from '@/components/CustomSelectors/SatelliteSelector';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

export interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
}

const { views: viewsTitle } = INFO_PANEL_TITLES;

const {
  // keywords,
  images: { h1Image },
  dbArticleId,
} = SAT_FINDER_META_DATA;

const satFinderArticleDBResult = await getSatFinderArticle();

const {
  title,
  description,
  text,
  view,
  title_en,
  description_en,
  keywords,
  keywords_en,
  text_en,
} =
  satFinderArticleDBResult instanceof Error
    ? {
        title: '',
        description: '',
        text: '',
        view: 0,
        title_en: '',
        description_en: '',
        keywords: '',
        keywords_en: '',
        text_en: '',
      }
    : satFinderArticleDBResult[0];

export const revalidate = 604800; // 3600 * 24 * 7 invalidate cache every 7 days

export const generateMetadata = ({ params }: IPageProps): Metadata => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const t = lang === ELanguage.UA ? title : title_en;
  const d = lang === ELanguage.UA ? description : description_en;

  return {
    metadataBase: new URL(BASE_URL),
    title: t,
    description: d,
    keywords: lang === ELanguage.UA ? keywords : keywords_en,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: t,
      description: d,
      url: `/${lang}/${EUrlBaseParam.SAT_FINDER}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}/${EUrlBaseParam.SAT_FINDER}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.SAT_FINDER}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.SAT_FINDER}`,
      },
    },
  };
};

export default async function Page({ params }: IPageProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const titleLang = lang === ELanguage.UA ? title : title_en || title;

  const satsForFormFn = () => getSatsForForm(false, lang);

  // const numberOfComments = await getCommentsNumber(
  //   EDBTableTitles.COMMENTS_ARTICLE,
  //   dbArticleId
  // );

  updateViewCount(EDBTableTitles.ARTICLE, dbArticleId, view);

  return (
    <>
      <BreadCrumbServer breadCrumbList={[titleLang]} lang={lang} />
      <article className="article">
        <Title style={{ padding: '4rem 1rem' }}>
          {titleLang}
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

        <DangerHtml
          text={lang === ELanguage.UA ? text : text_en}
          className="article-text"
        />

        <BottomInfoPanel
          items={[{ name: viewsTitle[lang], value: view + 1 }]}
        />
      </article>
    </>
  );
}

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${EUrlBaseParam.SAT_FINDER}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
//   articleId={dbArticleId}
//   articleName={titleLang}
// />
