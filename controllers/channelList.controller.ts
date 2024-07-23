import { poolExecute } from '@/libs/db/mysqldb';
import {
  IChannelPackagesModel,
  IOnlineChannelListModel,
  IPackageChannelListModel,
  ISatChannelListModel,
} from '@/models/channelList.model';
import { decode } from 'html-entities';
import { cache } from 'react';

const groupeChannelsBy = <T>(
  channelList: T[],
  groupChanBy: keyof T,
  decodeFields?: (keyof T)[],
  sortChanBy?: keyof T
): [string, T[]][] => {
  const groupedData = channelList.reduce(
    (acc, channel) => {
      const groupedField = channel[groupChanBy] as unknown as string;
      if (!acc[groupedField]) {
        acc[groupedField] = [];
      }

      const decodedChannel = { ...channel };

      if (decodeFields) {
        decodeFields.forEach((field) => {
          if (typeof channel[field] === 'string') {
            (decodedChannel[field] as unknown as string) = decode(
              channel[field] as string
            );
          }
        });
      }

      acc[groupedField].push(decodedChannel);

      return acc;
    },
    {} as { [key: string]: T[] }
  );

  const result = Object.entries(groupedData).map(([groupedField, channels]) => [
    groupedField,
    sortChanBy
      ? (channels as T[]).sort((a, b) => {
          if (typeof a[sortChanBy] === 'string') {
            return (a[sortChanBy] as string).localeCompare(
              b[sortChanBy] as string
            );
          } else {
            return (b[sortChanBy] as number) - (a[sortChanBy] as number);
          }
        })
      : channels,
  ]) as [string, T[]][];

  return result;
};

export const getSatChannels = cache(
  async (
    searchQuery = '',
    channelId = '',
    satellites?: string | string[] | undefined,
    isMPG4 = false,
    isT2MI = false
  ): Promise<ISatChannelListModel[]> => {
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

    const resp = await poolExecute<ISatChannelListModel[]>(sql, [channelId]);

    return resp instanceof Error || resp.length === 0
      ? []
      : resp.map((r) => ({
          ...r,
          sat_title: decode(r.sat_title),
          title: decode(r.title),
          description: decode(r.description),
        }));
  }
);

export const getChannelPackages = async (): Promise<
  IChannelPackagesModel[]
> => {
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

  const resp = await poolExecute<IChannelPackagesModel[]>(sql);

  return resp instanceof Error || resp.length === 0
    ? []
    : resp.map((r) => ({
        ...r,
        title: decode(r.title),
        description: decode(r.description),
      }));
};

export const getOnlineChannels = cache(async (searchQuery = '') => {
  const searchPart = searchQuery ? `AND C.title LIKE "%${searchQuery}%"` : '';

  const sql = `
    SELECT C.id AS chan_id, C.title AS chan_title, C.cpu AS chan_cpu, C.logo AS chan_logo, C.encryption, C.description AS chan_description, C.view, C.tema AS genre_id, C.compress, C.potok,
          CO.title AS compr, L.title AS lan, C.tvforsite_net, T.title AS genre_title
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

  const resp = await poolExecute<IOnlineChannelListModel[]>(sql);

  if (resp instanceof Error || !resp.length) return [];

  const groupedData = resp.reduce(
    (acc, channel) => {
      const decodedChannel = {
        ...channel,
        chan_title: decode(channel.chan_title),
        chan_description: decode(channel.chan_description),
      };

      const { chan_title, genre_title, potok, tvforsite_net } = decodedChannel;
      if (!acc[genre_title]) {
        acc[genre_title] = [];
      }

      const existingChannel = acc[genre_title].find(
        (otherChannel) =>
          otherChannel.chan_title === chan_title ||
          (otherChannel.compress === 5 &&
            otherChannel.potok &&
            otherChannel.potok === potok) ||
          (otherChannel.tvforsite_net &&
            otherChannel.tvforsite_net === tvforsite_net)
      );

      if (!existingChannel) {
        acc[genre_title].push(decodedChannel);
      }

      return acc;
    },
    {} as { [key: string]: IOnlineChannelListModel[] }
  );

  const result = Object.entries(groupedData).map(([genre_title, channels]) => [
    genre_title,
    channels.sort((a, b) => b.view - a.view),
  ]) as [string, IOnlineChannelListModel[]][];

  return result;
});

export const getChannelsWithSchedule = async (searchQuery = '') => {
  const searchPart = searchQuery ? `AND C.title LIKE "%${searchQuery}%"` : '';

  const sql = `
  SELECT 
      MAX(C.id) AS chan_id,
      C.title AS chan_title,
      MAX(C.cpu) AS chan_cpu,
      MAX(C.logo) AS chan_logo,
      MAX(C.description) AS chan_description,
      MAX(C.view) AS view,
      C.tema AS genre_id,
      MAX(L.title) AS lan,
      MAX(T.title) AS genre_title
  FROM 
      tbl_channals AS C
  LEFT JOIN 
      tbl_language AS L ON C.lang = L.id
  LEFT JOIN 
      tbl_chan_tema AS T ON C.tema = T.id
  WHERE 
  C.tema != 15 
  AND (
    (C.vipiko IS NOT NULL AND C.vipiko != '' AND C.vipiko != 0)
    OR 
    (C.vsetv IS NOT NULL AND C.vsetv != '' AND C.vsetv != 0)
  )
      ${searchPart}
  GROUP BY 
      C.title, C.tema
  ORDER BY 
      C.tema, 
      C.title;
  `;
  const resp = await poolExecute<IOnlineChannelListModel[]>(sql);

  return resp instanceof Error || !resp.length
    ? []
    : groupeChannelsBy<IOnlineChannelListModel>(resp, 'genre_title', [
        'chan_title',
        'chan_description',
      ]);
};

export const getT2Channels = cache(async (searchQuery = '') => {
  const searchPart = searchQuery ? `AND C.title LIKE "%${searchQuery}%"` : '';

  const sql = `
    SELECT C.id AS chan_id, C.title AS chan_title, C.cpu AS chan_cpu, C.logo AS chan_logo, C.encryption, C.description AS chan_description, C.tema AS genre_id, C.cat AS cat_id,
      CO.title AS compr, L.title AS lan, T.title AS genre_title, cat.logo AS cat_logo, cat.title AS cat_title, cat.cpu AS cat_slug, cat.description AS cat_description, cat.view AS cat_view
    FROM tbl_channals AS C
    LEFT JOIN tbl_chan_categ AS cat ON C.cat = cat.id 
    LEFT JOIN tbl_chan_compress AS CO ON C.compress = CO.id 
    LEFT JOIN tbl_language AS L ON C.lang = L.id
    LEFT JOIN tbl_chan_tema AS T ON C.tema = T.id 
    WHERE C.cat = 22 AND C.tema != 15
    ${searchPart}
    ORDER BY C.tema, C.title
  `;

  const resp =
    await poolExecute<(IOnlineChannelListModel & IPackageChannelListModel)[]>(
      sql
    );

  return resp instanceof Error || !resp.length
    ? null
    : groupeChannelsBy<IPackageChannelListModel>(resp, 'genre_title', [
        'chan_title',
        'chan_description',
      ]);
});

export const getPackageChannels = cache(
  async (packageSlug: string, searchQuery = '') => {
    const searchPart = searchQuery ? `AND C.title LIKE "%${searchQuery}%"` : '';

    const sql = `
  SELECT 
    cat.id AS cat_id,
    cat.title AS cat_title,
    cat.cpu AS cat_slug,
    cat.logo AS cat_logo, 
    cat.description AS cat_description,
    cat.view AS cat_view,
    subcat.cpu AS genre_slug,
    subcat.title AS genre_title,
    subcat.h1 AS genre_h1,
    subcat.logo AS genre_logo,
    subcat.description AS genre_description,
    subcat.price,
    subcat.h1,
    subcat.id AS genre_id,
    C.id AS chan_id,
    C.title AS chan_title,
    C.cpu AS chan_cpu,
    C.logo AS chan_logo,
    C.description AS chan_description,
    la.title AS lan
  FROM 
    tbl_chan_categ AS cat
  JOIN 
    tbl_chan_categ AS subcat ON cat.id = subcat.parent
  JOIN 
    tbl_channals AS C ON subcat.id = C.cat
  LEFT JOIN 
    tbl_language AS la ON C.lang = la.id
  WHERE 
    cat.cpu = ?
    AND C.sat != 1
    ${searchPart}
  ORDER BY 
    subcat.location, C.tema
  `;

    const resp = await poolExecute<IPackageChannelListModel[]>(sql, [
      packageSlug,
    ]);

    return resp instanceof Error || !resp.length
      ? null
      : groupeChannelsBy<IPackageChannelListModel>(
          resp,
          'genre_title',
          ['chan_title', 'chan_description'],
          'chan_title'
        );
  }
);

export const getGroupedChannelsAllSat = (
  satChannels: ISatChannelListModel[][]
): ISatChannelListModel[][][] => {
  const grouped: {
    [sat: number]: { [freq: number]: ISatChannelListModel[] };
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
