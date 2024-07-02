import {
  ARTICLES,
  IAllMapsModel,
  SAT_MAPS_MODEL,
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
  images: { allMaps: allMapsImg, singleMap },
  metaSingleMap: { metaTitle },
} = SAT_MAPS_MODEL;

const { views: viewsTitle, comments: commentsTitle } = ARTICLES.infoPanelTitles;

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
                    ...singleMap.h1Image,
                    src: `${singleMap.h1Image.path}${logo}`,
                  }}
                  defaultImage={singleMap.h1Image.defaultImg}
                  alternativeImgString={singleMap.h1Image.alternativeStr}
                  alt={`${singleMap.h1Image.altStart[lang]} ${metaTitle[lang]} ${title}`}
                  isBlur
                />
              }
              articleDescription={
                <p>{makePostDescription(description)[lang]}</p>
              }
              href={`/${EUrlBaseParam.SAT_COVERAGE_MAP}/${cpu}`}
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
