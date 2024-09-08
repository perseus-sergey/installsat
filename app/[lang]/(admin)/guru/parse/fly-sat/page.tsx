import { Title } from '@/components/ui/Titles/Title';
import {
  EDBTableTitles,
  ELanguage,
  TSearchParams,
  getDbTableLink,
} from '@/models/ui.model';
import Link from 'next/link';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlSearchParam } from '@/models/url.model';
import { EUrlAdminParam } from '@/cron/libs/commons.mjs';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseTransNews } from '@/components/EmailTemplates/parseTransNews.template';
import { parseProcess } from '@/cron/libs/parseALLFlySats.controller.mjs';

export const dynamic = 'force-dynamic';

export interface ITblFlySats {
  cluster: string;
  title: string;
  url_link: string;
  slug: string;
  position: string;
  grade: string;
  date_upd: Date;
}

// =================================================================
// Parse List of Satellites from FlySat with date_upd parameter
// Parse All Satellite which satellite date_upd from my DB is different with parsed date_upd
// ... OR parsed date_upd < then {INTERVAL_FROM_LAST_UPDATE} days ago
// =================================================================

const INTERVAL_FROM_LAST_UPDATE = 2;

const BASE_URL = process.env.BASE_URL;

const PARSE_LIST_OF_SATELLITES_URL = 'https://flysat.com/en/satellitelist';
const { FLY_SATELLITES } = EDBTableTitles;

const sendReportMail = async (errorMessages: string[]) => {
  await sendMail({
    subject: `Parse Fly Satellites`,
    body: await renderAsync(
      <ParseTransNews
        title="Parse Fly Satellites"
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={errorMessages}
        dbTableHref={getDbTableLink(FLY_SATELLITES)}
        hrefSources={PARSE_LIST_OF_SATELLITES_URL}
      />
    ),
  });
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const intervalFromLastUpd =
    parseInt(validSearchParam(EUrlSearchParam.INTERVAL, searchParams), 10) ||
    INTERVAL_FROM_LAST_UPDATE;

  let messages: string[] = [];
  let newSatList = [];
  let overSats = [];
  let updatedSatList = [];
  try {
    ({ newSatList, overSats, updatedSatList, messages } =
      await parseProcess(intervalFromLastUpd));
  } catch (error) {
    messages.push(
      error instanceof Error
        ? error.message
        : 'Unknown error while parseProcess'
    );
  }

  // const { dbSatList, newSatList, overSats, updatedSatList, messages } =
  //   await parseProcess(intervalFromLastUpd);

  // await sleep(1000);

  await sendReportMail(messages);

  return (
    <>
      <Title>
        <Link href={PARSE_LIST_OF_SATELLITES_URL}>
          Parse FlySat Satellites Table
        </Link>
      </Title>
      {messages.length > 0 && (
        <>
          <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
          <ul>
            {messages.map((message: string, i: number) => (
              <li key={i + message}>{message}</li>
            ))}
          </ul>
        </>
      )}
      {/* <SatList title="Current List of Satellite In DB:" satList={dbSatList} /> */}
      <SatList title="New Satellites Found:" satList={newSatList} />
      <SatList
        title="Satellites From My DB NOT Found in FlySat:"
        satList={overSats}
      />
      <SatList title="Should Update Satellites" satList={updatedSatList} />
      {/* <SatList title="All Parsed Satellites" satList={finalData} /> */}
    </>
  );
}

const SatList = ({
  satList,
  title,
}: {
  satList: ITblFlySats[];
  title: string;
}) => (
  <>
    <h2 className="font-bold text-blue-700 text-xl">{title}</h2>
    <pre>{JSON.stringify(satList, null, 2)}</pre>
  </>
);

// =================================================================

// <tr bgcolor="#b9dcff">
// <td align="center"><font color="#000099" size="1"></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/nss-9">NSS-9</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/nss-9">183.1° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">23.09.2022</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td align="center"><font color="#000099" size="1"></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/abs-6">ABS-6</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/abs-6">159.0° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C/Ku
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">25.02.2022</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td align="center"><font color="#000099" size="1"></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/express-amu7">Express-AMU7</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/express-amu7">145.0° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">31.10.2022</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td rowspan="2" align="center" style="vertical-align: center!important"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/position/140-e">140.0°E</a></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/express-am5">Express-AM5</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/express-am5">140.0° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C/Ku
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">02.03.2023</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/express-at2">Express-AT2</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/express-at2">139.8° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// Ku
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">02.03.2023</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td align="center"><font color="#000099" size="1"></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/laosat-1">LaoSat-1</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/laosat-1">128.5° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">13.02.2023</font></td>
// </tr>

// Треба зібрати з нього такі дані:

// const data = [
//   {
//     cluster: '',
//     title: 'NSS-9',
//     url_link: 'https://flysat.com/en/satellite/nss-9',
//     slug: 'nss-9',
//     position: '183.1° E',
//   },
//   {
//     cluster: '',
//     title: 'ABS-6',
//     url_link: 'https://flysat.com/en/satellite/abs-6',
//     slug: 'abs-6',
//     position: '159.0° E',
//   },
//   {
//     cluster: '',
//     title: 'Express-AMU7',
//     url_link: 'https://flysat.com/en/satellite/express-amu7',
//     slug: 'express-amu7',
//     position: '145.0° E',
//   },
//   {
//     cluster: '140.0°E',
//     title: 'Express-AM5',
//     url_link: 'https://flysat.com/en/satellite/express-am5',
//     slug: 'express-am5',
//     position: '140.0° E',
//   },
//   {
//     cluster: '140.0°E',
//     title: 'Express-AT2',
//     url_link: 'https://flysat.com/en/satellite/express-at2',
//     slug: 'express-at2',
//     position: '139.8° E',
//   },
//   {
//     cluster: '',
//     title: 'LaoSat-1',
//     url_link: 'https://flysat.com/en/satellite/laosat-1',
//     slug: 'laosat-1',
//     position: '128.5° E',
//   },
// ];
