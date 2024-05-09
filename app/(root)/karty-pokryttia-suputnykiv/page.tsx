import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import { SAT_MAPS_MODEL } from '@/models/articles.model';
import { getSatMapList } from '@/controllers/articles.controller';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { EUrlBaseParam } from '@/models/url.model';
import { LANGUAGE as L, DEFAULT_META_DATA } from '@/models/ui.model';
import FillingImg from '@/components/ui/Images/FillingImage';
import MapList from '@/components/article/ArticleList/MapList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';

const BASE_URL = process.env.BASE_URL;

// const { meta, pagination, images, articlesCountCaption } = ARTICLES.articleList;
const {
  metaAllMaps: { metaDescription, metaKeywords, metaTitle },
  images: { allMaps: allMapsImg },
} = SAT_MAPS_MODEL;

export const metadata: Metadata = {
  title: metaTitle[L],
  description: metaDescription[L],
  keywords: metaKeywords[L],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: metaTitle[L],
    description: metaDescription[L],
    url: `${BASE_URL}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
    publishedTime: getFormattedDateStr(),
  },
};
export default async function Page() {
  const allMaps = await getSatMapList();

  return (
    <>
      <BreadCrumbServer />
      <article className="article">
        <Title>
          {metaDescription[L]}

          <FillingImg
            width={allMapsImg.h1Image.width}
            height={allMapsImg.h1Image.height}
            src={allMapsImg.h1Image.src}
            alt={allMapsImg.h1Image.alt[L]}
            isBlur
          />
        </Title>

        <MapList articleList={allMaps} />
      </article>
    </>
  );
}
