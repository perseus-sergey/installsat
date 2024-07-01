import { TSatDigest } from '@/models/satDigest.model';
import SatNewsList from '../SatNewsList/SatNewsList';
import DateNewsList from '../DateNewsList/DateNewsList';
import { ELanguage, TSearchParams } from '@/models/ui.model';

export type TGroupedNews = [string, Map<string, TSatDigest[]>][];

interface ISatNewsProps {
  searchParams: TSearchParams;
  lang: ELanguage;
}

const SatNews = ({ searchParams, lang }: ISatNewsProps) =>
  searchParams && Object.keys(searchParams).length ? (
    <SatNewsList searchParams={searchParams} lang={lang} />
  ) : (
    <DateNewsList lang={lang} />
  );

export default SatNews;
