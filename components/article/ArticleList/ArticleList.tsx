import { ARTICLES, IAllNewsModel } from '@/models/articles.model';
import styles from './ArticleList.module.scss';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingImg from '../../ui/Images/FillingImage';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import Link from 'next/link';
import { LANGUAGE, IImgParams } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import DangerHtml from '../../ui/DangerHtml/DangerHtml';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

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

const ArticleList = ({ articleList, articleTitleImg }: IArticleListProps) =>
  articleList.length > 0 ? (
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
                  alt={`${h1Image.altStart[LANGUAGE]} ${title}`}
                  isBlur
                />
              }
              articleDescription={
                <DangerHtml
                  text={cutText(description, 250)}
                  wrapperTagName="span"
                />
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
                  value: getFormattedDateStrYearFirst(date),
                },
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

export default ArticleList;
