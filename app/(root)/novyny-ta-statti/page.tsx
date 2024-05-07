import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { ARTICLES } from '@/models/articles.model';
import { getChunkOfNews } from '@/controllers/articles.controller';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import ArticleList from '@/components/article/ArticleList/ArticleList';
import Pagination from '@/components/ui/Pagination/Pagination';
import { notFound } from 'next/navigation';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import {
  LANGUAGE as L,
  LANGUAGE,
  TSearchParams,
  DEFAULT_META_DATA,
} from '@/models/ui.model';
import { imagePathValidate } from '@/libs/utils/imagePathValidate';
import { validSearchParam } from '@/libs/utils/validSearchParam';

const BASE_URL = process.env.BASE_URL;

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
    ...DEFAULT_META_DATA.openGraph,
    title: meta.getTitle()[L],
    description: meta.getDescription()[L],
    url: `${BASE_URL}/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};
export default async function Page({ searchParams }: IProps) {
  const { perPage } = pagination;

  const page = validSearchParam(EUrlSearchParam.PAGE, searchParams) || '1';

  const searchQuery = validSearchParam(EUrlSearchParam.ARTICLE, searchParams);

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const allNews = await getChunkOfNews(
    perPage,
    (pageNumber - 1) * perPage,
    undefined,
    searchQuery
  );

  const mapsCount = !allNews.length ? 0 : allNews[0].total_count;

  const totalPages = Math.ceil(mapsCount / perPage);

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

      <p className="text-blue-600 font-bold text-center text-lg">{`${articlesCountCaption[LANGUAGE]}${mapsCount}`}</p>

      <Pagination
        page={pageNumber || 1}
        offsetNumber={pagination.offsetNumber}
        totalPages={totalPages}
        searchParams={searchParams}
      />

      <ArticleList articleList={allNews} articleTitleImg={articleTitleImg} />
    </>
  );
}
