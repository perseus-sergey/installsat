'use server';

import { LAST_NEWS_INTERVAL, rawSatDigest } from '@/models/satDigest.model';
import { revalidatePath } from 'next/cache';
import { getSatDigestNews } from '@/controllers/satDigest.controller';

const digestIntervalAction = async (
  _prevState: {
    message: string;
  },
  formData: FormData
) => {
  const selectSats = formData.getAll('selectSats') as string[] | undefined;
  const timeInterval = formData.get('timeInterval') || LAST_NEWS_INTERVAL;
  const submitBtn = formData.get('submitBtn');

  if (submitBtn !== 'Submit')
    return {
      message: `The submit button was not clicked!`,
      newsIntervalResult: [rawSatDigest],
    };

  const newsIntervalResult = await getSatDigestNews(
    selectSats,
    Number(timeInterval)
  );

  if (newsIntervalResult instanceof Error)
    return {
      message: `Failed to fetch data. Error: ${newsIntervalResult.message}`,
      newsIntervalResult: [rawSatDigest],
    };

  revalidatePath('/');

  return { message: '', newsIntervalResult };
};

export default digestIntervalAction;
