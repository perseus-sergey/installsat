import { ARTICLES, IAllNewsModel } from '@/models/articles.model';
import styles from './ArticleList.module.scss';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingImg from '../../Images/FillingImage';
import FillingValidImage from '../../Images/FillingValidImage';
import Link from 'next/link';
import { LANGUAGE, IImgParams } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils/utils';
import DangerHtml from '../../ui/DangerHtml/DangerHtml';

const { h1Image } = ARTICLES.article.images;

const {
  date: dateTitle,
  theme: themeTitle,
  views: viewsTitle,
  comments: commentsTitle,
} = ARTICLES.infoPanelTitles;
interface IArticleListProps {
  articleList: IAllNewsModel[];
  articleTitleImg: string | IImgParams;
}

const ArticleList = ({ articleList, articleTitleImg }: IArticleListProps) => (
  <>
    <ul className={styles.ArticleList} data-testid="ArticleList">
      {articleList.map(
        ({
          id,
          title,
          description,
          category_title,
          view,
          date,
          comment_count,
          category_cpu,
          logo,
          cpu,
        }) => (
          <li key={id}>
            <ArticleCard
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
                  alt={`${h1Image.getAlt()[LANGUAGE]}${title}`}
                  isBlur
                />
              }
              articleDescription={
                <DangerHtml text={description} wrapperTagName="span" />
              }
              href={`${ARTICLES.articleList.links.articleLink.path}${cpu}`}
              infoPanelItems={[
                {
                  name: themeTitle[LANGUAGE],
                  value: (
                    <Link
                      href={`/${EUrlBaseParam.NEWS_AND_ARTICLES}/${category_cpu}`}
                    >
                      {category_title}
                    </Link>
                  ),
                },
                { name: viewsTitle[LANGUAGE], value: view },
                {
                  name: dateTitle[LANGUAGE],
                  value: getFormattedDateStr(date),
                },
                { name: commentsTitle[LANGUAGE], value: comment_count },
              ]}
            />
          </li>
        )
      )}
    </ul>
  </>
);

export default ArticleList;
