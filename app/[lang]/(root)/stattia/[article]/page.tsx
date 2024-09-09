import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { ARTICLES, DEFAULT_ARTICLE_LOGO_NAME } from '@/models/articles.model';
import {
  getArticle,
  getSimilarArticles,
  updateViewCount,
} from '@/controllers/articles.controller';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import { EUrlAdminParam, EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
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
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

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

export const revalidate = 3600 * 48; // invalidate cache every 2 days

export const generateMetadata = async ({
  params,
}: IArticleParams): Promise<Metadata> => {
  const article = params[ARTICLE_PARAM];
  const lang = getELangKey(params[LANG]);

  const sqlResult = await getArticle(article);

  if (!sqlResult) return DEFAULT_META_DATA[lang];

  const {
    title,
    title_en,
    description_en,
    keywords,
    keywords_en,
    description,
    date,
    slug,
  } = sqlResult;

  const slugPath = `${ARTICLE}/${slug}`;
  const t = lang === ELanguage.UA ? title : title_en || title;
  const d = lang === ELanguage.UA ? description : description_en || description;

  return {
    metadataBase: new URL(BASE_URL),
    title: t,
    description: d,
    keywords:
      lang === ELanguage.UA
        ? keywords || description
        : keywords_en || description_en || description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: t,
      description: d,
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

  if (sqlResult instanceof Error) return <EmptyData lang={lang} />;
  if (!sqlResult) notFound();

  const {
    id,
    text,
    text_en,
    description,
    description_en,
    date,
    logo: logoDB,
    view,
    title,
    title_en,
    slug,
    cat_slug,
    cat_name,
    cat_name_en,
  } = sqlResult;

  const logo = logoDB || DEFAULT_ARTICLE_LOGO_NAME;

  const currDate = getFormattedDateStrYearFirst(date);

  const titleLang = lang === ELanguage.UA ? title : title_en || title;
  const descriptionLang = lang === ELanguage.UA ? description : description_en;
  const catLang = lang === ELanguage.UA ? cat_name : cat_name_en || cat_name;

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
            title: catLang,
            href: `${NEWS_AND_ARTICLES}/${cat_slug}`,
          },
          titleLang,
        ]}
      />
      <article className="article">
        <Title>
          {titleLang}
          <FillingValidImage
            image={{
              ...h1Image,
              src: `${h1Image.path}${logo}`,
            }}
            defaultImage={h1Image.defaultImg}
            alternativeImgString={h1Image.alternativeStr}
            alt={`${h1Image.altStart[lang]} ${titleLang}`}
            isBlur
          />
        </Title>

        {description_en && <TextUnderH1>{descriptionLang}</TextUnderH1>}

        <div className="article-text">
          <DangerHtml text={lang === ELanguage.UA ? text : text_en || text} />
        </div>
        <BottomInfoPanel
          items={[
            {
              name: themeTitle[lang],
              value: (
                <SeoLink
                  href={`/${lang}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${cat_slug}`}
                  title={
                    lang === ELanguage.UA
                      ? `Перейти до списку статей категорії "${catLang}"`
                      : `Go to the list of articles of the category "${catLang}"`
                  }
                >
                  {catLang}
                </SeoLink>
              ),
            },
            { name: viewsTitle[lang], value: view + 1 },
            {
              name: dateTitle[lang],
              value: <time dateTime={currDate}>{currDate}</time>,
            },
          ]}
        />
      </article>

      {similarArticles.length ? (
        <SimilarArticles
          similarTitle={SIMILAR_ARTICLES.title[lang]}
          similarArticlesMapped={similarArticles.map((art) => (
            <li key={art.cpu}>
              <SeoLink
                href={`/${lang}/${ARTICLE}/${art.cpu}`}
                title={
                  lang === ELanguage.UA
                    ? `Перейти до перегляду статті "${art.title}"`
                    : `Go to the view of the article "${art.title_en || art.title}"`
                }
              >
                {lang === ELanguage.UA ? art.title : art.title_en || art.title}
              </SeoLink>
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
        articleName={titleLang}
      />
    </>
  );
}
