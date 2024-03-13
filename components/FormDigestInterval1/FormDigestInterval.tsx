import TextButton from '../TextButton/TextButton';
import styles from './FormDigestInterval.module.scss';
import { LAST_NEWS_INTERVAL, digestIntervals } from '@/models/satDigest.model';
import { Loader } from '../loaders/Loader';
import { redirect } from 'next/navigation';
import {
  ReactSelectInterval,
  ReactSelectSat,
} from '../ReactSelect/ReactSelect';
import {
  getGroupedSatelliteOptions,
  getSatsForForm,
} from '@/controllers/satDigest.controller';
import EmptyData from '../EmptyData/EmptyData';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';

interface IFormDigestIntervalProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const FormDigestInterval = async ({
  searchParams,
}: IFormDigestIntervalProps) => {
  const satsForForm = await getSatsForForm();

  if (satsForForm instanceof Error)
    return <EmptyData description={satsForForm.message} />;

  const groupedSats = getGroupedSatelliteOptions(satsForForm);

  async function formAction(formData: FormData) {
    'use server';

    const selectSats = formData.getAll('selectSats') as string[] | null;
    const timeInterval = formData.get('timeInterval') || LAST_NEWS_INTERVAL;

    const urlSePar = new URLSearchParams();
    if (timeInterval) urlSePar.set(EUrlSearchParam.INTERVAL, `${timeInterval}`);
    if (selectSats && selectSats[0])
      selectSats.forEach((sat) =>
        urlSePar.append(EUrlSearchParam.SAT, `${sat}`)
      );

    // revalidatePath('/');
    redirect(`${EUrlBaseParam.BASE_PATH}?${urlSePar.toString()}`);
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
                    `${interv.value}` === searchParams[EUrlSearchParam.INTERVAL]
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
