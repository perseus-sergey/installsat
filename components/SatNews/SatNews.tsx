import { TSatDigest } from '@/models/satDigest.model';
import { ELanguage, TSearchParams } from '@/models/ui.model';
import dynamic from 'next/dynamic';

const SatNewsList = dynamic(() => import('../SatNewsList/SatNewsList'), {
  loading: () => <p>Loading...</p>,
});

const DateNewsList = dynamic(() => import('../DateNewsList/DateNewsList'), {
  loading: () => <p>Loading...</p>,
});

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
