import React, { Suspense } from 'react';
import Link from 'next/link';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import { LOGO, TOGGLE_SIDEBAR_BUTTON_TITLE } from '@/models/header.model';
import FillingImg from '../ui/Images/FillingImage';
import { ELanguage, DEFAULT_LANG } from '@/models/ui.model';
import LangSwitchButton from '../LangSwitchButton/LangSwitchButton';

const { title, siteLogo } = LOGO.link;

const Header = ({ lang = DEFAULT_LANG }: { lang: ELanguage }) => (
  <header
    className="w-full flex items-center justify-between bg-gradient-to-b from-blue-800 to-white/0"
    data-testid="Header"
  >
    <nav className="flex items-center">
      <ToggleSidebarLabel className="px-2 pb-1 text-4xl text-gray-400 cursor-pointer border border-gray-300 rounded-md my-0 mx-4">
        {TOGGLE_SIDEBAR_BUTTON_TITLE}
      </ToggleSidebarLabel>
      <Link href={`/${lang}`} title={title[lang]} className="inline-block p-5">
        <FillingImg {...siteLogo} alt={siteLogo.alt[lang]} isPriority />
      </Link>
    </nav>
    <Suspense>
      <LangSwitchButton />
    </Suspense>
  </header>
);

export default Header;
