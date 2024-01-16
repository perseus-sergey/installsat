'use client';

import ErrorPage from '@/components/ErrorPage/ErrorPage';

export default ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => <ErrorPage error={error} resetFn={reset} />;
