'use client';

import {
  IGroupedSatelliteOption,
  ISatelliteOption,
} from '@/models/tblSat.model';
import { ESelectType } from '@/models/ui.model';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MySelect,
  Group,
  formatGroupSatLabel,
  createIsMultiControlComponent,
} from '../ui/ReactSelect/ReactSelect';
import { MultiValue, components } from 'react-select';
import { EUrlSearchParam } from '@/models/url.model';
import {
  makeOptions,
  makeSimpleOptions,
} from '@/controllers/satFinder.controller';

interface ISimpleProps extends React.HTMLAttributes<HTMLElement> {
  itemList: IGroupedSatelliteOption[] | ISatelliteOption[];
  searchParamName: EUrlSearchParam;
  selectName: ESelectType;
  closeMenuOnSelect?: boolean;
  isMulti?: true;
  parentSeParName?: EUrlSearchParam;
  caption: string;
}

export const Selector = ({
  itemList,
  searchParamName,
  selectName,
  closeMenuOnSelect = true,
  className,
  caption,
  isMulti,
}: ISimpleProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Memoize the initial search parameter list
  const initialSerParamList = useMemo(
    () => searchParams.getAll(searchParamName),
    [searchParams, searchParamName]
  );

  const [selectedOptions, setSelectedOptions] =
    useState<MultiValue<ISatelliteOption> | null>(null);

  useEffect(() => {
    const urlParamList = initialSerParamList;

    const options =
      'options' in itemList[0]
        ? makeOptions(urlParamList, itemList as IGroupedSatelliteOption[])
        : makeSimpleOptions(urlParamList, itemList as ISatelliteOption[]);

    setSelectedOptions(options);
  }, [itemList, searchParams, initialSerParamList]);

  const getUrlSerPar = useCallback(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const handleSatSelect = useCallback(
    (selected: MultiValue<ISatelliteOption>) => {
      setSelectedOptions(selected);
      const urlSePar = getUrlSerPar();

      urlSePar.delete(searchParamName);

      const urlParams = selected.map((option) => `${option.value}`);
      urlParams.forEach((param) => urlSePar.append(searchParamName, param));

      replace(`${pathname}?${urlSePar.toString()}`, { scroll: false });
    },
    [getUrlSerPar, pathname, replace, searchParamName]
  );

  return (
    <MySelect
      className={className}
      selectName={selectName}
      isMulti={isMulti}
      closeMenuOnSelect={closeMenuOnSelect}
      value={selectedOptions}
      onChange={(selected) => handleSatSelect(selected)}
      options={itemList}
      components={{
        Group,
        Control: createIsMultiControlComponent(caption),
        Input: (props) => (
          <components.Input {...props} aria-activedescendant={undefined} />
        ),
      }}
      formatGroupLabel={formatGroupSatLabel}
    />
  );
};
