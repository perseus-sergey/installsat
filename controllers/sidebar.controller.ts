import { NUMBER_OF_LAST_NEWS_WIDGET } from '@/models/widget.model';

export const installationsSql = `
SELECT title, cpu, id FROM tbl_installations WHERE id NOT IN (8,9)
`;

export const channelCatsSql = `
SELECT title, id, parent, cpu FROM tbl_chan_categ WHERE parent=0 AND title != '' AND id NOT IN (2,23,25) ORDER BY title
`;

export const lastNewsWidgetSql = `
SELECT id, title, cpu FROM tbl_useful WHERE cat NOT IN (2,8,0,12) ORDER BY date DESC, id DESC LIMIT ${NUMBER_OF_LAST_NEWS_WIDGET}
`;

export const usefulArticlesSql = `
SELECT title, id, cpu FROM tbl_useful WHERE cat=4 OR cat=5
`;

export const channelSatsSql = `
SELECT title,position,id,cpu
FROM tbl_chan_sat
WHERE id != 1 AND fill = 1
ORDER BY position
`;

export const articleCategoriesSql = `
SELECT id,title, cpu FROM tbl_categories WHERE id != 2 AND id!=12 AND title!=''
`;
