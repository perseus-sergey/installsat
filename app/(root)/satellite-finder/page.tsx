import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/Images/FillingValidImage';
import SatFinder from '@/components/mapComponents/SatFinder/SatFinder';
import { Title } from '@/components/ui/Title/Title';
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

const { BASE_URL } = process.env;

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
    publishedTime: getFormattedDateStr(new Date()),
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
        baseUrl={process.env.BASE_URL || ''}
        emailKey={process.env.MAIL_ENCRYPT_KEY || ''}
      />
    </>
  );
}
