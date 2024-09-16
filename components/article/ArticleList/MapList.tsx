import {
  IAllMapsModel,
  INFO_PANEL_TITLES,
  META_ALL_SAT_MAPS_MODEL,
  META_SINGLE_SAT_MAP,
  SINGLE_SAT_MAP_DATA,
} from '@/models/articles.model';
import styles from './ArticleList.module.scss';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingImg from '../../ui/Images/FillingImage';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import EmptyData from '@/components/errors/EmptyData/EmptyData';

const {
  makePostDescription,
  images: { allMaps: allMapsImg },
} = META_ALL_SAT_MAPS_MODEL;

const { metaTitle } = META_SINGLE_SAT_MAP;

const { h1Image } = SINGLE_SAT_MAP_DATA.images;

const { views: viewsTitle, comments: commentsTitle } = INFO_PANEL_TITLES;

interface IArticleListProps {
  articleList: IAllMapsModel[];
  lang: ELanguage;
}
const MapList = ({ articleList, lang }: IArticleListProps) =>
  articleList.length > 0 ? (
    <ul className={styles.ArticleList} data-testid="ArticleList">
      {articleList.map(
        ({ id, title, description, view, comment_count, logo, cpu }) => (
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
                  {typeof allMapsImg.titleImg !== 'string' ? (
                    <FillingImg {...allMapsImg.titleImg} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>
                      {allMapsImg.titleImg}
                    </span>
                  )}
                  {title}
                </>
              }
              image={
                <FillingValidImage
                  image={{
                    ...h1Image,
                    src: `${h1Image.path}${logo}`,
                  }}
                  defaultImage={h1Image.defaultImg}
                  alternativeImgString={h1Image.alternativeStr}
                  alt={`${h1Image.altStart[lang]} ${metaTitle[lang]} ${title}`}
                  isBlur
                />
              }
              articleDescription={
                <p>{makePostDescription(description)[lang]}</p>
              }
              href={`/${lang}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${cpu}`}
              infoPanelItems={[
                { name: viewsTitle[lang], value: view },
                { name: commentsTitle[lang], value: comment_count },
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
