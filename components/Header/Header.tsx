import React from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
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
        src="/images/InstallsatOrigBlue_200.png"
        alt={LOGO.link.img.alt.ua}
        width={200}
        height={85}
        priority
      />
    </Link>
  </header>
);

export default Header;
