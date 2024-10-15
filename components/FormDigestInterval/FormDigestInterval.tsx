import {
  TRANS_NEWS_LIST_FILTERS,
  getDigestIntervalOptions,
} from '@/models/satDigest.model';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import Fieldset from '../ui/Fieldset/Fieldset';
import { SelectorSingle } from '../SatelliteSelector/SelectorSingle';
import ResetSearchParamsBtn from './ResetSearchParamsBtn';
import { Suspense } from 'react';
import SatelliteSelector from '../CustomSelectors/SatelliteSelector';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import { ESelectType } from '../ui/ReactSelect/ReactSelect';
import { ELanguage } from '@/models/language.model';

const {
  fieldsetTitle,
  select: { timeIntervalSelect },
} = TRANS_NEWS_LIST_FILTERS;
interface IFormDigestIntervalProps {
  lang: ELanguage;
}

const FormDigestInterval = ({ lang }: IFormDigestIntervalProps) => {
  const digestIntervalOptions = getDigestIntervalOptions(lang);

  const satsForFormFn = () => getSatsForForm(false, lang);

  return (
    <Fieldset legendText={fieldsetTitle[lang]}>
      <div className="flex flex-col justify-center items-center gap-2 pb-4">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 p-2 text-gray-400">
          <Suspense>
            <SatelliteSelector lang={lang} requestFn={satsForFormFn} />
          </Suspense>

          {digestIntervalOptions[0] ? (
            <SelectorSingle
              selectName={ESelectType.SELECT_TIME_INTERVAL}
              className="z-10"
              closeMenuOnSelect
              searchParamName={EUrlSearchParam.INTERVAL}
              itemList={digestIntervalOptions}
              caption={timeIntervalSelect.title[lang]}
            />
          ) : null}
        </div>

        <ResetSearchParamsBtn lang={lang} />
      </div>
    </Fieldset>
  );
};

export default FormDigestInterval;
