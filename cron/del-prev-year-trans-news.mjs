import { sendMail } from './libs/sendMail.mjs';
import { executePoolQuery } from './libs/mysqldb.mjs';
import { EDBTableTitles } from './libs/commons.mjs';

const sendReportMail = async (message) => {
  await sendMail({
    title: `Delete previous year news from ${EDBTableTitles.TRANS_NEWS}`,
    subject: `Delete old Trans News`,
    body: message,
  });
};

const R_U_N = async () => {
  const dbTblHref = getDbTableLink(EDBTableTitles.TRANS_NEWS);

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const deleteQuery = `
    DELETE FROM ${EDBTableTitles.TRANS_NEWS} 
    WHERE date < STR_TO_DATE('${currentYear}-01-01', '%Y-%m-%d')
  `;

  const delRes = await executePoolQuery(deleteQuery);
  const message =
    delRes instanceof Error
      ? `<p>DB ERROR! Could not delete old data for ${previousYear} year from the <a href="${dbTblHref}">table</a>.</p><p>Error: ${delRes.message}</p><p>Query: ${deleteQuery}</p>`
      : `<p>DB SUCCESS! Old data for ${previousYear} year deleted from the <a href="${dbTblHref}">table</a>.</p><p>Deleted rows: ${delRes.affectedRows}</p>`;

  await sendReportMail(message);
};

R_U_N();
