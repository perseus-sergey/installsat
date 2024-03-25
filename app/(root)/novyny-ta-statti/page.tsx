import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import type { Metadata } from 'next';
import { ARTICLES } from '@/models/articles.model';
import { getChunkOfNews } from '@/controllers/articles.controller';
import { imagePathValidate } from '@/libs/utilsServer';
import FillingValidImage from '@/components/Images/FillingValidImage';
import ArticleList from '@/components/ArticleList/ArticleList';
import Pagination from '@/components/Pagination/Pagination';
import { notFound } from 'next/navigation';

interface IProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: ARTICLES.articleList.meta.getTitle().ua,
  description: ARTICLES.articleList.meta.getDescription().ua,
  keywords: ARTICLES.articleList.meta.getKeywords('ua'),
};
export default async function SatNewsDatePage({ searchParams }: IProps) {
  const page = parseInt(`${searchParams.page}`, 10);
  if (isNaN(page)) notFound();

  const perPage = ARTICLES.articleList.pagination.perPage;
  const start = page * perPage;

  const allNews = await getChunkOfNews(perPage, start);
  if (allNews instanceof Error)
    return <EmptyData description={allNews.message} />;

  if (!allNews.length) return <EmptyData description={`Couldn't find data`} />;

  const totalPages = Math.ceil(allNews[0].total_count / perPage);

  if (page > totalPages) notFound();

  const currDate = new Date().toLocaleDateString('en-GB');

  const articleTitleImg = imagePathValidate(
    ARTICLES.articleList.images.titleImg,
    ARTICLES.articleList.images.titleImg.alternativeStr.title
  );

  return (
    <>
      <Title style={{ borderBottom: '2px groove' }}>
        {ARTICLES.articleList.meta.getH1(currDate).ua}
        <FillingValidImage
          image={ARTICLES.articleList.images.h1Image}
          alternativeImgString={
            ARTICLES.articleList.images.h1Image.alternativeStr
          }
          alt={ARTICLES.articleList.images.h1Image.alt.ua}
          isBlur
        />
      </Title>

      <Pagination
        page={page || 1}
        offsetNumber={ARTICLES.articleList.pagination.offsetNumber}
        totalPages={totalPages}
      />

      <ArticleList articleList={allNews} articleTitleImg={articleTitleImg} />
    </>
  );
}
