import EmptyData from '../EmptyData/EmptyData';
import styles from './Accordion.module.scss';
import {
  getChannelCatList,
  getChannelSatList,
  getInstallationsList,
  getUsefulArticleList,
} from '@/controllers/sidebar.controller';
import Link from 'next/link';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';
import { ADDED_ITEMS, MENU_ACCORDION } from '@/models/menuAccordion.model';
import { LANGUAGE } from '@/models/ui.model';

const Accordion = async () => {
  const installationsList = await getInstallationsList();

  const channelCatList = await getChannelCatList();

  const channelSatList = await getChannelSatList();

  const usefulArticleList = await getUsefulArticleList();

  if (
    installationsList instanceof Error ||
    usefulArticleList instanceof Error ||
    channelSatList instanceof Error ||
    channelCatList instanceof Error
  )
    return <EmptyData />;

  return (
    <nav className={styles.Accordion} data-testid="Accordion">
      <ul>
        <AccordionMenuItem
          language={LANGUAGE}
          options={MENU_ACCORDION.SATELLITE_TV}
        />
        <AccordionMenuItem
          language={LANGUAGE}
          options={MENU_ACCORDION.SAT_FINDER}
        />
        <AccordionMenuItem
          language={LANGUAGE}
          options={MENU_ACCORDION.INSTALLATIONS}
        >
          <ul className={styles.accordionContent}>
            {installationsList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`${MENU_ACCORDION.INSTALLATIONS.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem
          language={LANGUAGE}
          options={MENU_ACCORDION.SATELLITES}
        >
          <ul className={styles.accordionContent}>
            {channelSatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`${MENU_ACCORDION.SATELLITES.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title} {item.position}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem
          language={LANGUAGE}
          options={MENU_ACCORDION.PACKAGES}
        >
          <ul className={styles.accordionContent}>
            <li className={styles.contentItem}>
              <Link
                href={ADDED_ITEMS.freeChannels.link}
                className={styles.contentItemLink}
              >
                {ADDED_ITEMS.freeChannels.title[LANGUAGE]}
              </Link>
            </li>
            {channelCatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`${MENU_ACCORDION.PACKAGES.baseHrefOfList}/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem language={LANGUAGE} options={MENU_ACCORDION.USEFUL}>
          <ul className={styles.accordionContent}>
            {usefulArticleList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`${MENU_ACCORDION.USEFUL.baseHrefOfList}/${item.cpu}/`}
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
        <AccordionMenuItem
          language={LANGUAGE}
          options={MENU_ACCORDION.ONLINE_TV}
        />
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
