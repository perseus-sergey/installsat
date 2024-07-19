import { poolExecute } from '@/libs/db/mysqldb';

const TBL = 'tbl_digest';
// const TBL = 'tbl_digest_2023';
// const TBL = 'tbl_digest_2022';
// const TBL = 'tbl_digest_2021';
// const TBL = 'tbl_digest_2020';

const translateToEnglish = (text: string) => {
  const replacements = [
    { regex: /пакет/iu, replacement: 'package' },
    { regex: /транслюється відкрито/iu, replacement: 'free broadcasting' },
    {
      regex: /нова SR\(симв.+ швид.+\)/iu,
      replacement: 'new SR (symbol rate)',
    },
    { regex: /закодовано на/iu, replacement: 'encrypted on' },
    { regex: /відновив мовлення/iu, replacement: 'restored broadcasting' },
    { regex: /Знову в пакеті/iu, replacement: 'restored in the package' },

    {
      regex: /розпочав тестове мовлення/iu,
      replacement: 'started test broadcasting',
    },
    {
      regex: /розпочав регулярне мовлення/iu,
      replacement: 'started regular broadcasting',
    },
    { regex: /розпочав транслювати/iu, replacement: 'started translating' },
    { regex: /розпочав мовлення/iu, replacement: 'started broadcasting' },
    {
      regex: /повернувся з новими параметрами/iu,
      replacement: 'returned with new parameters',
    },
    { regex: /після зникнення/iu, replacement: 'after disappearance' },
    {
      regex: /з'явився на супутнику/iu,
      replacement: 'appeared on the satellite',
    },
    { regex: /припинив трансляції/iu, replacement: 'stopped broadcasting' },
    { regex: /змінилися параметри/iu, replacement: 'parameters have changed' },
    { regex: /повернувся/iu, replacement: 'returned' },
    { regex: /старий/iu, replacement: 'old' },
    { regex: /супутники/iu, replacement: 'satellites' },
    { regex: /супутник/iu, replacement: 'satellite' },
    { regex: /зараз/iu, replacement: 'now' },
    { regex: /знову/iu, replacement: 'again' },
    { regex: /на/iu, replacement: 'on' },
  ];

  return replacements.reduce(
    (acc, { regex, replacement }) => acc.replace(regex, replacement),
    text
  );
};

const updateDataInBatches = async (data: { id: string; text_en: string }[]) => {
  const extractErrors = [];
  if (!data || data.length === 0)
    return [new Error('Error: Received empty data for batch update')];

  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const sql = `
      UPDATE ${TBL}
      SET text_en = CASE id
        ${batch.map((row) => `WHEN ${row.id} THEN ?`).join(' ')}
      END
      WHERE id IN (${batch.map((row) => row.id).join(', ')})
    `;

    const updateValues = batch.map((row) => row.text_en);

    const res = await poolExecute(sql, updateValues);
    if (res instanceof Error) extractErrors.push(res);
  }

  return extractErrors;
};

export default async function Page() {
  const sql = `SELECT id, text FROM ${TBL}`;

  const oldData = await poolExecute<{ id: string; text: string }[]>(sql);
  if (oldData instanceof Error) return JSON.stringify(oldData);

  const translatedRows = oldData.map((row) => ({
    id: row.id,
    text_en: translateToEnglish(row.text),
  }));

  const insertRes = await updateDataInBatches(translatedRows);

  if (insertRes.length > 0) return JSON.stringify(insertRes);

  return JSON.stringify(insertRes);
}
