'use client';

import Image from 'next/image';
import emptyPageImg from 'public/Images/empty_page.png';

export default ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => (
  <section className="flex flex-col justify-center items-center min-h-screen gap-8 p-4 bg-blue-100 border border-stone-400 rounded-md">
    <h1 className="text-4xl text-center font-bold text-pink-700">Error Page</h1>
    <p className="text-xl text-center font-bold text-gray-800">
      Error Message: &lsquo;{error.message}&lsquo;
    </p>
    <Image
      src={emptyPageImg}
      alt={'Image of space for marking an empty result'}
    />
    <button
      type="button"
      className="py-2 px-3 font-bold text-white text-center text-xl sm:text-2xl border border-solid border-blue-300 cursor-pointer rounded-md bg-gradient-to-b from-sky-400 to-blue-500 hover:to-blue-600 shadow"
      style={{ textShadow: '0 -1px 1px rgba(0, 0, 0, 0.25)' }}
      onClick={() => reset()}
    >
      Try again / Спробувати знову
    </button>
  </section>
);
