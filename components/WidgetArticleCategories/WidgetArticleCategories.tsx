import styles from './WidgetArticleCategories.module.scss';
import { WIDGET_ARTICLE_CATEGORY } from '@/models/widget.model';
import { ELanguage } from '@/models/ui.model';
import { getArticleCatList } from '@/controllers/articles.controller';
import SeoLink from '../ui/SeoLink/SeoLink';

const WidgetArticleCategories = async ({ lang }: { lang: ELanguage }) => {
  const articleCatWidgetList = await getArticleCatList();

  return articleCatWidgetList.length > 0 ? (
    <ul className="sidebar-widget" data-testid="WidgetArticleCategories">
      <li className={styles.listItem}>
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
        const itemTitle =
          lang === ELanguage.UA ? item.title : item.title_en || item.title;

        return (
          <li key={item.id} className={styles.listItem}>
            <SeoLink
              title={`${WIDGET_ARTICLE_CATEGORY.ariaLabel[lang]}: "${itemTitle}"`}
              className={styles.itemLink}
              href={`/${lang}${WIDGET_ARTICLE_CATEGORY.baseHrefOfList}/${item.cpu}/`}
            >
              {itemTitle}
            </SeoLink>
          </li>
        );
      })}
    </ul>
  ) : null;
};
export default WidgetArticleCategories;
