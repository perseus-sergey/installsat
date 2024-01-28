import Danger from '@/components/Danger/Danger';
import { Title } from '@/components/Title/Title';
import { executeQuery } from '@/libs/db/mysqldb';
import { IChannel } from '@/models/channel.model';
import Link from 'next/link';

const res = await executeQuery<IChannel>(
  'SELECT * FROM `tbl_digest` LIMIT 10',
  []
);

export default function Home() {
  return (
    <>
      <Title name="Deployed Home Page" />
      <Link href="sputnikovye-novosti-2022-01-05">Sat News!</Link>

      {res.length > 0 && (
        <ul>
          {res.map((news) => {
            return <Danger key={news.id} text={news.text} />;
          })}
        </ul>
      )}
    </>
  );
}
