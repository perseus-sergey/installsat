import ArticleCard from '../ArticleCard/ArticleCard';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { EUrlBaseParam } from '@/models/url/url.model';
import { cutText } from '@/libs/utils/cutText';
import DangerHtml from '../../ui/DangerHtml/DangerHtml';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import SeoLink from '@/components/ui/SeoLink/SeoLink';
import { ELanguage } from '@/models/language.model';
import {
  ARTICLE_CARD_IMAGES,
  getInfoPanelLinkTitle,
  getSeoCardLinkTitle,
} from '@/models/articles/article.model';
import { IAllNewsModel } from '@/models/articles/articleList.model';
import { INFO_PANEL_TITLES } from '@/models/ui/infoPanel.model';

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
          description,
          category_title,
          view,
          date,
          // comment_count,
          category_cpu,
          logo,
          cpu,
        }) => {
          const currDate = getFormattedDateStrYearFirst(date, lang);

          return (
            <li key={id}>
              <ArticleCard
                lang={lang}
                seoCardLinkTitle={getSeoCardLinkTitle(title)[lang]}
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
                    alt={`${h1Image.altStart[lang]} ${title}`}
                    isFillParent
                  />
                }
                articleDescription={
                  <DangerHtml
                    text={cutText(description, 250)}
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
                        title={getInfoPanelLinkTitle(category_title)[lang]}
                        href={`/${lang}/${EUrlBaseParam.NEWS_AND_ARTICLES}/${category_cpu}`}
                      >
                        {category_title}
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
