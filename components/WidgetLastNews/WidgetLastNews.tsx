import styles from './WidgetLastNews.module.scss';
import { getLastNewsWidgetList } from '@/controllers/sidebar.controller';
import { WIDGET_LAST_NEWS } from '@/models/widget.model';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../ui/SeoLink/SeoLink';

const WidgetLastNews = async ({ lang }: { lang: ELanguage }) => {
  const lastNewsWidgetList = await getLastNewsWidgetList();
  if (lastNewsWidgetList instanceof Error) return null;

  return (
    <div className="sidebar-widget" data-testid="WidgetLastNews">
      <h3 className={styles.title}>
        <SeoLink
          title={WIDGET_LAST_NEWS.ariaLabelForTitle[lang]}
          href={`/${lang}/${WIDGET_LAST_NEWS.href}`}
          className={styles.titleLink}
        >
          {WIDGET_LAST_NEWS.title[lang]}
        </SeoLink>
      </h3>
      <ul className={styles.listBody}>
        {lastNewsWidgetList.map((item) => {
          const itemTitle =
            lang === ELanguage.UA ? item.title : item.title_en || item.title;

          return (
            <li key={item.id} className={styles.listItem}>
              <SeoLink
                title={`${WIDGET_LAST_NEWS.ariaLabel[lang]}: "${itemTitle}"`}
                href={`/${lang}/${WIDGET_LAST_NEWS.baseHrefOfList}/${item.cpu}/`}
              >
                {itemTitle} ...
              </SeoLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WidgetLastNews;
