import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import type { Metadata } from 'next';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { ARTICLES } from '@/models/articles.model';
import {
  getArticle,
  getArticleSlugList,
} from '@/controllers/articles.controller';
import DangerHtml from '@/components/DangerHtml/DangerHtml';
import { defaultMetaData } from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import Link from 'next/link';

// export const dynamic = 'force-dynamic';

export interface ISatChannelListParams {
  params: { article: string };
}

const articleSlugList = await getArticleSlugList();

// const getCurrentCatParams = cache((catCpu: string): ISingleCatArticlesModel => {
//   const catParams =
//     articleSlugList instanceof Error
//       ? ''
//       : articleSlugList.find((cat) => cat.cpu === catCpu);

//   return catParams
//     ? {
//         title: catParams.title,
//         id: catParams.id,
//         cpu: catParams.cpu,
//         description: catParams.description,
//         text: catParams.text,
//       }
//     : { title: '', description: '', id: -1, cpu: '', text: '' };
// });

export const generateMetadata = async ({
  params: { article },
}: ISatChannelListParams): Promise<Metadata> => {
  const sqlResult = await getArticle(article);
  if (sqlResult instanceof Error) return defaultMetaData.ua;

  const { title, description, date, slug } = sqlResult[0];

  return {
    title,
    description,
    keywords: description,
    openGraph: {
      ...defaultMetaData.openGraph,
      title,
      description,
      url: SITE_BASE_URL + EUrlBaseParam.ARTICLE + slug,
      publishedTime: getFormattedDateStr(date),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    article: string;
  }[]
> {
  if (articleSlugList instanceof Error) return [{ article: '' }];

  return articleSlugList.map((article) => ({ article: article.cpu }));
}

export const dynamicParams = false;
export default async function Page({
  params: { article },
}: ISatChannelListParams) {
  // const { id, description, text } = getCurrentCatParams(article);

  const sqlResult = await getArticle(article);
  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;

  const { title, logo, text, cat_slug, cat_name, date, view } = sqlResult[0];

  const { h1Image } = ARTICLES.article.images;

  const {
    date: dateTitle,
    theme: themeTitle,
    views: viewsTitle,
  } = ARTICLES.infoPanelTitles;

  return (
    <>
      <Title style={{ borderBottom: '2px groove' }}>
        {title}
        <FillingValidImage
          image={{
            ...h1Image,
            src: `${h1Image.path}${logo}`,
          }}
          defaultImage={h1Image.defaultImg}
          alternativeImgString={h1Image.alternativeStr}
          alt={`${h1Image.getAlt().ua}${title}`}
          isBlur
        />
      </Title>

      <DangerHtml text={text} />

      <BottomInfoPanel
        items={[
          {
            name: themeTitle.ua,
            value: (
              <Link
                href={`/${EUrlBaseParam.NEWS_AND_ARTICLES}/${cat_slug}`}
                style={{ textDecoration: 'underline' }}
              >
                {cat_name}
              </Link>
            ),
          },
          { name: viewsTitle.ua, value: view },
          { name: dateTitle.ua, value: getFormattedDateStr(date) },
        ]}
      />
    </>
  );
}
