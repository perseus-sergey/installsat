import styles from './WidgetArticleCategories.module.scss';
import Link from 'next/link';
import { WIDGET_ARTICLE_CATEGORY } from '@/models/widget.model';
import { LANGUAGE } from '@/models/ui.model';
import { getArticleCatList } from '@/controllers/articles.controller';

const WidgetArticleCategories = async () => {
  const articleCatWidgetList = await getArticleCatList();

  return articleCatWidgetList.length > 0 ? (
    <ul className="sidebar-widget" data-testid="WidgetArticleCategories">
      <li className={styles.listItem}>
        <Link className={styles.itemLink} href={WIDGET_ARTICLE_CATEGORY.href}>
          {WIDGET_ARTICLE_CATEGORY.title[LANGUAGE]}
        </Link>
        <br />
      </li>
      {articleCatWidgetList.map((item) => (
        <li key={item.id} className={styles.listItem}>
          <Link
            className={styles.itemLink}
            href={`${WIDGET_ARTICLE_CATEGORY.baseHrefOfList}/${item.cpu}/`}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  ) : null;
};
export default WidgetArticleCategories;
