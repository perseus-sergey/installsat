import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import {
  ARTICLE_CARD,
  DEFAULT_ARTICLE_LOGO_NAME,
  INFO_PANEL_TITLES,
} from '@/models/articles.model';
import { getArticle, updateViewCount } from '@/controllers/articles.controller';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import { EUrlAdminParam, EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import {
  DEFAULT_META_DATA,
  EDBTableTitles,
  ELanguage,
  SIMILAR_ARTICLES,
} from '@/models/ui.model';
import { notFound } from 'next/navigation';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { Metadata } from 'next';
import { getELangKey } from '@/libs/utils/validSearchParam';
// import { getCommentsNumber } from '@/controllers/comments.controller';
import EditLinkButton from '@/components/admin/EditLinkButton/EditLinkButton';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import SeoLink from '@/components/ui/SeoLink/SeoLink';
import { Suspense } from 'react';

const { h1Image } = ARTICLE_CARD.images;

const BASE_URL = process.env.BASE_URL || MAIN_URL;
const { ARTICLE_PARAM, ARTICLE, LANG, NEWS_AND_ARTICLES } = EUrlBaseParam;
const {
  date: dateTitle,
  theme: themeTitle,
  views: viewsTitle,
} = INFO_PANEL_TITLES;

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
      canonical: `/${lang}/${slugPath}`,
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
    // slug,
    cat_slug,
    cat_name,
    cat_name_en,
  } = sqlResult;

  const logo = logoDB || DEFAULT_ARTICLE_LOGO_NAME;

  const currDate = getFormattedDateStrYearFirst(date);

  const titleLang = lang === ELanguage.UA ? title : title_en || title;
  const descriptionLang = lang === ELanguage.UA ? description : description_en;
  const catLang = lang === ELanguage.UA ? cat_name : cat_name_en || cat_name;

  // const numberOfComments = await getCommentsNumber(
  //   EDBTableTitles.COMMENTS_ARTICLE,
  //   `${id}`
  // );

  updateViewCount(EDBTableTitles.ARTICLE, `${id}`, view);

  return (
    <>
      <Suspense>
        <EditLinkButton
          href={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit/${id}`}
        />
      </Suspense>

      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          {
            href: EUrlBaseParam.NEWS_AND_ARTICLES,
            title: {
              [ELanguage.UA]: 'Новини та статті',
              [ELanguage.EN]: 'News and articles',
            },
          },
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
            alt={`${h1Image.altStart[lang]} ${titleLang}`}
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
                  className="border-b border-stone-300 hover:border-white"
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

      <Suspense>
        <SimilarArticles
          similarTitle={SIMILAR_ARTICLES.title[lang]}
          lang={lang}
          logoSrc={logo}
          articleId={id}
        />
      </Suspense>
    </>
  );
}

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${ARTICLE}/${slug}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
//   articleId={`${id}`}
//   articleName={titleLang}
// />
