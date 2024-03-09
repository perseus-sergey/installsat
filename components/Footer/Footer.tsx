import { footerMenuList } from '@/models/footer.model';
import styles from './Footer.module.scss';
import Link from 'next/link';

const Footer = () => (
  <footer>
    <div className={styles.Footer}>
      Copyright &copy; 2009 - {new Date().getFullYear()} Copyright in
      Installsat. The link to the site is required when copying content.
    </div>

    <nav className={styles.footerNav}>
      <ul className={styles.menuList}>
        {footerMenuList.map((item, i) => {
          return (
            <Link href={item.href} className={styles.navLink} key={i}>
              {item.title.ua}
            </Link>
          );
        })}
      </ul>
    </nav>
  </footer>
);

export default Footer;
