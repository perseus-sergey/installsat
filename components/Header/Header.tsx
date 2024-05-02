import React from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import { LOGO, TOGGLE_SIDEBAR_BUTTON_TITLE } from '@/models/header.model';
import FillingImg from '../ui/Images/FillingImage';
import { LANGUAGE } from '@/models/ui.model';

const { href, title, siteLogo } = LOGO.link;

const Header = () => (
  <header className={styles.Header} data-testid="Header">
    <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
      {TOGGLE_SIDEBAR_BUTTON_TITLE}
    </ToggleSidebarLabel>
    <Link href={href} title={title[LANGUAGE]} className={styles.Link}>
      <FillingImg {...siteLogo} alt={siteLogo.alt[LANGUAGE]} isPriority />
    </Link>
  </header>
);

export default Header;
