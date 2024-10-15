'use client';

import { ISatelliteOption } from '@/models/tblSat.model';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  ESelectType,
  MySelect,
  createSingleControlComponent,
} from '../ui/ReactSelect/ReactSelect';
import { SingleValue, components } from 'react-select';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import { IStateOption } from '@/models/satDigest.model';

interface ISimpleProps extends React.HTMLAttributes<HTMLElement> {
  itemList: readonly IStateOption[];
  searchParamName: EUrlSearchParam;
  selectName: ESelectType;
  closeMenuOnSelect?: boolean;
  parentSeParName?: EUrlSearchParam;
  caption: string;
}

export const SelectorSingle = ({
  itemList,
  searchParamName,
  selectName,
  closeMenuOnSelect = true,
  className,
  caption,
}: ISimpleProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedOption, setSelectedOption] =
    useState<SingleValue<ISatelliteOption> | null>(null);

  const initialSerParam = searchParams.get(searchParamName);

  useEffect(() => {
    setSelectedOption(
      itemList.find((opt) => `${opt.value}` === initialSerParam) || null
    );
  }, [itemList, searchParams, initialSerParam]);

  const getUrlSerPar = useCallback(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const handleSelect = useCallback(
    (selected: SingleValue<ISatelliteOption>) => {
      setSelectedOption(selected);
      if (!selected) return;

      const urlSePar = getUrlSerPar();

      urlSePar.delete(searchParamName);

      urlSePar.append(searchParamName, `${selected.value}`);

      replace(`${pathname}?${urlSePar.toString()}`, { scroll: false });
    },
    [getUrlSerPar, pathname, replace, searchParamName]
  );

  return (
    <MySelect
      className={className}
      selectName={selectName}
      closeMenuOnSelect={closeMenuOnSelect}
      value={selectedOption}
      onChange={(selected) => handleSelect(selected)}
      options={itemList}
      components={{
        Control: createSingleControlComponent(caption, selectName),
        Input: (props) => (
          <components.Input {...props} aria-activedescendant={undefined} />
        ),
      }}
    />
  );
};
