import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import type { Metadata } from 'next';
import { ARTICLES } from '@/models/articles.model';
import { getChunkOfNews } from '@/controllers/articles.controller';
import { imagePathValidate } from '@/libs/utilsServer';
import FillingValidImage from '@/components/Images/FillingValidImage';
import ArticleList from '@/components/ArticleList/ArticleList';

export const metadata: Metadata = {
  title: ARTICLES.articleList.meta.getTitle().ua,
  description: ARTICLES.articleList.meta.getDescription().ua,
  keywords: ARTICLES.articleList.meta.getKeywords('ua'),
};
export default async function SatNewsDatePage() {
  const currDate = new Date().toLocaleDateString('en-GB');

  const allNews = await getChunkOfNews(20, 0);

  if (allNews instanceof Error)
    return <EmptyData description={allNews.message} />;

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

      <ArticleList articleList={allNews} articleTitleImg={articleTitleImg} />
    </>
  );
}
