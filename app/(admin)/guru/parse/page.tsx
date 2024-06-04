import { Title } from '@/components/ui/Titles/Title';
import { EUrlAdminParam } from '@/models/url.model';
import Link from 'next/link';

export default async function Page() {
  return (
    <>
      <Title>Parse Page</Title>
      <Link
        href={`${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`}
        target="_blank"
        className="bg-blue-500 text-white font-bold py-2 px-4 w-fit rounded hover:bg-blue-400"
      >
        Parse Schedule VseTv
      </Link>
      <Link
        href={`${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SAT_DIGEST}`}
        target="_blank"
        className="bg-blue-500 text-white font-bold py-2 px-4 w-fit rounded hover:bg-blue-400"
      >
        Parse Sat Digest
      </Link>
    </>
  );
}
