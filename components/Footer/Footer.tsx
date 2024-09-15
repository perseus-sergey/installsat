import {
  COPYRIGHT_SECTION,
  MENU_SEPARATOR,
  footerMenuList,
} from '@/models/footer.model';
import { ELanguage } from '@/models/ui.model';
import { Fragment } from 'react';
import SeoLink from '../ui/SeoLink/SeoLink';

const Footer = ({ lang }: { lang: ELanguage }) => (
  <footer className="text-white">
    <section
      style={{ textShadow: '#000033 4px 4px 4px' }}
      className="text-center my-2 p-4 border-y border-slate-200 text-sm font-verdana bg-gradient-to-b from-indigo-900 to-sky-400"
    >
      {COPYRIGHT_SECTION.title[lang]}
    </section>

    <nav className="py-4 bg-slate-900">
      <ul className="flex flex-wrap justify-around items-center text-gray-200">
        {footerMenuList.map((item, i) => {
          return (
            <Fragment key={i}>
              {i ? (
                <li className="text-red-500 text-2xl">{MENU_SEPARATOR}</li>
              ) : null}
              <li className="max-w-28 text-center">
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
    </nav>
  </footer>
);

export default Footer;
