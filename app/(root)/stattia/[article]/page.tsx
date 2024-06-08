import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { ARTICLES } from '@/models/articles.model';
import { getArticle } from '@/controllers/articles.controller';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import { EUrlBaseParam } from '@/models/url.model';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import Link from 'next/link';
import { LANGUAGE } from '@/models/ui.model';
import { notFound } from 'next/navigation';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

interface IArticleParams {
  params: { article: string };
}

const { h1Image } = ARTICLES.article.images;

const {
  date: dateTitle,
  theme: themeTitle,
  views: viewsTitle,
} = ARTICLES.infoPanelTitles;

export default async function Page({ params: { article } }: IArticleParams) {
  const sqlResult = await getArticle(article);

  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;
  if (!sqlResult) notFound();

  const { title, logo, text, cat_slug, cat_name, date, view } = sqlResult;

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
          alt={`${h1Image.altStart[LANGUAGE]} ${title}`}
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
            value: getFormattedDateStrYearFirst(date),
          },
        ]}
      />
    </>
  );
}
