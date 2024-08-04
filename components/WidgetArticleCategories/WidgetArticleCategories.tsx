import styles from './WidgetArticleCategories.module.scss';
import Link from 'next/link';
import { WIDGET_ARTICLE_CATEGORY } from '@/models/widget.model';
import { ELanguage } from '@/models/ui.model';
import { getArticleCatList } from '@/controllers/articles.controller';

const WidgetArticleCategories = async ({ lang }: { lang: ELanguage }) => {
  const articleCatWidgetList = await getArticleCatList();

  return articleCatWidgetList.length > 0 ? (
    <ul className="sidebar-widget" data-testid="WidgetArticleCategories">
      <li className={styles.listItem}>
        <Link
          className={styles.itemLink}
          href={`/${lang}${WIDGET_ARTICLE_CATEGORY.href}`}
        >
          {WIDGET_ARTICLE_CATEGORY.title[lang]}
        </Link>
        <br />
      </li>
      {articleCatWidgetList.map((item) => (
        <li key={item.id} className={styles.listItem}>
          <Link
            className={styles.itemLink}
            href={`/${lang}${WIDGET_ARTICLE_CATEGORY.baseHrefOfList}/${item.cpu}/`}
          >
            {lang === ELanguage.UA ? item.title : item.title_en || item.title}
          </Link>
        </li>
      ))}
    </ul>
  ) : null;
};
export default WidgetArticleCategories;
