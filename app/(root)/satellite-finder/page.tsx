import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/Images/FillingValidImage';
import SatFinder from '@/components/mapComponents/SatFinder/SatFinder';
import { Title } from '@/components/ui/Title/Title';
import {
  getSatFinderArticle,
  updateViewCount,
} from '@/controllers/articles.controller';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import { getFormattedDateStr } from '@/libs/utils';
import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import { EDBTableTitles, LANGUAGE, defaultMetaData } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import { Metadata } from 'next';
import { Suspense } from 'react';
import CommentList from '@/components/comments/CommentList/CommentList';
import { getComments } from '@/controllers/comments.controller';
import { getUserIP } from '@/libs/utilsServer';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';

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
  title: title,
  description: description,
  keywords: keywords[LANGUAGE],
  openGraph: {
    ...defaultMetaData.openGraph,
    title: title,
    description: description,
    url: `${BASE_URL}/${EUrlBaseParam.SAT_FINDER}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};

export default async function Page() {
  const userIP = getUserIP();

  const groupedSats = await getSatsForForm(false);
  const commentsDbResult = await getComments(
    EDBTableTitles.COMMENTS_ARTICLE,
    dbArticleId
  );
  const comments = commentsDbResult instanceof Error ? [] : commentsDbResult;

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

      <CommentList
        comments={comments}
        revalidateUrl={`/${EUrlBaseParam.SAT_FINDER}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
        articleId={dbArticleId}
        articleName={title}
        userIP={userIP}
        baseUrl={process.env.BASE_URL || ''}
        emailKey={process.env.MAIL_ENCRYPT_KEY || ''}
      />
    </>
  );
}
