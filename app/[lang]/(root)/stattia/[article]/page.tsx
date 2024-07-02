import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { ARTICLES } from '@/models/articles.model';
import {
  getArticle,
  getSimilarArticles,
  updateViewCount,
} from '@/controllers/articles.controller';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import { EUrlAdminParam, EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import Link from 'next/link';
import {
  DEFAULT_LANG,
  DEFAULT_META_DATA,
  EDBTableTitles,
  ELanguage,
  SIMILAR_ARTICLES,
} from '@/models/ui.model';
import { notFound } from 'next/navigation';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { Metadata } from 'next';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { getCommentsNumber } from '@/controllers/comments.controller';
import EditLinkButton from '@/components/admin/EditLinkButton/EditLinkButton';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';

const { h1Image } = ARTICLES.article.images;

const BASE_URL = process.env.BASE_URL || MAIN_URL;
const { ARTICLE_PARAM, ARTICLE, LANG, NEWS_AND_ARTICLES } = EUrlBaseParam;
const {
  date: dateTitle,
  theme: themeTitle,
  views: viewsTitle,
} = ARTICLES.infoPanelTitles;

interface IArticleParams {
  params: { [key in EUrlBaseParam]: string };
}

export const generateMetadata = async ({
  params,
}: IArticleParams): Promise<Metadata> => {
  const article = params[ARTICLE_PARAM];
  const lang = getELangKey(params[LANG]);

  const sqlResult = await getArticle(article);

  if (!sqlResult) return DEFAULT_META_DATA[lang];

  const { title, description, date, slug } = sqlResult;

  const slugPath = `${ARTICLE}/${slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `/${lang}/${slugPath}`,
      publishedTime: getFormattedDateStrYearFirst(date),
    },
    alternates: {
      canonical: `/${DEFAULT_LANG}/${slugPath}`,
      languages: {
        en: `/${ELanguage.EN}/${slugPath}`,
        uk: `/${ELanguage.UA}/${slugPath}`,
      },
    },
  };
};

export default async function Page({ params }: IArticleParams) {
  const article = params[ARTICLE_PARAM];
  if (!article) notFound();

  const lang = getELangKey(params[LANG]);

  const sqlResult = await getArticle(article);

  if (sqlResult instanceof Error)
    return <EmptyData lang={lang} description={sqlResult.message} />;
  if (!sqlResult) notFound();

  const { id, text, date, logo, view, title, slug, cat_slug, cat_name } =
    sqlResult;

  const similarArticles = await getSimilarArticles(logo, id);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_ARTICLE,
    `${id}`
  );

  updateViewCount(EDBTableTitles.ARTICLE, `${id}`, view);

  return (
    <>
      <EditLinkButton
        href={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit/${id}`}
      />
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          BREAD_CRUMBS.NEWS_AND_ARTICLES,
          {
            title: cat_name,
            href: `${NEWS_AND_ARTICLES}/${cat_slug}`,
          },
          title,
        ]}
      />
      <article className="article">
        <Title>
          {title}
          <FillingValidImage
            image={{
              ...h1Image,
              src: `${h1Image.path}${logo}`,
            }}
            defaultImage={h1Image.defaultImg}
            alternativeImgString={h1Image.alternativeStr}
            alt={`${h1Image.altStart[lang]} ${title}`}
            isBlur
          />
        </Title>
        <div className="article-text">
          <DangerHtml text={text} />
        </div>
        <BottomInfoPanel
          items={[
            {
              name: themeTitle[lang],
              value: (
                <Link
                  href={`/${lang}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${cat_slug}`}
                >
                  {cat_name}
                </Link>
              ),
            },
            { name: viewsTitle[lang], value: view + 1 },
            {
              name: dateTitle[lang],
              value: getFormattedDateStrYearFirst(date),
            },
          ]}
        />
      </article>

      {similarArticles.length ? (
        <SimilarArticles
          similarTitle={SIMILAR_ARTICLES.title[lang]}
          similarArticlesMapped={similarArticles.map((art) => (
            <li key={art.cpu}>
              <Link href={`/${lang}/${ARTICLE}/${art.cpu}`}>{art.title}</Link>
              <span>{` (${getFormattedDateStrYearFirst(art.date)})`}</span>
            </li>
          ))}
        />
      ) : null}

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${ARTICLE}/${slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
        articleId={`${id}`}
        articleName={title}
      />
    </>
  );
}
