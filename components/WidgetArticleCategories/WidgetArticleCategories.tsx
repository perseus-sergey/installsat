import styles from './WidgetArticleCategories.module.scss';
import { WIDGET_ARTICLE_CATEGORY } from '@/models/widget.model';
import { ELanguage } from '@/models/ui.model';
import { getArtCatListSideBar } from '@/controllers/articles.controller';
import SeoLink from '../ui/SeoLink/SeoLink';

const WidgetArticleCategories = async ({ lang }: { lang: ELanguage }) => {
  const articleCatWidgetList = await getArtCatListSideBar(lang);

  return articleCatWidgetList.length > 0 ? (
    <ul className="sidebar-widget" data-testid="WidgetArticleCategories">
      <li className="font-bold pb-2">
        <SeoLink
          title={WIDGET_ARTICLE_CATEGORY.ariaLabelForTitle[lang]}
          className={styles.itemLink}
          href={`/${lang}${WIDGET_ARTICLE_CATEGORY.href}`}
        >
          {WIDGET_ARTICLE_CATEGORY.title[lang]}
        </SeoLink>
        <br />
      </li>
      {articleCatWidgetList.map((item) => {
        return (
          <li key={item.cpu} className="font-bold pb-2">
            <SeoLink
              title={`${WIDGET_ARTICLE_CATEGORY.ariaLabel[lang]}: "${item.title}"`}
              className={styles.itemLink}
              href={`/${lang}${WIDGET_ARTICLE_CATEGORY.baseHrefOfList}/${item.cpu}/`}
            >
              {item.title}
            </SeoLink>
          </li>
        );
      })}
    </ul>
  ) : null;
};
export default WidgetArticleCategories;
