import { executeQuery } from '@/libs/db/mysqldb';
import EmptyData from '../EmptyData/EmptyData';
import styles from './Accordion.module.scss';
import { TUsefulArticlesSqlModel } from '@/models/tblUseful.model';
import {
  channelCatsSql,
  channelSatsSql,
  installationsSql,
  usefulArticlesSql,
} from '@/controllers/sidebar.controller';
import { TSatModel } from '@/models/tblSat.model';
import Link from 'next/link';
import { TInstallationsModel } from '@/models/tblInstallations.model';
import { TChannelCatsModel } from '@/models/tblChannelCateg.model';
import { accordionTitles } from '@/models/sideBar.model';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';

const Accordion = async () => {
  const installationsList =
    await executeQuery<TInstallationsModel>(installationsSql);

  const channelCatList = await executeQuery<TChannelCatsModel>(channelCatsSql);

  const channelSatList = await executeQuery<TSatModel>(channelSatsSql);

  const usefulArticleList =
    await executeQuery<TUsefulArticlesSqlModel>(usefulArticlesSql);

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
          language="ua"
          options={accordionTitles.SATELLITE_TV}
        />
        <AccordionMenuItem
          language="ua"
          options={accordionTitles.INSTALLATIONS}
        >
          <ul className={styles.accordionContent}>
            {installationsList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`/varianty-ustanovki-anten/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem language="ua" options={accordionTitles.SATELLITES}>
          <ul className={styles.accordionContent}>
            {channelSatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`/spisok-kanalov-sputnika/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title} {item.position}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem language="ua" options={accordionTitles.PACKAGES}>
          <ul className={styles.accordionContent}>
            {channelCatList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`/spisok-kanalov-paketa/${item.cpu}/`}
                  className={styles.contentItemLink}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionMenuItem>
        <AccordionMenuItem language="ua" options={accordionTitles.USEFUL}>
          <ul className={styles.accordionContent}>
            {usefulArticleList.map((item) => (
              <li key={item.id} className={styles.contentItem}>
                <Link
                  href={`/statja/${item.cpu}/`}
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
        <AccordionMenuItem language="ua" options={accordionTitles.ONLINE_TV} />
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
