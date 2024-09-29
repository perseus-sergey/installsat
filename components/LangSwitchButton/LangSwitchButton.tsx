'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FillingImg from '../ui/Images/FillingImage';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import { useEffect, useState } from 'react';
import { DEFAULT_LANG, ELanguage } from '@/models/ui.model';
import { getELangKey } from '@/libs/utils/validSearchParam';

const { UA, EN } = ELanguage;

const LANG = {
  [EN]: {
    title: 'UA',
    alt: 'Українська',
    ariaLabel: 'Перемкнути на Українську',
    imgSrc: '/Images/ukraine_flag_24.png',
  },
  [UA]: {
    title: 'EN',
    alt: 'English',
    ariaLabel: 'Switch to English',
    imgSrc: '/Images/english_flag_24.png',
  },
};

const LangSwitchButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [currentLang, setCurrentLang] = useState(DEFAULT_LANG);

  useEffect(() => {
    const lang = getELangKey(pathname.split('/')[1]);
    setCurrentLang(lang);
  }, [pathname, searchParams]);

  const handleLangToggle = () => {
    const newLang = currentLang === EN ? UA : EN;
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    replace(`${newPath}?${searchParams}`);
  };

  return (
    <BaseButton
      onClick={handleLangToggle}
      ariaLabel={LANG[currentLang].ariaLabel}
      className="flex items-center flex-wrap gap-x-2 text-gray-400 hover:text-gray-300 px-[3vw]"
    >
      {LANG[currentLang].title}
      <FillingImg
        width={24}
        height={24}
        alt={LANG[currentLang].alt}
        src={LANG[currentLang].imgSrc}
        isPriority
      />
    </BaseButton>
  );
};

export default LangSwitchButton;
