'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import FillingImg from '../ui/Images/FillingImage';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import { getELangKey } from '@/libs/utils/getLanguage';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';

import { LANGUAGE_SELECT } from '@/models/ui/header.model';

const LangSwitchButton = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentLang, setCurrentLang] = useState<ELanguage>(DEFAULT_LANG);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lang = getELangKey(pathname.split('/')[1]) || DEFAULT_LANG;
    setCurrentLang(lang);
  }, []);

  const handleLangToggle = (lang: ELanguage) => {
    const newPath = pathname.replace(`/${currentLang}`, `/${lang}`);
    replace(`${newPath}?${searchParams}`);
    setCurrentLang(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <BaseButton
        onClick={() => setIsOpen(!isOpen)}
        ariaLabel={LANGUAGE_SELECT[currentLang].ariaLabel}
        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-300"
      >
        <FillingImg
          width={24}
          height={24}
          alt={LANGUAGE_SELECT[currentLang].alt}
          src={LANGUAGE_SELECT[currentLang].imgSrc}
          isPriority
        />
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
                <FillingImg
                  width={24}
                  height={24}
                  src={langData.imgSrc}
                  alt={langData.alt}
                />
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
