import styles from './Accordion.module.scss';
import {
  getChannelCatList,
  getFlyChannelSatList,
  getSatMapsSideBar,
  getUsefulArticleList,
} from '@/controllers/sidebar.controller';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';
import {
  ACCORDION_ARIA_LABELS,
  MENU_ACCORDION,
} from '@/models/ui/menuAccordion.model';
import { ELanguage } from '@/models/language.model';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

import sitFinderIcon from 'public/Images/accordion/compass.png';
import mapCoverIcon from 'public/Images/accordion/point.png';
import satelliteIcon from 'public/Images/accordion/satellite32.png';
import chanPackagesIcon from 'public/Images/accordion/film24.png';
import usefulArticlesIcon from 'public/Images/accordion/icon_info_key.png';
import onlineTvIcon from 'public/Images/accordion/trailer-icon_37.png';
import scheduleIcon from 'public/Images/accordion/calendar.png';

const { SATELLITES, SAT_FINDER, MAPS, PACKAGES, USEFUL, ONLINE_TV, SCHEDULE } =
  MENU_ACCORDION;

const { getSatelliteAL, getPackageAL, getMapsAL, getArticlesAL } =
  ACCORDION_ARIA_LABELS;

const textShadow = {
  textShadow: '1px 1px 0 black',
};

const Accordion = async ({ lang }: { lang: ELanguage }) => {
  const channelCatListResp = await getChannelCatList(lang);
  const flyChannelSatList = await getFlyChannelSatList();
  const usefulArticleListResp = await getUsefulArticleList(lang);
  const maps = await getSatMapsSideBar();

  const channelCatList =
    channelCatListResp instanceof Error ? [] : channelCatListResp;

  const usefulArticleList =
    usefulArticleListResp instanceof Error ? [] : usefulArticleListResp;

  const accordContentStyle =
    'max-h-0 overflow-hidden transition-all duration-300 ease-out';
  const contentListStyle = `flex items-center gap-3 before:content-['*'] before:text-xl before:text-blue-100`;
  const contentItemStyle =
    'border-b border-stone-300 py-1 px-2 bg-stone-500 hover:bg-slate-500';

  return (
    <nav
      dir={lang === ELanguage.AR ? 'rtl' : 'ltr'}
      className="mx-auto py-4 text-white"
      data-testid="Accordion"
    >
      <ul role="menu">
        <AccordionMenuItem
          lang={lang}
          options={SAT_FINDER}
          menuIconSrc={sitFinderIcon}
        />

        <AccordionMenuItem
          lang={lang}
          options={SATELLITES}
          menuIconSrc={satelliteIcon}
        >
          <ul
            dir="ltr"
            role="menu"
            className={`${styles.accordionContent} ${accordContentStyle}`}
            style={textShadow}
          >
            {flyChannelSatList.map((item) => (
              <li role="menuitem" key={item.cpu} className={contentItemStyle}>
                <SeoLink
                  title={
                    getSatelliteAL(`${item.title} / ${item.position}`)[lang]
                  }
                  href={`/${lang}${SATELLITES.baseHrefOfList}/${item.cpu}/`}
                  className={contentListStyle}
                >
                  <span className="text-lime-200">{item.title}</span>{' '}
                  {item.position}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>

        <AccordionMenuItem
          lang={lang}
          options={MAPS}
          menuIconSrc={mapCoverIcon}
        >
          <ul
            dir="ltr"
            role="menu"
            className={`${styles.accordionContent} ${accordContentStyle}`}
            style={textShadow}
          >
            {maps.map((item) => (
              <li role="menuitem" key={item.cpu} className={contentItemStyle}>
                <SeoLink
                  title={getMapsAL(`${item.title} / ${item.position}`)[lang]}
                  href={`/${lang}${MAPS.baseHrefOfList}/${item.cpu}`}
                  className={contentListStyle}
                >
                  <span className="text-lime-200">{item.title}</span>{' '}
                  {item.position}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>

        <AccordionMenuItem
          lang={lang}
          options={PACKAGES}
          menuIconSrc={chanPackagesIcon}
        >
          <ul
            role="menu"
            className={`${styles.accordionContent} ${accordContentStyle}`}
            style={textShadow}
          >
            {channelCatList.map((item) => (
              <li role="menuitem" key={item.id} className={contentItemStyle}>
                <SeoLink
                  title={getPackageAL(item.title)[lang]}
                  href={`/${lang}${PACKAGES.baseHrefOfList}/${item.cpu}/`}
                  className={contentListStyle}
                >
                  {item.title}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>

        <AccordionMenuItem
          lang={lang}
          options={USEFUL}
          menuIconSrc={usefulArticlesIcon}
        >
          <ul
            role="menu"
            className={`${styles.accordionContent} ${accordContentStyle}`}
            style={textShadow}
          >
            {usefulArticleList.map((item) => (
              <li role="menuitem" key={item.id} className={contentItemStyle}>
                <SeoLink
                  title={getArticlesAL(item.title)[lang]}
                  href={`/${lang}${USEFUL.baseHrefOfList}/${item.cpu}/`}
                  className={contentListStyle}
                >
                  {item.title}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem
          lang={lang}
          options={ONLINE_TV}
          menuIconSrc={onlineTvIcon}
        />
        <AccordionMenuItem
          lang={lang}
          options={SCHEDULE}
          menuIconSrc={scheduleIcon}
        />
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
