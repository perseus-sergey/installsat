import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { ARTICLES } from '@/models/articles.model';
import {
  getArticleCatList,
  getChunkOfNews,
  getCurrentCatParams,
} from '@/controllers/articles.controller';
import { getFormattedDateStr } from '@/libs/utils/utils';
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import ArticleList from '@/components/article/ArticleList/ArticleList';
import { notFound } from 'next/navigation';
import Pagination from '@/components/ui/Pagination/Pagination';
import { LANGUAGE, TSearchParams, DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import { imagePathValidate } from '@/libs/utils/imagePathValidate';
import { validSearchParam } from '@/libs/utils/validSearchParam';

const BASE_URL = process.env.BASE_URL;

const {
  articleList: { pagination, images, articlesCountCaption },
} = ARTICLES;

const articleTitleImg = imagePathValidate(
  images.titleImg,
  images.titleImg.alternativeStr.title
);

export const dynamic = 'force-dynamic';

export interface IPageParams {
  params: { cat: string };
  searchParams: TSearchParams;
}

const currDateStr = getFormattedDateStr(new Date());

export const generateMetadata = async ({
  params: { cat },
}: IPageParams): Promise<Metadata> => {
  const { title, description, cpu } = await getCurrentCatParams(cat);

  return {
    title,
    description,
    keywords: description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `${BASE_URL}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${cpu}`,
      publishedTime: getFormattedDateStr(currDateStr),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    cat: string;
  }[]
> {
  const allCatResponse = await getArticleCatList();
  if (allCatResponse instanceof Error) return [{ cat: '' }];

  return allCatResponse.map((cat) => ({ cat: cat.cpu }));
}

export const dynamicParams = false;

export default async function Page({
  params: { cat },
  searchParams,
}: IPageParams) {
  const { id, description, text } = await getCurrentCatParams(cat);

  const { perPage } = pagination;

  const page = validSearchParam(EUrlSearchParam.PAGE, searchParams) || '1';

  const searchQuery = validSearchParam(EUrlSearchParam.ARTICLE, searchParams);

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const allNews = await getChunkOfNews(
    perPage,
    (pageNumber - 1) * perPage,
    id,
    searchQuery
  );

  const mapsCount = !allNews.length ? 0 : allNews[0].total_count;

  const totalPages = Math.ceil(mapsCount / perPage);

  return (
    <>
      <Title>
        {description}

        <FillingValidImage
          image={images.h1Image}
          alternativeImgString={images.h1Image.alternativeStr}
          alt={images.h1Image.alt[LANGUAGE]}
          isBlur
        />
      </Title>

      <TextUnderH1>{text}</TextUnderH1>

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
