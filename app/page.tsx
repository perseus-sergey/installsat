import DangerHtmlUl from '@/components/DangerHtmlUl/DangerHtmlUl';
import { Title } from '@/components/Title/Title';
import { executeQuery } from '@/libs/db/mysqldb';
import { IChannel } from '@/models/channel.model';
import { META_TRANS_NEWS_LIST } from '@/models/meta.model';
import Link from 'next/link';

const q = `
SELECT d.id, d.date, d.text,
sat.parent AS satParent,
sat.title AS satTitle,
sat.logo AS satLogo,
sat.grade AS satGrade,
sat.position AS satPosition
FROM tbl_digest AS d
LEFT JOIN tbl_chan_sat AS sat ON d.sat = sat.id
WHERE d.date >= CURDATE() - INTERVAL 370 DAY
ORDER BY d.date DESC, satGrade, satTitle;
`;
const res = await executeQuery<IChannel>(q, []);
const allNews = res.reduce((acc, curr) => curr.text + acc, '');

export default function Home() {
  return (
    <>
      <Title name={META_TRANS_NEWS_LIST.getH1()} />
      <Link href="/sputnikovye-novosti/2022-01-05">Sat News!</Link>
      {res.length > 0 && <DangerHtmlUl text={allNews} />}
    </>
  );
}
