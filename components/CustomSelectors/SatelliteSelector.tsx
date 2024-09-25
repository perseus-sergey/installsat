import { ELanguage, ESelectType } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';
import { SelectorMulti } from '../SatelliteSelector/SelectorMulti';
import { IGroupedSatelliteOption } from '@/models/tblSat.model';

export default async function SatelliteSelector({
  lang,
  requestFn,
}: {
  requestFn: () => Promise<Error | IGroupedSatelliteOption[]>;
  lang: string;
}) {
  const groupedSats = await requestFn();

  return (
    <SelectorMulti
      selectName={ESelectType.SELECT_SATS}
      className="z-20 min-w-72"
      searchParamName={EUrlSearchParam.SAT}
      itemList={groupedSats instanceof Error ? [] : groupedSats}
      caption={
        lang === ELanguage.UA ? 'Виберіть супутники' : 'Select satellites'
      }
    />
  );
}
