import { executeQuery } from '@/libs/db/mysqldb';
import {
  IChannelPackagesModel,
  IOnlineChannelListModel,
  ISatChannelListEmptyModel,
} from '@/models/channelList.model';
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

    const resp = await executeQuery<ISatChannelListEmptyModel>(sql, [
      channelId,
    ]);

    return resp;
  }
);

export const getChannelPackages = async () => {
  const sql = `
  SELECT 
    C.id, 
    C.title, 
    C.cpu, 
    C.description, 
    C.logo, 
    C.view, 
    (SELECT COUNT(id) FROM tbl_comments_packs WHERE post=C.id) AS comment_count
  FROM 
      tbl_chan_categ AS C
  WHERE 
      C.parent = 0 
      AND C.id NOT IN (2,23,25) 
  ORDER BY 
      C.title
  `;

  return await executeQuery<IChannelPackagesModel>(sql);
};
// SELECT COUNT(id) FROM tbl_comments_packs WHERE post=C.id
export const getOnlineChannels = cache(async (searchQuery = '') => {
  const searchPart = searchQuery ? `AND 	C.title LIKE "%${searchQuery}%"` : '';

  const sql = `
    SELECT C.id, C.title, C.cpu, C.logo, C.encryption, C.description, C.view, C.tema, C.compress, C.potok,
          CO.title AS compr, L.title AS lan, C.tvforsite_net, T.title AS genre
    FROM tbl_channals AS C
    LEFT JOIN tbl_chan_compress AS CO ON C.compress = CO.id 
    LEFT JOIN tbl_language AS L ON C.lang = L.id
    LEFT JOIN 
          tbl_chan_tema AS T ON C.tema = T.id 
    WHERE ((C.compress = 5 AND C.tema != 15) OR 
          (C.compress != 5 AND C.tema != 15 AND C.tvforsite_net != '' AND C.cat != 23))
          ${searchPart}
    ORDER BY C.tema, C.tvforsite_net DESC
  `;

  const resp = await executeQuery<IOnlineChannelListModel>(sql);

  if (resp instanceof Error) return resp;

  const groupedData = resp.reduce(
    (acc, channel) => {
      const { title, genre, potok, tvforsite_net } = channel;
      if (!acc[genre]) {
        acc[genre] = [];
      }
      const shouldAdd = !acc[genre].some(
        (otherChannel) =>
          otherChannel.title === title ||
          (otherChannel.compress === 5 &&
            otherChannel.potok &&
            otherChannel.potok === potok) ||
          (otherChannel.tvforsite_net &&
            otherChannel.tvforsite_net === tvforsite_net)
      );

      if (shouldAdd) {
        acc[genre].push(channel);
      }

      return acc;
    },
    {} as { [key: string]: IOnlineChannelListModel[] }
  );

  const result = Object.entries(groupedData).map(([genre, channels]) => [
    genre,
    channels.sort((a, b) => b.view - a.view),
  ]) as [string, IOnlineChannelListModel[]][];

  return result;
});

export const getGroupedChannelsAllSat = (
  satChannels: ISatChannelListEmptyModel[][]
): ISatChannelListEmptyModel[][][] => {
  const grouped: {
    [sat: number]: { [freq: number]: ISatChannelListEmptyModel[] };
  } = {};

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
