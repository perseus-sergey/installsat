import styles from './Accordion.module.scss';
import Link from 'next/link';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';
import { MENU_ACCORDION_ADMIN } from '@/models/menuAccordionAdmin.model';

const AccordionAdmin = async () => {
  // const channelCatListResp = await getChannelCatList();
  // const channelSatListResp = await getChannelSatList();
  // const usefulArticleListResp = await getUsefulArticleList();
  // const mapsResp = await getSatMapList();

  // const maps = mapsResp instanceof Error ? [] : mapsResp;

  // const channelCatList =
  //   channelCatListResp instanceof Error ? [] : channelCatListResp;

  // const channelSatList =
  //   channelSatListResp instanceof Error ? [] : channelSatListResp;

  // const usefulArticleList =
  //   usefulArticleListResp instanceof Error ? [] : usefulArticleListResp;

  // =================================================================
  // server env add: TINY_MCE_API_KEY
  // =================================================================

  return (
    <nav className={styles.Accordion} data-testid="Accordion">
      <ul>
        {Object.values(MENU_ACCORDION_ADMIN).map((menuType, index) => {
          return menuType.links ? (
            <AccordionMenuItem options={menuType} key={index}>
              <ul className={styles.accordionContent}>
                {menuType.links.map((item) => (
                  <li key={item.title} className={styles.contentItem}>
                    <Link href={item.href} className={styles.contentItemLink}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionMenuItem>
          ) : (
            <AccordionMenuItem options={menuType} />
          );
        })}
        {/* <AccordionMenuItem options={SATELLITE_TV} />
        <AccordionMenuItem options={SAT_FINDER} /> */}
        {/* <AccordionMenuItem options={INSTALLATIONS}>
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
        {/* <AccordionMenuItem options={SATELLITES}>
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
        <AccordionMenuItem options={MAPS}>
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
        <AccordionMenuItem options={PACKAGES}>
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
        </AccordionMenuItem> */}

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
        {/* <AccordionMenuItem options={ONLINE_TV} />
        <AccordionMenuItem options={SCHEDULE} /> */}
      </ul>
      <input
        type="radio"
        name="accordion-radio-button"
        id="accordion-closing-button"
      ></input>
    </nav>
  );
};

export default AccordionAdmin;
