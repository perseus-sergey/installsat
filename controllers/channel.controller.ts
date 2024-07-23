import { poolExecute } from '@/libs/db/mysqldb';
import {
  IChannel,
  IOnlineChannel,
  ISimilarChannel,
} from '@/models/channel.model';
import { decode } from 'html-entities';
import { cache } from 'react';

export const getDBChannel = cache(async (slug: string) => {
  const sql = `
  SELECT 
  CH.id, 
  CH.title, 
  CH.cpu AS chan_slug, 
  CH.logo, 
  CH.description, 
  CH.text, 
  CH.cat AS cat_id, 
  CH.url, 
  CH.view, 
  CH.canonical, 
  CH.vsetv, 
  CH.vipiko, 
  CH.tvforsite_net,
  F.freq,
  F.sr,
  F.fec,
  B.polar,
  S.title AS sat_title,
  S.cpu AS sat_slug,
  E.title AS encryption,
  T.title AS genre,
  CO.title AS compression,
  C.title AS cat_title,
  C.parent AS cat_parent_id,
  C.cpu AS cat_slug,
  (SELECT title FROM tbl_chan_categ WHERE id = C.parent LIMIT 1) AS cat_parent_title,
  (SELECT cpu FROM tbl_chan_categ WHERE id = C.parent LIMIT 1) AS cat_parent_cpu,
  L.title AS chan_lang
FROM 
  tbl_channals AS CH 
LEFT JOIN 
  tbl_chan_tema AS T ON CH.tema = T.id 
LEFT JOIN 
  tbl_chan_encryption AS E ON CH.encryption = E.id  
LEFT JOIN 
  tbl_chan_beam AS B ON CH.beam = B.id 
LEFT JOIN 
  tbl_chan_sat AS S ON CH.sat = S.id 
LEFT JOIN 
  tbl_chan_freq AS F ON CH.frequency = F.id 
LEFT JOIN 
  tbl_chan_categ AS C ON CH.cat = C.id 
LEFT JOIN 
  tbl_chan_compress AS CO ON CH.compress = CO.id 
LEFT JOIN 
  tbl_language AS L ON CH.lang = L.id 
WHERE 
  CH.cpu = ?
LIMIT 1
`;
  const res = await poolExecute<IChannel[]>(sql, [slug]);
  if (res instanceof Error) return null;
  if (!res.length) return null;

  return {
    ...res[0],
    title: decode(res[0].title),
    description: decode(res[0].description),
    sat_title: decode(res[0].sat_title),
  };
});

export const getDBOnlineChannel = cache(
  async (slug: string): Promise<IOnlineChannel | null> => {
    const sql = `
  SELECT 
    C.id, 
    C.title, 
    C.cpu AS chan_slug, 
    C.logo, 
    C.description, 
    C.text, 
    C.url, 
    C.view, 
    C.canonical, 
    C.programma, 
    C.potok, 
    C.aspect, 
    C.no_googlads, 
    C.tvforsite_net, 
    C.other_stream, 
    C.vipiko, 
    C.telegid_id, 
    C.vsetv, 
    C.tema AS genre_id,
    COMP.title as compression,
    L.title as chan_lang,
    COUNT.title as country 
  FROM tbl_channals AS C 
  LEFT JOIN tbl_chan_compress AS COMP ON C.compress = COMP.id 
  LEFT JOIN tbl_country AS COUNT ON C.country_id = COUNT.id 
  LEFT JOIN tbl_language AS L ON C.lang = L.id 
  WHERE C.cpu =  ?
  LIMIT 1
`;
    const res = await poolExecute<IOnlineChannel[]>(sql, [slug]);

    return res instanceof Error || !res.length
      ? null
      : {
          ...res[0],
          title: decode(res[0].title),
          description: decode(res[0].description),
          other_stream: decode(res[0].other_stream),
        };
  }
);

// export const getDBChannelSlugList = async () =>
//   await poolExecute<{ cpu: string }[]>(`SELECT cpu FROM tbl_channals`);

export const getSimilarChannels = async (logo: string) => {
  const sql = `
  SELECT  
    C.id, 
    C.compress, 
    C.cpu,
    C.cat       AS cat_id,
    CA.title    AS cat_title,
    CA.cpu      AS cat_slug,
    CA.parent   AS cat_parent_id,
    S.title     AS sat_title,
    S.cpu       AS sat_cpu,
    S.position  AS sat_position,
    F.freq      AS freq,
    (SELECT title FROM tbl_chan_categ WHERE id = CA.parent LIMIT 1) AS cat_parent_title,
    (SELECT cpu FROM tbl_chan_categ WHERE id = CA.parent LIMIT 1) AS cat_parent_cpu
  FROM 
    tbl_channals AS C 
  LEFT JOIN 
    tbl_chan_sat AS S ON C.sat = S.id 
  LEFT JOIN 
    tbl_chan_freq AS F ON C.frequency = F.id
  LEFT JOIN 
    tbl_chan_categ AS CA ON C.cat = CA.id 
  WHERE 
    C.logo = ?
  AND
    C.cat != 23
  AND
    CA.parent NOT IN (2, 25)
  OR 
    C.logo = ? 
  AND 
    C.compress = 5
  ORDER BY 
    C.cat DESC, S.grade
  `;

  return await poolExecute<ISimilarChannel[]>(sql, [logo, logo]);
};
