import { sendMail } from './libs/sendMail.mjs';
import {
  EDBTableTitles,
  getDbTableLink,
  EUrlAdminParam,
} from './libs/commons.mjs';
import { parseProcess } from './libs/parseALLFlySats.controller.mjs';

const BASE_URL = process.env.BASE_URL;
const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;

const sendReportMail = async (errorMessages) => {
  const messages = errorMessages.length
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p><ul style="padding-bottom: 10px">${errorMessages.map((msg) => `<li>${msg}</li>`)}</ul>`
    : '';

  await sendMail({
    title: 'Parse Trans News',
    subject: `Parse transponder news`,
    body: `
      ${messages}
    <hr />
    <p>
      <a style="color: blue; font-size: 20px; padding: 10px 0" target="_blank" href="${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}" >
      Parse Transponder news again
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

const PARSE_LIST_OF_SATELLITES_URL = 'https://flysat.com/en/satellitelist';
const { FLY_SATELLITES } = EDBTableTitles;

const R_U_N = async () => {
  const { messages } = await parseProcess(intervalFromLastUpd);

  await sendReportMail(messages);
};

R_U_N();
