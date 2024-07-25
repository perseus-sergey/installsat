import { Title } from '@/components/ui/Titles/Title';
import {
  EDBTableTitles,
  TSearchParams,
  getDbTableLink,
} from '@/models/ui.model';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { EUrlAdminParam, EUrlBaseParam } from '@/models/url.model';
import axios from 'axios';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseVipikoEmailTemplate } from '@/components/EmailTemplates/parseVseTv.template';
import { executePoolQuery, getPool, poolExecute } from '@/libs/db/mysqldb';
import fs from 'fs';
import { createGunzip } from 'zlib';
import sax from 'sax';

export const dynamic = 'force-dynamic';

interface IProgramme {
  start: string;
  stop: string;
  channel: string;
  title: string;
  category: string;
  desc: string;
}

const IS_LOGGED = true;
const MAX_PARSING_LINES = 1000000; // 0 for ignore
const BATCH_SIZE = 1000;

const DOWNLOAD_URL = 'http://epg.it999.ru/edem.xml.gz';
const BASE_URL = process.env.BASE_URL;
const { TV_SCHEDULE_VIPIKO } = EDBTableTitles;
const filePath = 'edem.xml';
const pool = getPool();

const clearTable = async () => {
  await executePoolQuery(`TRUNCATE TABLE ${TV_SCHEDULE_VIPIKO}`);

  return `SUCCESS: Table ${TV_SCHEDULE_VIPIKO} cleared`;
};

const insertChunk = async (data: IProgramme[]) => {
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

  if (res instanceof Error) throw new Error(`DB INSERT data: ${res.message}`);
};

export default async function Page({
  params,
}: {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const BASE_GURU_PATH = `${BASE_URL}/${lang}/${EUrlAdminParam.BASE_PATH}`;
  let messages: string[] = [];
  let insertInProgress = false;
  let lineCount = 0;

  try {
    IS_LOGGED && console.log('🚀 ~ Starting download and extraction...');
    const response = await axios({
      url: DOWNLOAD_URL,
      method: 'GET',
      responseType: 'stream',
    });

    const gunzip = createGunzip();

    IS_LOGGED && console.log('🚀 ~ Starting table clearing...');
    const clearTableMessage = await clearTable();
    messages.push(clearTableMessage);
    IS_LOGGED && console.log('🚀 ~ Table clearing completed');

    const saxStream = sax.createStream(true);

    let currentProgramme: IProgramme | null = null;
    let buffer: IProgramme[] = [];

    saxStream.on('opentag', (node) => {
      if (MAX_PARSING_LINES && lineCount >= MAX_PARSING_LINES) return;

      if (node.name === 'programme') {
        currentProgramme = {
          start: String(node.attributes.start).slice(0, 14),
          stop: String(node.attributes.stop).slice(0, 14),
          channel: String(node.attributes.channel),
          title: '',
          category: '',
          desc: '',
        };
      }
    });

    saxStream.on('text', (text) => {
      if (MAX_PARSING_LINES && lineCount >= MAX_PARSING_LINES) return;

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
      }
    });

    saxStream.on('closetag', async (tagName) => {
      if (MAX_PARSING_LINES && lineCount >= MAX_PARSING_LINES) return;

      if (tagName === 'programme' && currentProgramme) {
        buffer.push(currentProgramme);
        lineCount += 1;

        if (buffer.length >= BATCH_SIZE && !insertInProgress) {
          insertInProgress = true;
          await insertChunk(buffer);
          buffer = [];
          insertInProgress = false;
        }

        currentProgramme = null;
      }
    });

    saxStream.on('end', async () => {
      if (buffer.length > 0) {
        IS_LOGGED &&
          console.log(
            '🚀 ~ saxStream.end ~ final insert ~ buffer.length:',
            buffer.length
          );
        await insertChunk(buffer);
        buffer = [];
      }
      messages.push('SUCCESS: Parsing and insertion completed');
      IS_LOGGED &&
        console.log(
          '🚀 ~ Parsing and insertion completed. Handled line count:',
          lineCount
        );
    });

    response.data
      .pipe(gunzip)
      .pipe(saxStream)
      .on('error', (err: Error) => {
        console.error('Error during parsing:', err);
        messages.push(`ERROR: failed during parsing: ${err.message}`);
      });

    messages.push('SUCCESS: Download and extraction completed');
    IS_LOGGED && console.log('🚀 ~ Download and extraction completed');
  } catch (error) {
    messages.push(
      error instanceof Error
        ? `ERROR: failed during processing: ${error.message}`
        : 'ERROR: Unknown error occurred'
    );
    console.error('🚀 ~ Error during processing:', error);
  } finally {
    // Delete the file
    fs.unlink(filePath, (err) => {
      err
        ? messages.push(`ERROR: failed deleting file: ${err.message}`)
        : messages.push('SUCCESS: File deleted');
    });
  }

  console.log('🚀 ~ lineCount:', lineCount);

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
