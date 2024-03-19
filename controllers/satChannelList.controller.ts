import { executeQuery } from '@/libs/db/mysqldb';
import { TSatChannelListModel } from '@/models/satChannelList.model';

export const getSatChannels = async (channelId = '') => {
  const sql = `
  SELECT ch.id, ch.title, ch.cpu, ch.frequency, ch.sat, ch.tema, ch.logo, ch.programma, ch.encryption, ch.biss, ch.description,
  sa.title AS sat_title,
  sa.position AS sat_position,
  sa.logo AS sat_logo,
  fr.freq,
  fr.sr,
  fr.fec,
  be.polar,
  be.title AS beam,
  te.title AS tem,
  co.title AS compr,
  la.title AS lan 
  FROM tbl_channals AS ch 
  LEFT JOIN tbl_chan_tema 		  AS te	 ON ch.tema 		  = te.id
  LEFT JOIN tbl_chan_sat 		    AS sa	 ON ch.sat 		    = sa.id
  LEFT JOIN tbl_chan_encryption	AS en	 ON ch.encryption	= en.id  
  LEFT JOIN tbl_chan_freq 		  AS fr	 ON ch.frequency 	= fr.id 
  LEFT JOIN tbl_chan_beam 		  AS be	 ON fr.beam 		  = be.id 
  LEFT JOIN tbl_chan_sat 			  AS sat ON ch.sat 			  = sat.id 
  LEFT JOIN tbl_chan_compress   AS co	 ON ch.compress 	= co.id 
  LEFT JOIN tbl_language 			  AS la	 ON ch.lang 		  = la.id
  WHERE ch.sat ${channelId ? '= ?' : '!= 1'}
  AND  	ch.cat = 4
  AND 	en.id IN(1,2,10)
  ORDER BY sat.grade,fr.freq, be.polar, ch.title;
  `;

  return await executeQuery<TSatChannelListModel>(sql, [channelId]);
};

// export const allSatChannelsSql = `
// SELECT ch.id, ch.title, ch.cpu, ch.frequency, ch.sat, ch.tema, ch.logo, ch.programma, ch.encryption, ch.biss, ch.description,
// fr.freq,
// fr.sr,
// fr.fec,
// be.polar,
// be.title AS beam,
// te.title AS tem,
// co.title AS compr,
// la.title AS lan
// FROM 		tbl_channals 			    AS ch
// LEFT JOIN tbl_chan_tema 		  AS te	 ON ch.tema 		= te.id
// LEFT JOIN tbl_chan_encryption	AS en	 ON ch.encryption	= en.id
// LEFT JOIN tbl_chan_freq 		  AS fr	 ON ch.frequency 	= fr.id
// LEFT JOIN tbl_chan_beam 		  AS be	 ON fr.beam 		= be.id
// LEFT JOIN tbl_chan_sat 			  AS sat ON ch.sat 			= sat.id
// LEFT JOIN tbl_chan_compress 	AS co	 ON ch.compress 	= co.id
// LEFT JOIN tbl_language 			  AS la	 ON ch.lang 		= la.id
// WHERE ch.cat = 4
// AND ch.sat != 1
// AND en.id IN(1,2,10)
// ORDER BY sat.grade,fr.freq, be.polar, ch.title
// `;

export const groupedChannels = (
  satChannels: TSatChannelListModel[]
): TSatChannelListModel[][] => {
  return Object.values(
    satChannels.reduce((acc: Record<number, TSatChannelListModel[]>, curr) => {
      const key = curr.frequency;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);

      return acc;
    }, {})
  ).sort((a, b) => a[0].freq - b[0].freq);
};

export const groupedChannelsAllSat = (
  satChannels: TSatChannelListModel[][]
): TSatChannelListModel[][][] => {
  const grouped: { [sat: number]: { [freq: number]: TSatChannelListModel[] } } =
    {};

  satChannels.forEach((satGroup) => {
    satGroup.forEach((channel) => {
      if (!grouped[channel.sat]) {
        grouped[channel.sat] = {};
      }
      if (!grouped[channel.sat][channel.freq]) {
        grouped[channel.sat][channel.freq] = [];
      }
      grouped[channel.sat][channel.freq].push(channel);
    });
  });

  return Object.values(grouped).map((satGroup) => Object.values(satGroup));
};

// const channels = [
//   { sat: 1, freq: 4444, title: 'someTitle' },
//   { sat: 1, freq: 4444, title: 'someTitle' },
//   { sat: 3, freq: 1111, title: 'someTitle' },
//   { sat: 3, freq: 1111, title: 'someTitle' },
//   { sat: 1, freq: 2222, title: 'someTitle' },
//   { sat: 1, freq: 2222, title: 'someTitle' },
//   { sat: 1, freq: 2222, title: 'someTitle' },
//   { sat: 3, freq: 3333, title: 'someTitle' },
// ];

// const groupedChannels = (satChannels) => {}
// Напиши функцію groupedChannels
// groupedChannels(channels);
// яка поверне такий результат:
// [
//   [
//     [
//       { sat: 3, freq: 1111, title: 'someTitle' },
//       { sat: 3, freq: 1111, title: 'someTitle' },
//     ],
//     [{ sat: 3, freq: 3333, title: 'someTitle' }],
//   ],
//   [
//     [
//       { sat: 1, freq: 4444, title: 'someTitle' },
//       { sat: 1, freq: 4444, title: 'someTitle' },
//     ],
//     [
//       { sat: 1, freq: 2222, title: 'someTitle' },
//       { sat: 1, freq: 2222, title: 'someTitle' },
//       { sat: 1, freq: 2222, title: 'someTitle' },
//     ],
//   ],
// ];
