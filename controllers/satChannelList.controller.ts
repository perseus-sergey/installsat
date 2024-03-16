import { executeQuery } from '@/libs/db/mysqldb';
import { TSatChannelListModel } from '@/models/satChannelList.model';

export const getSatChannels = async (channelId: string) => {
  const sql = `
  SELECT ch.id, ch.title, ch.cpu, ch.frequency, ch.sat AS tema, ch.logo, ch.programma, ch.encryption, ch.biss, ch.description,
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
  WHERE ch.sat = ?
  AND  	ch.cat = 4
  AND 	en.id IN(1,2,10)
  ORDER BY sat.grade,fr.freq, be.polar, ch.title
`;

  return await executeQuery<TSatChannelListModel>(sql, [channelId]);
};

// export const channelCatsSql = `
// SELECT title, id, parent, cpu FROM tbl_chan_categ WHERE parent=0 AND title != '' AND id NOT IN (2,23,25) ORDER BY title
// `;

// export const lastNewsWidgetSql = `
// SELECT id, title, cpu FROM tbl_useful WHERE cat NOT IN (2,8,0,12) ORDER BY date DESC, id DESC LIMIT ${NUMBER_OF_LAST_NEWS_WIDGET}
// `;

// export const usefulArticlesSql = `
// SELECT title, id, cpu FROM tbl_useful WHERE cat=4 OR cat=5
// `;

// export const channelSatsSql = `
// SELECT title,position,id,cpu
// FROM tbl_chan_sat
// WHERE id != 1 AND fill = 1
// ORDER BY position
// `;

// export const articleCategoriesSql = `
// SELECT id,title, cpu FROM tbl_categories WHERE id != 2 AND id!=12 AND title!=''
// `;

// export const getInstallationsList = cache(
//   async () => await executeQuery<TInstallationsModel>(installationsSql)
// );

// export const getChannelCatList = cache(
//   async () => await executeQuery<TChannelCatsModel>(channelCatsSql)
// );

// export const getChannelSatList = cache(
//   async () => await executeQuery<TSatModel>(channelSatsSql)
// );

// export const getUsefulArticleList = cache(
//   async () => await executeQuery<TUsefulArticlesSqlModel>(usefulArticlesSql)
// );
