import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import { SelectorMulti } from '../SatelliteSelector/SelectorMulti';
import {
  ESelectType,
  IGroupedSatelliteOption,
  SAT_SELECTOR_CAPTION,
} from '@/models/reactSelect.model';
import { ELanguage } from '@/models/language.model';

export default async function SatelliteSelector({
  lang,
  requestFn,
}: {
  requestFn: () => Promise<Error | IGroupedSatelliteOption[]>;
  lang: ELanguage;
}) {
  const groupedSats = await requestFn();

  return (
    <SelectorMulti
      selectName={ESelectType.SELECT_SATS}
      className="z-20 min-w-72"
      searchParamName={EUrlSearchParam.SAT}
      itemList={groupedSats instanceof Error ? [] : groupedSats}
      caption={SAT_SELECTOR_CAPTION[lang]}
    />
  );
}
