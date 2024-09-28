import {
  ARTICLE_CARD_IMAGES,
  IAllNewsModel,
  INFO_PANEL_TITLES,
} from '@/models/articles.model';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import DangerHtml from '../../ui/DangerHtml/DangerHtml';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

const { h1Image } = ARTICLE_CARD_IMAGES;

const {
  date: dateTitle,
  theme: themeTitle,
  views: viewsTitle,
  // comments: commentsTitle,
} = INFO_PANEL_TITLES;

interface IArticleListProps {
  lang: ELanguage;
  articleList: IAllNewsModel[];
}

const ArticleList = ({ articleList, lang }: IArticleListProps) =>
  articleList.length > 0 ? (
    <ul>
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
          // comment_count,
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
                    <div className="bg-[url('/Images/package_network_4729.png')] w-8 h-8 flex-shrink-0" />
                    {titleLang}
                  </>
                }
                image={
                  <FillingValidImage
                    image={{
                      ...h1Image.currentImg,
                      src: `${h1Image.currentImg.path}${logo}`,
                    }}
                    defaultImage={h1Image.defaultImg}
                    alt={`${h1Image.altStart[lang]} ${titleLang}`}
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
                      <SeoLink
                        className="border-b border-stone-300 hover:border-white"
                        title={`${
                          lang === ELanguage.UA
                            ? 'Перейти до перегляду списку статей категорії'
                            : 'Go to view the list of articles in the category'
                        } "${catTitleLang}"`}
                        href={`/${lang}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${category_cpu}`}
                      >
                        {catTitleLang}
                      </SeoLink>
                    ),
                  },
                  { name: viewsTitle[lang], value: view },
                  {
                    name: dateTitle[lang],
                    value: <time dateTime={currDate}>{currDate}</time>,
                  },
                  // { name: commentsTitle[lang], value: comment_count },
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
