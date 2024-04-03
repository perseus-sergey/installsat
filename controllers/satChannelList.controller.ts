import { executeQuery } from '@/libs/db/mysqldb';
import { TSatChannelListModel } from '@/models/channelList.model';
import { cache } from 'react';

export const getSatChannels = cache(
  async (
    searchQuery = '',
    channelId = '',
    satellites?: string | string[] | undefined,
    isMPG4 = false,
    isT2MI = false
  ) => {
    let inSatList = '';

    const searchPart = searchQuery
      ? `AND 	ch.title LIKE "%${searchQuery}%"`
      : '';

    if (satellites && satellites[0]) {
      const selectedSats =
        typeof satellites === 'string' ? satellites : satellites.join('","');
      inSatList = `AND sat.cpu IN ("${selectedSats}")`;
    }

    const notMpg4 = isMPG4 ? `AND co.id NOT IN(3,4,6,7)` : '';
    const notT2mi = isT2MI ? `AND co.id NOT IN(8)` : '';

    const sql = `
  SELECT ch.id, ch.title, ch.cpu, ch.frequency, ch.sat, ch.tema, ch.logo, ch.programma, ch.encryption, ch.biss, ch.description,
  sat.title AS sat_title,
  sat.position AS sat_position,
  sat.logo AS sat_logo,
  sat.cpu AS sat_slug,
  sat.grade AS sat_grade,
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
  LEFT JOIN tbl_chan_encryption	AS en	 ON ch.encryption	= en.id  
  LEFT JOIN tbl_chan_freq 		  AS fr	 ON ch.frequency 	= fr.id 
  LEFT JOIN tbl_chan_beam 		  AS be	 ON fr.beam 		  = be.id 
  LEFT JOIN tbl_chan_sat 			  AS sat ON ch.sat 			  = sat.id 
  LEFT JOIN tbl_chan_compress   AS co	 ON ch.compress 	= co.id 
  LEFT JOIN tbl_language 			  AS la	 ON ch.lang 		  = la.id
  WHERE ch.sat ${channelId ? '= ?' : '!= 1'}
  AND  	ch.cat = 4
  AND 	en.id IN(1,2,10)
  ${searchPart}
  ${inSatList}
  ${notMpg4}
  ${notT2mi}
  ORDER BY fr.freq, be.polar, ch.title
  `;

    return await executeQuery<TSatChannelListModel>(sql, [channelId]);
  }
);

export const getGroupedChannelsAllSat = (
  satChannels: TSatChannelListModel[][]
): TSatChannelListModel[][][] => {
  const grouped: { [sat: number]: { [freq: number]: TSatChannelListModel[] } } =
    {};

  satChannels.forEach((satGroup) => {
    satGroup.forEach((channel) => {
      const { sat, freq } = channel;
      if (!grouped[sat]) {
        grouped[sat] = {};
      }
      if (!grouped[sat][freq]) {
        grouped[sat][freq] = [];
      }
      grouped[sat][freq].push(channel);
    });
  });

  const sortedGroups = Object.values(grouped)
    .map((satGroup) => Object.values(satGroup))
    .sort((a, b) => a[0][0].sat_grade - b[0][0].sat_grade);

  return sortedGroups;
};
