import Danger from '@/components/Danger/Danger';
import { Title } from '@/components/Title/Title';
// import { executeQuery } from '@/libs/db/mysqldb';
// import { IChannel } from '@/models/channel.model';
import Link from 'next/link';

const res = [
  {
    text: `<div><li><p><span class='grey_text'>«LenTV24»</span> <span class='left_chan'>перестал транслироваться</span> на  ( Tricolor,  12476 R ) </p></li></div>`,
    id: 1,
  },
  {
    text: `<div><li><p><span class='grey_text'>«Obieqtivi»</span> <span class='left_chan'>перестал транслироваться</span> на  ( 11135 H ) </p></li></div>`,
    id: 2,
  },
  {
    text: `<div><li><p><span class='grey_text'>«Reshet 13»</span> <span class='add_chan'>появился на спутнике</span>  ( 11047 H ) </p></li></div>`,
    id: 3,
  },
  {
    text: `<div><li><p><span class='grey_text'>«Channel 12 (Keshet 12)»</span> <span class='add_chan'>появился на спутнике</span>  ( 11047 H ) </p></li></div>`,
    id: 4,
  },
];

// const res = await executeQuery<IChannel>(
//   'SELECT * FROM `tbl_digest` LIMIT 10',
//   []
// );

export default function Home() {
  return (
    <>
      <Title name="Deployed Home Page" />
      <Link href="/sputnikovye-novosti/2022-01-05">Sat News!</Link>

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
