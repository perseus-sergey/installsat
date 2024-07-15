import {
  COPYRIGHT_SECTION,
  MENU_SEPARATOR,
  footerMenuList,
} from '@/models/footer.model';
import styles from './Footer.module.scss';
import Link from 'next/link';
import { ELanguage } from '@/models/ui.model';
import { Fragment } from 'react';
import FillingImg from '../ui/Images/FillingImage';

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
                <span className={styles.separator}>{MENU_SEPARATOR}</span>
              ) : null}
              <li>
                <Link href={`/${lang}/${item.href}`} className={styles.navLink}>
                  {item.title[lang]}
                </Link>
              </li>
            </Fragment>
          );
        })}
      </ul>
      <Link href="/?ez_force_cookie_consent=1">
        <FillingImg
          width={24}
          height={24}
          alt={
            lang === ELanguage.UA
              ? 'Налаштування використання cookies'
              : 'Set up cookies'
          }
          src="/Images/cookie.png"
        />
      </Link>
    </nav>
  </footer>
);

export default Footer;
