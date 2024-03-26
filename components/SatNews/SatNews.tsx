import { TSatDigest } from '@/models/satDigest.model';
import SatNewsList from '../SatNewsList/SatNewsList';
import DateNewsList from '../DateNewsList/DateNewsList';

export type TGroupedNews = [string, Map<string, TSatDigest[]>][];

interface ISatNewsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SatNews = ({ searchParams }: ISatNewsProps) =>
  searchParams && Object.keys(searchParams).length ? (
    <SatNewsList searchParams={searchParams} />
  ) : (
    <DateNewsList />
  );

export default SatNews;
