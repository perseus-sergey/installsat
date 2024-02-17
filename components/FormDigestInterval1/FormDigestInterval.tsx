import {
  TSatModel,
  getGroupedSatelliteOptions,
  satSql,
} from '@/models/sat.model';
import TextButton from '../TextButton/TextButton';
import styles from './FormDigestInterval.module.scss';
import { LAST_NEWS_INTERVAL, digestIntervals } from '@/models/satDigest.model';
import { Loader } from '../loaders/Loader';
import { redirect } from 'next/navigation';
import {
  ReactSelectInterval,
  ReactSelectSat,
} from '../ReactSelect/ReactSelect';
import { EUrlParam } from '@/models/url.model';
import { executeQuery } from '@/libs/db/mysqldb';

interface IFormDigestIntervalProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const satResult = await executeQuery<TSatModel>(satSql);

// const groupedNewsByDateMap = (news: TSatDigest[]) =>
//   news.reduce((acc, currObj) => {
//     const strCurrDate = `${currObj.date}`;
//     const date = acc.get(strCurrDate) || [];
//     acc.set(strCurrDate, [...date, currObj]);

//     return acc;
//   }, new Map());

// export type TGroupedNewsByDateMap = typeof groupedNewsByDateMap;

const satellites = satResult.reduce(
  (acc: TSatModel[][], curr) => {
    curr.grade > 0 ? acc[0].push(curr) : acc[1].push(curr);

    return acc;
  },
  [[], []]
);

const FormDigestInterval = ({ searchParams }: IFormDigestIntervalProps) => {
  const groupedSats = getGroupedSatelliteOptions(satellites);

  async function formAction(formData: FormData) {
    'use server';

    const selectSats = formData.getAll('selectSats') as string[] | null;
    const timeInterval = formData.get('timeInterval') || LAST_NEWS_INTERVAL;

    const urlSePar = new URLSearchParams();
    if (timeInterval)
      urlSePar.set(EUrlParam.SEARCH_PARAM_INTERVAL, `${timeInterval}`);
    if (selectSats && selectSats[0])
      selectSats.forEach((sat) =>
        urlSePar.append(EUrlParam.SEARCH_PARAM_SAT, `${sat}`)
      );

    // revalidatePath('/');
    redirect(`${EUrlParam.BASE_PATH}?${urlSePar.toString()}`);
  }

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
            <ReactSelectSat
              defValue={groupedSats[0].options[0]}
              groupedSats={groupedSats}
            />
          ) : (
            <h2>
              <Loader /> Loading...
            </h2>
          )}

          {digestIntervals[0] ? (
            <ReactSelectInterval
              defValue={
                digestIntervals.find(
                  (interv) =>
                    `${interv.value}` ===
                    searchParams[EUrlParam.SEARCH_PARAM_INTERVAL]
                ) || digestIntervals[1]
              }
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
          // aria-disabled={pending}
        >
          Submit
        </TextButton>
      </fieldset>
    </form>
  );
};

export default FormDigestInterval;
