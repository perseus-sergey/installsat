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
import { digestIntervals } from '@/models/satDigest.model';

export enum ESelectType {
  SELECT_SATS = 'selectSats',
  SELECT_TIME_INTERVAL = 'timeInterval',
}

interface IReactSelectProps {
  selectName: ESelectType;
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

const formatGroupSatLabel = (group: IGroupedSatelliteOption) => (
  <div className={styles.groupHeading}>
    <span>{group.label}</span>
    <span className={styles.groupBadgeStyles}>{group.options.length}</span>
  </div>
);

interface IReactSelectSat {
  groupedSats: readonly IGroupedSatelliteOption[];
  defValue?: ISatelliteOption;
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

// export const ReactSelectInterval = ({
//   defValue,
// }: {
//   defValue: ISatelliteOption;
// }) => {
//   const searchParams = useSearchParams();

//   const getInterval = () => {
//     const spInterval = searchParams.get(EUrlParam.SEARCH_PARAM_INTERVAL);
//     return (
//       digestIntervals.find((interv) => `${interv.value}` === spInterval) ||
//       digestIntervals[1]
//     );
//   };

//   const [value, setValue] =
//     useState<SingleValue<ISatelliteOption>>(getInterval());
//   const changeValue = (currentValue: SingleValue<ISatelliteOption>) => {
//     setValue(currentValue);
//   };

//   return (
//     <ReactSelect
//       selectName={ESelectType.SELECT_TIME_INTERVAL}
//       // defaultValue={getInterval()}
//       // defaultValue={defValue}
//       value={value}
//       onChange={changeValue}
//       // defaultValue={digestIntervals[1]}
//       options={digestIntervals}
//       components={{
//         Control: ControlComponentInterval,
//         Input: (props) => (
//           <components.Input {...props} aria-activedescendant={undefined} />
//         ),
//       }}
//     />
//   );
// };
