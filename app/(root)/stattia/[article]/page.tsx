import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import type { Metadata } from 'next';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { ARTICLES, ISingleCatArticlesModel } from '@/models/articles.model';
import {
  getArticle,
  getArticleCatList,
} from '@/controllers/articles.controller';
import { cache } from 'react';
import DangerHtml from '@/components/DangerHtml/DangerHtml';

// export const dynamic = 'force-dynamic';

export interface ISatChannelListParams {
  params: { article: string };
}

const allCatResponse = await getArticleCatList();

const getCurrentCatParams = cache((catCpu: string): ISingleCatArticlesModel => {
  const catParams =
    allCatResponse instanceof Error
      ? ''
      : allCatResponse.find((cat) => cat.cpu === catCpu);

  return catParams
    ? {
        title: catParams.title,
        id: catParams.id,
        cpu: catParams.cpu,
        description: catParams.description,
        text: catParams.text,
      }
    : { title: '', description: '', id: -1, cpu: '', text: '' };
});

export const generateMetadata = ({
  params: { article },
}: ISatChannelListParams): Metadata => {
  const { title, description } = getCurrentCatParams(article);

  return {
    title,
    description,
    keywords: description,
  };
};

export async function generateStaticParams(): Promise<
  {
    cat: string;
  }[]
> {
  if (allCatResponse instanceof Error) return [{ cat: '' }];

  return allCatResponse.map((cat) => ({ cat: cat.cpu }));
}

export const dynamicParams = false;
export default async function Page({
  params: { article },
}: ISatChannelListParams) {
  // const { id, description, text } = getCurrentCatParams(article);

  const sqlResult = await getArticle(article);
  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;

  const articleResult = sqlResult[0];
  // const articleTitleImg = imagePathValidate(
  //   ARTICLES.articleList.images.titleImg,
  //   ARTICLES.articleList.images.titleImg.alternativeStr.title
  // );
  const { h1Image } = ARTICLES.article.images;

  return (
    <>
      <Title style={{ borderBottom: '2px groove' }}>
        {articleResult.title}
        <FillingValidImage
          image={{
            ...h1Image,
            src: `${h1Image.path}${articleResult.logo}`,
          }}
          defaultImage={h1Image.defaultImg}
          alternativeImgString={h1Image.alternativeStr}
          alt={`${h1Image.getAlt().ua}${articleResult.title}`}
          isBlur
        />
      </Title>

      <DangerHtml text={articleResult.text} />
    </>
  );
}
