import { executeQuery } from '@/libs/db/mysqldb';
import styles from './WidgetArticleCategories.module.scss';
import { articleCategoriesSql } from '@/controllers/sidebar.controller';
import EmptyData from '../EmptyData/EmptyData';
import Link from 'next/link';
import { TCategories } from '@/models/tblCategories.model';
import { WIDGET_ARTICLE_CATEGORY } from '@/models/widget.model';

const WidgetArticleCategories = async () => {
  const articleCatWidgetList =
    await executeQuery<TCategories>(articleCategoriesSql);
  if (articleCatWidgetList instanceof Error) return <EmptyData />;

  return (
    <ul className="sidebar-widget" data-testid="WidgetArticleCategories">
      <li className={styles.listItem}>
        <Link className={styles.itemLink} href={WIDGET_ARTICLE_CATEGORY.href}>
          {WIDGET_ARTICLE_CATEGORY.title.ua}
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
  );
};
export default WidgetArticleCategories;
