import { ReactNode } from 'react';
import Image, { StaticImageData } from 'next/image';

import styles from '../Accordion/Accordion.module.scss';
import { ELanguage } from '@/models/language.model';
import {
  ACCORDION_ARIA_LABELS,
  IAccordionItemOptions,
} from '@/models/ui/menuAccordion.model';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

interface IAccordionMenuItem {
  options: IAccordionItemOptions;
  lang: ELanguage;
  menuIconSrc: StaticImageData;
  children?: ReactNode;
}

export const AccordionMenuItem = ({
  options: { name, title, img, titleHref },
  children,
  lang,
  menuIconSrc,
}: IAccordionMenuItem) => {
  const labelStyle =
    'flex items-center gap-3 h-14 border-t border-t-indigo-600 cursor-pointer';

  const gradientStyle = 'bg-gradient-to-b from-black to-blue-800';

  return children ? (
    <>
      <li className="relative" role="menuitem">
        <input
          type="radio"
          id={name}
          name="accordion-radio-button"
          className={`${styles.accordionRadio} hidden`}
        />
        <label
          htmlFor={name}
          className={`${styles.accordionLabel} ${labelStyle} ${gradientStyle} ${lang === ELanguage.AR ? `pl-2 after:content-['⏴']` : `pr-2 after:content-['⏵']`} justify-between`}
        >
          <div className={`${labelStyle} p-2`}>
            {menuIconSrc && (
              <Image src={menuIconSrc} alt={img.alt[lang] || ''} />
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
    <li className={`${gradientStyle}`} role="menuitem">
      <SeoLink
        title={ACCORDION_ARIA_LABELS.getBaseAL(title[lang])[lang]}
        className={`${labelStyle} p-2`}
        href={`/${lang}${titleHref}` || '#'}
      >
        {menuIconSrc && <Image src={menuIconSrc} alt={img.alt[lang] || ''} />}
        {title[lang]}
      </SeoLink>
    </li>
  );
};
