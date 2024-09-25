'use client';

import ErrorPage from '@/components/errors/ErrorPage/ErrorPage';

export default ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => <ErrorPage resetFn={reset} />;
