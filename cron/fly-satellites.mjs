import { sendMail } from './libs/sendMail.mjs';
import {
  EDBTableTitles,
  getDbTableLink,
  EUrlAdminParam,
} from './libs/commons.mjs';
import { parseProcess } from './libs/parseALLFlySats_without_capsolver.controller.mjs';
// import { parseProcess } from './libs/parseALLFlySats.controller.mjs';

const INTERVAL_FROM_LAST_UPDATE = 2;

const BASE_URL = process.env.BASE_URL;
const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;

const PARSE_LIST_OF_SATELLITES_URL = 'https://flysat.com/en/satellitelist';
const { FLY_SATELLITES } = EDBTableTitles;

const sendReportMail = async (
  messages,
  newSatList,
  overSats,
  allParsedSatList,
  dbSatList
) => {
  // ========= DEBUG =========
  const allDbList = `<p style="color: blue; font-size: 20px; padding: 10px 0">All Sats in my DB:</p><ul style="padding-bottom: 10px">${dbSatList.map((sat) => `<li>${sat.title} ${sat.position}</li>`).join('')}</ul>`;

  const allParsedList = `<p style="color: blue; font-size: 20px; padding: 10px 0">All Sats in FLYSAT:</p><ul style="padding-bottom: 10px">${allParsedSatList.map((sat) => `<li>${sat.title} ${sat.position}</li>`).join('')}</ul>`;

  // ========= DEBUG =========
  const reportMessages = messages.length
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p><ul style="padding-bottom: 10px">${messages.map((msg) => `<li>${msg}</li>`).join('')}</ul>`
    : '';

  const newSats = newSatList.length
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">New Satellites on FlySat:</p><ul style="padding-bottom: 10px">${newSatList.map((sat) => `<li>${JSON.stringify(sat, null, 2)}</li>`).join('')}</ul>`
    : '';

  const overSatList = overSats.length
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Over Sats: Satellites in My DB, That Not Found in FlySat:</p><ul style="padding-bottom: 10px">${overSats.map((sat) => `<li>${JSON.stringify(sat, null, 2)}</li>`).join('')}</ul>`
    : '';

  await sendMail({
    title: 'Parse Fly Satellites Report',
    subject: `Parse Fly Satellites`,
    body: `
    ${allDbList}
    ${allParsedList}
    <hr />
      ${newSats}
      ${overSatList}
      ${reportMessages}
    <hr />
    <p>
      <a style="color: blue; font-size: 20px; padding: 10px 0" target="_blank" href="${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}" >
      Parse Fly Satellites again
      </a>
    </p>
    <p>
      <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${getDbTableLink(FLY_SATELLITES)}" >
      DB Table
      </a>
    </p>
    <p>
      <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${PARSE_LIST_OF_SATELLITES_URL}" >
      Source page
      </a>
    </p>
    `,
  });
};

const R_U_N = async () => {
  let messages = [];
  let newSatList = [];
  let overSats = [];
  try {
    ({ messages, newSatList, overSats, allParsedSatList, dbSatList } =
      await parseProcess(INTERVAL_FROM_LAST_UPDATE));
  } catch (error) {
    messages.push(
      error instanceof Error
        ? error.message
        : 'ERROR: Unknown error occurred while parseProcess'
    );
  }

  await sendReportMail(
    messages,
    newSatList,
    overSats,
    allParsedSatList,
    dbSatList
  );
};

R_U_N();

// interface ISat {
//   cluster: string,
//   title: string,
//   url_link: string,
//   slug: string,
//   position: string,
//   grade: string,
//   date_upd: Date,
// }
