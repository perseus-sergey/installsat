import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Metadata } from 'next';

import { Title } from '@/components/ui/Titles/Title';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import {
  ARTICLE_CARD_IMAGES,
  BREAD_ARTICLES,
  getInfoPanelLinkTitle,
  SIMILAR_ARTICLES_TITLE,
} from '@/models/articles/article.model';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import EditLinkButton from '@/components/admin/EditLinkButton/EditLinkButton';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import SeoLink from '@/components/ui/SeoLink/SeoLink';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { ELanguage } from '@/models/language.model';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import {
  DEFAULT_ARTICLE_LOGO_NAME,
  IMG_PROPERTIES,
} from '@/models/ui/image.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { getELangKey } from '@/libs/utils/getLanguage';
import { getArticle } from '@/controllers/article.controller';
import { updateViewCount } from '@/controllers/viewUpdate.controller';
import { INFO_PANEL_TITLES } from '@/models/ui/infoPanel.model';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { isFileExists } from '@/libs/utils/imagePathValidate';

const TextUnderH1 = dynamic(
  () => import('@/components/TextUnderH1/TextUnderH1')
);

const {
  h1Image: { currentImg, defaultImg, altStart },
  articleBigImg,
} = ARTICLE_CARD_IMAGES;

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

export const revalidate = 172800; // 3600 * 48 invalidate cache every 2 days

export const generateMetadata = async ({
  params,
}: IArticleParams): Promise<Metadata> => {
  const article = params[ARTICLE_PARAM];
  const lang = getELangKey(params[LANG]);

  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  const sqlResult = await getArticle(article, lang);
  if (!sqlResult) return DEFAULT_META_DATA[lang];

  const { title, keywords, description, date, slug } = sqlResult;

  const slugPath = `${ARTICLE}/${slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `/${lang}/${slugPath}`,
      publishedTime: getFormattedDateStrYearFirst(date, lang),
    },
    alternates: {
      canonical: `/${lang}/${slugPath}`,
      languages: {
        en: `/${EN}/${slugPath}`,
        uk: `/${UA}/${slugPath}`,
        ru: `/${RU}/${slugPath}`,
        es: `/${ES}/${slugPath}`,
        ar: `/${AR}/${slugPath}`,
        de: `/${DE}/${slugPath}`,
        fr: `/${FR}/${slugPath}`,
        it: `/${IT}/${slugPath}`,
      },
    },
  };
};

export default async function Page({ params }: IArticleParams) {
  const article = params[ARTICLE_PARAM];
  if (!article) notFound();

  const lang = getELangKey(params[LANG]);

  const sqlResult = await getArticle(article, lang);

  if (!sqlResult) notFound();

  const {
    id,
    text,
    description,
    date,
    logo: logoDB,
    view,
    title,
    slug,
    cat_slug,
    cat_name,
  } = sqlResult;

  const logo = logoDB || DEFAULT_ARTICLE_LOGO_NAME;

  const currDate = getFormattedDateStrYearFirst(date, lang);

  const imgPath = `${articleBigImg.params.path}${slug}.jpg`;

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
          BREAD_ARTICLES,
          {
            title: cat_name,
            href: `${NEWS_AND_ARTICLES}/${cat_slug}`,
          },
          title,
        ]}
      />

      <ArticleWrapper lang={lang}>
        <Title>
          {title}
          <FillingValidImage
            image={{
              ...currentImg,
              src: `${currentImg.path}${logo}`,
            }}
            defaultImage={defaultImg}
            alt={`${altStart[lang]} ${title}`}
            isFillParent
          />
        </Title>

        {description && <TextUnderH1>{description}</TextUnderH1>}

        {isFileExists(imgPath) && (
          <Image
            className="my-4 sm:border-2 border-white sm:shadow-md rounded"
            src={imgPath}
            alt={articleBigImg.getAlt(title)[lang]}
            width={articleBigImg.params.width}
            height={articleBigImg.params.height}
            placeholder="blur"
            blurDataURL={IMG_PROPERTIES.defaultImgBlur}
          />
        )}

        <div className="article-text">
          <DangerHtml text={text} />
        </div>

        <BottomInfoPanel
          lang={lang}
          items={[
            {
              name: themeTitle[lang],
              value: (
                <SeoLink
                  href={`/${lang}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${cat_slug}`}
                  className="border-b border-stone-300 hover:border-white"
                  title={getInfoPanelLinkTitle(cat_name)[lang]}
                >
                  {cat_name}
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
      </ArticleWrapper>

      <Suspense>
        <SimilarArticles
          similarTitle={SIMILAR_ARTICLES_TITLE[lang]}
          lang={lang}
          logoSrc={logo}
          articleId={id}
        />
      </Suspense>

      <Suspense>
        <CommentBlock
          lang={lang}
          revalidateUrl={`/${lang}/${ARTICLE}/${slug}`}
          dbCommentTableName={EDBTableTitles.COMMENTS_ARTICLE}
          articleId={`${id}`}
          articleName={title}
        />
      </Suspense>
    </>
  );
}
