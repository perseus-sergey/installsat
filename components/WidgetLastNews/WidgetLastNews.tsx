import styles from './WidgetLastNews.module.scss';
import { getLastNewsWidgetList } from '@/controllers/sidebar.controller';
import { WIDGET_LAST_NEWS } from '@/models/widget.model';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../ui/SeoLink/SeoLink';

const WidgetLastNews = async ({ lang }: { lang: ELanguage }) => {
  const lastNewsWidgetList = await getLastNewsWidgetList();
  if (lastNewsWidgetList instanceof Error) return null;

  return (
    <nav
      className="text-stone-300 p-4 rounded border border-solid border-stone-400 my-1 mx-auto overflow-hidden bg-gradient-to-b from-black to-blue-900"
      data-testid="WidgetLastNews"
    >
      <h3 className={`${styles.title} min-h-12 pb-2 font-bold text-xl`}>
        <SeoLink
          title={WIDGET_LAST_NEWS.ariaLabelForTitle[lang]}
          href={`/${lang}/${WIDGET_LAST_NEWS.href}`}
          className={`${styles.titleLink} flex items-center gap-4 text-white`}
        >
          {WIDGET_LAST_NEWS.title[lang]}
        </SeoLink>
      </h3>
      <ul>
        {lastNewsWidgetList.map((item) => {
          const itemTitle =
            lang === ELanguage.UA ? item.title : item.title_en || item.title;

          return (
            <li key={item.id} className={`${styles.listItem} py-1`}>
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
    </nav>
  );
};

export default WidgetLastNews;
