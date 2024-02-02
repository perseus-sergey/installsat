'use server';

import {
  TSatDigest,
  LAST_NEWS_INTERVAL,
  rawSatDigest,
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
      // if (+timeInterval > 180) {
      if (+timeInterval > 580) {
        if (+timeInterval !== new Date().getFullYear())
          tblName = `tbl_digest_${timeInterval}`;
      } else {
        where = `WHERE date >= CURDATE() - INTERVAL ${LAST_NEWS_INTERVAL} DAY`;
        // where = `WHERE date >= CURDATE() - INTERVAL ${timeInterval} DAY`;
      }
    }
    if (selectSats && selectSats.length && selectSats[0]) {
      inSatList = `AND sat.grade IN ("${selectSats.join('","')}")`;
    }
  }
  const newsSql = `
    SELECT d.id, d.date, d.text,
    sat.parent AS satParent,
    sat.title AS satTitle,
    sat.logo AS satLogo,
    sat.grade AS satGrade,
    sat.position AS satPosition
    FROM ${tblName} AS d
    LEFT JOIN tbl_chan_sat AS sat ON d.sat = sat.id
    ${where}
    ${inSatList}
    ${orderBy}
  `;
  // console.log('🚀 ~ newsSql:', newsSql);

  try {
    const newsIntervalResult = await executeQuery<TSatDigest>(newsSql, []);

    revalidatePath('/');

    return { message: '', newsIntervalResult };
  } catch (e) {
    const err = e as Error;

    return {
      // message: `Sorry, the error has happened while receiving data.`,
      message: `Failed to fetch data. Error: ${err.message}`,
      newsIntervalResult: [rawSatDigest],
    };
  }
};

export default digestIntervalAction;
