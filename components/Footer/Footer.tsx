import styles from './Footer.module.scss';
import Link from 'next/link';

const menuList = [
  {
    title: `Как установить спутниковую антенну`,
    href: '/statja/samostoyatelnaya-ustanovka-sputnikovoi-antenni',
  },
  {
    title: `Как определить направление антенны`,
    href: '/statja/napravlenie-antenny-po-karte',
  },
  {
    title: `Как настроить спутниковый ресивер`,
    href: '/statja/kak-sviazati-tuner-s-antennoi',
  },
  {
    title: `Спутниковое оборудование`,
    href: '/novosti-i-statji/satellite_equipments',
  },
  {
    title: `Телеканалы без абонплаты`,
    href: '/spisok-kanalov-paketa/bez-abonplati',
  },
  {
    title: `ТВ Онлайн`,
    href: '/spisok-online-kanalov/vse-tv',
  },
  {
    title: `Biss Ключи`,
    href: '/statja/key-biss',
  },
];

const Footer = () => (
  <>
    <div className={styles.Footer}>
      Copyright &copy; 2009 - {new Date().getFullYear()} Авторские права принадлежат компании
      Installsat. При копировании, ссылка на сайт обязательнa.
    </div>

    <nav className={styles.footerNav}>
      <ul className={styles.menuList}>
        {menuList.map((item, i) => {
          return (
            <Link href={item.href} className={styles.navLink} key={i}>
              {item.title}
            </Link>
          );
        })}
      </ul>
    </nav>
  </>
);

export default Footer;
