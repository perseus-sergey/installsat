'use client';

import {
  META_TRANS_NEWS_LIST,
  digestIntervalOptions,
} from '@/models/satDigest.model';
import { Loader } from '../ui/loaders/Loader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ESelectType,
  MySelect,
  Group,
  formatGroupSatLabel,
  createControlComponentInterval,
  createControlComponentSat,
} from '../ui/ReactSelect/ReactSelect';
import { MultiValue, SingleValue, components } from 'react-select';
import { EUrlSearchParam } from '@/models/url.model';
import Fieldset from '../ui/Fieldset/Fieldset';
import { ELanguage } from '@/models/ui.model';
import {
  IGroupedSatelliteOption,
  ISatelliteOption,
} from '@/models/tblSat.model';
import { useCallback, useEffect, useState } from 'react';
import { makeSelectedOptions } from '@/controllers/satFinder.controller';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';

const { fieldsetTitle } = META_TRANS_NEWS_LIST;
interface IFormDigestIntervalProps {
  groupedSats: IGroupedSatelliteOption[];
  lang: ELanguage;
}

const FormDigestInterval = ({
  groupedSats,
  lang,
}: IFormDigestIntervalProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, refresh } = useRouter();

  const [satSelectedOptions, setSatSelectedOptions] =
    useState<MultiValue<ISatelliteOption> | null>(null);
  const [intervalSelectedOptions, setIntervalSelectedOptions] =
    useState<SingleValue<ISatelliteOption> | null>(null);
  const [satGradeList, setSatGradeList] = useState(
    searchParams.getAll(EUrlSearchParam.SAT)
  );

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString())
  //     params.set(name, value)

  //     return params.toString()
  //   },
  //   [searchParams]
  // )

  useEffect(() => {
    const satUrlParams = searchParams.getAll(EUrlSearchParam.SAT);
    setSatSelectedOptions(makeSelectedOptions(satUrlParams, groupedSats));
    const intervalUrlParam = searchParams.get(EUrlSearchParam.INTERVAL);
    setIntervalSelectedOptions(
      digestIntervalOptions.find(
        (opt) => `${opt.value}` === intervalUrlParam
      ) || digestIntervalOptions[1]
    );
  }, [groupedSats, satGradeList, searchParams]);

  const getUrlSerPar = useCallback(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const handleSatSelect = (selected: MultiValue<ISatelliteOption>) => {
    setSatSelectedOptions(selected);
    const urlSePar = getUrlSerPar();

    urlSePar.delete(EUrlSearchParam.SAT);
    let gradeList: string[] = [];
    setSatGradeList([]);

    selected.forEach((option) => {
      urlSePar.append(EUrlSearchParam.SAT, `${option.value}`);
      gradeList = [...gradeList, `${option.value}`];
    });
    setSatGradeList(gradeList);

    replace(`${pathname}?${urlSePar.toString()}`, { scroll: false });
  };

  const handleIntervalSelect = (selected: SingleValue<ISatelliteOption>) => {
    setIntervalSelectedOptions(selected);
    if (!selected) return;

    const urlSePar = getUrlSerPar();

    urlSePar.delete(EUrlSearchParam.INTERVAL);

    urlSePar.append(EUrlSearchParam.INTERVAL, `${selected.value}`);

    replace(`${pathname}?${urlSePar.toString()}`, { scroll: false });
  };

  const resetAll = () => {
    replace(pathname);
    refresh();
  };

  return (
    <Fieldset legendText={fieldsetTitle[lang]}>
      <div className="flex flex-col justify-center items-center gap-2 pb-4">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 p-2 text-gray-400">
          {groupedSats.length > 0 ? (
            // <ReactSelectSat
            //   defValue={groupedSats[0].options[0]}
            //   groupedSats={groupedSats}
            // />
            <MySelect
              selectName={ESelectType.SELECT_SATS}
              isMulti
              closeMenuOnSelect
              value={satSelectedOptions}
              onChange={(selected) => handleSatSelect(selected)}
              options={groupedSats}
              components={{
                Group,
                Control: createControlComponentSat(lang),
                Input: (props) => (
                  <components.Input
                    {...props}
                    aria-activedescendant={undefined}
                  />
                ),
              }}
              formatGroupLabel={formatGroupSatLabel}
            />
          ) : (
            <h2>
              <Loader /> Loading...
            </h2>
          )}

          {digestIntervalOptions[0] ? (
            <MySelect
              selectName={ESelectType.SELECT_TIME_INTERVAL}
              closeMenuOnSelect
              value={intervalSelectedOptions}
              onChange={(selected) => handleIntervalSelect(selected)}
              options={digestIntervalOptions}
              components={{
                Control: createControlComponentInterval(lang),
                Input: (props) => (
                  <components.Input
                    {...props}
                    aria-activedescendant={undefined}
                  />
                ),
              }}
            />
          ) : (
            <h2>
              <Loader /> Loading...
            </h2>
          )}
        </div>
        <TooltipSimple tooltipText={'Reset all filters'}>
          <BaseButton
            className="w-fit bg-sky-700 text-gray-100 px-4 py-2 rounded-md hover:bg-sky-600"
            ariaLabel={'Reset all filters'}
            onClick={resetAll}
          >
            <span className="text-lg text-white">⏻</span>
            {' Reset filters'}
          </BaseButton>
        </TooltipSimple>
      </div>
    </Fieldset>
  );
};

export default FormDigestInterval;
