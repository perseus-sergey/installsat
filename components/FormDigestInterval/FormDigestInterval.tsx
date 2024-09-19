'use client';

import {
  TRANS_NEWS_LIST_FILTERS,
  getDigestIntervalOptions,
} from '@/models/satDigest.model';
import { usePathname, useRouter } from 'next/navigation';
import { EUrlSearchParam } from '@/models/url.model';
import Fieldset from '../ui/Fieldset/Fieldset';
import { ELanguage, ESelectType } from '@/models/ui.model';
import { IGroupedSatelliteOption } from '@/models/tblSat.model';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import { SelectorMulti } from '../SatelliteSelector/SelectorMulti';
import { SelectorSingle } from '../SatelliteSelector/SelectorSingle';

const {
  fieldsetTitle,
  resetButton,
  select: { satSelect, timeIntervalSelect },
} = TRANS_NEWS_LIST_FILTERS;
interface IFormDigestIntervalProps {
  groupedSats: IGroupedSatelliteOption[];
  lang: ELanguage;
}

const FormDigestInterval = ({
  groupedSats,
  lang,
}: IFormDigestIntervalProps) => {
  const pathname = usePathname();
  const { replace, refresh } = useRouter();

  const digestIntervalOptions = getDigestIntervalOptions(lang);

  const resetAll = () => {
    replace(pathname);
    refresh();
  };

  return (
    <Fieldset legendText={fieldsetTitle[lang]}>
      <div className="flex flex-col justify-center items-center gap-2 pb-4">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 p-2 text-gray-400">
          {groupedSats.length > 0 ? (
            <SelectorMulti
              selectName={ESelectType.SELECT_SATS}
              className="z-20"
              closeMenuOnSelect
              searchParamName={EUrlSearchParam.SAT}
              itemList={groupedSats instanceof Error ? [] : groupedSats}
              caption={satSelect.title[lang]}
            />
          ) : null}

          {digestIntervalOptions[0] ? (
            <SelectorSingle
              selectName={ESelectType.SELECT_TIME_INTERVAL}
              className="z-10"
              closeMenuOnSelect
              searchParamName={EUrlSearchParam.INTERVAL}
              itemList={digestIntervalOptions}
              caption={timeIntervalSelect.title[lang]}
            />
          ) : null}
        </div>
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
      </div>
    </Fieldset>
  );
};

export default FormDigestInterval;
