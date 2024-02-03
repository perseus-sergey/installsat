'use server';

import {
  TSatDigest,
  LAST_NEWS_INTERVAL,
  rawSatDigest,
  makeDigestSql,
} from '@/models/satDigest.model';
import { executeQuery } from '../db/mysqldb';
import { revalidatePath } from 'next/cache';

const digestIntervalAction = async (
  _prevState: {
    message: string;
  },
  formData: FormData
) => {
  const selectSats = formData.getAll('selectSats') as string[] | null;
  const timeInterval = formData.get('timeInterval') || LAST_NEWS_INTERVAL;
  const submitBtn = formData.get('submitBtn');
  let orderBy = '';
  let inSatList = '';
  let tblName = 'tbl_digest';
  let where = '';

  if (submitBtn === 'Submit') {
    if (timeInterval) {
      orderBy = 'ORDER BY satGrade, satTitle, d.date DESC';
      // TODO:
      // if (+timeInterval > 180) {
      if (+timeInterval > 580) {
        if (+timeInterval !== new Date().getFullYear())
          tblName = `tbl_digest_${timeInterval}`;
      } else {
        // where = `WHERE date >= CURDATE() - INTERVAL ${LAST_NEWS_INTERVAL} DAY`;
        // TODO:
        where = `WHERE date >= CURDATE() - INTERVAL ${timeInterval} DAY`;
      }
    }
    if (selectSats && selectSats.length && selectSats[0]) {
      inSatList = `AND sat.grade IN ("${selectSats.join('","')}")`;
    }
  }
  const newsSql = makeDigestSql(tblName, where, inSatList, orderBy);
  // console.log('🚀 ~ newsSql:', newsSql);

  try {
    const newsIntervalResult = await executeQuery<TSatDigest>(newsSql, []);

    revalidatePath('/');

    return { message: '', newsIntervalResult };
  } catch (e) {
    const err = e as Error;

    return {
      // TODO:
      // message: `Sorry, the error has happened while receiving data.`,
      message: `Failed to fetch data. Error: ${err.message}`,
      newsIntervalResult: [rawSatDigest],
    };
  }
};

export default digestIntervalAction;
