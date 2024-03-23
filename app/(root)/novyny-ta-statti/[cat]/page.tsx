import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import { getChannelSatList } from '@/controllers/sidebar.controller';
import { META_SAT_CHANNEL_LIST } from '@/models/satChannelList.model';
import type { Metadata } from 'next';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { ARTICLES } from '@/models/articles.model';
import { getChunkOfAllNews } from '@/controllers/acticles.controller';
import { imagePathValidate } from '@/libs/utilsServer';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import FillingImg from '@/components/Images/FillingImage';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils';
import { getSatChannels } from '@/controllers/satChannelList.controller';

export interface ISatChannelListParams {
  params: { cat: string };
}

const satListResponse = await getChannelSatList();

const getCurrentSatParams = (satCpu: string) => {
  const catParams =
    satListResponse instanceof Error
      ? ''
      : satListResponse.find((cat) => cat.cpu === satCpu);

  return catParams
    ? {
        title: catParams.title,
        id: `${catParams.id}`,
        satPosition: catParams.position,
        logo: catParams.logo,
      }
    : { title: '', id: '-1', satPosition: -1, logo: '' };
};

export const generateMetadata = ({
  params,
}: ISatChannelListParams): Metadata => {
  const catParams = getCurrentSatParams(params.cat);
  const satTitle = `${catParams.title} - ${catParams.satPosition}`;

  return {
    title: `${META_SAT_CHANNEL_LIST.getTitle().ua} ${satTitle}`,
    description: `${META_SAT_CHANNEL_LIST.getDescription().ua} ${satTitle}`,
    keywords: `${satTitle} ${META_SAT_CHANNEL_LIST.getKeywords('ua')}`,
  };
};

export async function generateStaticParams(): Promise<
  {
    cat: string;
  }[]
> {
  if (satListResponse instanceof Error) return [{ cat: '' }];

  return satListResponse.map((cat) => ({ cat: cat.cpu }));
}

export const dynamicParams = false;
export default async function SatNewsDatePage({
  params,
}: ISatChannelListParams) {
  const catParams = getCurrentSatParams(params.cat);
  const satChannels = await getSatChannels(catParams.id);

  if (satChannels instanceof Error)
    return <EmptyData description={satChannels.message} />;

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
