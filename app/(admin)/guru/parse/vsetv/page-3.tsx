import { Title } from '@/components/ui/Titles/Title';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import {
  getFormattedDate,
  getFormattedDateStrYearFirst,
} from '@/libs/utils/dates';
import { DateTime } from 'luxon';
import {
  deleteDBVseTvChannel,
  getDBVseTvChannels,
  getDbIdAmount,
  insertDBVseTvChannels,
  truncateDBVseTv,
} from '@/controllers/schedule.controller';
import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import { validSearchParamArray } from '@/libs/utils/validSearchParam';
import {
  EUrlAdminParam,
  EUrlBaseParam,
  EUrlSearchParam,
} from '@/models/url.model';
import { IVseTvErrorChannel, IVseTvParsModel } from '@/models/scheduleTV.model';
import { cache } from 'react';
import Link from 'next/link';
import { createURLWithParams } from '@/libs/utils/utils';
import { IDbIdAmountModel } from '@/models/admin.model';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseVseTvEmailTemplate } from '@/components/EmailTemplates/parseVseTv.template';

interface IShowsData {
  startTime: string;
  endTime: string;
  title: string;
  channelVseTvId: string;
}

const BASE_URL = process.env.BASE_URL;
const trapChannel: IVseTvParsModel = {
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

  const dateTime = DateTime.fromObject({
    year,
    month,
    day,
    hour,
    minute,
  });

  return dateTime.isValid
    ? dateTime.toJSDate()
    : `Wrong dateTime ${dateTime.toJSDate()}`;
}; // Output: Date object representing '2024-07-14 07:25:00'

const parseChannelPage = async (
  browser: Browser,
  channel: IVseTvParsModel,
  zero?: string,
  five?: string
) => {
  if ((!zero || !five) && `${channel.vsetv}` !== `${trapChannel.vsetv}`)
    throw new Error(
      `Error parsing channel «${channel.title}»(${channel.vsetv} - Traps are not defined: zero = «${zero}»; five = «${five}»`
    );
  const url = getParseURL(channel.vsetv);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const html = await page.content();
  // const res = await axios.get(getParseURL(channel.vsetv), {
  //   responseType: 'arraybuffer',
  // });

  // const decodedData = iconv.decode(Buffer.from(res.data), 'windows-1251');

  const replacedHtml = html
    .replace(new RegExp(`<img src="/pic/${five || ''}\\.gif">`, 'g'), '5')
    .replace(new RegExp(`<img src="/pic/${zero || ''}\\.gif">`, 'g'), '0');
  // const replacedHtml = decodedData
  //   .replace(new RegExp(`<img src="/pic/${five || ''}\\.gif">`, 'g'), '5')
  //   .replace(new RegExp(`<img src="/pic/${zero || ''}\\.gif">`, 'g'), '0');

  return cheerio.load(replacedHtml);
};

const extractParsedData = ($: cheerio.CheerioAPI, channel: IVseTvParsModel) => {
  const parsedData: IShowsData[] = [];
  const chWeekdayTitle = $('td.weekdaytitle').first();
  if (!chWeekdayTitle)
    return `Error of parsing weekday title for channel «${channel.title}»(${channel.vsetv})`;

  const words = chWeekdayTitle.text().trim().split(' ');
  const parsedMonth = words[words.length - 1];
  const parsedDay = words[words.length - 2];
  const monthNumber = month.indexOf(parsedMonth);
  if (monthNumber < 0)
    return `Error extracting and matching month number from chWeekdayTitle: «${chWeekdayTitle}»`;

  const chTimes = $('.time');
  const chProgTitles = $('.prname2');
  if (!chTimes.length || !chProgTitles.length)
    return `Error of parsing channel times or program titles for channel`;

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

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQueryArray = validSearchParamArray(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  let dbInsertedStrings: string[] = [];
  const errorChannels: IVseTvErrorChannel[] = [];
  let browser;
  let errorMessage = '';
  let resDbTableLength: IDbIdAmountModel[] | string = '';

  try {
    browser = await puppeteer.launch({ headless: true });
    const channels = await getDBVseTvChannels(searchQueryArray);

    if (!searchQueryArray || searchQueryArray.length === 0)
      await truncateDBVseTv();

    for (const channel of channels) {
      try {
        // const { zero, five } = catchTraps(await parseChannelPage(trapChannel));
        const { zero, five } = catchTraps(
          await parseChannelPage(browser, trapChannel)
        );
        const $ = await parseChannelPage(browser, channel, zero, five);
        // const $ = await parseChannelPage(channel, zero, five);
        const channelParsedData = extractParsedData($, channel);
        if (typeof channelParsedData === 'string') {
          errorChannels.push({
            ...channel,
            error: channelParsedData,
            channelEditUrl: `${BASE_URL}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${channel.cpu}/${getFormattedDateStrYearFirst()}`,
            sourceChannelUrl: createURLWithParams(
              `${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`,
              { [EUrlSearchParam.CHANNEL]: channel.vsetv }
            ),
            parseUrl: getParseURL(channel.vsetv),
          });
          continue;
        }

        dbInsertedStrings = channelParsedData.map(
          (chan) =>
            `('${chan.startTime}', '${chan.endTime}', ${chan.channelVseTvId}, '${chan.title.replace(/'/g, "''")}')`
        );

        if (searchQueryArray && searchQueryArray.length > 0)
          await deleteDBVseTvChannel(`${channel.vsetv}`, channel.title);

        insertDBVseTvChannels(dbInsertedStrings);
      } catch (err) {
        errorMessage = `Error processing channel «${channel.title}»(${channel.vsetv}): ${err instanceof Error ? err.message : 'Unknown error occurred'}`;
      }
    }

    resDbTableLength = await getDbIdAmount();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? `Error during parsing: ${error.message}`
        : 'Unknown error occurred';
  }
  // finally {
  // if (browser) await browser.close();
  // }
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
        errorMessages={[errorMessage]}
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
          The number of records in the database table{' '}
          {EDBTableTitles.TV_SCHEDULE_VSE_TV}:{' '}
          {resDbTableLength[0].count.toLocaleString('en-US')}
        </p>
      )}
      {errorMessage && <p>{errorMessage}</p>}
      {errorChannels.length > 0 && (
        <ul>
          {errorChannels.map((channel) => (
            <li key={channel.id}>
              <span>
                <Link
                  href={`${BASE_URL}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${channel.cpu}/${getFormattedDateStrYearFirst()}`}
                >
                  «{channel.title}»
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
