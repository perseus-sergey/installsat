'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import { getELangKey } from '@/libs/utils/getLanguage';
import { ELanguage } from '@/models/language.model';

import { LANGUAGE_SELECT } from '@/models/ui/header.model';

const LangSwitchButton = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const currentUrlLang = pathname.split('/')[1];
  const currentLang = getELangKey(currentUrlLang);

  const handleLangToggle = (lang: ELanguage) => {
    const pathSegments = pathname.split('/');
    pathSegments[1] = lang;
    const newPath = pathSegments.join('/');
    replace(`${newPath}?${searchParams}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <BaseButton
        onClick={() => setIsOpen(!isOpen)}
        ariaLabel={LANGUAGE_SELECT[currentLang].ariaLabel}
        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-300"
      >
        {LANGUAGE_SELECT[currentLang].icon}
        <span>{LANGUAGE_SELECT[currentLang].title}</span>
      </BaseButton>

      {isOpen && (
        <ul className="absolute -translate-x-1/3 z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1">
          {Object.entries(LANGUAGE_SELECT).map(([langKey, langData]) => (
            <li key={langKey}>
              <BaseButton
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer w-full text-left"
                onClick={() => handleLangToggle(langKey as ELanguage)}
                ariaLabel={langData.ariaLabel}
              >
                {langData.icon}
                <span>{langData.alt}</span>
              </BaseButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LangSwitchButton;
