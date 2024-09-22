'use client';

import { ELanguage } from '@/models/ui.model';
import { OPEN_SIDE_BAR_BTN } from '@/models/header.model';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import { useState } from 'react';

const { sideBarCloseIcon, sideBarIcon } = OPEN_SIDE_BAR_BTN;

const SideBar = ({
  lang,
  children,
}: {
  lang: ELanguage;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // throw new Error('Error');

  return (
    <>
      <BaseButton
        onClick={() => setIsOpen(false)}
        ariaLabel={sideBarCloseIcon.ariaLabel[lang]}
        className={`fixed top-0 left-0 z-40 ${isOpen ? 'w-full h-full' : ''}`}
      />
      <BaseButton
        ariaLabel={
          isOpen
            ? sideBarCloseIcon.ariaLabel[lang]
            : sideBarIcon.ariaLabel[lang]
        }
        className={`${isOpen ? `bg-[url('/Images/accordion/sidebar_hide_icon.png')] bg-slate-900 fixed` : `bg-[url('/Images/accordion/sidebar_icon.png')] absolute`} bg-no-repeat w-8 h-8 top-1 left-1 p-4 cursor-pointer z-50 duration-300`}
        onClick={toggleAccordion}
      ></BaseButton>
      <aside
        className={`
          ${isOpen ? 'left-0' : '-left-full'} overflow-y-auto fixed top-0 h-full w-64 sm:w-80 z-40
          pt-16 p-2 bg-slate-900 shadow-lg
          transition-all ease-linear duration-300
          `}
      >
        {children}
      </aside>
    </>
  );
};

export default SideBar;
