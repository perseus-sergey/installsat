import { WIDGET_ARTICLE_CATEGORY } from '@/models/widget.model';
import { ELanguage } from '@/models/ui.model';
import { getArtCatListSideBar } from '@/controllers/articles.controller';
import SeoLink from '../ui/SeoLink/SeoLink';

const WidgetArticleCategories = async ({ lang }: { lang: ELanguage }) => {
  const articleCatWidgetList = await getArtCatListSideBar(lang);

  return articleCatWidgetList.length > 0 ? (
    <ul
      className="tracking-wide text-stone-200 p-4 rounded border border-solid border-stone-400 my-1 mx-auto overflow-hidden bg-gradient-to-b from-black to-blue-900"
      data-testid="WidgetArticleCategories"
    >
      <li className="font-bold py-2 border-b border-stone-400">
        <SeoLink
          title={WIDGET_ARTICLE_CATEGORY.ariaLabelForTitle[lang]}
          href={`/${lang}${WIDGET_ARTICLE_CATEGORY.href}`}
        >
          {WIDGET_ARTICLE_CATEGORY.title[lang]}
        </SeoLink>
        <br />
      </li>
      {articleCatWidgetList.map((item) => {
        return (
          <li
            key={item.cpu}
            className="font-bold py-2 border-b border-dotted border-stone-400"
          >
            <SeoLink
              title={`${WIDGET_ARTICLE_CATEGORY.ariaLabel[lang]}: "${item.title}"`}
              href={`/${lang}${WIDGET_ARTICLE_CATEGORY.baseHrefOfList}/${item.cpu}/`}
            >
              {item.title}
            </SeoLink>
          </li>
        );
      })}
    </ul>
  ) : null;
};
export default WidgetArticleCategories;
