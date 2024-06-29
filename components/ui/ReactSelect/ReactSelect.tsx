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

export const formatGroupSatLabel = (group: IGroupedSatelliteOption) => (
  <div className={styles.groupHeading}>
    <span>{group.label}</span>
    <span className={styles.groupBadgeStyles}>{group.options.length}</span>
  </div>
);
