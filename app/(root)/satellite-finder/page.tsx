import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import SatFinder from '@/components/mapComponents/SatFinder/SatFinder';
import { Title } from '@/components/ui/Titles/Title';
import {
  getSatFinderArticle,
  updateViewCount,
} from '@/controllers/articles.controller';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import { EDBTableTitles, LANGUAGE, DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import { Metadata } from 'next';
import { Suspense } from 'react';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import { getCommentsNumber } from '@/controllers/comments.controller';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';

const BASE_URL = process.env.BASE_URL;

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

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL || ''),
  title,
  description,
  keywords: keywords[LANGUAGE],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title,
    description,
    url: `${BASE_URL}/${EUrlBaseParam.SAT_FINDER}`,
    publishedTime: getFormattedDateStr(),
  },
};

export default async function Page() {
  const groupedSats = await getSatsForForm(false);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_ARTICLE,
    dbArticleId
  );

  updateViewCount(EDBTableTitles.ARTICLE, dbArticleId, view);

  return (
    <>
      <BreadCrumbServer breadCrumbList={[title]} />
      <article className="article">
        <Title>
          {title}
          <FillingValidImage
            image={h1Image}
            alternativeImgString={h1Image.alternativeStr}
            alt={h1Image.alt[LANGUAGE]}
          />
        </Title>

        <div className="article-text">
          <Suspense>
            <SatFinder
              searchQueryName={EUrlSearchParam.SAT}
              apiKey={process.env.GOOGLE_MAP_API_KEY || ''}
              mapId={process.env.GOOGLE_MAP_ID || ''}
              groupedSats={groupedSats instanceof Error ? [] : groupedSats}
            />
          </Suspense>
        </div>

        <DangerHtml text={text} />

        <BottomInfoPanel
          items={[{ name: 'View', value: view.toLocaleString('en-US') }]}
        />
      </article>

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.SAT_FINDER}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
        articleId={dbArticleId}
        articleName={title}
      />
    </>
  );
}
