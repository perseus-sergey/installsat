import FormDigestInterval from '@/components/FormDigestInterval1/FormDigestInterval';
import { Suspense } from 'react';

interface IProps {
  searchParams: { [key: string]: string | string[] | undefined };
  children: React.ReactNode;
}

export default function RootLayout({ searchParams, children }: IProps) {
  return (
    <>
      <nav>
        <Suspense>
          <FormDigestInterval searchParams={searchParams} />
        </Suspense>
      </nav>
      {children}
    </>
  );
}
