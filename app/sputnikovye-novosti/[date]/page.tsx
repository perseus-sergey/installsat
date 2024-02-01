import { Title } from '@/components/Title/Title';
import { executeQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStr } from '@/libs/utils';
import { ISatDigest, LAST_NEWS_INTERVAL } from '@/models/satDigest.model';

interface ISatNewsDatePageParams {
  params: { date: string };
}

const q = `
SELECT DISTINCT date
FROM tbl_digest
WHERE date >= CURDATE() - INTERVAL ? DAY
`;
const res = await executeQuery<ISatDigest>(q, [`${LAST_NEWS_INTERVAL}`]);

export const generateStaticParams = () =>
  res.map((news) => ({ date: getFormattedDateStr(news.date) }));

export const dynamicParams = false;

export default function SatNewsDatePage({ params }: ISatNewsDatePageParams) {
  return (
    <>
      <Title name={`Page for ${params.date}`} />
    </>
  );
}
