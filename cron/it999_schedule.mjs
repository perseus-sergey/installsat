import {
  EDBTableTitles,
  getDbTableLink,
  EUrlAdminParam,
} from './libs/commons.mjs';
import axios from 'axios';
import { sendMail } from './libs/sendMail.mjs';
import { getPool, executePoolQuery } from './libs/mysqldb.mjs';
import { getDbIdAmount } from './libs/parseTransNews.controller.mjs';
import { clearTable } from './libs/parse.controller.mjs';
// import fs from 'fs';
import { createGunzip } from 'zlib';
import sax from 'sax';

const isProductionMode = process.env.NODE_ENV === 'production';
const IS_LOGGED = !isProductionMode;

const MAX_TABLE_LINES = 2000000;
const BATCH_SIZE = 8096;

const DOWNLOAD_URL = 'http://epg.one/epg2.xml.gz';
const BASE_URL = process.env.BASE_URL;
const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;
// const filePath = 'edem.xml';

const { TV_SCHEDULE_VIPIKO, VIPIKO_CHANNELS } = EDBTableTitles;
const pool = getPool();

let insertedRows = 0;

const insertEmptyFirstRow = async () => {
  const sql = `
    INSERT INTO ${VIPIKO_CHANNELS} (title, vipiko_id)
    VALUES (?, ?)
  `;
  const res = await executePoolQuery(sql, ['', 0]);
  if (res instanceof Error)
    throw new Error(`DB INSERT/UPDATE first row: ${res.message}`);

  return `SUCCESS: First empty row inserted into ${VIPIKO_CHANNELS}`;
};

const insertProgrammeChunk = async (data) => {
  const dataLength = data.length;
  if (dataLength === 0) return;
  if (insertedRows > MAX_TABLE_LINES)
    throw new Error(`DB inserted rows > ${MAX_TABLE_LINES}`);

  const values = data.map((item) => [
    pool.escape(item.start),
    pool.escape(item.stop),
    pool.escape(item.channel),
    pool.escape(item.title),
    pool.escape(item.category),
    pool.escape(item.desc),
  ]);
  const sql = `
    INSERT INTO ${TV_SCHEDULE_VIPIKO} (start, end, chan_id, title, prog_cat, prog_desc)
    VALUES ${values.map((valueSet) => `(${valueSet.join(', ')})`).join(', ')};
  `;
  const res = await executePoolQuery(sql);
  if (res instanceof Error) {
    // console.log('ERROR during programme chunk insertion:', res.message);
    throw new Error(`DB INSERT data: ${res.message}`);
  }

  insertedRows += dataLength;
  // if (dataLength < BATCH_SIZE)
  //   console.log(`Inserted ${dataLength} programme rows.`);
};

const insertChannelChunk = async (data) => {
  const values = data.map((item) => [
    pool.escape(item.title),
    pool.escape(item.vipiko_id),
  ]);
  const sql = `
      INSERT INTO ${VIPIKO_CHANNELS} (title, vipiko_id)
      VALUES ${values.map((valueSet) => `(${valueSet.join(', ')})`).join(', ')};
    `;
  const res = await executePoolQuery(sql);
  if (res instanceof Error) throw new Error(`DB INSERT data: ${res.message}`);
};

const sendReportMail = async ({ messages, tblItemLength, foundLines }) => {
  await sendMail({
    title: 'Parse Vipiko-It999 Schedule Report',
    subject: `Parse Vipiko-It999 Schedule`,
    body: `
    <p style="font-size: 20px;">The number of records in the db <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${getDbTableLink(TV_SCHEDULE_VIPIKO)}" >
        table ${TV_SCHEDULE_VIPIKO}
        </a>:
      <span style="color: green;"> ${tblItemLength}</span>
    </p>
    <p>Found and handled tags "programme": <span style="color: green;"> ${foundLines}</span></p>
      ${
        messages.length
          ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p><ul style="padding-bottom: 10px">${messages.map((msg) => `<li>${msg}</li>`).join('')}</ul>`
          : ''
      }
      <hr />
      <p>
        <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}" >
        Main Parsing Page
        </a>
      </p>
      <p>
        <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${getDbTableLink(VIPIKO_CHANNELS)}" >
        Db Table Vipiko Channel List
        </a>
      </p>
    `,
  });
};

const R_U_N = async () => {
  let messages = [];
  let insertInProgress = false;
  let lineCount = 0;

  const addMessage = (message, error = undefined) => {
    messages.push(`${message}${error ? `: ${error.message}` : ''}`);
    if (IS_LOGGED)
      console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
  };

  try {
    const response = await axios({
      url: DOWNLOAD_URL,
      method: 'GET',
      responseType: 'stream',
    });

    const gunzip = createGunzip();

    addMessage(await clearTable(TV_SCHEDULE_VIPIKO));
    addMessage(await clearTable(VIPIKO_CHANNELS));

    addMessage(await insertEmptyFirstRow());

    const saxStream = sax.createStream(true);

    let currentProgramme = null;
    let currentChannel = null;
    let bufferProgramme = [];
    let bufferChannel = [];
    let displayNames = [];

    saxStream.on('opentag', (node) => {
      if (node.name === 'programme') {
        currentProgramme = {
          start: String(node.attributes.start).slice(0, 14),
          stop: String(node.attributes.stop).slice(0, 14),
          channel: String(node.attributes.channel),
          title: '',
          category: '',
          desc: '',
        };
      } else if (node.name === 'channel') {
        currentChannel = {
          title: '',
          vipiko_id: String(node.attributes.id),
        };
        displayNames = [];
      }
    });

    saxStream.on('text', (text) => {
      if (currentProgramme) {
        const trimmedText = text.trim();
        switch (saxStream._parser.tag.name) {
          case 'title':
            currentProgramme.title += trimmedText;
            break;
          case 'category':
            currentProgramme.category += trimmedText;
            break;
          case 'desc':
            currentProgramme.desc += trimmedText;
            break;
        }
      } else if (currentChannel) {
        const trimmedText = text.trim();
        if (saxStream._parser.tag.name === 'display-name') {
          displayNames.push(trimmedText);
        }
      }
    });

    saxStream.on('closetag', async (tagName) => {
      if (tagName === 'programme' && currentProgramme) {
        bufferProgramme.push(currentProgramme);
        lineCount += 1;

        if (bufferProgramme.length >= BATCH_SIZE) {
          while (insertInProgress) {
            // Зачекайте, поки поточна вставка завершиться
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          insertInProgress = true;
          try {
            if (bufferProgramme.length > 0) {
              // Перевірка на порожній буфер
              await insertProgrammeChunk(bufferProgramme);
            }
          } catch (error) {
            addMessage('ERROR: during programme chunk insertion', error);
          }
          bufferProgramme = [];
          insertInProgress = false;
        }

        currentProgramme = null;
      } else if (tagName === 'channel' && currentChannel) {
        displayNames.forEach((name) => {
          if (currentChannel && name)
            bufferChannel.push({
              title: name,
              vipiko_id: currentChannel.vipiko_id,
            });
        });

        if (bufferChannel.length >= BATCH_SIZE) {
          while (insertInProgress) {
            // Зачекайте, поки поточна вставка завершиться
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          insertInProgress = true;
          try {
            if (bufferChannel.length > 0) {
              // Перевірка на порожній буфер
              await insertChannelChunk(bufferChannel);
            }
          } catch (error) {
            addMessage('ERROR: during channel chunk insertion', error);
          }
          bufferChannel = [];
          insertInProgress = false;
        }

        currentChannel = null;
        displayNames = [];
      }
    });

    saxStream.on('end', async () => {
      if (bufferProgramme.length > 0) {
        await insertProgrammeChunk(bufferProgramme);
        bufferProgramme = [];
      }
      if (bufferChannel.length > 0) {
        await insertChannelChunk(bufferChannel);
        bufferChannel = [];
      }

      addMessage(
        `SUCCESS: End of file. Handled line count: ${lineCount.toLocaleString('en-US')}`
      );

      const resDbTableLength = await getDbIdAmount(TV_SCHEDULE_VIPIKO);
      addMessage(
        `The number of records in the db table: ${
          typeof resDbTableLength === 'string'
            ? resDbTableLength
            : resDbTableLength[0].count.toLocaleString('en-US')
        }`
      );

      saxStream.on('error', (error) => {
        console.error('SAX Parser Error:', error);
        saxStream._parser.error = new Error();
        saxStream._parser.resume();
      });

      addMessage(
        `${TV_SCHEDULE_VIPIKO}: Inserted rows: ${insertedRows}. Batch size: ${BATCH_SIZE}`
      );

      await sendReportMail({
        foundLines: lineCount,
        messages,
        tblItemLength:
          typeof resDbTableLength === 'string'
            ? resDbTableLength
            : resDbTableLength[0].count.toLocaleString('en-US'),
      });
    });

    response.data
      .pipe(gunzip)
      .pipe(saxStream)
      .on('error', (err) => {
        addMessage('ERROR: during parsing', err);
      });

    addMessage('SUCCESS: Download and extraction completed');
  } catch (error) {
    addMessage(
      '`ERROR: failed during processing',
      error instanceof Error ? error : new Error('Unknown error occurred')
    );
  } finally {
    // Delete the file
    // fs.unlink(filePath, (err) => {
    //   err
    //     ? messages.push(`ERROR: failed deleting file: ${err.message}`)
    //     : messages.push('SUCCESS: File deleted');
    // });
  }
};

R_U_N();

// <channel id="2066">
// 	<display-name lang="ru">Երկիր մեդիա</display-name>
// 	<display-name lang="ru">Երկիր մեդիա FHD</display-name>
// 	<icon src="http://epg.one/img/2066.png" />
// </channel>
// <programme start="20240724020000 +0300" stop="20240724030000 +0300" channel="681">
//   <title lang="ru">Хит нон-стоп</title>
//   <desc lang="ru">музыкальная программа</desc>
//   <category lang="ru">Досуг</category>
// </programme>
