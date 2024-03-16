import React from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import mainLogo from '/public/images/InstallsatOrigBlue_200.png';
import ToggleSidebarLabel from '../ToggleSidebarLabel/ToggleSidebarLabel';
import { LOGO, TOGGLE_SIDEBAR_BUTTON_TITLE } from '@/models/header.model';

const Header = () => (
  <header className={styles.Header} data-testid="Header">
    <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
      {TOGGLE_SIDEBAR_BUTTON_TITLE}
    </ToggleSidebarLabel>
    <Link
      href={LOGO.link.href}
      title={LOGO.link.title.ua}
      className={styles.Link}
    >
      <Image
        className={styles.Logo}
        src={mainLogo}
        alt={LOGO.link.img.alt.ua}
      />
    </Link>
  </header>
);

export default Header;
