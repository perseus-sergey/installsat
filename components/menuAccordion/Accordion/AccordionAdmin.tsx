import styles from './Accordion.module.scss';
import Link from 'next/link';
import { AccordionMenuItem } from '../AccordionMenuItem/AccordionMenuItem';
import { MENU_ACCORDION_ADMIN } from '@/models/menuAccordionAdmin.model';
import { ELanguage } from '@/models/ui.model';

const { EN } = ELanguage;

const AccordionAdmin = async () => {
  const accordContentStyle =
    'max-h-0 overflow-hidden transition-all duration-300 ease-out';
  const contentListStyle = `flex items-center gap-3 before:w-4 before:h-4 before:content-['*'] before:text-xl before:text-blue-100`;
  const contentItemStyle =
    'border-b border-stone-300 py-1 px-2 bg-stone-400 hover:bg-slate-500';

  return (
    <nav className="mx-auto py-4 text-white" data-testid="Accordion">
      <ul>
        {Object.values(MENU_ACCORDION_ADMIN).map((menuType, index) => {
          return menuType.links ? (
            <AccordionMenuItem
              lang={EN}
              options={menuType}
              key={index}
              menuIconSrc={menuType.img.src}
            >
              <ul
                className={`${styles.accordionContent} ${accordContentStyle}`}
              >
                {menuType.links.map((item) => (
                  <li key={item.title} className={contentItemStyle}>
                    <Link
                      href={`/${EN}${item.href}`}
                      className={contentListStyle}
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
        className="hidden"
        type="radio"
        name="accordion-radio-button"
        id="accordion-closing-button"
      ></input>
    </nav>
  );
};

export default AccordionAdmin;
