import { footerMenuList } from '@/models/footer.model';
import styles from './Footer.module.scss';
import Link from 'next/link';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.Copyright}>
      Copyright &copy; 2009 - {new Date().getFullYear()} Copyright in
      Installsat. The link to the site is required when copying content.
    </div>

    <nav className={styles.footerMenu}>
      <ul className={styles.menuList}>
        {footerMenuList.map((item, i) => {
          return (
            <>
              {i ? <span className={styles.separator}>▪</span> : null}
              <li key={i}>
                <Link href={item.href} className={styles.navLink}>
                  {item.title.ua}
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
