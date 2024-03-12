import Link from 'next/link';
import styles from './WidgetLastNews.module.scss';
import { lastNewsWidgetSql } from '@/controllers/sidebar.controller';
import EmptyData from '../EmptyData/EmptyData';
import { executeQuery } from '@/libs/db/mysqldb';
import { TUsefulArticlesSqlModel } from '@/models/tblUseful.model';

const WidgetLastNews = async () => {
  const lastNewsWidgetList =
    await executeQuery<TUsefulArticlesSqlModel>(lastNewsWidgetSql);
  if (lastNewsWidgetList instanceof Error) return <EmptyData />;

  return (
    <div className="sidebar-widget" data-testid="WidgetLastNews">
      <h3 className={styles.title}>
        <Link href="/novosti-i-statji/lastnews/" className={styles.titleLink}>
          Останні новини
        </Link>
      </h3>
      <ul className={styles.listBody}>
        {lastNewsWidgetList.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <Link href={`/statja/${item.cpu}/`}>{item.title} ...</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WidgetLastNews;
