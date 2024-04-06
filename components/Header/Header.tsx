import React from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import ToggleSidebarLabel from '../ToggleSidebarLabel/ToggleSidebarLabel';
import { LOGO, TOGGLE_SIDEBAR_BUTTON_TITLE } from '@/models/header.model';
import FillingImg from '../Images/FillingImage';
import { LANGUAGE } from '@/models/ui.model';

const Header = () => (
  <header className={styles.Header} data-testid="Header">
    <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
      {TOGGLE_SIDEBAR_BUTTON_TITLE}
    </ToggleSidebarLabel>
    <Link
      href={LOGO.link.href}
      title={LOGO.link.title[LANGUAGE]}
      className={styles.Link}
    >
      <FillingImg
        {...LOGO.link.siteLogo}
        alt={LOGO.link.siteLogo.alt[LANGUAGE]}
      />
    </Link>
  </header>
);

export default Header;
