import React from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { EUrlParam } from '@/models/url.model';
import ToggleSidebarLabel from '../ToggleSidebarLabel/ToggleSidebarLabel';

const Header = () => (
  <header className={styles.Header} data-testid="Header">
    <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
      ☰
    </ToggleSidebarLabel>
    <Link
      href={EUrlParam.BASE_PATH}
      title="To Home Page"
      className={styles.Link}
    >
      <Image
        className={styles.Logo}
        src="/images/InstallsatOrigBlue_200.png"
        alt="Installsat TV Logo"
        width={200}
        height={85}
        priority
      />
    </Link>
  </header>
);

export default Header;
