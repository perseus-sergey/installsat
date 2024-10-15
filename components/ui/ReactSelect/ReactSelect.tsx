'use client';

import type {} from 'react-select/base';
import Select, {
  ControlProps,
  GroupBase,
  GroupProps,
  Props,
  components,
} from 'react-select';
import {
  ESelectType,
  IGroupedSatelliteOption,
  ISatelliteOption,
} from '@/models/reactSelect.model';

interface IReactSelectProps {
  selectName: ESelectType;
}

const PRE_ID = 'inst-';

export const createIsMultiControlComponent = (
  title: string,
  selectId: ESelectType
) => {
  const id = `react-select-${PRE_ID}${selectId}-input`;

  return (props: ControlProps<ISatelliteOption, true>) => (
    <div className="h-fit p-1 border border-solid border-gray-600 bg-sky-700 text-white text-center rounded-md min-w-48">
      <label htmlFor={id}>{title}</label>
      <components.Control {...props} />
    </div>
  );
};

export const createSingleControlComponent = (
  title: string,
  selectId: ESelectType
) => {
  const id = `react-select-${PRE_ID}${selectId}-input`;

  return (props: ControlProps<ISatelliteOption, false>) => (
    <div className="h-fit p-1 border border-solid border-gray-600 bg-sky-700 text-white text-center rounded-md min-w-48">
      <label htmlFor={id}>{title}</label>
      <components.Control {...props} />
    </div>
  );
};

export const Group = (
  props: GroupProps<ISatelliteOption, true, IGroupedSatelliteOption>
) => (
  <div className="border-2 border-dotted border-sky-500 rounded-md bg-sky-50">
    <components.Group {...props} aria-activedescendant={undefined} />
  </div>
);

export const MySelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  selectName,
  ...rest
}: Props<Option, IsMulti, Group> & IReactSelectProps) => {
  return (
    <>
      <Select
        instanceId={`${PRE_ID}${selectName}`}
        id={selectName}
        name={selectName}
        {...rest}
      />
    </>
  );
};

export const formatGroupSatLabel = (group: IGroupedSatelliteOption) => (
  <div className="flex items-center justify-around text-white rounded py-1 text-center w-full bg-sky-700">
    <span>{group.label}</span>
    <span className="bg-gray-100 rounded-3xl text-blue-950 inline-block text-xs min-w-0.5 min-h-0.5 py-1 px-2 text-center">
      {group.options.length}
    </span>
  </div>
);
