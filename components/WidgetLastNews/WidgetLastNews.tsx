import { getLastNewsWidgetList } from '@/controllers/sidebar.controller';
import { WIDGET_LAST_NEWS } from '@/models/widget.model';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../ui/SeoLink/SeoLink';
import titleLinkImg from 'public/Images/last_news_55.png';
import Image from 'next/image';

const WidgetLastNews = async ({ lang }: { lang: ELanguage }) => {
  const lastNewsWidgetList = await getLastNewsWidgetList();
  if (lastNewsWidgetList instanceof Error) return null;

  return (
    <nav
      className="text-stone-300 p-4 rounded border border-stone-400 h-fit mx-auto overflow-hidden bg-gradient-to-b from-black to-blue-900"
      data-testid="WidgetLastNews"
    >
      <h3 className="flex items-center gap-4 min-h-12 pb-2 font-bold text-xl border-b-4 border-slate-300 border-double">
        <Image
          src={titleLinkImg}
          alt={
            lang === ELanguage.UA ? 'Газета з новинами' : 'Newspaper with news'
          }
          className="shrink-0"
        />
        <SeoLink
          title={WIDGET_LAST_NEWS.ariaLabelForTitle[lang]}
          href={`/${lang}/${WIDGET_LAST_NEWS.href}`}
          className="flex items-center gap-4 text-white tracking-wide"
        >
          {WIDGET_LAST_NEWS.title[lang]}
        </SeoLink>
      </h3>
      <ul>
        {lastNewsWidgetList.map((item) => {
          const itemTitle =
            lang === ELanguage.UA ? item.title : item.title_en || item.title;

          return (
            <li
              key={item.id}
              className="py-1 border-b border-stone-300 before:text-red-500 before:text-xl before:content-['▪_'] after:content-['_...']"
            >
              <SeoLink
                title={`${WIDGET_LAST_NEWS.ariaLabel[lang]}: "${itemTitle}"`}
                href={`/${lang}/${WIDGET_LAST_NEWS.baseHrefOfList}/${item.cpu}/`}
              >
                {itemTitle}
              </SeoLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default WidgetLastNews;
