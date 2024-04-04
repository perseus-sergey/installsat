import Link from 'next/link';
import styles from './WidgetLastNews.module.scss';
import { getLastNewsWidgetList } from '@/controllers/sidebar.controller';
import EmptyData from '../EmptyData/EmptyData';
import { WIDGET_LAST_NEWS } from '@/models/widget.model';
import { CURRENT_LANGUAGE } from '@/models/ui.model';

const WidgetLastNews = async () => {
  const lastNewsWidgetList = await getLastNewsWidgetList();
  if (lastNewsWidgetList instanceof Error) return <EmptyData />;

  return (
    <div className="sidebar-widget" data-testid="WidgetLastNews">
      <h3 className={styles.title}>
        <Link href={WIDGET_LAST_NEWS.href} className={styles.titleLink}>
          {WIDGET_LAST_NEWS.title[CURRENT_LANGUAGE]}
        </Link>
      </h3>
      <ul className={styles.listBody}>
        {lastNewsWidgetList.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <Link href={`${WIDGET_LAST_NEWS.baseHrefOfList}/${item.cpu}/`}>
              {item.title} ...
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WidgetLastNews;
