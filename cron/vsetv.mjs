import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import {
  getDBVseTvChannels,
  truncateDBVseTv,
} from './libs/parseVseTv.controller.mjs';
import { getDbIdAmount } from './libs/parseTransNews.controller.mjs';
import memoize from 'lodash.memoize';
import axios from 'axios';
import iconv from 'iconv-lite';
import { sendMail } from './libs/sendMail.mjs';
import { pool } from './libs/mysqldb.mjs';
import { insertDBVseTvChannels } from './libs/parseVseTv.controller.mjs';
import {
  EDBTableTitles,
  getFormattedDate,
  EUrlAdminParam,
  EUrlSearchParam,
  createURLWithParams,
} from './libs/commons.mjs';
import '../dotenv-config.mjs';

const BASE_URL = process.env.BASE_URL;
const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;

const { TV_SCHEDULE_VSE_TV } = EDBTableTitles;
const BATCH_SIZE = 500;
const TRAP_CHANNEL = {
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

const getParseURL = memoize(
  (vsetvId) => `http://www.vsetv.com/schedule_channel_${vsetvId}_week.html`
);

const catchTraps = ($) => {
  const firstTimeDiv = $('#schedule_container .time').first();
  const imgs = firstTimeDiv.find('img');

  const results = [];

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

const getFullDate = (year, month, dayStr, timeStr) => {
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
}; // Output: Date object representing '2024-07-14 07:25:00';

const parseChannelPage = async (
  channel,
  trapChannelId,
  zero = undefined,
  five = undefined
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

const extractParsedData = ($, channel) => {
  const parsedData = [];
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

  let currentTitle = undefined;
  let previousDate = null;
  let addedDays = 0;
  let errors = [];

  chTimes.each((i, chTime) => {
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

const insertDataInBatches = async (data) => {
  if (!data || data.length === 0)
    return ['Error: Received empty data for batch insert'];

  let message = [];

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    const resMessage = await insertDBVseTvChannels(batch);
    if (resMessage) message.push(resMessage);
  }

  return message;
};

const sendReportMail = async ({
  errorMessages,
  tblItemLength,
  errorChannels,
}) => {
  const messages = errorMessages.length
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p><ul style="padding-bottom: 10px">${errorMessages.map((msg) => `<li>${msg}</li>`)}</ul>`
    : '';
  const wrongChannels = errorChannels.length
    ? `<p style="color: red; font-size: 20px; padding: 10px 0">Channels with errors:</p><ul style="padding-bottom: 10px">${errorChannels.map((ch) => `<li><a href=${ch.channelEditUrl}>Edit «${ch.title}»</a> | <a style="color: darkgray" href=${ch.sourceChannelUrl}>SOURCE</a> | <a style="color: darkgreen" href=${ch.parseUrl}>Parse Again</a><span style="color: gray"> (${ch.error})</span></li>`)}</ul>`
    : '';

  const allFailedChannelsUrl = createURLWithParams(
    `${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`,
    { [EUrlSearchParam.CHANNEL]: errorChannels.map((chan) => chan.vsetv) }
  );

  await sendMail({
    title: 'Parse VseTv Schedule Report',
    subject: `Parse VseTv Schedule`,
    body: `
    <p style="font-size: 20px;">The number of records in the database table:
      <span style="color: green;"> ${tblItemLength}</span>
    </p>
      ${messages}
      <hr />
      ${wrongChannels}
      <hr />
      <p>
        <a style="color: blue; font-size: 20px; padding: 10px 0" target="_blank" href="${allFailedChannelsUrl}" >
        Parse all failed channels
        </a>
      </p>
      <p>
        <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${BASE_URL}/guru/parse" >
        Parse all channels again
        </a>
      </p>
    `,
  });
};

const R_U_N = async () => {
  let dbInsertedStrings = [];
  const errorChannels = [];
  const errorMessages = [];
  let resDbTableLength = '';
  const trapChannel = TRAP_CHANNEL;

  try {
    const { zero, five } = catchTraps(
      await parseChannelPage(trapChannel, trapChannel.vsetv)
    );
    if (!zero || !five || zero === five)
      throw new Error(
        `Traps are not defined: zero = «${zero}»; five = «${five}»`
      );

    const channels = await getDBVseTvChannels();

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
            channelEditUrl: `${BASE_GURU_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit/${channel.id}`,
            sourceChannelUrl: getParseURL(channel.vsetv),
            parseUrl: createURLWithParams(
              `${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`,
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
      } catch (err) {
        errorMessages.push(
          `Error processing channel «${channel.title}»(${channel.vsetv}): ${err instanceof Error ? err.message : 'Unknown error occurred'}`
        );
      }
    }

    const insertMessages = await insertDataInBatches(dbInsertedStrings);
    insertMessages && errorMessages.push(...insertMessages);

    resDbTableLength = await getDbIdAmount(TV_SCHEDULE_VSE_TV);
  } catch (error) {
    errorMessages.push(
      error instanceof Error
        ? `Error during parsing: ${error.message}`
        : 'Unknown error occurred'
    );
  }

  sendReportMail({
    errorMessages,
    errorChannels,
    tblItemLength:
      typeof resDbTableLength === 'string'
        ? 'Not Defined'
        : resDbTableLength[0].count.toLocaleString('en-US'),
  });
};

R_U_N();
