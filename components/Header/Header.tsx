import React from 'react';
import Link from 'next/link';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import { LOGO, TOGGLE_SIDEBAR_BUTTON_TITLE } from '@/models/header.model';
import FillingImg from '../ui/Images/FillingImage';
import { LANGUAGE } from '@/models/ui.model';

const { href, title, siteLogo } = LOGO.link;

const Header = () => (
  <header
    className="w-full flex items-center bg-gradient-to-b from-blue-800 to-white/0"
    data-testid="Header"
  >
    <ToggleSidebarLabel className="px-2 pb-2 text-6xl text-gray-400 cursor-pointer border border-gray-300 rounded-md my-0 mx-4">
      {TOGGLE_SIDEBAR_BUTTON_TITLE}
    </ToggleSidebarLabel>
    <Link href={href} title={title[LANGUAGE]} className="inline-block p-5">
      <FillingImg {...siteLogo} alt={siteLogo.alt[LANGUAGE]} isPriority />
    </Link>
  </header>
);

export default Header;
