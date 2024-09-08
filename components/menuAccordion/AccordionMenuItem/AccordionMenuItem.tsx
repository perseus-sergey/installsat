import { ELanguage } from '@/models/ui.model';
import styles from '../Accordion/Accordion.module.scss';

import React, { ReactNode } from 'react';
import { IAccordionItemOptions } from '@/models/menuAccordion.model';
import FillingImg from '../../ui/Images/FillingImage';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

interface IAccordionMenuItem {
  options: IAccordionItemOptions;
  lang: ELanguage;
  children?: ReactNode;
}

export const AccordionMenuItem = ({
  options: { name, title, img, titleHref },
  children,
  lang,
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
                alt={img.alt[lang] || ''}
                isFillParent
              />
            )}
            {title[lang]}
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
      <SeoLink
        title={
          lang === ELanguage.UA
            ? `Перейти до сторінки "${title[lang]}"`
            : `Go to the view of the "${title[lang]}" page`
        }
        className={styles.titleWrapper}
        href={`/${lang}${titleHref}` || '#'}
      >
        {img.src && (
          <FillingImg
            width={img.width}
            height={img.height}
            src={img.src}
            alt={img.alt[lang] || ''}
          />
        )}
        {title[lang]}
      </SeoLink>
    </li>
  );
