'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ELanguage } from '@/models/language.model';
import { TRANS_NEWS_LIST_FILTERS } from '@/models/satDigest.model';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';

const { resetButton } = TRANS_NEWS_LIST_FILTERS;

export default function ResetSearchParamsBtn({ lang }: { lang: ELanguage }) {
  const pathname = usePathname();
  const { replace, refresh } = useRouter();

  const resetAll = () => {
    replace(pathname);
    refresh();
  };

  return (
    <TooltipSimple tooltipText={resetButton.ariaLabel[lang]}>
      <BaseButton
        className="w-fit bg-sky-700 text-gray-100 px-4 py-2 rounded-md hover:bg-sky-600"
        ariaLabel={resetButton.ariaLabel[lang]}
        onClick={resetAll}
      >
        <span className="text-lg text-white">⏻ </span>
        {resetButton.title[lang]}
      </BaseButton>
    </TooltipSimple>
  );
}
