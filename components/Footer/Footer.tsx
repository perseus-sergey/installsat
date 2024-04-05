import {
  COPYRIGHT_SECTION,
  MENU_SEPARATOR,
  footerMenuList,
} from '@/models/footer.model';
import styles from './Footer.module.scss';
import Link from 'next/link';
import { LANGUAGE } from '@/models/ui.model';

const Footer = () => (
  <footer className={styles.footer}>
    <section className={styles.Copyright}>
      {COPYRIGHT_SECTION.title[LANGUAGE]}
    </section>

    <nav className={styles.footerMenu}>
      <ul className={styles.menuList}>
        {footerMenuList.map((item, i) => {
          return (
            <>
              {i ? (
                <span className={styles.separator}>{MENU_SEPARATOR}</span>
              ) : null}
              <li key={i}>
                <Link href={item.href} className={styles.navLink}>
                  {item.title[LANGUAGE]}
                </Link>
              </li>
            </>
          );
        })}
      </ul>
    </nav>
  </footer>
);

export default Footer;
