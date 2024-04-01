import { TSatDigest } from '@/models/satDigest.model';
import SatNewsList from '../SatNewsList/SatNewsList';
import DateNewsList from '../DateNewsList/DateNewsList';
import { TSearchParams } from '@/models/ui.model';

export type TGroupedNews = [string, Map<string, TSatDigest[]>][];

interface ISatNewsProps {
  searchParams: TSearchParams;
}

const SatNews = ({ searchParams }: ISatNewsProps) =>
  searchParams && Object.keys(searchParams).length ? (
    <SatNewsList searchParams={searchParams} />
  ) : (
    <DateNewsList />
  );

export default SatNews;
