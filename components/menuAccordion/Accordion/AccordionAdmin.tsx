import styles from './Accordion.module.scss';
import Link from 'next/link';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';
import { MENU_ACCORDION_ADMIN } from '@/models/menuAccordionAdmin.model';
import { ELanguage } from '@/models/ui.model';

const { EN } = ELanguage;

const AccordionAdmin = async () => {
  return (
    <nav className={styles.Accordion} data-testid="Accordion">
      <ul>
        {Object.values(MENU_ACCORDION_ADMIN).map((menuType, index) => {
          return menuType.links ? (
            <AccordionMenuItem
              lang={EN}
              options={menuType}
              key={index}
              menuIconSrc={menuType.img.src}
            >
              <ul className={styles.accordionContent}>
                {menuType.links.map((item) => (
                  <li key={item.title} className={styles.contentItem}>
                    <Link
                      href={`/${EN}${item.href}`}
                      className={styles.contentItemLink}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionMenuItem>
          ) : (
            <AccordionMenuItem
              lang={EN}
              options={menuType}
              key={index}
              menuIconSrc={menuType.img.src}
            />
          );
        })}
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
