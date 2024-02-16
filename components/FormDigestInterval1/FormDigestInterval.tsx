// 'use client';

import { TSatModel, getGroupedSatelliteOptions } from '@/models/sat.model';
import TextButton from '../TextButton/TextButton';
import styles from './FormDigestInterval.module.scss';
import {
  LAST_NEWS_INTERVAL,
  TSatDigest,
  digestIntervals,
} from '@/models/satDigest.model';
// import { useFormState, useFormStatus } from 'react-dom';
// import digestIntervalAction from '@/libs/serverActions/digestInterval.action';
import { Loader } from '../loaders/Loader';
import { redirect } from 'next/navigation';
import {
  ReactSelectInterval,
  ReactSelectSat,
} from '../ReactSelect/ReactSelect';
import { Suspense } from 'react';
import { EUrlPath } from '@/models/url.model';
// import { useCallback, useEffect, useState } from 'react';

interface IFormDigestIntervalProps {
  satellites: TSatModel[][];
  // intervalSubmitHandler: (data: TSatDigest[]) => void;
  newsResults: TSatDigest[];
}

// const formatGroupSatLabel = (group: IGroupedSatelliteOption) => (
//   <div className={styles.groupHeading}>
//     <span>{group.label}</span>
//     <span className={styles.groupBadgeStyles}>{group.options.length}</span>
//   </div>
// );

const FormDigestInterval = ({
  satellites,
  // intervalSubmitHandler,
  // newsResults,
}: IFormDigestIntervalProps) => {
  // const [groupedSats, setGroupedSats] = useState<
  //   readonly IGroupedSatelliteOption[]
  // >([]);

  // const initialState = {
  //   message: '',
  //   newsIntervalResult: newsResults,
  // };

  // const [formState, formAction] = useFormState(
  //   digestIntervalAction,
  //   initialState
  // );

  const groupedSats = getGroupedSatelliteOptions(satellites);

  async function formAction(formData: FormData) {
    'use server';

    const selectSats = formData.getAll('selectSats') as string[] | null;
    const timeInterval = formData.get('timeInterval') || LAST_NEWS_INTERVAL;

    const urlSePar = new URLSearchParams();
    if (timeInterval) urlSePar.set('interval', `${timeInterval}`);
    if (selectSats && selectSats[0])
      selectSats.forEach((sat) => urlSePar.append('sat', `${sat}`));

    redirect(`${EUrlPath.BASE_PATH}?${urlSePar.toString()}`);
  }

  // const getGroupedSatOptions = useCallback(
  //   () => getGroupedSatelliteOptions(satellites),
  //   [satellites]
  // );

  // useEffect(() => {
  //   intervalSubmitHandler(formState.newsIntervalResult);
  // }, [formState]);

  // useEffect(() => {
  //   setGroupedSats(getGroupedSatOptions());
  // }, [getGroupedSatOptions]);

  // const { pending } = useFormStatus();

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
          <Suspense>
            {groupedSats[1] ? (
              <ReactSelectSat groupedSats={groupedSats} />
            ) : (
              <h2>
                <Loader /> Loading...
              </h2>
            )}
          </Suspense>

          {digestIntervals[0] ? (
            <ReactSelectInterval />
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
          // aria-disabled={pending}
        >
          Submit
        </TextButton>
      </fieldset>
      {/* {pending ? (
        <h2>
          <Loader /> Loading...
        </h2>
      ) : null}
      {formState.message ? <h3>{formState.message}</h3> : null} */}
    </form>
  );
};

export default FormDigestInterval;
