import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Title/Title';
import type { Metadata } from 'next';
import { ARTICLES } from '@/models/articles.model';
import { getChunkOfNews } from '@/controllers/articles.controller';
import { imagePathValidate } from '@/libs/utilsServer';
import FillingValidImage from '@/components/Images/FillingValidImage';
import ArticleList from '@/components/article/ArticleList/ArticleList';
import Pagination from '@/components/Pagination/Pagination';
import { notFound } from 'next/navigation';
import { getFormattedDateStr } from '@/libs/utils';
import {
  EUrlBaseParam,
  EUrlSearchParam,
  SITE_BASE_URL,
} from '@/models/url.model';
import {
  LANGUAGE as L,
  LANGUAGE,
  TSearchParams,
  defaultMetaData,
} from '@/models/ui.model';

const { meta, pagination, images, articlesCountCaption } = ARTICLES.articleList;

const currDate = new Date().toLocaleDateString('en-GB');

const articleTitleImg = imagePathValidate(
  images.titleImg,
  images.titleImg.alternativeStr.title
);

export const dynamic = 'force-dynamic';

interface IProps {
  searchParams: TSearchParams;
}

export const metadata: Metadata = {
  title: meta.getTitle()[L],
  description: meta.getDescription()[L],
  keywords: meta.getKeywords(L),
  openGraph: {
    ...defaultMetaData.openGraph,
    title: meta.getTitle()[L],
    description: meta.getDescription()[L],
    url: `${SITE_BASE_URL}/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};
export default async function Page({ searchParams }: IProps) {
  const { perPage } = pagination;

  const page =
    searchParams?.[EUrlSearchParam.PAGE] &&
    typeof searchParams[EUrlSearchParam.PAGE] === 'string'
      ? searchParams[EUrlSearchParam.PAGE]
      : '1';

  const searchQuery =
    searchParams?.[EUrlSearchParam.ARTICLE] &&
    typeof searchParams[EUrlSearchParam.ARTICLE] === 'string'
      ? searchParams[EUrlSearchParam.ARTICLE]
      : '';

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const allNews = await getChunkOfNews(
    perPage,
    (pageNumber - 1) * perPage,
    undefined,
    searchQuery
  );
  if (allNews instanceof Error)
    return <EmptyData description={allNews.message} />;

  if (!allNews.length) return <EmptyData description={`Couldn't find data`} />;
  const totalPages = Math.ceil(allNews[0].total_count / perPage);

  return (
    <>
      <Title>
        {meta.getH1(currDate)[L]}

        <FillingValidImage
          image={images.h1Image}
          alternativeImgString={images.h1Image.alternativeStr}
          alt={images.h1Image.alt[L]}
          isBlur
        />
      </Title>

      <p className="text-blue-600 font-bold text-center text-lg">{`${articlesCountCaption[LANGUAGE]}${allNews[0].total_count}`}</p>

      {totalPages > 1 && (
        <Pagination
          page={pageNumber || 1}
          offsetNumber={pagination.offsetNumber}
          totalPages={totalPages}
          searchParams={searchParams}
        />
      )}

      <ArticleList articleList={allNews} articleTitleImg={articleTitleImg} />
    </>
  );
}
