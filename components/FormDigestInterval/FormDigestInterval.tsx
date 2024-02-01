'use client';

import { ISat } from '@/models/sat.model';
import TextButton from '../TextButton/TextButton';
import styles from './FormDigestInterval.module.scss';
import {
  ISatDigest,
  TSatDigest,
  digestIntervals,
} from '@/models/satDigest.model';
import { useFormState, useFormStatus } from 'react-dom';
import digestIntervalAction from '@/libs/serverActions/digestInterval.action';
import { Loader } from '../loaders/Loader';
import { useCallback, useEffect } from 'react';

interface IFormDigestIntervalProps {
  satellites: ISat[][];
  intervalSubmitHandler: (data: TSatDigest[]) => void;
  newsResults: ISatDigest[];
}

const FormDigestInterval = ({
  satellites,
  intervalSubmitHandler,
  newsResults,
}: IFormDigestIntervalProps) => {
  const initialState = {
    message: '',
    newsIntervalResult: newsResults,
  };

  const [formState, formAction] = useFormState(
    digestIntervalAction,
    initialState
  );
  const [eastSats, westSats] = satellites;

  const makeNewNewsList = useCallback(
    () => intervalSubmitHandler(formState.newsIntervalResult),
    [formState.newsIntervalResult, intervalSubmitHandler]
  );
  useEffect(() => {
    makeNewNewsList();
  }, [makeNewNewsList]);

  const { pending } = useFormStatus();

  return (
    <form
      action={formAction}
      name="formDigestInterval"
      id="formDigestInterval"
      className={styles.FormDigestInterval}
    >
      <fieldset
        style={{
          border: '1px solid darkgray',
          borderRadius: '0.5rem',
          padding: '1rem 1.5rem 1.5rem',
        }}
      >
        <legend
          style={{
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            color: '#a9a9a9',
            fontSize: '0.9rem',
          }}
        >
          Удерживайте клавишу «CTRL» для выбора нескольких спутников
        </legend>

        <select
          id="selectSats"
          name="selectSats"
          multiple
          size={10}
          style={{ color: '#000000', padding: '2%', fontSize: '0.9rem' }}
        >
          <option selected value="">
            --= Все Спутники =--
          </option>
          <optgroup label="Западное направление">
            {westSats.map((sat) => (
              <option
                value={sat.grade}
                key={sat.id}
              >{`${sat.position}..... ${sat.title}`}</option>
            ))}
          </optgroup>
          <optgroup label="Восточное направление">
            {eastSats.map((sat) => (
              <option
                value={sat.grade}
                key={sat.id}
              >{`${sat.position}..... ${sat.title}`}</option>
            ))}
          </optgroup>
        </select>

        <select
          id="timeInterval"
          name="timeInterval"
          size={7}
          style={{ color: '#000000', padding: '2%', fontSize: '0.9rem' }}
        >
          <option style={{ color: 'grey', textAlign: 'center' }} value="30">
            --= Период =--
          </option>
          {digestIntervals.map((interval) => (
            <option value={interval.value} key={interval.value}>
              {interval.text}
            </option>
          ))}
        </select>

        <TextButton
          type="submit"
          id="submitBtn"
          name="submitBtn"
          value="Submit"
          className="type_table"
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
