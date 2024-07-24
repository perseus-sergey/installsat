import { sendMail } from './libs/sendMail.mjs';
import { executePoolQuery } from './libs/mysqldb.mjs';
import { EDBTableTitles, getDbTableLink } from './libs/commons.mjs';

const { TRANS_NEWS } = EDBTableTitles;

const sendReportMail = async (message) => {
  await sendMail({
    title: `Create Copy of table ${TRANS_NEWS} to previous year table`,
    subject: `Create Last Year Trans News Table`,
    body: message,
  });
};

const R_U_N = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const newTableName = `${TRANS_NEWS}_${previousYear}`;

  const createTableQuery = `
    CREATE TABLE ${newTableName} LIKE ${TRANS_NEWS};
  `;

  const copyDataQuery = `
    INSERT INTO ${newTableName}
    SELECT * FROM ${TRANS_NEWS}
    WHERE date BETWEEN '${previousYear}-01-01' AND '${previousYear}-12-31';
  `;

  let htmlText = '';

  const createRes = await executePoolQuery(createTableQuery);

  if (!(createRes instanceof Error)) {
    console.log('🚀 ~ constR_U_N= ~ createRes:', createRes);
    htmlText += `<p style='color: green;'>Таблиця ${newTableName} успішно створена</p>`;

    const copyRes = await executePoolQuery(copyDataQuery);

    htmlText +=
      copyRes instanceof Error
        ? `<p style='color: red;>DB ERROR! Could not copy data from ${TRANS_NEWS} to ${newTableName} table.</p><p>Error: ${copyRes.message}</p><p>Query: ${copyDataQuery}</p>`
        : `<p style='color: green;'>DB SUCCESS! Data copied from ${TRANS_NEWS} to ${newTableName} table.</p><p>Copied rows: ${copyRes.affectedRows}</p>`;
  } else {
    htmlText += `<p style='color: red;>DB ERROR! Could not create new table ${newTableName}.</p><p>Error: ${createRes.message}</p><p>Query: ${createTableQuery}</p>`;
  }

  htmlText += `<p><a href="${getDbTableLink(TRANS_NEWS)}">Original table</a></p>`;
  htmlText += `<p><a href="${getDbTableLink(newTableName)}">New table</a></p>`;
  await sendReportMail(htmlText);
};

R_U_N();
