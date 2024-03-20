import { ILang } from '@/models/ui.model';
import styles from '../Accordion/Accordion.module.scss';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IAccordionItemOptions } from '@/models/menuAccordion.model';

interface IAccordionMenuItem {
  language: keyof ILang;
  options: IAccordionItemOptions;
  children?: ReactNode;
}

export const AccordionMenuItem = ({
  language,
  options,
  children,
}: IAccordionMenuItem) => {
  const { name, title, img, titleHref } = options;

  return children ? (
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
              <Image
                width={0}
                height={0}
                src={img.src}
                alt={img.alt[language] || ''}
                style={{ width: `${img.width}px`, height: 'auto' }}
              />
            )}
            {title[language]}
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
          <Image
            width={0}
            height={0}
            src={img.src}
            alt={img.alt[language] || ''}
            style={{ width: `${img.width}px`, height: 'auto' }}
          />
        )}
        {title[language]}
      </Link>
    </li>
  );
};
