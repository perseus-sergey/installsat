import { Suspense, cache } from 'react';

import { Title } from '@/components/ui/Titles/Title';
import {
  getPackageChannels,
  getPackageParams,
  getT2Channels,
} from '@/controllers/channelList.controller';
import { T2_SLUG } from '@/models/channels/channelList.model';
import type { Metadata } from 'next';
import { getELangKey } from '@/libs/utils/getLanguage';
import { validSearchParam } from '@/libs/utils/validSearchParam';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
// import { getCommentsNumber } from '@/controllers/comments.controller';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { getChannelCatList } from '@/controllers/sidebar.controller';
import { updateViewCount } from '@/controllers/viewUpdate.controller';
import BreadCrumbServer, {
  IBreadCrumbLink,
} from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import SeoLink from '@/components/ui/SeoLink/SeoLink';
import SimilarBlock from '@/components/SimilarArticles/SimilarBlock';
import EmptyPage from '@/components/errors/EmptyPage/EmptyPage';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import {
  BREAD_PACKAGE_CHANNEL_LIST,
  getSimilarPackagesTitle,
  META_PACKAGE_CHANNEL_LIST,
  PACKAGE_CHANNEL_LIST_DATA,
  PACKAGE_CHANNEL_LIST_IMAGES,
} from '@/models/channels/packageChannelListMeta.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { getH1, metaKeywords, metaTitle } = META_PACKAGE_CHANNEL_LIST;

const {
  similarLinks: { title: similarLinksTitle, beforeLinkText },
} = PACKAGE_CHANNEL_LIST_DATA;
const { h1Image } = PACKAGE_CHANNEL_LIST_IMAGES;

const { SLUG, LANG, PACKAGE_CHANNEL_LIST, CHANNEL_PARAMS } = EUrlBaseParam;

const getH1Cached = cache(getH1);

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export const revalidate = 172800; // 3600 * 48 invalidate cache every 2 days

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const res =
    slug === T2_SLUG
      ? await getT2Channels(lang)
      : await getPackageChannels({ packageSlug: slug, lang: lang });

  if (!res || !res.length) return DEFAULT_META_DATA[lang];

  const { cat_title, cat_description, cat_slug } = res[0][1][0];

  const slugPath = `${PACKAGE_CHANNEL_LIST}/${cat_slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: `${cat_title}. ${metaTitle[lang]}`,
    description: cat_description,
    keywords: `${cat_title} ${metaKeywords[lang]}`,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: `${cat_title}. ${metaTitle[lang]}`,
      description: cat_description,
      url: `/${lang}/${slugPath}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
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

export async function generateStaticParams() {
  const allCatResponse = await getChannelCatList();

  if (allCatResponse instanceof Error) return [{ [SLUG]: '' }];

  return allCatResponse.map((cat) => ({ [SLUG]: cat.cpu }));
}

export const dynamicParams = false;

export default async function Page({ params, searchParams }: IPageProps) {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const getChannelsFn =
    slug === T2_SLUG
      ? () => getT2Channels(lang, searchQueryChannel)
      : () =>
          getPackageChannels({
            packageSlug: slug,
            searchQuery: searchQueryChannel,
            lang: lang,
          });

  // const numberOfComments = channels
  //   ? await getCommentsNumber(
  //       EDBTableTitles.COMMENTS_PACKAGES,
  //       `${channels[0][1][0].cat_id}`
  //     )
  //   : 0;

  const packageParamsResp = await getPackageParams(
    lang,
    slug === T2_SLUG ? undefined : slug
  );

  if (!packageParamsResp) return EmptyPage;

  const packagesResp = await getChannelCatList(lang);
  const similarLinks =
    packagesResp instanceof Error
      ? []
      : packagesResp.filter((pack) => pack.cpu !== slug);

  !searchQueryChannel &&
    updateViewCount(
      EDBTableTitles.CHANNEL_CATEGORY,
      `${packageParamsResp.cat_id}`,
      packageParamsResp.cat_view
    );

  const breadCrumbList: (IBreadCrumbLink | string)[] = [
    BREAD_PACKAGE_CHANNEL_LIST,
  ];
  breadCrumbList.push(
    getH1Cached(packageParamsResp.cat_title, searchQueryChannel)[lang]
  );

  return (
    <>
      <BreadCrumbServer breadCrumbList={breadCrumbList} lang={lang} />

      <ArticleWrapper lang={lang}>
        <>
          <Title>
            {getH1Cached(packageParamsResp.cat_title, searchQueryChannel)[lang]}
            <FillingValidImage
              image={{
                width: h1Image.width,
                height: h1Image.height,
                src: `${h1Image.path}${packageParamsResp.cat_logo}`,
              }}
              defaultImage={h1Image.defaultImage}
              alt={`${h1Image.alt[lang]} "${packageParamsResp.cat_title}"`}
            />
          </Title>

          <Suspense>
            <PackageChannelList
              lang={lang}
              isGenre={slug === 't2-efir'}
              getChannelsFn={getChannelsFn}
              pathToChannelDetails={CHANNEL_PARAMS}
            />
          </Suspense>
        </>
      </ArticleWrapper>

      {similarLinks.length ? (
        <SimilarBlock blockTitle={similarLinksTitle[lang]} lang={lang}>
          {similarLinks.map((link) => (
            <li key={link.cpu}>
              <SeoLink
                className="text-indigo-700 hover:text-red-500"
                href={`/${lang}/${PACKAGE_CHANNEL_LIST}/${link.cpu}`}
                title={getSimilarPackagesTitle(link.title)[lang]}
              >
                {beforeLinkText[lang]} {link.title}
              </SeoLink>
            </li>
          ))}
        </SimilarBlock>
      ) : null}
    </>
  );
}

// {channels ? (
//   <CommentBlock
//     lang={lang}
//     numberOfComments={numberOfComments}
//     revalidateUrl={`/${lang}/${PACKAGE_CHANNEL_LIST}/${channels[0][1][0].cat_slug}`}
//     dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
//     articleId={`${channels[0][1][0].cat_id}`}
//     articleName={`${channels[0][1][0].cat_title}. ${metaTitle[lang]}`}
//   />
// ) : (
//   <EmptyData lang={lang} />
// )}
// {"id":"1","title":"Суспільні","cpu":"tematika-obshchestvennyie","description":"Категорія громадських каналів з трансляціями популярних шоу, передач, кінофільмів та новин","title_en":"Public","description_en":"Category of public channels broadcasting popular shows, programs, movies and news","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"2","title":"Новини","cpu":"tematika-novosti","description":"Категорія новинних та бізнес каналів","title_en":"News","description_en":"Category of news and business channels","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"3","title":"Кінофільми","cpu":"tematika-filmy","description":"Канали, що транслюють в основному кінофільми та мультфільми","title_en":"Movies","description_en":"Channels mainly broadcasting movies and cartoons","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},

// {"id":"4","title":"Спорт","cpu":"sport","description":"Канали зі спортивним змістом","title_en":"Sport","description_en":"Channels with sports content","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"5","title":"Відпочинок, розваги","cpu":"tematika-razvlecheniya","description":"Категорія каналів розважального характеру, популярні ток-шоу, кінофільми, музика","title_en":"Leisure, entertainment","description_en":"Category of entertainment channels, popular talk shows, movies, music","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"6","title":"Дитячі","cpu":"detskiye","description":"Канали для дітей, які пропонують анімаційні шоу, навчальні програми та розважальні передачі для наймолодших глядачів.","title_en":"For Kids","description_en":"Channels for children offering animated shows, educational programs, and entertainment for the youngest viewers.","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"7","title":"XXX, Дорослі","cpu":"tematika-xxx-vzroslyie","description":"Канали для дорослих","title_en":"XXX, Adults","description_en":"Channels for adults","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"8","title":"Музичні","cpu":"tematika-muzikalnyie","description":"Канали, що транслюють музику, концерти та інші музичні програми.","title_en":"Music","description_en":"Channels broadcasting music, concerts and other music programs.","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"9","title":"Пізнавальні","cpu":"poznavatelnyie","description":"Канали з пізнавальним контентом, наука, природа, історія","title_en":"Educational","description_en":"Channels with educational content, science, nature, history","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"10","title":"Розваги, Гумор","cpu":"tematika-razvlecheniye-yumor","description":"Розважально-гумористичні канали","title_en":"Entertainment, Humor","description_en":"Entertainment and humorous channels","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"11","title":"Відпочинок, Спорт, Розваги","cpu":"tematika-otdyh-sport-razvlecheniya","description":"Канали про хобі, нетрадиційні види спорту","title_en":"Leisure, Sports, Entertainment","description_en":"Channels about hobbies, non-traditional sports","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"12","title":"Релігійні, духовні","cpu":"tematika-religiya","description":"Релігійні та духовні канали, що пропонують контент, пов'язаний з різними віруваннями та духовними практиками. Це можуть бути служби, проповіді, медитації та програми, що досліджують духовні аспекти життя.","title_en":"Religious, Spiritual","description_en":"Religious and spiritual channels offering content related to various beliefs and spiritual practices. This may include services, sermons, meditations, and programs exploring the spiritual aspects of life.","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"13","title":"ТВ продажі, Магазин на дивані","cpu":"tematika-tv-shop","description":"Канали ТВ-продажів і магазини на дивані пропонують широкий асортимент товарів через телевізійні трансляції. Інфо-комерційні програми показують продукти, спеціальні пропозиції та знижки, з можливістю покупки з дому.","title_en":"TV Sales","description_en":"TV shopping channels and infomercial networks offer a wide range of products through TV broadcasts. Infomercial programs showcase items, special offers, and discounts, allowing you to shop conveniently from home.","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"14","title":"Мода, Fashion","cpu":"tematika-fashion","description":"Канали моди демонструють останні тренди, колекції дизайнерів і стилістичні поради. Від показів до інтерв'ю з фахівцями, ці канали допоможуть вам бути в курсі актуальних модних тенденцій.","title_en":"Fashion","description_en":"Fashion channels showcase the latest trends, designer collections, and style tips. From runway shows to expert interviews, these channels keep you updated on current fashion trends and style insights.","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"15","title":"Отключен !!!","cpu":"otkluchen","description":"Отключенные, или временно недоступные телеканалы","title_en":null,"description_en":null,"title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"16","title":"Канали онлайн","cpu":"vse-tv","description":"Канали у прямому ефірі онлайн","title_en":"Online channels","description_en":"Live Channels Online","title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null},
// {"id":"17","title":"Программа передач каналов","cpu":"vse-kanaly","description":"Программа телепередач популярных каналов","title_en":null,"description_en":null,"title_ru":null,"title_es":null,"title_ar":null,"title_de":null,"title_fr":null,"title_it":null,"description_ru":null,"description_es":null,"description_ar":null,"description_de":null,"description_fr":null,"description_it":null}

//   ALTER TABLE tbl_chan_tema
// ADD COLUMN title_ru VARCHAR(150),
// ADD COLUMN title_es VARCHAR(150),
// ADD COLUMN title_ar VARCHAR(150),
// ADD COLUMN title_de VARCHAR(150),
// ADD COLUMN title_fr VARCHAR(150),
// ADD COLUMN title_it VARCHAR(150),

// ADD COLUMN description_ru VARCHAR(500),
// ADD COLUMN description_es VARCHAR(500),
// ADD COLUMN description_ar VARCHAR(500),
// ADD COLUMN description_de VARCHAR(500),
// ADD COLUMN description_fr VARCHAR(500),
// ADD COLUMN description_it VARCHAR(500)
