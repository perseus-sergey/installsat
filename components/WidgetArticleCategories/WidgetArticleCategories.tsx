import styles from './WidgetArticleCategories.module.scss';
import EmptyData from '../EmptyData/EmptyData';
import Link from 'next/link';
import { WIDGET_ARTICLE_CATEGORY } from '@/models/widget.model';
import { getArticleCatWidgetList } from '@/controllers/sidebar.controller';

const WidgetArticleCategories = async () => {
  const articleCatWidgetList = await getArticleCatWidgetList();
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
