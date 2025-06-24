import { Title } from '@/components/ui/Titles/Title';
import { EUrlSearchParam, validSearchParam } from '@cron/libs/commons.mjs';
// import { parseTransNewsForum } from '@cron/libs/parseTransNewsForum.controller.mjs';
import { parseTransNewsForum } from '@cron/libs/parseTransNewsForumSatUniverse.controller.mjs';
// import { parseTransNews } from '@cron/libs/parseTransNews.controller.mjs';
import { TSearchParams } from '@/models/url/urlSearch.model';

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQuery = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);

  if (!searchQuery)
    return (
      <p className="text-2xl text-red-500">
        ERROR: Choose the correct interval
      </p>
    );

  // const PARSED_UPDATES = 4;

  const errorMessages = (await parseTransNewsForum(
    parseInt(searchQuery, 10)
  )) as string[];

  // const errorMessages = (await parseTransNews(
  //   parseInt(searchQuery, 10) || PARSED_UPDATES
  // )) as string[];

  return (
    <>
      <Title>
        Parse FlySat Transponder news from https://www.satsupreme.com
      </Title>
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
    </>
  );
}

// =================================================================
// =================================================================

// <p class="baslik">02.06.2024/4th update</p>
// <p class="guncellemenormal"> <b><font color="##686868">19:50 CET</font></b> <b>Rai 3</b> ( Stream 1 - RAI 3 Nazionali,11637 V )
// <font color="#ff0000">
// <b>left</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/eutelsat-5-west-b"> Eutelsat 5 West B @ 5° W </a></b> </p>
// <p style="height: 8px; font-size:1px;">&nbsp;</p>
// <p class="guncellemenormal"> <b><font color="##686868">19:50 CET</font></b> <b>Rai 1</b> ( Stream 7 - RAI Mux MR 3,11637 V )
// <font color="#ff0000">
// <b>on</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/eutelsat-5-west-b"> Eutelsat 5 West B @ 5° W </a></b> </p>

// <p class="baslik">02.06.2024/3rd update</p>
// <p class="guncellemenormal"> <b><font color="##686868">16:32 CET</font></b> <b>MsMotorTV</b> ( 12577 H )
// <font color="#ff0000">
// <b>left</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/hot-bird-13g"> Hot Bird 13G @ 13° E </a></b> </p>
// <p class="guncellemenormal"> <b><font color="##686868">16:32 CET</font></b> <b>MS Channel</b> ( 12577 H )
// <font color="#ff0000">
// <b>left</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/hot-bird-13g"> Hot Bird 13G @ 13° E </a></b> </p>

// <p class="baslik">02.06.2024/2nd update</p>
// <p class="guncellemenormal"> <b><font color="##686868">13:13 CET</font></b> <b>beIN Sports AFC</b> ( beIN, 10810 V )
// <font color="#ff0000">
// <b>left</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/es-hail-2"> Es&#039;hail-2 @ 25.8° E </a></b> </p>

// <p class="baslik">01.06.2024/1st update</p>
// <p class="guncellemenormal"> <b><font color="##686868">06:40 CET</font></b> <b>MTV India</b> ( 4160 V )
// <font color="#16ad16">
// <b>on</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/measat-3d"> Measat 3d @ 91.5° E </a></b> </p>

// <p class="guncellemenormal"> <b><font color="##686868">17:45 CET</font></b> <b>Suspilne Kyiv (RZR)</b> ( Viasat Ukraine, 12207 V )
// <font color="#16ad16">
// <b>back on</b>
// </font>
// <b><a href="https://www.flysat.com/en/satellite/astra-4a"> Astra 4A @ 4.8° E </a></b> </p>

// const data: ITblDigestParse[] = [
// {
//   date: '02.06.2024',
//   update: 4,
//   channel_title: 'Rai 3',
//   action: 'left',
//   frequency_text: '( Stream 1 - RAI 3 Nazionali,11637 V )',
//   sat_name: 'Eutelsat 5 West B @ 5° W',
// },
// {
//   date: '02.06.2024',
//   update: 4,
//   channel_title: 'Rai 1',
//   action: 'on',
//   frequency_text: '( Stream 7 - RAI Mux MR 3,11637 V )',
//   sat_name: 'Eutelsat 5 West B @ 5° W',
// },

// {
//   date: '02.06.2024',
//   update: 3,
//   channel_title: 'MsMotorTV',
//   action: 'left',
//   frequency_text: '( 12577 H )',
//   sat_name: 'Hot Bird 13G @ 13° E',
// },
// {
//   date: '02.06.2024',
//   update: 3,
//   channel_title: 'MS Channel',
//   action: 'left',
//   frequency_text: '( 12577 H )',
//   sat_name: 'Hot Bird 13G @ 13° E',
// },

// {
//   date: '02.06.2024',
//   update: 2,
//   channel_title: 'beIN Sports AFC',
//   action: 'left',
//   frequency_text: '( beIN, 10810 V )',
//   sat_name: 'Es'hail-2 @ 25.8° E',
// },

// {
//   date: '01.06.2024',
//   update: 1,
//   channel_title: 'MTV India',
//   action: 'on',
//   frequency_text: '( 4160 V )',
//   sat_name: 'Measat 3d @ 91.5° E',
// },

// {
//   date: 04.06.2024',
//   update: 5,
//   channel_title: 'Suspilne Kyiv (RZR)',
//   action: 'back on',
//   frequency_text: '( Viasat Ukraine, 12207 V )',
//   sat_name: 'Astra 4A @ 4.8° E',
// },
// ]
