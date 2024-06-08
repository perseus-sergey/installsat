import {
  COPYRIGHT_SECTION,
  MENU_SEPARATOR,
  footerMenuList,
} from '@/models/footer.model';
import styles from './Footer.module.scss';
import Link from 'next/link';
import { LANGUAGE } from '@/models/ui.model';
import { Fragment } from 'react';

const Footer = () => (
  <footer className={styles.footer}>
    <section className={styles.Copyright}>
      {COPYRIGHT_SECTION.title[LANGUAGE]}
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
                <Link href={item.href} className={styles.navLink}>
                  {item.title[LANGUAGE]}
                </Link>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </nav>
  </footer>
);

export default Footer;
