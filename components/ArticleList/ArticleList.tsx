import { ARTICLES, IAllNewsModel } from '@/models/articles.model';
import styles from './ArticleList.module.scss';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingImg from '../Images/FillingImage';
import FillingValidImage from '../Images/FillingValidImage';
import Link from 'next/link';
import { IImgParams } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils';
import DangerHtml from '../DangerHtml/DangerHtml';

interface IArticleListProps {
  articleList: IAllNewsModel[];
  articleTitleImg: string | IImgParams;
  // children?: React.ReactNode;
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
        }) => {
          const { h1Image } = ARTICLES.article.images;

          return (
            <li key={id}>
              <ArticleCard
                articleTitle={
                  <>
                    {typeof articleTitleImg !== 'string' ? (
                      <FillingImg {...articleTitleImg} />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>
                        {articleTitleImg}
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
                    alt={`${h1Image.getAlt().ua}${title}`}
                    isBlur
                  />
                }
                articleDescription={
                  <DangerHtml text={description} wrapperTagName="span" />
                }
                href={`${ARTICLES.articleList.links.articleLink.path}${cpu}`}
                infoPanelItems={[
                  {
                    name: 'Тема',
                    value: (
                      <Link
                        href={`${EUrlBaseParam.NEWS_AND_ARTICLES}/${category_cpu}`}
                        style={{ textDecoration: 'underline' }}
                      >
                        {category_title}
                      </Link>
                    ),
                  },
                  { name: 'Переглядів', value: view },
                  { name: 'Дата', value: getFormattedDateStr(date) },
                  { name: 'Коментарів', value: comment_count },
                ]}
              />
            </li>
          );
        }
      )}
    </ul>
    <p
      className={styles.articlesCount}
    >{`${ARTICLES.articleList.articlesCountCaption.ua}${articleList[0].total_count}`}</p>
  </>
);

export default ArticleList;
