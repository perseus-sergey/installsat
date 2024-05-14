import { executeMultipleQuery, executeQuery } from '@/libs/db/mysqldb';
import { IScheduleTVModel } from '@/models/scheduleTV.model';
import { EDBTableTitles } from '@/models/ui.model';
import { cache } from 'react';

export const getDBChannelScheduleShort = cache(
  async (
    dbTableName: EDBTableTitles,
    chanelId: number,
    hourInterval: number,
    rowsLimit: number
  ) => {
    const sql = `
    SELECT *
    FROM ${dbTableName}
    WHERE chan_id = ?
    AND start >= NOW() - INTERVAL ? HOUR AND end <= NOW() + INTERVAL 20 HOUR
    ORDER BY start
    LIMIT ?
`;

    return await executeQuery<IScheduleTVModel>(sql, [
      `${chanelId}`,
      `${hourInterval}`,
      `${rowsLimit}`,
    ]);
  }
);

export const getChanOneDaySchedule = cache(
  async (
    scheduleTables: { tblName: EDBTableTitles; scheduleId: number }[],
    dateStr: string
  ) => {
    const sql = scheduleTables
      .map(
        ({ tblName, scheduleId }) =>
          `
      SELECT *
      FROM ${tblName}
      WHERE chan_id = ${scheduleId}
      AND start < DATE_ADD('${dateStr}', INTERVAL 30 HOUR)
      AND start > DATE_SUB('${dateStr}', INTERVAL 2 HOUR)     
      ORDER BY start;
      `
      )
      .join(' ');
    const res = await executeMultipleQuery<IScheduleTVModel>(sql);

    return res instanceof Error ? null : res;
  }
);

// export const getDBChannelSchedule = cache(
//   async (chanelSlug: string, dateStr: string) => {
//     const sql = `
//     SELECT
//       C.id,
//       C.title,
//       C.cpu,
//       C.logo,
//       C.description,
//       C.text,
//       C.url,
//       C.view,
//       C.canonical,
//       C.tvforsite_net,
//       C.vipiko,
//       C.telegid_id,
//       C.vsetv,
// 			co.title as compr,
// 			la.title as language
// 			FROM tbl_channals AS C
// 			LEFT JOIN tbl_chan_compress AS co ON C.compress = co.id
// 			LEFT JOIN tbl_language AS la ON C.lang = la.id
// 			WHERE C.cpu = ?
// 			LIMIT 1
// `;
//     const res = await executeQuery<IScheduleTvChannel>(sql, [chanelSlug]);
//     if (res instanceof Error) return null;

//     const res1 = res[0].vipiko
//       ? await executeQuery(`
//       SELECT *
// 			FROM tv_shedule_vipiko
// 			WHERE chan_id=${res[0].vipiko}
// 			AND start < ${dateStr} + INTERVAL 30 HOUR
// 			AND start > ${dateStr} - INTERVAL 2 HOUR
// 			ORDER BY start
//       `)
//       : null;

//     const res2 = res[0].vsetv
//       ? await executeQuery(`
//       SELECT *
// 			FROM tv_shedule_vsetv
// 			WHERE chan_id=${res[0].vsetv}
// 			AND start < ${dateStr} + INTERVAL 30 HOUR
// 			AND start > ${dateStr} - INTERVAL 2 HOUR
// 			ORDER BY start
//       `)
//       : null;

//     return [res, res1, res2];
//   }
// );

// SELECT
//         C.id,
//         C.title,
//         C.cpu,
//         C.logo,
//         C.description,
//         C.text,
//         C.url,
//         C.view,
//         C.canonical,
//         C.tvforsite_net,
//         C.vipiko,
//         C.telegid_id,
//         C.vsetv,
//         la.title as language,
//         VIP.start AS vip_start,
//         VIP.end AS vip_end,
//         VIP.title AS vip_title,
//         VIP.prog_desc AS vip_prog_desc,
//         VSE.start AS vse_start,
//         VSE.end AS vse_end,
//         VSE.title AS vse_title
//     FROM tbl_channals AS C
//     LEFT JOIN tbl_language AS la ON C.lang = la.id
//     LEFT JOIN tv_shedule_vipiko AS VIP ON C.vipiko = VIP.chan_id
//     LEFT JOIN tv_shedule_vsetv AS VSE ON C.vsetv = VSE.chan_id
//     WHERE C.cpu = ?
//     AND (
//         (VIP.start < '${dateStr}' + INTERVAL 30 HOUR AND VIP.start > '${dateStr}' - INTERVAL 2 HOUR)
//         OR
//         (VSE.start < '${dateStr}' + INTERVAL 30 HOUR AND VSE.start > '${dateStr}' - INTERVAL 2 HOUR)
//     )
