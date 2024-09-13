import { ELanguage } from '@/models/ui.model';
import styles from '../Accordion/Accordion.module.scss';

import { ReactNode } from 'react';
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
}: IAccordionMenuItem) => {
  const labelStyle =
    'flex items-center gap-3 h-14 border-t border-t-indigo-600 cursor-pointer';

  return children ? (
    <>
      <input
        type="radio"
        id={name}
        name="accordion-radio-button"
        className={`${styles.accordionRadio} hidden`}
      />
      <li className={`${styles.accordionItem} relative`}>
        <label
          htmlFor={name}
          className={`${styles.accordionLabel} ${styles.arrow} ${labelStyle} justify-between pr-2`}
        >
          <div className={`${styles.titleWrapper} ${labelStyle} p-2`}>
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
          className={`${styles.closing} hidden absolute w-full top-0 left-0 cursor-pointer h-14`}
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
        className={`${styles.titleWrapper} ${labelStyle} p-2`}
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
};
