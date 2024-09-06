import { Title } from '@/components/ui/Titles/Title';
import {
  EDBTableTitles,
  TSearchParams,
  getDbTableLink,
} from '@/models/ui.model';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import {
  EUrlAdminParam,
  EUrlBaseParam,
  EUrlSearchParam,
} from '@/models/url.model';
import axios from 'axios';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseVipikoEmailTemplate } from '@/components/EmailTemplates/parseVseTv.template';
import { getPool, poolExecute } from '@/libs/db/mysqldb';
// import fs from 'fs';
import { createGunzip } from 'zlib';
import sax from 'sax';
import { getDbIdAmount } from '@/controllers/schedule.controller';
import { clearTable } from '@/controllers/parse.controller';

export const dynamic = 'force-dynamic';

interface IProgramme {
  start: string;
  stop: string;
  channel: string;
  title: string;
  category: string;
  desc: string;
}

interface IChannel {
  title: string;
  vipiko_id: string;
}

const IS_LOGGED = true;
const MAX_TABLE_LINES = 2000000;
const BATCH_SIZE = 4096;

const DOWNLOAD_URL = 'http://epg.one/epg2.xml.gz';
const BASE_URL = process.env.BASE_URL;
const { TV_SCHEDULE_VIPIKO, VIPIKO_CHANNELS } = EDBTableTitles;
// const filePath = 'edem.xml';
const pool = getPool();

let insertedRows = 0;

const insertEmptyFirstRow = async () => {
  const sql = `
    INSERT INTO ${VIPIKO_CHANNELS} (title, vipiko_id)
    VALUES (?, ?)
  `;
  const res = await poolExecute(sql, ['', 0]);
  if (res instanceof Error)
    throw new Error(`DB INSERT/UPDATE first row: ${res.message}`);

  return `SUCCESS: First empty row inserted into ${VIPIKO_CHANNELS}`;
};

const insertProgrammeChunk = async (data: IProgramme[]) => {
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
  const res = await poolExecute(sql);
  if (res instanceof Error) {
    // console.log('ERROR during programme chunk insertion:', res.message);
    throw new Error(`DB INSERT data: ${res.message}`);
  }

  insertedRows += dataLength;
  // if (dataLength < BATCH_SIZE)
  //   console.log(`Inserted ${dataLength} programme rows.`);
};

const insertChannelChunk = async (data: IChannel[]) => {
  const values = data.map((item) => [
    pool.escape(item.title),
    pool.escape(item.vipiko_id),
  ]);
  const sql = `
    INSERT INTO ${VIPIKO_CHANNELS} (title, vipiko_id)
    VALUES ${values.map((valueSet) => `(${valueSet.join(', ')})`).join(', ')};
  `;
  const res = await poolExecute(sql);
  if (res instanceof Error) {
    // console.log('ERROR during channel chunk insertion:', res.message);
    throw new Error(`DB INSERT data: ${res.message}`);
  }
};

export default async function Page({
  searchParams,
  params,
}: {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const seParBatchSize =
    parseInt(validSearchParam(EUrlSearchParam.INTERVAL, searchParams), 10) ||
    BATCH_SIZE;

  const BASE_GURU_PATH = `${BASE_URL}/${lang}/${EUrlAdminParam.BASE_PATH}`;
  let messages: string[] = [];
  let insertInProgress = false;
  let lineCount = 0;

  const addMessage = (message: string, error?: Error) => {
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

    let currentProgramme: IProgramme | null = null;
    let currentChannel: IChannel | null = null;
    let bufferProgramme: IProgramme[] = [];
    let bufferChannel: IChannel[] = [];
    let displayNames: string[] = [];

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

        if (bufferProgramme.length >= seParBatchSize) {
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
            addMessage(
              'ERROR: during programme chunk insertion',
              error as Error
            );
          }
          bufferProgramme = [];
          insertInProgress = false;
        }

        currentProgramme = null;
      } else if (tagName === 'channel' && currentChannel) {
        displayNames.forEach((name) => {
          if (currentChannel && name) {
            bufferChannel.push({
              title: name,
              vipiko_id: currentChannel.vipiko_id,
            });
          }
        });

        if (bufferChannel.length >= seParBatchSize) {
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
            addMessage('ERROR: during channel chunk insertion', error as Error);
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
        `${TV_SCHEDULE_VIPIKO}: Inserted rows: ${insertedRows}. Batch size: ${seParBatchSize}`
      );

      await sendMail({
        subject: `Parse schedule Vipiko-it999`,
        body: await renderAsync(
          <ParseVipikoEmailTemplate
            pathToMainParsePage={`${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}`}
            errorMessages={messages}
            dbTableHref={getDbTableLink(TV_SCHEDULE_VIPIKO)}
          />
        ),
      });
    });

    response.data
      .pipe(gunzip)
      .pipe(saxStream)
      .on('error', (err: Error) => {
        addMessage('ERROR: during parsing', err);
      });

    addMessage('SUCCESS: Download and extraction completed');
  } catch (error) {
    addMessage(
      'ERROR: failed during processing',
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

  return (
    <>
      <Title>Parse Schedule Vipiko Page</Title>
      {messages.length > 0 && (
        <>
          <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
          <ul>
            {messages.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

// <?xml version="1.0" encoding="utf-8" ?><!DOCTYPE tv SYSTEM "http://epg.it999.ru/xmltv.dtd">
// <tv source-info-url="http://epg.it999.ru" source-info-name="EPG it999" source-info-logo="http://epg.it999.ru/images/logo100x100.png" generator-info-name="EPG it999 generator xmltv v2.1" generator-info-url="http://it999.ru">
// <channel id="2067">
// 	<display-name lang="ru">ATV</display-name>
// 	<display-name lang="ru">ATV FHD</display-name>
// 	<display-name lang="ru">Atv HD AM</display-name>
// 	<icon src="http://epg.one/img/2067.png" />
// </channel>
// <channel id="2626">
// 	<display-name lang="ru">Բազմոց tv</display-name>
// 	<icon src="http://epg.one/img/2626.png" />
// </channel>
// <channel id="2061">
// 	<display-name lang="ru">Dar 21 AM</display-name>
// 	<display-name lang="ru">Դար 21</display-name>
// 	<icon src="http://epg.one/img/2061.png" />
// </channel>
// <channel id="2066">
// 	<display-name lang="ru">Երկիր մեդիա</display-name>
// 	<display-name lang="ru">Երկիր մեդիա FHD</display-name>
// 	<icon src="http://epg.one/img/2066.png" />
// </channel>
// <channel id="2387">
// 	<display-name lang="ru">ԽԱՂԱԼԻՔ</display-name>
// 	<icon src="http://epg.one/img/2387.png" />
// </channel>

// 'id' int(4)	AUTO_INCREMENT
// 'title'	varchar(256)	utf8_unicode_ci
// 'vipiko_id'	int(5)

// <channel id="2067">
// 	<display-name lang="ru">ATV</display-name>
// 	<display-name lang="ru">ATV FHD</display-name>
// 	<display-name lang="ru">Atv HD AM</display-name>
// 	<icon src="http://epg.one/img/2067.png" />
// </channel>

// {
//   title: 'ATV',
//   vipiko_id: '2067',
// },
// {
//   title: 'ATV FHD',
//   vipiko_id: '2067',
// },
// {
//   title: 'Atv HD AM',
//   vipiko_id: '2067',
// },
