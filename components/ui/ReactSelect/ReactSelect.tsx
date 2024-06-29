'use client';

import styles from './ReactSelect.module.scss';

import type {} from 'react-select/base';
import Select, {
  ControlProps,
  GroupBase,
  GroupProps,
  Props,
  components,
} from 'react-select';
import {
  IGroupedSatelliteOption,
  ISatelliteOption,
} from '@/models/tblSat.model';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
import { ELanguage } from '@/models/ui.model';

const { satSelect, timeIntervalSelect } = META_TRANS_NEWS_LIST.select;

export enum ESelectType {
  SELECT_SATS = 'selectSats',
  SELECT_TIME_INTERVAL = 'timeInterval',
}

interface IReactSelectProps {
  selectName: ESelectType;
}

export const createControlComponentSat = (lang: ELanguage) => {
  return (props: ControlProps<ISatelliteOption, true>) => (
    <div className={`${styles.selectHeader} ${styles.satSelectHeader}`}>
      <p>{satSelect.title[lang]}</p>
      <components.Control {...props} />
    </div>
  );
};

export const createControlComponentInterval = (lang: ELanguage) => {
  return (props: ControlProps<ISatelliteOption, false>) => {
    return (
      <div className={`${styles.selectHeader} ${styles.satSelectHeader}`}>
        <p>{timeIntervalSelect.title[lang]}</p>
        <components.Control {...props} />
      </div>
    );
  };
};

export const Group = (
  props: GroupProps<ISatelliteOption, true, IGroupedSatelliteOption>
) => (
  <div className={styles.groupStyles}>
    <components.Group {...props} aria-activedescendant={undefined} />
  </div>
);

export const ReactSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  selectName,
  ...rest
}: Props<Option, IsMulti, Group> & IReactSelectProps) => {
  return (
    <Select
      className={styles.ReactSelect}
      instanceId={`inst-${selectName}`}
      id={selectName}
      name={selectName}
      data-testid="ReactSelect"
      {...rest}
    />
  );
};

export const MySelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  selectName,
  ...rest
}: Props<Option, IsMulti, Group> & IReactSelectProps) => {
  return (
    <Select
      className={styles.ReactSelect}
      instanceId={`inst-${selectName}`}
      id={selectName}
      name={selectName}
      {...rest}
    />
  );
};

// export const ReactSelectInterval = ({
//   defValue,
//   ...rest
// }: {
//   defValue: ISatelliteOption;
// }) => (
//   <ReactSelect
//     selectName={ESelectType.SELECT_TIME_INTERVAL}
//     defaultValue={defValue}
//     // defaultValue={digestIntervalOptions[1]}
//     options={digestIntervalOptions}
//     components={{
//       Control: ControlComponentInterval,
//       Input: (props) => (
//         <components.Input {...props} aria-activedescendant={undefined} />
//       ),
//     }}
//     {...rest}
//   />
// );

export const formatGroupSatLabel = (group: IGroupedSatelliteOption) => (
  <div className={styles.groupHeading}>
    <span>{group.label}</span>
    <span className={styles.groupBadgeStyles}>{group.options.length}</span>
  </div>
);

// interface IReactSelectSat {
//   groupedSats: readonly IGroupedSatelliteOption[];
//   defValue?: ISatelliteOption;
//   closeMenuOnSelect?: boolean;
// }

// export const ReactSelectSat = ({ groupedSats, defValue }: IReactSelectSat) => (
//   <ReactSelect
//     selectName={ESelectType.SELECT_SATS}
//     isMulti
//     closeMenuOnSelect={false}
//     defaultValue={defValue}
//     // defaultValue={groupedSats[0].options[0]}
//     options={groupedSats}
//     components={{
//       Group,
//       Control: ControlComponentSat,
//       Input: (props) => (
//         <components.Input {...props} aria-activedescendant={undefined} />
//       ),
//     }}
//     formatGroupLabel={formatGroupSatLabel}
//   />
// );
