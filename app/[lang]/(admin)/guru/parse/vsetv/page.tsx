import { Title } from '@/components/ui/Titles/Title';
import * as cheerio from 'cheerio';
import { getFormattedDate } from '@/libs/utils/dates';
import { DateTime } from 'luxon';
import {
  deleteDBVseTvChannel,
  getDBVseTvChannels,
  getDbIdAmount,
  insertDBVseTvChannels,
  truncateDBVseTv,
} from '@/controllers/schedule.controller';
import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import {
  validSearchParam,
  validSearchParamArray,
} from '@/libs/utils/validSearchParam';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import { IVseTvErrorChannel, IVseTvParsModel } from '@/models/scheduleTV.model';
import { cache } from 'react';
import Link from 'next/link';
import { createURLWithParams } from '@/libs/utils/utils';
import axios from 'axios';
import iconv from 'iconv-lite';
import { IDbIdAmountModel } from '@/models/admin.model';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseVseTvEmailTemplate } from '@/components/EmailTemplates/parseVseTv.template';
import { getPool } from '@/libs/db/mysqldb';

interface IShowsData {
  startTime: string;
  endTime: string;
  title: string;
  channelVseTvId: string;
}

const pool = getPool();
const BASE_URL = process.env.BASE_URL;
const { TV_SCHEDULE_VSE_TV } = EDBTableTitles;
const BATCH_SIZE = 500;
const TRAP_CHANNEL: IVseTvParsModel = {
  vsetv: '346',
  title: 'trapChannel',
  id: '',
  cpu: '',
};
const DATE_FORMAT_FOR_DB = 'yyyy-MM-dd HH:mm:ss';
const currentYear = new Date().getFullYear();

const month = [
  '0',
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const getParseURL = cache(
  (vsetvId: string) =>
    `http://www.vsetv.com/schedule_channel_${vsetvId}_week.html`
);

const catchTraps = ($: cheerio.CheerioAPI) => {
  const firstTimeDiv = $('#schedule_container .time').first();
  const imgs = firstTimeDiv.find('img');

  const results: string[] = [];

  imgs.each((_, img) => {
    const src = $(img).attr('src');
    if (!src)
      throw new Error(
        `Error trap: Can't extract img.src: ${src} from element img: ${img}`
      );

    const match = src.match(/\/pic\/(\w+)\.gif/);
    if (!match || match.length === 0 || !match[1])
      throw new Error(`Can't match trap from img.src: ${src}`);

    results.push(match[1]);
  });

  return { zero: results[0], five: results[1] };
};

const getFullDate = (
  year: number,
  month: number,
  dayStr: string,
  timeStr: string
): Date | string => {
  if (month <= 0 || month > 12) return `Bad month number: ${month}`;

  const day = parseInt(dayStr, 10);
  if (isNaN(day) || day <= 0 || day > 31)
    return `Bad day: ${day} from ${dayStr}`;

  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  if (isNaN(hour) || hour < 0 || hour >= 24)
    return `Bad hour: ${hour} from ${timeStr}`;

  const minute = parseInt(minuteStr, 10);
  if (isNaN(minute) || minute < 0 || minute >= 60)
    return `Bad minute: ${minute} from ${timeStr}`;

  const dateTime = DateTime.fromObject({ year, month, day, hour, minute });

  return dateTime.isValid
    ? dateTime.toJSDate()
    : `Wrong dateTime ${dateTime.toJSDate()}`;
}; // Output: Date object representing '2024-07-14 07:25:00'

const parseChannelPage = async (
  channel: IVseTvParsModel,
  trapChannelId: string,
  zero?: string,
  five?: string
) => {
  if ((!zero || !five || zero === five) && `${channel.vsetv}` !== trapChannelId)
    throw new Error(
      `Error parsing channel «${channel.title}»(${channel.vsetv} - Traps are not defined: zero = «${zero}»; five = «${five}»`
    );
  const res = await axios.get(getParseURL(channel.vsetv), {
    responseType: 'arraybuffer',
  });

  const decodedData = iconv.decode(Buffer.from(res.data), 'windows-1251');

  const replacedHtml = decodedData
    .replace(new RegExp(`<img src="/pic/${five || ''}\\.gif">`, 'g'), '5')
    .replace(new RegExp(`<img src="/pic/${zero || ''}\\.gif">`, 'g'), '0');

  return cheerio.load(replacedHtml);
};

const extractParsedData = ($: cheerio.CheerioAPI, channel: IVseTvParsModel) => {
  const parsedData: IShowsData[] = [];
  const chWeekdayTitle = $('td.weekdaytitle').first();
  if (!chWeekdayTitle)
    return `Error of parsing WEEKDAY TITLE from «${$(chWeekdayTitle).html()}» for channel «${channel.title}»(${channel.vsetv})`;

  const words = chWeekdayTitle.text().trim().split(' ');
  const parsedMonth = words[words.length - 1];
  const parsedDay = words[words.length - 2];
  const monthNumber = month.indexOf(parsedMonth);
  if (monthNumber < 0)
    return `Error extracting and matching month number from chWeekdayTitle: «${$(chWeekdayTitle).html()}»`;

  const chTimes = $('.time');
  const chProgTitles = $('.prname2');
  if (!chTimes.length || !chProgTitles.length)
    return `Error of parsing channel TIMES or PROGRAM TITLES for channel «${channel.title}»(${channel.vsetv})`;

  let currentTitle: string | undefined = undefined;
  let previousDate: Date | null = null;
  let addedDays = 0;
  let errors: string[] = [];

  chTimes.each((i: number, chTime: cheerio.Element) => {
    let dateUpd = getFullDate(
      currentYear,
      monthNumber,
      parsedDay,
      $(chTime).text().trim()
    );

    if (typeof dateUpd === 'string') {
      errors.push(`Error of making date: ${dateUpd}`);

      return;
    }

    let newDate = DateTime.fromJSDate(dateUpd)
      .plus({ days: addedDays })
      .toJSDate();

    if (previousDate && previousDate > newDate) {
      addedDays += 1;
      newDate = DateTime.fromJSDate(newDate).plus({ days: 1 }).toJSDate();
    }

    if (currentTitle !== undefined) {
      parsedData.push({
        startTime: getFormattedDate(
          previousDate || new Date('970-01-01'),
          DATE_FORMAT_FOR_DB
        ),
        endTime: getFormattedDate(newDate, DATE_FORMAT_FOR_DB),
        title: currentTitle,
        channelVseTvId: channel.vsetv,
      });
    }

    currentTitle = $(chProgTitles[i]).text().trim();
    if (!currentTitle) {
      errors.push(
        `Error of parsing program title: currentTitle = «${currentTitle}»`
      );

      return;
    }

    previousDate = newDate;
  });

  return errors.length > 0 ? errors.join(', ') : parsedData;
};

const insertDataInBatches = async (data: string[]) => {
  if (!data || data.length === 0)
    return ['Error: Received empty data for batch insert'];

  let message: string[] = [];

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    // const insertedStr = batch.join(',');
    // const sql = `
    //   INSERT INTO ${TV_SCHEDULE_VSE_TV} (start, end, chan_id, title)
    //   VALUES ${insertedStr}
    // `;

    try {
      // await pool.query(sql);
      await insertDBVseTvChannels(batch);
      // message.push(`Inserted batch, BATCH_SIZE = ${BATCH_SIZE}`);
    } catch (err) {
      message.push(
        `Error inserting batch: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      // message.push(
      //   `Error inserting batch: ${error instanceof Error ? error.message : 'Unknown error'}`
      // );
    }
  }

  return message;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQueryArray = validSearchParamArray(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const trapsChannelId = validSearchParam(
    EUrlSearchParam.COMMENT_ID,
    searchParams
  );

  let dbInsertedStrings: string[] = [];
  const errorChannels: IVseTvErrorChannel[] = [];
  const errorMessages: string[] = [];
  let resDbTableLength: IDbIdAmountModel[] | string = '';
  const trapChannel: IVseTvParsModel = trapsChannelId
    ? { ...TRAP_CHANNEL, vsetv: trapsChannelId }
    : TRAP_CHANNEL;

  try {
    const { zero, five } = catchTraps(
      await parseChannelPage(trapChannel, trapChannel.vsetv)
    );
    if (!zero || !five || zero === five)
      throw new Error(
        `Traps are not defined: zero = «${zero}»; five = «${five}»`
      );

    const channels = await getDBVseTvChannels(searchQueryArray);

    if (!searchQueryArray || searchQueryArray.length === 0)
      await truncateDBVseTv();

    for (const channel of channels) {
      try {
        const $ = await parseChannelPage(
          channel,
          trapChannel.vsetv,
          zero,
          five
        );
        const channelParsedData = extractParsedData($, channel);
        if (typeof channelParsedData === 'string') {
          errorChannels.push({
            ...channel,
            error: channelParsedData,
            channelEditUrl: `${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit/${channel.id}`,
            sourceChannelUrl: getParseURL(channel.vsetv),
            parseUrl: createURLWithParams(
              `${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`,
              { [EUrlSearchParam.CHANNEL]: channel.vsetv }
            ),
          });
          continue;
        }

        dbInsertedStrings = [
          ...dbInsertedStrings,
          ...channelParsedData.map(
            (chan) =>
              `(${pool.escape(chan.startTime)}, ${pool.escape(chan.endTime)}, ${pool.escape(chan.channelVseTvId)}, ${pool.escape(chan.title.replace(/'/g, "''"))})`
          ),
        ];

        if (
          searchQueryArray &&
          searchQueryArray.length > 0 &&
          dbInsertedStrings.length > 0
        )
          await deleteDBVseTvChannel(`${channel.vsetv}`, channel.title);
      } catch (err) {
        errorMessages.push(
          `Error processing channel «${channel.title}»(${channel.vsetv}): ${err instanceof Error ? err.message : 'Unknown error occurred'}`
        );
      }
    }

    const insertMessages = await insertDataInBatches(dbInsertedStrings);
    errorMessages.push(...insertMessages);

    resDbTableLength = await getDbIdAmount();
  } catch (error) {
    errorMessages.push(
      error instanceof Error
        ? `Error during parsing: ${error.message}`
        : 'Unknown error occurred'
    );
  }

  await sendMail({
    subject: `Parse schedule VseTv`,
    body: await renderAsync(
      <ParseVseTvEmailTemplate
        pathToMainParsePage={`${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        dbTableLength={
          typeof resDbTableLength === 'string'
            ? 'Not Defined'
            : resDbTableLength[0].count.toLocaleString('en-US')
        }
        errorMessages={errorMessages}
        errorChannels={errorChannels}
        allFailedChannelsUrl={createURLWithParams(
          `${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`,
          { [EUrlSearchParam.CHANNEL]: errorChannels.map((chan) => chan.vsetv) }
        )}
      />
    ),
  });

  return (
    <>
      <Title>Parse Schedule VseTv Page</Title>
      {typeof resDbTableLength === 'string' ? (
        <p>{resDbTableLength}</p>
      ) : (
        <p>
          The number of records in the database table {TV_SCHEDULE_VSE_TV}:{' '}
          {resDbTableLength[0].count.toLocaleString('en-US')}
        </p>
      )}
      {errorMessages.length > 0 && (
        <>
          <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
          <ul>
            {errorMessages.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </>
      )}
      {errorChannels.length > 0 && (
        <ul>
          {errorChannels.map((channel) => (
            <li key={channel.id}>
              <span>
                <Link
                  href={`${BASE_URL}/${EUrlAdminParam.BASE_PATH}${EUrlAdminParam.CHANNELS_EDIT}/edit/${channel.id}`}
                >
                  Edit «{channel.title}»
                </Link>{' '}
                <Link href={getParseURL(channel.vsetv)}>VseTv</Link>{' '}
                <Link
                  href={createURLWithParams(
                    `${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`,
                    { [EUrlSearchParam.CHANNEL]: channel.vsetv }
                  )}
                >
                  Parse Again
                </Link>
              </span>
              <span> ({channel.error})</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
