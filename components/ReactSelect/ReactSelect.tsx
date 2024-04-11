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
import {
  META_TRANS_NEWS_LIST,
  digestIntervals,
} from '@/models/satDigest.model';
import { LANGUAGE } from '@/models/ui.model';

const { satSelect, timeIntervalSelect } = META_TRANS_NEWS_LIST.select;

export enum ESelectType {
  SELECT_SATS = 'selectSats',
  SELECT_TIME_INTERVAL = 'timeInterval',
}

interface IReactSelectProps {
  selectName: ESelectType;
}

export const ControlComponentSat = (
  props: ControlProps<ISatelliteOption, true>
) => (
  <div className={`${styles.selectHeader} ${styles.satSelectHeader}`}>
    <p>{satSelect.title[LANGUAGE]}</p>
    <components.Control {...props} />
  </div>
);

const ControlComponentInterval = (
  props: ControlProps<ISatelliteOption, false>
) => (
  <div className={`${styles.selectHeader} ${styles.satSelectHeader}`}>
    <p>{timeIntervalSelect.title[LANGUAGE]}</p>
    <components.Control {...props} />
  </div>
);

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
      data-testid="ReactSelect"
      {...rest}
    />
  );
};

export const ReactSelectInterval = ({
  defValue,
}: {
  defValue: ISatelliteOption;
}) => (
  <ReactSelect
    selectName={ESelectType.SELECT_TIME_INTERVAL}
    defaultValue={defValue}
    // defaultValue={digestIntervals[1]}
    options={digestIntervals}
    components={{
      Control: ControlComponentInterval,
      Input: (props) => (
        <components.Input {...props} aria-activedescendant={undefined} />
      ),
    }}
  />
);

export const formatGroupSatLabel = (group: IGroupedSatelliteOption) => (
  <div className={styles.groupHeading}>
    <span>{group.label}</span>
    <span className={styles.groupBadgeStyles}>{group.options.length}</span>
  </div>
);

interface IReactSelectSat {
  groupedSats: readonly IGroupedSatelliteOption[];
  defValue?: ISatelliteOption;
  closeMenuOnSelect?: boolean;
}

export const ReactSelectSat = ({ groupedSats, defValue }: IReactSelectSat) => (
  <ReactSelect
    selectName={ESelectType.SELECT_SATS}
    isMulti
    closeMenuOnSelect={false}
    defaultValue={defValue}
    // defaultValue={groupedSats[0].options[0]}
    options={groupedSats}
    components={{
      Group,
      Control: ControlComponentSat,
      Input: (props) => (
        <components.Input {...props} aria-activedescendant={undefined} />
      ),
    }}
    formatGroupLabel={formatGroupSatLabel}
  />
);
