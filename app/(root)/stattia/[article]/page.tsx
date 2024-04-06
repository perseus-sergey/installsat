import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { ARTICLES } from '@/models/articles.model';
import { getArticle } from '@/controllers/articles.controller';
import DangerHtml from '@/components/DangerHtml/DangerHtml';
import { getFormattedDateStr } from '@/libs/utils';
import { EUrlBaseParam } from '@/models/url.model';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import Link from 'next/link';
import { LANGUAGE } from '@/models/ui.model';

const { h1Image } = ARTICLES.article.images;

const {
  date: dateTitle,
  theme: themeTitle,
  views: viewsTitle,
} = ARTICLES.infoPanelTitles;
export interface IArticleParams {
  params: { article: string };
}

export default async function Page({ params: { article } }: IArticleParams) {
  const sqlResult = await getArticle(article);
  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;

  const { title, logo, text, cat_slug, cat_name, date, view } = sqlResult[0];

  return (
    <>
      <Title>
        {title}
        <FillingValidImage
          image={{
            ...h1Image,
            src: `${h1Image.path}${logo}`,
          }}
          defaultImage={h1Image.defaultImg}
          alternativeImgString={h1Image.alternativeStr}
          alt={`${h1Image.getAlt()[LANGUAGE]}${title}`}
          isBlur
        />
      </Title>
      <div className="article-text">
        <DangerHtml text={text} />
      </div>
      <BottomInfoPanel
        items={[
          {
            name: themeTitle[LANGUAGE],
            value: (
              <Link href={`/${EUrlBaseParam.NEWS_AND_ARTICLES}/${cat_slug}`}>
                {cat_name}
              </Link>
            ),
          },
          { name: viewsTitle[LANGUAGE], value: view + 1 },
          {
            name: dateTitle[LANGUAGE],
            value: getFormattedDateStr(date),
          },
        ]}
      />
      .
    </>
  );
}
