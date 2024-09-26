import {
  COPYRIGHT_SECTION,
  EFooterColumns,
  footerColumnTitles,
  footerMenuList,
  IFooterMenuItem,
} from '@/models/footer.model';
import { ELanguage } from '@/models/ui.model';
import React, { Fragment } from 'react';
import SeoLink from '../ui/SeoLink/SeoLink';

const Footer = ({ lang }: { lang: ELanguage }) => (
  <footer className="text-white">
    <section
      style={{ textShadow: '#000033 4px 4px 4px' }}
      className="text-center my-2 p-4 border-y border-slate-200 text-sm font-verdana bg-gradient-to-b from-indigo-900 to-sky-400"
    >
      {COPYRIGHT_SECTION.title[lang]}
    </section>

    <nav className="flex flex-wrap justify-between lg:justify-around gap-8 p-4 bg-slate-900">
      {Object.entries(
        footerMenuList as Record<EFooterColumns, IFooterMenuItem[]>
      ).map(([columnType, columnItems]) => (
        <section key={columnType} className="group w-44 sm:w-auto">
          <h2 className="text-xl flex items-center gap-2">
            <div className="text-violet-200 transform group-hover:rotate-[360deg] duration-300">
              {footerColumnTitles[columnType as EFooterColumns].image}
            </div>
            {footerColumnTitles[columnType as EFooterColumns].title[lang]}
          </h2>
          <ul className="text-gray-200 flex flex-col gap-1">
            {columnItems.map((item, i) => {
              return (
                <Fragment key={i}>
                  <li
                    className={`before:content-['▪'] before:text-red-500 before:text-2xl flex flex-nowrap items-center text-left gap-4`}
                  >
                    <SeoLink
                      href={`/${lang}/${item.href}`}
                      title={
                        lang === ELanguage.UA
                          ? `Натисніть, щоб перейти до перегляду сторінки "${item.title[lang]}"`
                          : `Click to go to the view of the "${item.title[lang]}" page`
                      }
                    >
                      {item.title[lang]}
                    </SeoLink>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
    <div className="w-full">
      <div className="w-full flex"></div>
    </div>
  </footer>
);

export default Footer;
