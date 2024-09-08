import {
  COPYRIGHT_SECTION,
  MENU_SEPARATOR,
  footerMenuList,
} from '@/models/footer.model';
import styles from './Footer.module.scss';
import { ELanguage } from '@/models/ui.model';
import { Fragment } from 'react';
import SeoLink from '../ui/SeoLink/SeoLink';

const Footer = ({ lang }: { lang: ELanguage }) => (
  <footer className={styles.footer}>
    <section className={styles.Copyright}>
      {COPYRIGHT_SECTION.title[lang]}
    </section>

    <nav className={styles.footerMenu}>
      <ul className={styles.menuList}>
        {footerMenuList.map((item, i) => {
          return (
            <Fragment key={i}>
              {i ? (
                <li className={styles.separator}>{MENU_SEPARATOR}</li>
              ) : null}
              <li>
                <SeoLink
                  href={`/${lang}/${item.href}`}
                  className={styles.navLink}
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
