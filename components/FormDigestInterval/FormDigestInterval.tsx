'use client';

import {
  IGroupedSatelliteOption,
  ISatelliteOption,
  TSatModel,
} from '@/models/tblSat.model';
import TextButton from '../TextButton/TextButton';
import styles from './FormDigestInterval.module.scss';
import Select, { components, GroupProps, ControlProps } from 'react-select';
import { TSatDigest, digestIntervals } from '@/models/satDigest.model';
import { useFormState, useFormStatus } from 'react-dom';
import digestIntervalAction from '@/libs/serverActions/digestInterval.action';
import { Loader } from '../loaders/Loader';
import { useCallback, useEffect, useState } from 'react';
import { getGroupedSatelliteOptions } from '@/controllers/satDigest.controller';

interface IFormDigestIntervalProps {
  satellites: TSatModel[][];
  intervalSubmitHandler: (data: TSatDigest[]) => void;
  newsResults: TSatDigest[];
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

const formatGroupSatLabel = (group: IGroupedSatelliteOption) => (
  <div className={styles.groupHeading}>
    <span>{group.label}</span>
    <span className={styles.groupBadgeStyles}>{group.options.length}</span>
  </div>
);

const Group = (
  props: GroupProps<ISatelliteOption, true, IGroupedSatelliteOption>
) => (
  <div className={styles.groupStyles}>
    <components.Group {...props} aria-activedescendant={undefined} />
  </div>
);

const FormDigestInterval = ({
  satellites,
  intervalSubmitHandler,
  newsResults,
}: IFormDigestIntervalProps) => {
  const [groupedSats, setGroupedSats] = useState<
    readonly IGroupedSatelliteOption[]
  >([]);

  const initialState = {
    message: '',
    newsIntervalResult: newsResults,
  };

  const [formState, formAction] = useFormState(
    digestIntervalAction,
    initialState
  );

  const getGroupedSatOptions = useCallback(
    () => getGroupedSatelliteOptions(satellites),
    [satellites]
  );

  useEffect(() => {
    intervalSubmitHandler(formState.newsIntervalResult);
  }, [formState]);

  useEffect(() => {
    setGroupedSats(getGroupedSatOptions());
  }, [getGroupedSatOptions]);

  const { pending } = useFormStatus();

  return (
    <form
      action={formAction}
      name="formDigestInterval"
      id="formDigestInterval"
      className={styles.FormDigestInterval}
    >
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          Виберіть супутники та проміжок часу
        </legend>

        <div className={styles.selectsBlock}>
          {groupedSats[1] ? (
            <Select
              instanceId="selectSats"
              id="selectSats"
              name="selectSats"
              isMulti
              closeMenuOnSelect={false}
              defaultValue={groupedSats[0].options[0]}
              options={groupedSats}
              components={{ Group, Control: ControlComponentSat }}
              formatGroupLabel={formatGroupSatLabel}
            />
          ) : (
            <h2>
              <Loader /> Loading...
            </h2>
          )}

          {digestIntervals[0] ? (
            <Select
              instanceId="timeInterval"
              id="timeInterval"
              name="timeInterval"
              defaultValue={digestIntervals[1]}
              options={digestIntervals}
              components={{
                Control: ControlComponentInterval,
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

        <TextButton
          type="submit"
          id="submitBtn"
          name="submitBtn"
          value="Submit"
          aria-disabled={pending}
        >
          Submit
        </TextButton>
      </fieldset>
      {pending ? (
        <h2>
          <Loader /> Loading...
        </h2>
      ) : null}
      {formState.message ? <h3>{formState.message}</h3> : null}
    </form>
  );
};

export default FormDigestInterval;
