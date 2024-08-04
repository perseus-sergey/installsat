import Link from 'next/link';
import styles from './WidgetLastNews.module.scss';
import { getLastNewsWidgetList } from '@/controllers/sidebar.controller';
import { WIDGET_LAST_NEWS } from '@/models/widget.model';
import { ELanguage } from '@/models/ui.model';

const WidgetLastNews = async ({ lang }: { lang: ELanguage }) => {
  const lastNewsWidgetList = await getLastNewsWidgetList();
  if (lastNewsWidgetList instanceof Error) return null;

  return (
    <div className="sidebar-widget" data-testid="WidgetLastNews">
      <h3 className={styles.title}>
        <Link
          href={`/${lang}/${WIDGET_LAST_NEWS.href}`}
          className={styles.titleLink}
        >
          {WIDGET_LAST_NEWS.title[lang]}
        </Link>
      </h3>
      <ul className={styles.listBody}>
        {lastNewsWidgetList.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <Link
              href={`/${lang}/${WIDGET_LAST_NEWS.baseHrefOfList}/${item.cpu}/`}
            >
              {lang === ELanguage.UA ? item.title : item.title_en || item.title}{' '}
              ...
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WidgetLastNews;
