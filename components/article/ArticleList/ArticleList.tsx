import { ARTICLES, IAllNewsModel } from '@/models/articles.model';
import styles from './ArticleList.module.scss';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingImg from '../../ui/Images/FillingImage';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import Link from 'next/link';
import { ELanguage, IImgParams } from '@/models/ui.model';
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
  lang: ELanguage;
  articleList: IAllNewsModel[];
  articleTitleImg: string | IImgParams;
}

const ArticleList = ({
  articleList,
  articleTitleImg,
  lang,
}: IArticleListProps) =>
  articleList.length > 0 ? (
    <ul className={styles.ArticleList} data-testid="ArticleList">
      {articleList.map(
        ({
          id,
          title,
          title_en,
          description,
          description_en,
          category_title,
          category_title_en,
          view,
          date,
          comment_count,
          category_cpu,
          logo,
          cpu,
        }) => {
          const titleLang = lang === ELanguage.UA ? title : title_en || title;
          const descriptionLang =
            lang === ELanguage.UA ? description : description_en || description;
          const catTitleLang =
            lang === ELanguage.UA
              ? category_title
              : category_title_en || category_title;

          const currDate = getFormattedDateStrYearFirst(date);

          return (
            <li key={id}>
              <ArticleCard
                seoCardLinkTitle={
                  lang === ELanguage.UA
                    ? `Перейти до перегляду статті "${titleLang}"`
                    : `Go to the view of the article "${titleLang}"`
                }
                articleTitle={
                  <>
                    {typeof articleTitleImg !== 'string' ? (
                      <FillingImg {...articleTitleImg} />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>
                        {articleTitleImg}
                      </span>
                    )}
                    {titleLang}
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
                    alt={`${h1Image.altStart[lang]} ${titleLang}`}
                    isBlur
                    isFillParent
                  />
                }
                articleDescription={
                  <DangerHtml
                    text={cutText(descriptionLang, 250)}
                    wrapperTagName="span"
                  />
                }
                href={`/${lang}/${EUrlBaseParam.ARTICLE}/${cpu}`}
                infoPanelItems={[
                  {
                    name: themeTitle[lang],
                    value: (
                      <Link
                        href={`/${lang}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${category_cpu}`}
                      >
                        {catTitleLang}
                      </Link>
                    ),
                  },
                  { name: viewsTitle[lang], value: view },
                  {
                    name: dateTitle[lang],
                    value: <time dateTime={currDate}>{currDate}</time>,
                  },
                  { name: commentsTitle[lang], value: comment_count },
                ]}
              />
            </li>
          );
        }
      )}
    </ul>
  ) : (
    <EmptyData lang={lang} />
  );

export default ArticleList;
