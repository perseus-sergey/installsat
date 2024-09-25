'use client';

import ErrorPage from '@/components/errors/ErrorPage/ErrorPage';

export default ({ reset }: { reset: () => void }) => (
  <html lang="en">
    <body suppressHydrationWarning={true}>
      <main className="article">
        <ErrorPage resetFn={reset} />
      </main>
    </body>
  </html>
);
