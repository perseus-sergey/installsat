'use client';

import ErrorPage from '@/components/errors/ErrorPage/ErrorPage';

export default ({ reset }: { reset: () => void }) => (
  <ErrorPage resetFn={reset} />
);
