import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import { SelectorMulti } from '../SatelliteSelector/SelectorMulti';
import { IStateOption } from '@/models/satDigest.model';
import { ESelectType } from '@/models/reactSelect.model';
import { ELanguage } from '@/cron/libs/commons.mjs';

export default async function LanguageSelector({
  lang,
  requestFn,
}: {
  requestFn: () => Promise<IStateOption[]>;
  lang: string;
}) {
  const channelsLangList = await requestFn();

  return (
    channelsLangList.length > 0 && (
      <SelectorMulti
        className="z-10"
        selectName={ESelectType.SELECT_LANG}
        searchParamName={EUrlSearchParam.LANGUAGE_URL}
        itemList={channelsLangList}
        caption={
          lang === ELanguage.UA
            ? 'Виберіть мову каналу'
            : 'Choose a channel language'
        }
      />
    )
  );
}
