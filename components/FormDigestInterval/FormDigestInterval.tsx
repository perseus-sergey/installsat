import TextButton from '../ui/buttons/TextButton/TextButton';
import styles from './FormDigestInterval.module.scss';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
  digestIntervals,
} from '@/models/satDigest.model';
import { Loader } from '../loaders/Loader';
import { redirect } from 'next/navigation';
import {
  ReactSelectInterval,
  ReactSelectSat,
} from '../ui/ReactSelect/ReactSelect';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import EmptyData from '../errors/EmptyData/EmptyData';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import Fieldset from '../ui/Fieldset/Fieldset';
import { LANGUAGE, TSearchParams } from '@/models/ui.model';

const { fieldsetTitle, submitButton } = META_TRANS_NEWS_LIST;
interface IFormDigestIntervalProps {
  searchParams: TSearchParams;
}

const FormDigestInterval = async ({
  searchParams,
}: IFormDigestIntervalProps) => {
  const groupedSats = await getSatsForForm();

  if (groupedSats instanceof Error)
    return <EmptyData description={groupedSats.message} />;

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

    redirect(`${EUrlBaseParam.BASE_PATH}?${urlSePar.toString()}`);
  }

  return (
    <form
      action={formAction}
      name="formDigestInterval"
      id="formDigestInterval"
      className={styles.FormDigestInterval}
    >
      <Fieldset legendText={fieldsetTitle[LANGUAGE]}>
        <div className={styles.formWrapper}>
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
                      searchParams[EUrlSearchParam.INTERVAL]
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
            ariaLabel={submitButton.ariaLabel[LANGUAGE]}
            type="submit"
            id="submitBtn"
            name="submitBtn"
            value="Submit"
          >
            {submitButton.title[LANGUAGE]}
          </TextButton>
        </div>
      </Fieldset>
    </form>
  );
};

export default FormDigestInterval;
