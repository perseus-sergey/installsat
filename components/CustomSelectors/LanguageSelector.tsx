import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import { SelectorMulti } from '../SatelliteSelector/SelectorMulti';
import { IStateOption } from '@/models/satDigest.model';
import {
  ESelectType,
  LANGUAGE_SELECTOR_CAPTION,
} from '@/models/reactSelect.model';
import { ELanguage } from '@/models/language.model';

export default async function LanguageSelector({
  lang,
  requestFn,
}: {
  requestFn: () => Promise<IStateOption[]>;
  lang: ELanguage;
}) {
  const channelsLangList = await requestFn();

  return (
    channelsLangList.length > 0 && (
      <SelectorMulti
        className="z-10"
        selectName={ESelectType.SELECT_LANG}
        searchParamName={EUrlSearchParam.LANGUAGE_URL}
        itemList={channelsLangList}
        caption={LANGUAGE_SELECTOR_CAPTION[lang]}
      />
    )
  );
}
