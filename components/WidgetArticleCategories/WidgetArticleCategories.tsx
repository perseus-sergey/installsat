import { executeQuery } from '@/libs/db/mysqldb';
import styles from './WidgetArticleCategories.module.scss';
import { articleCategoriesSql } from '@/controllers/sidebar.controller';
import EmptyData from '../EmptyData/EmptyData';
import Link from 'next/link';
import { TCategories } from '@/models/tblCategories.model';

const WidgetArticleCategories = async () => {
  const articleCatWidgetList =
    await executeQuery<TCategories>(articleCategoriesSql);
  if (articleCatWidgetList instanceof Error) return <EmptyData />;

  return (
    <ul className="sidebar-widget" data-testid="WidgetArticleCategories">
      <li className={styles.listItem}>
        <Link
          className={styles.itemLink}
          href="/novosti-i-statji/transpondernye-novosti/"
        >
          Транспондерні новини
        </Link>
        <br />
      </li>
      {articleCatWidgetList.map((item) => (
        <li key={item.id} className={styles.listItem}>
          <Link
            className={styles.itemLink}
            href={`/novosti-i-statji/${item.cpu}/`}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default WidgetArticleCategories;
