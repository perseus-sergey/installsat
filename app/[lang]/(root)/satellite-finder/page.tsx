import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
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
  DEFAULT_LANG,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import { Metadata } from 'next';
import { Suspense } from 'react';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import { getCommentsNumber } from '@/controllers/comments.controller';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { META_CHANNEL } from '@/models/channel.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

export interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
}

const {
  infoPanelTitles: { views: viewsTitle },
} = META_CHANNEL;

const {
  keywords,
  images: { h1Image },
  dbArticleId,
} = SAT_FINDER_META_DATA;

const satFinderArticleDBResult = await getSatFinderArticle();

const { title, description, text, view } =
  satFinderArticleDBResult instanceof Error
    ? { title: '', description: '', text: '', view: 0 }
    : satFinderArticleDBResult[0];

export const generateMetadata = ({ params }: IPageProps): Metadata => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: keywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `/${lang}/${EUrlBaseParam.SAT_FINDER}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${DEFAULT_LANG}/${EUrlBaseParam.SAT_FINDER}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.SAT_FINDER}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.SAT_FINDER}`,
      },
    },
  };
};

export default async function Page({ params }: IPageProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const groupedSats = await getSatsForForm(false);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_ARTICLE,
    dbArticleId
  );

  updateViewCount(EDBTableTitles.ARTICLE, dbArticleId, view);

  return (
    <>
      <BreadCrumbServer breadCrumbList={[title]} lang={lang} />
      <article className="article">
        <Title>
          {title}
          <FillingValidImage
            image={h1Image}
            alternativeImgString={h1Image.alternativeStr}
            alt={h1Image.alt[lang]}
          />
        </Title>

        <div className="article-text">
          <Suspense>
            <SatFinder
              lang={lang}
              searchQueryName={EUrlSearchParam.SAT}
              apiKey={process.env.GOOGLE_MAP_API_KEY || ''}
              mapId={process.env.GOOGLE_MAP_ID || ''}
              groupedSats={groupedSats instanceof Error ? [] : groupedSats}
            />
          </Suspense>
        </div>

        <DangerHtml text={text} />

        <BottomInfoPanel
          items={[{ name: viewsTitle[lang], value: view + 1 }]}
        />
      </article>

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${EUrlBaseParam.SAT_FINDER}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
        articleId={dbArticleId}
        articleName={title}
      />
    </>
  );
}
