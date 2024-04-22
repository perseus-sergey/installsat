import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/Images/FillingValidImage';
import SatFinder from '@/components/mapComponents/SatFinder/SatFinder';
import { Title } from '@/components/ui/Title/Title';
import { getSatFinderArticle } from '@/controllers/articles.controller';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import { getFormattedDateStr } from '@/libs/utils';
import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import { EDBTableTitles, LANGUAGE, defaultMetaData } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import { Metadata } from 'next';
import { Suspense } from 'react';
import CommentList from '@/components/comments/CommentList/CommentList';
import { getComments } from '@/controllers/comments.controller';
import { headers } from 'next/headers';

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
// TODO: Add view counter
// =================================================================
export default async function Page() {
  const header = headers();
  const userIP = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];

  const baseUrl = process.env.BASE_URL || '';
  const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

  const groupedSats = await getSatsForForm(false);
  const commentsDbResult = await getComments(
    EDBTableTitles.COMMENTS_ARTICLE,
    dbArticleId
  );

  // const commDbResult = await getComments(id, EDBTableTitles.COMMENTS_CHANNEL);
  const comments = commentsDbResult instanceof Error ? [] : commentsDbResult;

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

        <p>View: {view.toLocaleString('en-US')}</p>
      </article>

      {/* {similarArticles.length ? (
        <SimilarArticles
          similarTitle={simArticlesBefore.title[LANGUAGE]}
          similarArticlesMapped={similarArticles.map((art) => (
            <li key={art.cpu}>
              <Link href={`/${EUrlBaseParam.ARTICLE}/${art.cpu}`}>
                {art.title}
              </Link>
              <span>{` (${getFormattedDateStr(art.date)})`}</span>
            </li>
          ))}
        />
      ) : null} */}

      <CommentList
        comments={comments}
        revalidateUrl={`/${EUrlBaseParam.SAT_FINDER}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
        articleId={dbArticleId}
        articleName={title}
        userIP={userIP}
        baseUrl={baseUrl}
        emailKey={emailKey}
      />
    </>
  );
}
