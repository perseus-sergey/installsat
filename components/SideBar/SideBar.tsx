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
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    setMenuVisible(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 0);
  };

  const closeMenu = () => {
    setIsOpen(false);

    setTimeout(() => {
      setMenuVisible(false);
    }, 300);
  };

  return (
    <>
      <BaseButton
        ariaLabel={sideBarIcon.ariaLabel[lang]}
        className="bg-[url('/Images/accordion/sidebar_icon.png')] absolute bg-no-repeat w-8 h-8 sm:top-8 top-4 left-8 p-4 cursor-pointer"
        onClick={openMenu}
      />

      {menuVisible && (
        <>
          <BaseButton
            onClick={closeMenu}
            ariaLabel={sideBarCloseIcon.ariaLabel[lang]}
            className="fixed top-0 left-0 z-40 w-full h-full bg-gray-600/10"
          />
          <aside
            className={`
              overflow-y-auto fixed left-0 top-0 h-full w-64 sm:w-80 z-50
              pt-16 p-2 bg-slate-900 shadow-[10px_0_15px_-8px_#333333de]
              transition-transform duration-300 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }
              `}
          >
            <BaseButton
              ariaLabel={
                isOpen
                  ? sideBarCloseIcon.ariaLabel[lang]
                  : sideBarIcon.ariaLabel[lang]
              }
              className="bg-[url('/Images/accordion/sidebar_hide_icon.png')] bg-slate-900 fixed bg-no-repeat w-8 h-8 top-8 left-4 p-4 cursor-pointer"
              onClick={closeMenu}
            />
            {children}
          </aside>
        </>
      )}
    </>
  );
};

export default SideBar;
