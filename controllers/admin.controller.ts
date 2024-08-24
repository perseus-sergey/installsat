import { IInputData } from '@/components/admin/FormEditArticle/FormEditChannel';
import { poolExecute, poolQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import {
  IAllNewsModel,
  IArticleCategory,
  TArticleTableModel,
} from '@/models/articles.model';
import { EChannelEditFields, TChannelEditModel } from '@/models/channel.model';
import { IEditChannelListModel } from '@/models/channelList.model';
import { EDBTableTitles } from '@/models/ui.model';
import { ResultSetHeader } from 'mysql2';
import { cache } from 'react';

// export const WRONG_CAT_IDS = '(2,0,11,12,13)';
const { ARTICLE: TBL_ARTICLE } = EDBTableTitles;

export const deleteItemFromDbTable = async (
  dbTableName: EDBTableTitles,
  id: string
) => await poolExecute(`DELETE FROM ${dbTableName} WHERE id=?`, [id]);

export const getAdminChunkOfNews = cache(
  async (quantity: number, start = 0, searchQuery = '') => {
    const searchText = searchQuery ? `LIKE "%${searchQuery}%"` : '!= ""';

    const sql = `
      SELECT 
      U.id,
      U.title,
      U.date_upd,
      T.total_count,
      CAT.title AS category_title
    FROM ${TBL_ARTICLE} U
    LEFT JOIN tbl_categories CAT ON U.cat = CAT.id
    CROSS JOIN
      (SELECT COUNT(id) AS total_count FROM ${TBL_ARTICLE} WHERE title ${searchText}) T
      WHERE U.title ${searchText}
    ORDER BY 
      U.date DESC, U.id 
    LIMIT ?, ?
    `;
    const res = await poolExecute<IAllNewsModel[]>(sql, [
      `${start}`,
      `${quantity}`,
    ]);

    return res instanceof Error ? [] : res;
  }
);

export const getArticleAndCatDb = cache(async (articleId: string | number) => {
  const sql = `SELECT * FROM ${TBL_ARTICLE} WHERE id = ${articleId} LIMIT 1; SELECT title, id FROM tbl_categories`;

  return poolQuery<[TArticleTableModel[], IArticleCategory[]]>(sql);
});

export const editArticleDB = async (
  articleID: string,
  articleData: TArticleTableModel
) =>
  await poolExecute<ResultSetHeader>(
    `
    UPDATE ${TBL_ARTICLE} 
    SET 
      title = ?,
      cpu = ?,
      description = ?,
      text = ?,
      cat = ?,
      author = ?,
      logo = ?,
      folder = ?,
      title_en = ?,
      description_en = ?,
      keywords = ?,
      keywords_en = ?,
      text_en = ?,
      date = ?,
      date_upd = ?
    WHERE id = ?`,
    [
      articleData.title,
      articleData.cpu,
      articleData.description,
      articleData.text,
      `${articleData.cat}`,
      articleData.author || '',
      articleData.logo || '',
      articleData.folder || '',
      articleData.title_en || '',
      articleData.description_en || '',
      articleData.keywords || '',
      articleData.keywords_en || '',
      articleData.text_en || '',
      getFormattedDateStrYearFirst(articleData.date),
      getFormattedDateStrYearFirst(),
      articleID,
    ]
  );

export const getEditDbChannels = cache(async (searchQuery: string) => {
  if (!searchQuery) return [];

  const sql = `
      SELECT ch.id, ch.title, ch.cpu, ch.canonical,
      sat.title AS sat_title,
      sat.position AS sat_position,
      fr.freq AS frequency,
      cat.title AS category,
      co.title AS compr,
      (SELECT title FROM tbl_chan_categ WHERE id = cat.parent LIMIT 1) AS cat_parent_title
      FROM tbl_channals AS ch 
      LEFT JOIN tbl_chan_freq 		  AS fr	 ON ch.frequency 	= fr.id 
      LEFT JOIN tbl_chan_categ 		  AS cat ON ch.cat   		  = cat.id 
      LEFT JOIN tbl_chan_sat 			  AS sat ON ch.sat 			  = sat.id 
      LEFT JOIN tbl_chan_compress   AS co	 ON ch.compress 	= co.id 
      WHERE 	ch.title LIKE "%${searchQuery}%"
      ORDER BY ch.title, fr.freq
    `;

  const resp = await poolExecute<IEditChannelListModel[]>(sql);

  return resp;
});

export const getDbRelativeChannelCats = cache(
  async (parentId: string | number) => {
    const resp = await poolExecute<IInputData[]>(
      `SELECT title, id FROM tbl_chan_categ WHERE parent = ?`,
      [`${parentId}`]
    );

    return resp instanceof Error ? [] : resp;
  }
);
export const getDbRelativeFrequencies = cache(
  async (satId: string | number) => {
    const resp = await poolExecute<
      {
        freq: number;
        sat: number;
        beam: number;
        id: number;
        cpu: string;
      }[]
    >(
      `
    SELECT 
      F.freq, 
      F.id,
      F.sat,
      F.beam,
      B.cpu
    FROM 
      tbl_chan_freq AS F 
    LEFT JOIN 
      tbl_chan_beam AS B ON F.beam = B.id
    WHERE 
      F.sat = ?
    ORDER BY 
      F.beam, F.freq;
        `,
      [`${satId}`]
    );

    if (resp instanceof Error) return [];

    return resp.map((f) => ({
      title: `${f.freq} => ${f.cpu}`,
      id: `${f.sat}|${f.beam}|${f.id}`,
    }));
  }
);

export const getEditDbChannel = async (
  id: string
): Promise<
  | Error
  | [
      IInputData[],
      TChannelEditModel[],
      IInputData[],
      IInputData[],
      IInputData[],
      IInputData[],
      IInputData[],
      IInputData[],
      IInputData[],
    ]
> => {
  const sql = `
      SELECT title, id, position FROM tbl_chan_sat WHERE id != 1 AND fill = 1 ORDER BY grade;

      SELECT
        CH.title, 
        CH.cpu AS chan_slug, 
        CH.logo, 
        CH.description, 
        CH.text, 
        CH.sat AS sat_id, 
        CH.frequency AS frequency_id, 
        CH.beam AS beam_id, 
        CH.cat AS cat_id, 
        CH.tema AS genre_id, 
        CH.compress AS compress_id, 
        CH.lang AS lang_id, 
        CH.encryption AS encryption_id, 
        CH.url, 
        CH.country_id, 
        CH.biss, 
        CH.ip_deny, 
        CH.canonical, 
        CH.no_googlads, 
        CH.vsetv, 
        CH.vipiko, 
        CH.potok, 
        CH.pars_uppod, 
        CH.pattern, 
        CH.other_stream, 
        CH.mark, 
        CH.tvforsite_net,
        CAT.parent AS parent_cat_id
      FROM tbl_channals AS CH
      LEFT JOIN tbl_chan_categ AS CAT ON CH.cat = CAT.id
      WHERE CH.id = ?
      LIMIT 1;

      SELECT title, id FROM tbl_chan_categ WHERE parent = 0;

      SELECT title, id FROM tbl_chan_compress;

      SELECT title, id FROM tbl_chan_encryption;

      SELECT title, id FROM tbl_chan_tema;

      SELECT title, id FROM tbl_language;

      SELECT title, vipiko_id AS id FROM vipiko_chan ORDER BY title ASC;

      SELECT title, id FROM tbl_country;
    `;

  const resp = await poolQuery<
    [
      (IInputData & { position: string })[],
      TChannelEditModel[],
      IInputData[],
      IInputData[],
      IInputData[],
      IInputData[],
      IInputData[],
      IInputData[],
      IInputData[],
    ]
  >(sql, [id]);

  if (resp instanceof Error) return resp;

  const frequencies = resp[0].map((f) => ({
    title: `${f.position} - ${f.title}`,
    id: f.id,
  }));
  const [, ...rest] = resp;

  return [frequencies, ...rest];
};

export const editChannelDB = async (
  channelID: string,
  channelData: TChannelEditModel
) =>
  await poolExecute<ResultSetHeader>(
    `
    UPDATE tbl_channals SET 
      title = ?,
      cpu = ?,
      description = ?,
      text = ?,
      cat = ?,
      sat = ?,
      frequency = ?,
      beam = ?,
      tema = ?,
      logo = ?,
      url = ?,
      biss = ?,
      ip_deny = ?,
      no_googlads = ?,
      country_id = ?,
      encryption = ?,
      canonical = ?,
      compress = ?,
      lang = ?,
      tvforsite_net = ?,
      vsetv = ?,
      vipiko = ?,
      potok = ?,
      pars_uppod = ?,
      other_stream = ?,
      mark = ?,
      pattern = ?
    WHERE id = ?
    `,
    [
      channelData[EChannelEditFields.title],
      channelData[EChannelEditFields.chan_slug],
      channelData[EChannelEditFields.description],
      channelData[EChannelEditFields.text],
      `${channelData[EChannelEditFields.cat_id]}`,
      `${channelData[EChannelEditFields.sat_id]}` || '',
      `${channelData[EChannelEditFields.frequency_id]}` || '',
      `${channelData[EChannelEditFields.beam_id]}` || '',
      `${channelData[EChannelEditFields.genre_id]}`,
      `${channelData[EChannelEditFields.logo]}`,
      `${channelData[EChannelEditFields.url]}`,
      channelData[EChannelEditFields.biss] || '',
      `${channelData[EChannelEditFields.ip_deny]}`,
      `${channelData[EChannelEditFields.no_googlads]}`,
      `${channelData[EChannelEditFields.country_id]}`,
      `${channelData[EChannelEditFields.encryption_id]}`,
      channelData[EChannelEditFields.canonical],
      `${channelData[EChannelEditFields.compress_id]}`,
      `${channelData[EChannelEditFields.lang_id]}`,
      channelData[EChannelEditFields.tvforsite_net] || '',
      `${channelData[EChannelEditFields.vsetv]}`,
      `${channelData[EChannelEditFields.vipiko]}`,
      channelData[EChannelEditFields.potok] || '',
      channelData[EChannelEditFields.pars_uppod] || '',
      channelData[EChannelEditFields.other_stream] || '',
      channelData[EChannelEditFields.mark] || '',
      channelData[EChannelEditFields.pattern] || '',
      channelID,
    ]
  );
