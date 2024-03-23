import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import type { Metadata } from 'next';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { ARTICLES, ISingleCatArticlesModel } from '@/models/articles.model';
import {
  getArticleCatList,
  getChunkOfNews,
} from '@/controllers/articles.controller';
import { imagePathValidate } from '@/libs/utilsServer';
import { getFormattedDateStr } from '@/libs/utils';
import { cache } from 'react';
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import ArticleList from '@/components/ArticleList/ArticleList';

export interface ISatChannelListParams {
  params: { cat: string };
}

const currDateStr = getFormattedDateStr(new Date());

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
  params: { cat },
}: ISatChannelListParams): Metadata => {
  const { title, description } = getCurrentCatParams(cat);

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
export default async function SatNewsDatePage({
  params: { cat },
}: ISatChannelListParams) {
  const { id, description, text } = getCurrentCatParams(cat);

  const allNews = await getChunkOfNews(20, 0, id);

  if (allNews instanceof Error)
    return <EmptyData description={allNews.message} />;

  const articleTitleImg = imagePathValidate(
    ARTICLES.articleList.images.titleImg,
    ARTICLES.articleList.images.titleImg.alternativeStr.title
  );

  return (
    <>
      <Title style={{ borderBottom: '2px groove' }}>
        {ARTICLES.articleSingleCatList.meta.getH1(currDateStr, description).ua}
        <FillingValidImage
          image={ARTICLES.articleList.images.h1Image}
          alternativeImgString={
            ARTICLES.articleList.images.h1Image.alternativeStr
          }
          alt={ARTICLES.articleList.images.h1Image.alt.ua}
          isBlur
        />
      </Title>

      <TextUnderH1>{text}</TextUnderH1>

      <ArticleList articleList={allNews} articleTitleImg={articleTitleImg} />
    </>
  );
}
