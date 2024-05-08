import {
  ARTICLES,
  IAllMapsModel,
  SAT_MAPS_MODEL,
} from '@/models/articles.model';
import styles from './ArticleList.module.scss';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingImg from '../../ui/Images/FillingImage';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { LANGUAGE, IImgParams } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import EmptyData from '@/components/errors/EmptyData/EmptyData';

const { h1Image } = ARTICLES.article.images;

const {
  makePostDescription,
  metaSingleMap: { metaTitle },
} = SAT_MAPS_MODEL;

const { views: viewsTitle, comments: commentsTitle } = ARTICLES.infoPanelTitles;

interface IArticleListProps {
  articleList: IAllMapsModel[];
  articleTitleImg: string | IImgParams;
}

const MapList = ({ articleList, articleTitleImg }: IArticleListProps) =>
  articleList.length > 0 ? (
    <ul className={styles.ArticleList} data-testid="ArticleList">
      {articleList.map(
        ({ id, title, description, view, comment_count, logo, cpu }) => (
          <li key={id}>
            <ArticleCard
              isTitleCentered
              articleTitle={
                <>
                  {typeof articleTitleImg !== 'string' ? (
                    <FillingImg {...articleTitleImg} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>{articleTitleImg}</span>
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
                  alt={`${h1Image.altStart[LANGUAGE]} ${metaTitle[LANGUAGE]} ${title}`}
                  isBlur
                />
              }
              articleDescription={
                <p>{makePostDescription(description)[LANGUAGE]}</p>
              }
              href={`/${EUrlBaseParam.SAT_COVERAGE_MAP}/${cpu}`}
              infoPanelItems={[
                { name: viewsTitle[LANGUAGE], value: view },
                { name: commentsTitle[LANGUAGE], value: comment_count },
              ]}
            />
          </li>
        )
      )}
    </ul>
  ) : (
    <EmptyData />
  );

export default MapList;
