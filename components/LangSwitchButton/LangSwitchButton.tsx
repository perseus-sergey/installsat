'use client';

import { usePathname, useRouter } from 'next/navigation';
import FillingImg from '../ui/Images/FillingImage';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';

// interface ILangSwitchButtonProps {
//   children?: React.ReactNode;
// }

const LangSwitchButton = () => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentLang = pathname.split('/')[1];
  const newLang = currentLang === 'en' ? 'ua' : 'en';

  const handleLangToggle = () => {
    replace(pathname.replace(`/${currentLang}`, `/${newLang}`));
  };

  return (
    <BaseButton
      onClick={handleLangToggle}
      ariaLabel={
        newLang === 'en' ? 'Switch to English' : 'Перемкнути на Українську'
      }
      className="text-gray-400 hover:text-gray-300 px-4"
    >
      <FillingImg
        width={32}
        height={32}
        alt={newLang === 'en' ? 'English' : 'Українська'}
        src={
          newLang === 'en'
            ? '/Images/english-language.png'
            : '/Images/ukraine-language.png'
        }
      />
      {newLang === 'en' ? 'EN' : 'UA'}
    </BaseButton>
  );
};

export default LangSwitchButton;
