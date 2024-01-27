import { Title } from '@/components/Title/Title';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Title name="Deployed Home Page" />
      <Link href="/sputnikovye-novosti/2022-01-05">
        /sputnikovye-novosti/2022-01-05
      </Link>
    </>
  );
}
