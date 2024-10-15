import ArticleCard from '../ArticleCard/ArticleCard';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam } from '@/models/url/url.model';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { INFO_PANEL_TITLES } from '@/components/BottomInfoPanel/BottomInfoPanel';
import {
  IAllMapsModel,
  META_ALL_SAT_MAPS_MODEL,
  META_SINGLE_SAT_MAP,
  SINGLE_SAT_MAP_DATA,
} from '@/models/mapCoverage.model';

const { makePostDescription } = META_ALL_SAT_MAPS_MODEL;

const { metaTitle } = META_SINGLE_SAT_MAP;

const { h1Image } = SINGLE_SAT_MAP_DATA.images;

const {
  views: viewsTitle,
  // comments: commentsTitle
} = INFO_PANEL_TITLES;

interface IArticleListProps {
  articleList: IAllMapsModel[];
  lang: ELanguage;
}
const MapList = ({ articleList, lang }: IArticleListProps) =>
  articleList.length > 0 ? (
    <ul data-testid="ArticleList">
      {articleList.map(
        ({
          id,
          title,
          description,
          view,
          // comment_count,
          logo,
          cpu,
        }) => (
          <li key={id}>
            <ArticleCard
              isTitleCentered
              seoCardLinkTitle={
                lang === ELanguage.UA
                  ? `Перейти до перегляду карт покриття супутника "${title}"`
                  : `Go to view the coverage maps of the "${title}" satellite`
              }
              articleTitle={
                <>
                  <div className="bg-[url('/Images/package_network_4729.png')] w-8 h-8 flex-shrink-0" />
                  {title}
                </>
              }
              image={
                <FillingValidImage
                  image={{
                    ...h1Image.currentImg,
                    src: `${h1Image.currentImg.path}${logo}`,
                  }}
                  defaultImage={h1Image.defaultImg}
                  alt={`${h1Image.altStart[lang]} ${metaTitle[lang]} ${title}`}
                  isFillParent
                />
              }
              articleDescription={
                <p>{makePostDescription(description)[lang]}</p>
              }
              href={`/${lang}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${cpu}`}
              infoPanelItems={[
                { name: viewsTitle[lang], value: view },
                // { name: commentsTitle[lang], value: comment_count },
              ]}
            />
          </li>
        )
      )}
    </ul>
  ) : (
    <EmptyData lang={lang} />
  );

export default MapList;
