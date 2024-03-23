import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import type { Metadata } from 'next';
import { ARTICLES } from '@/models/articles.model';
import { getChunkOfAllNews } from '@/controllers/acticles.controller';
import { getFormattedDateStr } from '@/libs/utils';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import FillingImg from '@/components/Images/FillingImage';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import { imagePathValidate } from '@/libs/utilsServer';
import FillingValidImage from '@/components/Images/FillingValidImage';

export const metadata: Metadata = {
  title: ARTICLES.articleList.meta.getTitle().ua,
  description: ARTICLES.articleList.meta.getDescription().ua,
  keywords: ARTICLES.articleList.meta.getKeywords('ua'),
};
export default async function SatNewsDatePage() {
  const currDate = new Date().toLocaleDateString('en-GB');

  const allNews = await getChunkOfAllNews(20, 0);

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

      <ul>
        {allNews.map(
          ({
            id,
            title,
            description,
            category_title,
            view,
            date,
            comment_count,
            logo,
            cpu,
          }) => (
            <li key={id}>
              <ArticleCard
                articleTitle={
                  <>
                    {typeof articleTitleImg !== 'string' ? (
                      <FillingImg {...articleTitleImg} />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>
                        {articleTitleImg}
                      </span>
                    )}
                    {title}
                  </>
                }
                image={
                  <FillingValidImage
                    image={{
                      ...ARTICLES.article.images.h1Image,
                      src: `${ARTICLES.article.images.h1Image.path}${logo}}`,
                    }}
                    defaultImage={ARTICLES.article.images.h1Image.defaultImg}
                    alternativeImgString={
                      ARTICLES.article.images.h1Image.alternativeStr
                    }
                    alt={ARTICLES.article.images.h1Image.getAlt().ua}
                    isBlur
                  />
                }
                articleDescription={description}
                href={`${ARTICLES.articleList.links.articleLink.path}${cpu}`}
                infoPanelItems={[
                  {
                    name: 'Тема',
                    value: (
                      <Link
                        href={EUrlBaseParam.NEWS_AND_ARTICLES}
                        style={{ textDecoration: 'underline' }}
                      >
                        {category_title}
                      </Link>
                    ), // TODO: href
                  },
                  { name: 'Переглядів', value: view },
                  { name: 'Дата', value: getFormattedDateStr(date) },
                  { name: 'Коментарів', value: comment_count },
                ]}
              />
            </li>
          )
        )}
      </ul>
    </>
  );
}
