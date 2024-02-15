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
import { IGroupedSatelliteOption, ISatelliteOption } from '@/models/sat.model';
import { digestIntervals } from '@/models/satDigest.model';

export enum ESelectType {
  SELECT_SATS = 'selectSats',
  SELECT_TIME_INTERVAL = 'timeInterval',
}

interface IReactSelectProps {
  name: ESelectType;
}

const ControlComponentSat = (props: ControlProps<ISatelliteOption, true>) => (
  <div className={`${styles.selectHeader} ${styles.satSelectHeader}`}>
    <p>Оберіть супутники</p>
    <components.Control {...props} />
  </div>
);

const ControlComponentInterval = (
  props: ControlProps<ISatelliteOption, false>
) => (
  <div className={`${styles.selectHeader} ${styles.satSelectHeader}`}>
    <p>Оберіть період</p>
    <components.Control {...props} />
  </div>
);

const Group = (
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
  name,
  ...rest
}: Props<Option, IsMulti, Group> & IReactSelectProps) => {
  return (
    <Select
      className={styles.ReactSelect}
      instanceId={name}
      id={name}
      name={name}
      data-testid="ReactSelect"
      {...rest}
    />
  );
};

export const ReactSelectInterval = () => (
  <ReactSelect
    name={ESelectType.SELECT_TIME_INTERVAL}
    defaultValue={digestIntervals[1]}
    options={digestIntervals}
    components={{
      Control: ControlComponentInterval,
      Input: (props) => (
        <components.Input {...props} aria-activedescendant={undefined} />
      ),
    }}
  />
);

const formatGroupSatLabel = (group: IGroupedSatelliteOption) => (
  <div className={styles.groupHeading}>
    <span>{group.label}</span>
    <span className={styles.groupBadgeStyles}>{group.options.length}</span>
  </div>
);

export const ReactSelectSat = ({
  groupedSats,
}: {
  groupedSats: readonly IGroupedSatelliteOption[];
}) => (
  <ReactSelect
    name={ESelectType.SELECT_SATS}
    isMulti
    closeMenuOnSelect={false}
    defaultValue={groupedSats[0].options[0]}
    options={groupedSats}
    components={{ Group, Control: ControlComponentSat }}
    formatGroupLabel={formatGroupSatLabel}
  />
);
