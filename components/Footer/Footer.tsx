import { COPYRIGHT_SECTION, footerMenuList } from '@/models/footer.model';
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

    <nav className="py-4 relative bg-slate-900">
      <ul className="w-11/12 m-auto text-gray-200 grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
        {footerMenuList.map((item, i) => {
          return (
            <Fragment key={i}>
              <li
                className={`min-w-36 max-w-28 before:content-['▪'] before:text-red-500 before:text-2xl flex flex-nowrap items-center text-left gap-4`}
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
    </nav>
  </footer>
);

export default Footer;
