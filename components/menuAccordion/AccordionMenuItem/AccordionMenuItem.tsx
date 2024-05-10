import { LANGUAGE } from '@/models/ui.model';
import styles from '../Accordion/Accordion.module.scss';

import { ReactNode } from 'react';
import Link from 'next/link';
import { IAccordionItemOptions } from '@/models/menuAccordion.model';
import FillingImg from '../../ui/Images/FillingImage';

interface IAccordionMenuItem {
  options: IAccordionItemOptions;
  children?: ReactNode;
}

export const AccordionMenuItem = ({
  options: { name, title, img, titleHref },
  children,
}: IAccordionMenuItem) =>
  children ? (
    <>
      <input
        type="radio"
        id={name}
        name="accordion-radio-button"
        className={styles.accordionRadio}
      />
      <li className={styles.accordionItem}>
        <label
          htmlFor={name}
          className={`${styles.accordionLabel} ${styles.arrow}`}
        >
          <div className={styles.titleWrapper}>
            {img.src && (
              <FillingImg
                width={img.width}
                height={img.height}
                src={img.src}
                alt={img.alt[LANGUAGE] || ''}
              />
            )}
            {title[LANGUAGE]}
          </div>
        </label>
        <label
          className={styles.closing}
          htmlFor="accordion-closing-button"
        ></label>
        {children}
      </li>
    </>
  ) : (
    <li className={styles.accordionItem}>
      <Link className={styles.titleWrapper} href={titleHref || '#'}>
        {img.src && (
          <FillingImg
            width={img.width}
            height={img.height}
            src={img.src}
            alt={img.alt[LANGUAGE] || ''}
          />
        )}
        {title[LANGUAGE]}
      </Link>
    </li>
  );
