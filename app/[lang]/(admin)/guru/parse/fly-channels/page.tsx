import { Title } from '@/components/ui/Titles/Title';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import {
  EDBTableTitles,
  ELanguage,
  TSearchParams,
  getDbTableLink,
} from '@/models/ui.model';
import {
  getContentFromPuppeteerBrowser,
  killChromeProcesses,
} from '@/controllers/parse.controller';
import Link from 'next/link';
import { getPool, poolExecute } from '@/libs/db/mysqldb';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import { ResultSetHeader } from 'mysql2';
import { ParseTransNews } from '@/components/EmailTemplates/parseTransNews.template';
import { renderAsync } from '@react-email/render';
import { sendMail } from '@/libs/mail/sendMail';

export const dynamic = 'force-dynamic';

type TIsRadio = 0 | 1;

interface IFlyChannel {
  id?: string;
  frequency: number;
  polarization: string;
  mode: string;
  sr: number;
  fec: string;
  title: string;
  is_radio: TIsRadio;
  compress: string;
  sid: number | null;
  v_pid: number | null;
  a_pid: string;
  encryption: string;
  beam: string;
}

const BASE_URL = process.env.BASE_URL;
const isProductionMode = process.env.PRODUCTION_MODE === 'true';

const IS_LOGGED = true;
const PARSE_URL_BASE = 'https://www.flysat.com/en/satellite/';
const CURRENT_SAT_SLUG = 'astra-4a';
const { FLY_CHANNELS } = EDBTableTitles;
const pool = getPool();

const messages: string[] = [];

const addMessage = (message: string, error?: Error) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

const getSatChannelsFromDB = async (currentSatSlug: string, title?: string) => {
  const where = title
    ? ` WHERE title = "${title}" AND is_removed = 1 LIMIT 1`
    : ` WHERE sat_slug = "${currentSatSlug}" AND is_removed != 1`;

  const sql = `
    SELECT 
      id,
      frequency,
      polarization,
      mode,
      beam,
      sr,
      fec,
      title,
      is_radio,
      compress,
      sid,
      v_pid,
      a_pid,
      encryption
    FROM ${FLY_CHANNELS}
    ${where}
  `;
  const res = await poolExecute<IFlyChannel[]>(sql);
  if (res instanceof Error) {
    console.log('ERROR during SELECT data:', res.message);
    throw res;
  }

  return res;
};

const updateTblChannels = async (
  currentSatSlug: string,
  shouldUpdChannels: IFlyChannel[]
) => {
  let count = 0;

  for (const channel of shouldUpdChannels) {
    if (!channel.id) {
      addMessage(
        `ERROR: Cannot update channel ${channel.title}! channel.id = "${channel.id}"`
      );
      continue;
    }

    const res = await poolExecute(
      `
      UPDATE ${FLY_CHANNELS} 
      SET 
        sat_slug = ?,
        package_id = ?,
        is_removed = ?,
        frequency = ?,
        polarization = ?,
        mode = ?,
        beam = ?,
        sr = ?,
        fec = ?,
        title = ?,
        is_radio = ?,
        compress = ?,
        sid = ?,
        v_pid = ?,
        a_pid = ?,
        encryption = ?
      WHERE id = ?
      LIMIT 1
      `,
      [
        currentSatSlug,
        2,
        0,
        channel.frequency,
        channel.polarization,
        channel.mode,
        channel.beam,
        channel.sr,
        channel.fec,
        channel.title,
        channel.is_radio,
        channel.compress,
        channel.sid || null,
        channel.v_pid || null,
        channel.a_pid,
        channel.encryption,
        channel.id,
      ]
    );
    if (res instanceof Error) {
      addMessage(
        `ERROR: during UPDATE channel ${channel.title}! channel.id = "${channel.id}" for Sat_SLUG: "${currentSatSlug}"`,
        res
      );
    } else {
      count += 1;
    }
  }

  return count;
};

const setDisableChannels = async (
  currentSatSlug: string,
  shouldDeleteChannels: IFlyChannel[]
) => {
  let count = 0;

  for (const channel of shouldDeleteChannels) {
    if (!channel.id) {
      addMessage(
        `ERROR: Cannot DISABLE channel ${channel.title}! channel.id = "${channel.id}"`
      );
      continue;
    }

    const res = await poolExecute(
      `
      UPDATE ${FLY_CHANNELS} 
      SET is_removed = ?
      WHERE id = ?
      LIMIT 1
      `,
      [1, channel.id]
    );
    if (res instanceof Error) {
      addMessage(
        `ERROR: during "SET is_removed = 1" for channel "${channel.title} ${channel.frequency} ${channel.polarization}"! channel.id = "${channel.id}" for Sat_SLUG: "${currentSatSlug}"`,
        res
      );
    } else {
      count += 1;
    }
  }

  return count;
};

const insertTblChannels = async (
  currentSatSlug: string,
  parsedNewChannels: IFlyChannel[]
) => {
  if (!parsedNewChannels.length) {
    addMessage(
      `DB INSERT: NO new channels to insert for sat_slug: ${currentSatSlug}`
    );

    return 0;
  }
  const values = parsedNewChannels.map((item) => [
    pool.escape(createSlug(item.title)),
    pool.escape(currentSatSlug),
    pool.escape(item.frequency),
    pool.escape(item.polarization),
    pool.escape(item.mode),
    pool.escape(item.beam),
    pool.escape(item.sr),
    pool.escape(item.fec),
    pool.escape(item.title),
    pool.escape(item.is_radio),
    pool.escape(item.compress),
    pool.escape(item.sid || null),
    pool.escape(item.v_pid || null),
    pool.escape(item.a_pid),
    pool.escape(item.encryption),
    2,
    0,
  ]);

  const sql = `
      INSERT INTO ${FLY_CHANNELS} 
      (\`slug\`, \`sat_slug\`, \`frequency\`, \`polarization\`, \`mode\`, \`beam\`, \`sr\`, \`fec\`, \`title\`, \`is_radio\`, \`compress\`, \`sid\`, \`v_pid\`, \`a_pid\`, \`encryption\`,\`package_id\`,\`is_removed\`)
      VALUES ${values.map((valueSet) => `(${valueSet.join(', ')})`).join(', ')};
    `;
  const res = await poolExecute<ResultSetHeader>(sql);

  res instanceof Error
    ? addMessage(
        `ERROR: DB INSERT channels failed for Sat_SLUG: "${currentSatSlug}"`,
        res
      )
    : addMessage(
        `--== SUCCESS: DB INSERT ${res.affectedRows} channels for Sat_SLUG: "${currentSatSlug}" ==--`
      );

  return res instanceof Error ? 0 : res.affectedRows;
};

const createSlug = (title: string) => {
  if (!title) {
    addMessage('ERROR: Cannot create SLUG. No title provided.');

    return null;
  }
  const handledTitle = title
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (!title) {
    addMessage(`ERROR: Cannot create SLUG from title: "${title}"`);

    return null;
  }

  const randomString = Math.random().toString(36).slice(2, 6);

  return `${randomString}-${handledTitle}`;
};

interface TitleResult {
  is_radio: TIsRadio;
  title: string;
}

const extractTextFromElement = (
  element: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI
): string[] => {
  const texts: string[] = [];
  element.contents().each((_i, el) => {
    if (el.type === 'text') {
      const text = $(el).text().trim();
      if (text) {
        texts.push(text);
      }
    }
  });

  return texts;
};

const titleHandler = (
  titleCell: cheerio.Cheerio<cheerio.Element>
): TitleResult | null => {
  if (titleCell.attr('align') === 'center') return null;

  const title = titleCell.text().trim();
  if (!title) return null;

  const is_radio = title.startsWith('-R-') ? 1 : 0;
  const cleanTitle = is_radio ? title.slice(3).trim() : title.trim();

  const isFeed = /^data$/i.test(cleanTitle) || /^feed$/i.test(cleanTitle);
  if (isFeed) return null;

  return { is_radio, title: cleanTitle };
};

const aPidHandler = (
  aPidCell: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI
) => extractTextFromElement(aPidCell.find('font'), $).join(' | ');

const encryptionHandler = (
  encryptionCell: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI
) => {
  const encryptions = extractTextFromElement(
    encryptionCell.find('font'),
    $
  ).map((text) => text.toLowerCase());

  return encryptions.length !== 0 ||
    !encryptions.includes('biss') ||
    !encryptions.includes('fta')
    ? encryptions.join('|')
    : null;
};

const extractParsedData = ($: cheerio.CheerioAPI): IFlyChannel[] => {
  let currentFreq = 0;
  let currentPolar = '';
  let currentMode = '';
  let currentSr = 0;
  let currentFec = '';
  let currentBeam = '';

  const channels: IFlyChannel[] = [];
  let capture = false;

  $('table[bordercolor="#3366cc"] > tbody > tr').each((_, element) => {
    const $element = $(element);

    if ($element.attr('bgcolor') === '#cee7ff') {
      capture = true;

      return;
    }

    if (capture && $element.find('table').length === 0) {
      const tds = $element.find('td');
      if (tds.length < 7) return;

      if (tds.length === 12) {
        const freqPolar = tds.eq(2).find('b').text().trim();
        const [freq, polar] = freqPolar.split(' ');
        if (!freq || !polar) return;
        currentFreq = Number(freq.trim());
        currentPolar = polar.trim().toUpperCase();
        if (!currentFreq || !currentPolar || currentPolar.length > 1) return;

        currentMode = extractTextFromElement(tds.eq(2).find('font'), $).join(
          '|'
        );
        currentBeam = tds.eq(11).text().trim();
        if (!currentBeam) return;

        const srFec = tds.eq(3).text().trim();
        const [sr, fec] = srFec.split(' ');
        if (!sr || !fec) return;
        currentSr = Number(sr.trim());
        currentFec = fec.trim();
        if (!currentSr || !currentFec) return;

        const titleData = titleHandler(tds.eq(4));
        if (!titleData) return;
        const { title, is_radio } = titleData;

        const compress = tds.eq(5).text().trim();
        if (!compress && !is_radio) return;

        const sid = Number(tds.eq(6).text().trim()) || null;
        const v_pid = Number(tds.eq(7).text().trim()) || null;
        const a_pid = aPidHandler(tds.eq(8), $);
        const encryption = encryptionHandler(tds.eq(9), $);
        if (encryption === null) return;

        channels.push({
          frequency: currentFreq,
          polarization: currentPolar,
          mode: currentMode,
          beam: currentBeam,
          sr: currentSr,
          fec: currentFec,
          title,
          is_radio,
          compress,
          sid,
          v_pid,
          a_pid,
          encryption,
        });
      } else if (tds.length === 7) {
        const titleData = titleHandler(tds.eq(0));
        if (!titleData) return;
        const { title, is_radio } = titleData;

        const compress = tds.eq(1).text().trim();
        if (!compress && !is_radio) return;

        const sid = Number(tds.eq(2).text().trim()) || null;
        const v_pid = Number(tds.eq(3).text().trim()) || null;
        const a_pid = aPidHandler(tds.eq(4), $);
        const encryption = encryptionHandler(tds.eq(5), $);
        if (encryption === null) return;

        channels.push({
          frequency: currentFreq,
          polarization: currentPolar,
          mode: currentMode,
          beam: currentBeam,
          sr: currentSr,
          fec: currentFec,
          title,
          is_radio,
          compress,
          sid,
          v_pid,
          a_pid,
          encryption,
        });
      }
    }
  });

  return channels;
};

const serializeChannelWithoutId = (channel: IFlyChannel | IFlyChannel) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = channel;

  return JSON.stringify(rest);
};

const getFilteredChannelArrays = (
  parsedChannels: IFlyChannel[],
  dbChannels: IFlyChannel[]
) => {
  const serializedParsedChannels = new Set(
    parsedChannels.map(serializeChannelWithoutId)
  );

  const filteredDbChannels = dbChannels.filter(
    (dbChannel) =>
      !serializedParsedChannels.has(serializeChannelWithoutId(dbChannel))
  );

  const serializedDbChannels = new Set(
    dbChannels.map(serializeChannelWithoutId)
  );

  const filteredParsedChannels = parsedChannels.filter(
    (parsedChannel) =>
      !serializedDbChannels.has(serializeChannelWithoutId(parsedChannel))
  );

  return { filteredDbChannels, filteredParsedChannels };
};

const makeShouldUpdateFromCurrentTbl = (
  dbChannels: IFlyChannel[],
  parsedChannels: IFlyChannel[]
) => {
  let parsedNewChannels = parsedChannels.slice();
  let shouldDeleteChannels = dbChannels.slice();

  const currTblShouldUpdChannels = shouldDeleteChannels.reduce(
    (acc: IFlyChannel[], dbChannel) => {
      const matchIndex = parsedNewChannels.findIndex(
        (parsedChannel) => parsedChannel.title === dbChannel.title
      );

      if (matchIndex !== -1) {
        const matchedParsedChannel = {
          ...parsedNewChannels[matchIndex],
          id: dbChannel.id,
        };

        acc.push(matchedParsedChannel);

        parsedNewChannels = parsedNewChannels.filter(
          (_, idx) => idx !== matchIndex
        );

        shouldDeleteChannels = shouldDeleteChannels.filter(
          (channel) => channel !== dbChannel
        );
      }

      return acc;
    },
    []
  );

  return { currTblShouldUpdChannels, parsedNewChannels, shouldDeleteChannels };
};

const findSimilarChannelFromAllSats = async (
  parsedNewChannels: IFlyChannel[],
  currTblShouldUpdChannels: IFlyChannel[],
  currentSatSlug: string
) => {
  const shouldUpdChannels = currTblShouldUpdChannels.slice();
  let parsedNewChannelsFiltered = parsedNewChannels.slice();

  for (const parsedNewChannel of parsedNewChannelsFiltered) {
    try {
      const dbRes = await getSatChannelsFromDB(
        currentSatSlug,
        parsedNewChannel.title
      );

      if (dbRes.length) {
        shouldUpdChannels.push({
          ...parsedNewChannel,
          id: dbRes[0].id,
        });

        parsedNewChannelsFiltered = parsedNewChannelsFiltered.filter(
          (channel) => channel !== parsedNewChannel
        );
      }
    } catch (error) {
      addMessage(
        `ERROR: Could not get channel by title: "${parsedNewChannel.title}" from table: "${FLY_CHANNELS}"`,
        error instanceof Error ? error : new Error('Unknown error!')
      );
    }
  }

  return { shouldUpdChannels, parsedNewChannelsFiltered };
};

const sendReportMail = async (messages: string[], hrefSource: string) => {
  await sendMail({
    subject: `Parse Fly Channels`,
    body: await renderAsync(
      <ParseTransNews
        title="Parse Fly Channels"
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={messages}
        dbTableHref={getDbTableLink(FLY_CHANNELS)}
        hrefSources={hrefSource}
      />
    ),
  });
};

const MessageBlock = ({ messages }: { messages: string[] }) =>
  messages.length > 0 && (
    <>
      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );

export const parseFlyChannels = async ({
  currentSatSlug,
  incomingBrowser,
}: {
  currentSatSlug: string;
  incomingBrowser?: Browser;
}) => {
  const sourceUrl = `${PARSE_URL_BASE}${currentSatSlug}`;

  let browser;
  let parsedChannels: IFlyChannel[] = [];
  let filteredDbChannels: IFlyChannel[] = [];
  let filteredParsedChannels: IFlyChannel[] = [];
  let currTblShouldUpdChannels: IFlyChannel[] = [];
  let parsedNewChannels: IFlyChannel[] = [];
  let shouldDeleteChannels: IFlyChannel[] = [];
  let shouldUpdChannels: IFlyChannel[] = [];
  let parsedNewChannelsFiltered: IFlyChannel[] = [];
  let updateResCount = 0;
  let insertCount = 0;
  let removeResCount = 0;

  try {
    const dbChannels = await getSatChannelsFromDB(currentSatSlug);

    browser =
      incomingBrowser ||
      (await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }));

    const html = await getContentFromPuppeteerBrowser(browser, sourceUrl);
    const $ = cheerio.load(html);

    parsedChannels = extractParsedData($);

    ({ filteredDbChannels, filteredParsedChannels } = getFilteredChannelArrays(
      parsedChannels,
      dbChannels
    ));

    ({ currTblShouldUpdChannels, parsedNewChannels, shouldDeleteChannels } =
      makeShouldUpdateFromCurrentTbl(
        filteredDbChannels,
        filteredParsedChannels
      ));

    ({ shouldUpdChannels, parsedNewChannelsFiltered } =
      await findSimilarChannelFromAllSats(
        parsedNewChannels,
        currTblShouldUpdChannels,
        currentSatSlug
      ));

    updateResCount = await updateTblChannels(currentSatSlug, shouldUpdChannels);
    if (updateResCount > 0)
      addMessage(
        `--== Updated ${updateResCount} channels for satellite "${currentSatSlug}" ==--`
      );
    insertCount = await insertTblChannels(
      currentSatSlug,
      parsedNewChannelsFiltered
    );
    removeResCount = await setDisableChannels(
      currentSatSlug,
      shouldDeleteChannels
    );
    if (removeResCount > 0)
      addMessage(
        `--== Disabled ${removeResCount} channels for satellite "${currentSatSlug}" ==--`
      );
  } catch (error) {
    addMessage(
      `ERROR: failed during channels parsing for satellite "${currentSatSlug}"`,
      error instanceof Error
        ? error
        : new Error(
            `Unknown error occurred when channel parsing for satellite "${currentSatSlug}"`
          )
    );
  } finally {
    if (browser && !incomingBrowser) {
      try {
        await browser.close();
      } catch (closeError) {
        addMessage(
          'ERROR: closing browser',
          closeError instanceof Error
            ? closeError
            : new Error('Error closing browser')
        );
      }
    }
    if (isProductionMode) {
      const killRes = killChromeProcesses();
      killRes instanceof Error
        ? addMessage('ERROR: killing chrome processes', killRes)
        : addMessage('SUCCESS: killing chrome processes.');
    }
  }

  return incomingBrowser
    ? messages
    : {
        updateResCount,
        currTblShouldUpdChannels,
        shouldUpdChannels,
        removeResCount,
        shouldDeleteChannels,
        parsedNewChannels,
        insertCount,
      };
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const currentSatSlug =
    validSearchParam(EUrlSearchParam.SAT, searchParams) || CURRENT_SAT_SLUG;

  const sourceUrl = `${PARSE_URL_BASE}${currentSatSlug}`;

  const report = await parseFlyChannels({ currentSatSlug });

  if (Array.isArray(report)) return <MessageBlock messages={messages} />;

  const {
    updateResCount,
    currTblShouldUpdChannels,
    shouldUpdChannels,
    removeResCount,
    shouldDeleteChannels,
    parsedNewChannels,
    insertCount,
  } = report;

  await sendReportMail(messages, sourceUrl);

  return (
    <>
      <Title>
        <Link href={sourceUrl}>Parse FlySat Channels Table</Link>
      </Title>

      <MessageBlock messages={messages} />

      <h2 className="text-2xl text-red-700 bg-blue-300">
        Should Update Channels in table {FLY_CHANNELS}. ({updateResCount}{' '}
        updated)
      </h2>
      <pre>{JSON.stringify(currTblShouldUpdChannels, null, 2)}</pre>

      <h2 className="text-2xl text-red-700 bg-blue-300">
        Should Update Channels ALL table {FLY_CHANNELS}. ({updateResCount}{' '}
        updated)
      </h2>
      <pre>{JSON.stringify(shouldUpdChannels, null, 2)}</pre>

      <h2 className="text-2xl text-red-700 bg-blue-300">
        Should Disable Channels in table {FLY_CHANNELS}. ({removeResCount}{' '}
        disabled)
      </h2>
      <pre>{JSON.stringify(shouldDeleteChannels, null, 2)}</pre>
      <hr />

      <h2 className="text-2xl text-red-700 bg-blue-300">
        {parsedNewChannels.length} New Channels Found. ({insertCount} inserted)
      </h2>
      <pre>{JSON.stringify(parsedNewChannels, null, 2)}</pre>
    </>
  );
}
