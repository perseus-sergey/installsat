import DangerHtml from '@/components/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { Title } from '@/components/Title/Title';
import { getSatFinderArticle } from '@/controllers/articles.controller';
import { getFormattedDateStr } from '@/libs/utils';
import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import { LANGUAGE, TSearchParams, defaultMetaData } from '@/models/ui.model';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';
import { Metadata } from 'next';

interface IPageProps {
  searchParams: TSearchParams;
}

const {
  keywords,
  images: { h1Image },
} = SAT_FINDER_META_DATA;

const satFinderArticleDBResult = await getSatFinderArticle();
const articleData =
  satFinderArticleDBResult instanceof Error
    ? { title: '', description: '', text: '', logo: '', view: 0 }
    : satFinderArticleDBResult[0];

// const satListResults = await getChannelSatList(false);
// const satList = satListResults instanceof Error ? [] : satListResults;
// const { title, position, id, cpu, logo } = satList[0];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: articleData.title,
  description: articleData.description,
  keywords: keywords[LANGUAGE],
  openGraph: {
    ...defaultMetaData.openGraph,
    title: articleData.title,
    description: articleData.description,
    url: `${SITE_BASE_URL}/${EUrlBaseParam.SAT_FINDER}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};

export default async function Page({ searchParams }: IPageProps) {
  console.log('🚀 ~ Page ~ searchParams:', searchParams);
  // searchParams?.[EUrlSearchParam.SAT]

  //   const urlSearchParams = makeUrlSearchParams(searchParams);

  // const setUrlSearchParamsStr = (value: string | number): string => {
  //   urlSearchParams.set(EUrlSearchParam.PAGE, `${value}`);

  //   return `?${urlSearchParams.toString()}`;
  // };

  // const firstPage = setUrlSearchParamsStr('1');

  // const commDbResult = await getComments(id, EDBTableTitles.COMMENTS_CHANNEL);
  // const comments = commDbResult instanceof Error ? [] : commDbResult;

  return (
    <>
      <article className="article">
        <Title>
          {articleData.title}
          <FillingValidImage
            image={h1Image}
            alternativeImgString={h1Image.alternativeStr}
            alt={h1Image.alt[LANGUAGE]}
          />
        </Title>

        <div className="article-text">
          <DangerHtml text={articleData.text} />
        </div>

        <p>View: {articleData.view.toLocaleString('en-US')}</p>
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
    </>
  );
}
