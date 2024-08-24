import { poolExecute } from '@/libs/db/mysqldb';
import {
  IChannel,
  IFlyChannel,
  IOnlineChannel,
  ISimilarChannel,
} from '@/models/channel.model';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import { decode } from 'html-entities';
import { cache } from 'react';

const {
  FLY_CHANNELS,
  CHANNEL_THEME,
  CHANNELS,
  CHANNEL_CATEGORY,
  CHANNEL_ENCRYPTION,
  CHANNEL_FREQUENCY,
  CHANNEL_BEAM,
  CHANNEL_SAT,
  FLY_SATELLITES,
  CHANNEL_COMPRESSION,
  TBL_LANGUAGE,
  FLY_PACKAGES,
} = EDBTableTitles;

export const getDBFlyChannel = cache(
  async (slug: string, lang: ELanguage): Promise<IFlyChannel | null> => {
    const sql = `
  SELECT 
  CH.id, 
  CH.title, 
  CH.slug, 
  CH.logo,
  ${lang === ELanguage.UA ? 'CH.description_ua' : 'CH.description_en AS description'}, 
  ${lang === ELanguage.UA ? 'CH.text_ua' : 'CH.text_en AS text'}, 
  CH.official_site_url, 
  CH.view, 
  CH.canonical, 
  CH.vsetv, 
  CH.vipiko, 
  CH.frequency,
  CH.sr,
  CH.fec,
  CH.beam,
  CH.polarization,
  CH.encryption,
  CH.biss,
  CH.is_biss,
  CH.mode,
  CH.compress,
  CH.is_radio,
  CH.sid,
  CH.v_pid,
  CH.a_pid,
  CH.t2_stream,
  CH.sat_slug,
  CH.is_removed,
  S.title AS sat_title,
  S.position AS sat_position,
  S.grade AS sat_grade,
  T.title AS theme,
  L.title AS lan
FROM ${FLY_CHANNELS} AS CH 
LEFT JOIN ${CHANNEL_THEME} AS T ON CH.theme_id = T.id 
LEFT JOIN ${FLY_SATELLITES} AS S ON CH.sat_slug = S.slug 
LEFT JOIN ${TBL_LANGUAGE} AS L ON CH.lang_id = L.id 
WHERE CH.slug = ?
LIMIT 1
`;
    const res = await poolExecute<IFlyChannel[]>(sql, [slug]);
    if (res instanceof Error) return null;
    if (!res.length) return null;

    return {
      ...res[0],
      title: decode(res[0].title),
      description: decode(res[0].description),
      sat_title: decode(res[0].sat_title),
    };
  }
);

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
  (SELECT title FROM ${CHANNEL_CATEGORY} WHERE id = C.parent LIMIT 1) AS cat_parent_title,
  (SELECT cpu FROM ${CHANNEL_CATEGORY} WHERE id = C.parent LIMIT 1) AS cat_parent_cpu,
  L.title AS chan_lang
FROM 
  ${CHANNELS} AS CH 
LEFT JOIN 
  ${CHANNEL_THEME} AS T ON CH.tema = T.id 
LEFT JOIN 
  ${CHANNEL_ENCRYPTION} AS E ON CH.encryption = E.id  
LEFT JOIN 
  ${CHANNEL_BEAM} AS B ON CH.beam = B.id 
LEFT JOIN 
  ${CHANNEL_SAT} AS S ON CH.sat = S.id 
LEFT JOIN 
  ${CHANNEL_FREQUENCY} AS F ON CH.frequency = F.id 
LEFT JOIN 
  ${CHANNEL_CATEGORY} AS C ON CH.cat = C.id 
LEFT JOIN 
  ${CHANNEL_COMPRESSION} AS CO ON CH.compress = CO.id 
LEFT JOIN 
  ${TBL_LANGUAGE} AS L ON CH.lang = L.id 
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
  FROM ${CHANNELS} AS C 
  LEFT JOIN ${CHANNEL_COMPRESSION} AS COMP ON C.compress = COMP.id 
  LEFT JOIN tbl_country AS COUNT ON C.country_id = COUNT.id 
  LEFT JOIN ${TBL_LANGUAGE} AS L ON C.lang = L.id 
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
    (SELECT title FROM ${CHANNEL_CATEGORY} WHERE id = CA.parent LIMIT 1) AS cat_parent_title,
    (SELECT cpu FROM ${CHANNEL_CATEGORY} WHERE id = CA.parent LIMIT 1) AS cat_parent_cpu
  FROM 
    ${CHANNELS} AS C 
  LEFT JOIN 
    ${CHANNEL_SAT} AS S ON C.sat = S.id 
  LEFT JOIN 
    ${CHANNEL_FREQUENCY} AS F ON C.frequency = F.id
  LEFT JOIN 
    ${CHANNEL_CATEGORY} AS CA ON C.cat = CA.id 
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

export const getSimilarFlyChannels = async (title: string) => {
  const sql = `
  SELECT  
    C.id, 
    C.compress, 
    C.frequency, 
    C.encryption,
    C.biss,
    C.mode,
    C.slug,
    C.package_id,
    P.title     AS package_title,
    P.slug      AS package_slug,
    S.title     AS sat_title,
    S.slug      AS sat_slug,
    S.position  AS sat_position
  FROM 
    ${FLY_CHANNELS} AS C 
  LEFT JOIN 
    ${FLY_SATELLITES} AS S ON C.sat_slug = S.slug  
  LEFT JOIN 
    ${FLY_PACKAGES} AS P ON C.package_id = P.id  
  WHERE 
    C.title = ?
  AND
    C.is_removed != 1
  ORDER BY 
    S.grade
  `;

  const res = await poolExecute<IFlyChannel[]>(sql, [title]);

  return res instanceof Error ? [] : res;
};
