import styles from './Accordion.module.scss';
import {
  getChannelCatList,
  getChannelSatList,
  getUsefulArticleList,
} from '@/controllers/sidebar.controller';
import Link from 'next/link';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';
import { MENU_ACCORDION } from '@/models/menuAccordion.model';
import { getSatMapList } from '@/controllers/articles.controller';
import { ELanguage } from '@/models/ui.model';

const {
  SATELLITE_TV,
  SATELLITES,
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
  const channelSatListResp = await getChannelSatList();
  const usefulArticleListResp = await getUsefulArticleList();
  const mapsResp = await getSatMapList();

  const maps = mapsResp instanceof Error ? [] : mapsResp;

  const channelCatList =
    channelCatListResp instanceof Error ? [] : channelCatListResp;

  const channelSatList =
    channelSatListResp instanceof Error ? [] : channelSatListResp;

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
                <Link
                  href={`${INSTALLATIONS.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem> */}
        <AccordionMenuItem lang={lang} options={SATELLITES}>
          <ul className={styles.accordionContent}>
            {channelSatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`${SATELLITES.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title} {item.position}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={MAPS}>
          <ul className={styles.accordionContent}>
            {maps.map((item) => (
              <li key={item.beam_id} className={styles.contentItem}>
                <Link
                  href={`${MAPS.baseHrefOfList}/${item.cpu}`}
                  className={styles.contentItemLink}
                >
                  {item.title} {item.position}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={PACKAGES}>
          <ul className={styles.accordionContent}>
            {channelCatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`${PACKAGES.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem lang={lang} options={USEFUL}>
          <ul className={styles.accordionContent}>
            {usefulArticleList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`${USEFUL.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </Link>
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
                    <Link href={`/kategorija-tovara/${item.cpu}/`} className={styles.contentItemLink}>
                      <Image
                        height="16"
                        width="16"
                        src="/Images/accordion/bulb2.png"
                        alt={item.title}
                      />
                      {item.title}
                    </Link>
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
