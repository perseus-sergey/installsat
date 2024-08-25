import { executePoolQuery, getPool } from './mysqldb.mjs';
import { EDBTableTitles } from './commons.mjs';
import memoize from 'lodash.memoize';

const pool = getPool();

export const getDBSatID = memoize(async (satSlug, satName) => {
  if (!satSlug)
    return `ERROR extracting SATELLITE ID from DB. Parsed satellite SLUG not defined for sat. name «${satName}»`;

  const sql = `
  SELECT id, grade
  FROM ${EDBTableTitles.FLY_SATELLITES}
  WHERE slug = ?
  LIMIT 1
`;
  const res = await executePoolQuery(sql, [satSlug]);

  if (res instanceof Error) return `DB Error: ${res.message}`;
  if (res.length === 0)
    return `ERROR extracting SATELLITE ID from DB. Can't find satellite slug «${satSlug}» for sat. name «${satName}»`;

  return res[0];
});

export const insertDBTransNews = async (data) => {
  const placeholders = data
    .map(() => `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .join(', ');

  const values = data.flatMap((item) => [
    item.date,
    item.update,
    item.channel_title,
    item.action,
    item.text,
    item.text_en,
    item.sat,
    item.sat_name,
    item.sat_slug,
    item.sat_grade,
    item.sat_position,
    item.frequency_text,
    item.country,
  ]);

  const sql = `
    INSERT INTO ${EDBTableTitles.TRANS_NEWS} 
    (
      \`date\`,
      \`update\`,
      \`channel_title\`,
      \`action\`,
      \`text\`,
      \`text_en\`,
      \`sat\`,
      \`sat_name\`,
      \`sat_slug\`,
      \`sat_grade\`,
      \`sat_position\`,
      \`frequency_text\`,
      \`country\`
    )
    VALUES ${placeholders};
  `;
  const res = await executePoolQuery(sql, values);

  if (res instanceof Error) throw new Error(`DB INSERT data: ${res.message}`);

  return `DB SUCCESS! inserted rows: ${res.affectedRows}`;
};

export const deleteDBOldTransNews = async (data) => {
  const uniqueDateUpdatePairs = [
    ...new Set(
      data.map(
        (item) => `(${pool.escape(item.date)}, ${pool.escape(item.update)})`
      )
    ),
  ];

  const sql = `
    DELETE FROM ${EDBTableTitles.TRANS_NEWS}
    WHERE (\`date\`, \`update\`) IN (${uniqueDateUpdatePairs.join(', ')});
  `;
  const res = await executePoolQuery(sql);

  if (res instanceof Error)
    throw new Error(`DB DELETE data: ${res.message}!!! sql: ${sql}`);

  return `DB SUCCESS! deleted rows: ${res.affectedRows}`;
};

export const getDbIdAmount = async (tblName) => {
  const res = await executePoolQuery(
    `SELECT COUNT( id ) AS count FROM ${tblName}`
  );

  return res instanceof Error
    ? `Error of count id in DB table${tblName}: ${res.message}`
    : res;
};

export const actionTextHandler = (text, chanTitle, frequency) => {
  const replacements = [
    { regex: /package/giu, ua: 'Пакет', en: 'Package' },
    {
      regex: /FTA(?: *\w*){0,2}/giu,
      ua: "<span class='free_chan'>транслюється відкрито</span>",
      en: "<span class='free_chan'>free broadcasting</span>",
    },
    {
      regex: /\bnew SR\b/giu,
      ua: "<span class='add_chan'>нова SR(символьна швидкість)</span>",
      en: "<span class='add_chan'>new SR (symbol rate)</span>",
    },
    {
      regex: /(?:\b\w*\b\s)*encrypted(?:\b\w*\b\s)*/giu,
      ua: "<span class='left_chan'>закодовано на </span>",
      en: "<span class='left_chan'>encrypted on </span>",
    },
    {
      regex: /^ *(st\w+ed ag\w+n(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>відновив мовлення</span>",
      en: "<span class='add_chan'>restored broadcasting</span>",
    },
    {
      regex: /^ *(in the pa\w+ge ag\w*n(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>Знову в пакеті</span>",
      en: "<span class='add_chan'>restored in the package</span>",
    },
    {
      regex: /^ *(st\w+ed te\w+ng(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав тестове мовлення</span>",
      en: "<span class='add_chan'>started test broadcasting</span>",
    },
    {
      regex: /^ *(st\w+ed r\w+r p\w+m(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав регулярне мовлення</span>",
      en: "<span class='add_chan'>started regular broadcasting</span>",
    },
    {
      regex: /^ *(st\w+ed p\w+m(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав транслювати</span>",
      en: "<span class='add_chan'>started translating</span>",
    },
    {
      regex: /^ *(st\w+ed(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав мовлення</span>",
      en: "<span class='add_chan'>started broadcasting</span>",
    },
    {
      regex: /b\w+[kc] (?:on)* *\w* *new/giu,
      ua: "<span class='add_chan'>повернувся з новими параметрами</span>",
      en: "<span class='add_chan'>returned with new parameters</span>",
    },
    {
      regex: /a\w+r a* *br\w*k/giu,
      ua: "<span class='add_chan'>після зникнення</span>",
      en: "<span class='add_chan'>after disappearance</span>",
    },
    {
      regex: /^(ag\w*n)* *(on *(?:ag\w*n)*)/giu,
      ua: "<span class='add_chan'>з'явився на супутнику</span> ",
      en: "<span class='add_chan'>appeared on the satellite </span>",
    },
    {
      regex: /^(ag\w*n)* *(left *(?:ag\w*n)*)/giu,
      ua: "<span class='left_chan'>припинив трансляції</span> на ",
      en: "<span class='left_chan'>stopped broadcasting</span> on ",
    },
    { regex: / package /giu, ua: ' пакет ', en: ' package ' },
    {
      regex: /^ *(new) /giu,
      ua: 'змінилися параметри ',
      en: 'parameters have changed ',
    },
    {
      regex: /back on/giu,
      ua: "<span class='add_chan'>повернувся</span> на ",
      en: "<span class='add_chan'>returned</span> on ",
    },
    { regex: /old/giu, ua: 'старий', en: 'old' },
    { regex: /satellites/giu, ua: 'супутники', en: 'satellites' },
    { regex: /satellite/giu, ua: 'супутник', en: 'satellite' },
    { regex: /now/giu, ua: 'зараз', en: 'now' },
    { regex: /again/giu, ua: 'знову', en: 'again' },
    { regex: /on/giu, ua: '', en: 'on' },
  ];

  const changed = replacements.reduce(
    (acc, { regex, ua, en }) => {
      const uaRes = acc.ua.replaceAll(regex, ua);
      const enRes = acc.en.replaceAll(regex, en);

      return { ua: uaRes, en: enRes };
    },
    { ua: text, en: text }
  );

  return {
    ua: `<li><p><span class='grey_text'>${chanTitle.replaceAll('/package/ui', 'Пакет')}</span> ${changed.ua} ${frequency}`,
    en: `<li><p><span class='grey_text'>${chanTitle.replaceAll('/package/ui', 'Package')}</span> ${changed.en} ${frequency}`,
  };
};
