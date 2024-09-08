import styles from './Accordion.module.scss';
import {
  getChannelCatList,
  // getChannelSatList,
  getFlyChannelSatList,
  getUsefulArticleList,
} from '@/controllers/sidebar.controller';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';
import { MENU_ACCORDION } from '@/models/menuAccordion.model';
import { getSatMapList } from '@/controllers/articles.controller';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

const {
  SATELLITE_TV,
  SATELLITES,
  // SATELLITES_FLY,
  SAT_FINDER,
  MAPS,
  PACKAGES,
  USEFUL,
  ONLINE_TV,
  SCHEDULE,
} = MENU_ACCORDION;

const Accordion = async ({ lang }: { lang: ELanguage }) => {
  // const installationsList = await getInstallationsList();

  const channelCatListResp = await getChannelCatList();
  // const channelSatListResp = await getChannelSatList();
  const flyChannelSatList = await getFlyChannelSatList();
  const usefulArticleListResp = await getUsefulArticleList();
  const mapsResp = await getSatMapList();

  const maps = mapsResp instanceof Error ? [] : mapsResp;

  const channelCatList =
    channelCatListResp instanceof Error ? [] : channelCatListResp;

  // const channelSatList =
  //   channelSatListResp instanceof Error ? [] : channelSatListResp;

  const usefulArticleList =
    usefulArticleListResp instanceof Error ? [] : usefulArticleListResp;

  return (
    <nav className={styles.Accordion} data-testid="Accordion">
      <ul>
        <AccordionMenuItem lang={lang} options={SATELLITE_TV} />
        <AccordionMenuItem lang={lang} options={SAT_FINDER} />
        {/* <AccordionMenuItem lang={lang} options={INSTALLATIONS}>
          <ul className={styles.accordionContent}>
            {installationsList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <SeoLink
                  href={`/${lang}${INSTALLATIONS.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem> */}
        {/* <AccordionMenuItem lang={lang} options={SATELLITES}>
          <ul className={styles.accordionContent}>
            {channelSatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <SeoLink
                  href={`/${lang}${SATELLITES.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title} {item.position}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem> */}
        <AccordionMenuItem lang={lang} options={SATELLITES}>
          <ul className={styles.accordionContent}>
            {flyChannelSatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <SeoLink
                  title={
                    lang === ELanguage.UA
                      ? `Перейти до перегляду списку каналів з супутника "${item.title} / ${item.position}"`
                      : `Go to view the list of channels broadcast from the "${item.title} / ${item.position}" satellite`
                  }
                  href={`/${lang}${SATELLITES.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  <span className="text-lime-200">{item.title}</span>{' '}
                  {item.position}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={MAPS}>
          <ul className={styles.accordionContent}>
            {maps.map((item) => (
              <li key={item.beam_id} className={styles.contentItem}>
                <SeoLink
                  title={
                    lang === ELanguage.UA
                      ? `Перейти до перегляду мап покриття супутника "${item.title} / ${item.position}"`
                      : `Go to view the map coverage of the "${item.title} / ${item.position}" satellite`
                  }
                  href={`/${lang}${MAPS.baseHrefOfList}/${item.cpu}`}
                  className={styles.contentItemLink}
                >
                  {item.title} {item.position}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={PACKAGES}>
          <ul className={styles.accordionContent}>
            {channelCatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <SeoLink
                  title={
                    lang === ELanguage.UA
                      ? `Перейти до перегляду списку каналів пакету "${item.title}"`
                      : `Go to view the list of channels in the "${item.title}" package`
                  }
                  href={`/${lang}${PACKAGES.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={USEFUL}>
          <ul className={styles.accordionContent}>
            {usefulArticleList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <SeoLink
                  title={
                    lang === ELanguage.UA
                      ? `Натисніть, щоб читати статтю "${item.title}"`
                      : `Click to read the "${item.title_en || item.title}" article`
                  }
                  href={`/${lang}${USEFUL.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {lang === ELanguage.UA
                    ? item.title
                    : item.title_en || item.title}
                </SeoLink>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        {/* EQUIPMENT */}
        {/* {menu_selcat.map((menu_arrcat) => (
            <li key={menu_arrcat.id}>
                <Image
                  width="32"
                  height="32"
                  src="/Images/accordion/hardwarepng_1855.png"
                  alt="Обладнання для супутникового та ефірного тб"
                />
                Обладнання
              <ul>
                {menu_arrcat.map((item) => (
                  <li key={item.id} className={styles.contentItem}>
                    <SeoLink href={`/${lang}/kategorija-tovara/${item.cpu}/`} className={styles.contentItemLink}>
                      <Image
                        height="16"
                        width="16"
                        src="/Images/accordion/bulb2.png"
                        alt={item.title}
                      />
                      {item.title}
                    </SeoLink>
                  </li>
                ))}
              </ul>
            </li>
          ))} */}
        <AccordionMenuItem lang={lang} options={ONLINE_TV} />
        <AccordionMenuItem lang={lang} options={SCHEDULE} />
      </ul>
      <input
        type="radio"
        name="accordion-radio-button"
        id="accordion-closing-button"
      ></input>
    </nav>
  );
};

export default Accordion;
