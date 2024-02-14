import React from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';

const Header = () => (
  <header className={styles.Header} data-testid="Header">
    <Image
      className=""
      src="/images/InstallsatOrigBlue_200.png"
      alt="Installsat TV Logo"
      width={200}
      height={85}
      priority
    />
  </header>
);

export default Header;
