import styles from './Accordion.module.scss';
import {
  getChannelCatList,
  getFlyChannelSatList,
  getSatMapsSideBar,
  getUsefulArticleList,
} from '@/controllers/sidebar.controller';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';
import { MENU_ACCORDION } from '@/models/menuAccordion.model';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

const { SATELLITES, SAT_FINDER, MAPS, PACKAGES, USEFUL, ONLINE_TV, SCHEDULE } =
  MENU_ACCORDION;

const Accordion = async ({ lang }: { lang: ELanguage }) => {
  const channelCatListResp = await getChannelCatList(lang);
  const flyChannelSatList = await getFlyChannelSatList();
  const usefulArticleListResp = await getUsefulArticleList();
  const maps = await getSatMapsSideBar();

  const channelCatList =
    channelCatListResp instanceof Error ? [] : channelCatListResp;

  const usefulArticleList =
    usefulArticleListResp instanceof Error ? [] : usefulArticleListResp;

  const accordContentStyle = 'max-h-0 overflow-hidden bg-stone-400';
  const contentItemStyle =
    'border-b border-stone-300 py-[5px] px-2 hover:bg-slate-500';

  return (
    <nav className="mx-auto py-4 text-white" data-testid="Accordion">
      <ul>
        <AccordionMenuItem lang={lang} options={SAT_FINDER} />
        <AccordionMenuItem lang={lang} options={SATELLITES}>
          <ul className={`${styles.accordionContent} ${accordContentStyle}`}>
            {flyChannelSatList.map((item) => (
              <li key={item.cpu} className={contentItemStyle}>
                <SeoLink
                  title={
                    lang === ELanguage.UA
                      ? `Перейти до перегляду списку каналів з супутника "${item.title} / ${item.position}"`
                      : `Go to view the list of channels broadcast from the "${item.title} / ${item.position}" satellite`
                  }
                  href={`/${lang}${SATELLITES.baseHrefOfList}/${item.cpu}/`}
                  className={`${styles.contentItemLink} flex items-center gap-3`}
                >
                  <span className="text-lime-200">{item.title}</span>{' '}
                  {item.position}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={MAPS}>
          <ul className={`${styles.accordionContent} ${accordContentStyle}`}>
            {maps.map((item) => (
              <li key={item.cpu} className={contentItemStyle}>
                <SeoLink
                  title={
                    lang === ELanguage.UA
                      ? `Перейти до перегляду мап покриття супутника "${item.title} / ${item.position}"`
                      : `Go to view the map coverage of the "${item.title} / ${item.position}" satellite`
                  }
                  href={`/${lang}${MAPS.baseHrefOfList}/${item.cpu}`}
                  className={`${styles.contentItemLink} flex items-center gap-3`}
                >
                  <span className="text-lime-200">{item.title}</span>{' '}
                  {item.position}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={PACKAGES}>
          <ul className={`${styles.accordionContent} ${accordContentStyle}`}>
            {channelCatList.map((item) => (
              <li key={item.id} className={contentItemStyle}>
                <SeoLink
                  title={
                    lang === ELanguage.UA
                      ? `Перейти до перегляду списку каналів пакету "${item.title}"`
                      : `Go to view the list of channels in the "${item.title}" package`
                  }
                  href={`/${lang}${PACKAGES.baseHrefOfList}/${item.cpu}/`}
                  className={`${styles.contentItemLink} flex items-center gap-3`}
                >
                  {item.title}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={USEFUL}>
          <ul className={`${styles.accordionContent} ${accordContentStyle}`}>
            {usefulArticleList.map((item) => (
              <li key={item.id} className={contentItemStyle}>
                <SeoLink
                  title={
                    lang === ELanguage.UA
                      ? `Натисніть, щоб читати статтю "${item.title}"`
                      : `Click to read the "${item.title_en || item.title}" article`
                  }
                  href={`/${lang}${USEFUL.baseHrefOfList}/${item.cpu}/`}
                  className={`${styles.contentItemLink} flex items-center gap-3`}
                >
                  {lang === ELanguage.UA
                    ? item.title
                    : item.title_en || item.title}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={ONLINE_TV} />
        <AccordionMenuItem lang={lang} options={SCHEDULE} />
      </ul>
      <input
        className="hidden"
        type="radio"
        name="accordion-radio-button"
        id="accordion-closing-button"
      ></input>
    </nav>
  );
};

export default Accordion;
