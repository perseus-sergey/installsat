import { poolExecute } from '@/libs/db/mysqldb';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';

const translateToEnglish = (text: string) => {
  const replacements = [
    { regex: /пакет/iu, replacement: 'package' },
    {
      regex: /транслюється відкрито|идет открыто/iu,
      replacement: 'free broadcasting',
    },
    {
      regex: /открыт/iu,
      replacement: 'FTA',
    },
    {
      regex: /обновил\w*/iu,
      replacement: 'updated',
    },
    {
      regex: /нова SR\(симв.+ швид.+\)/iu,
      replacement: 'new SR (symbol rate)',
    },
    { regex: /закодовано на|закодирован на/iu, replacement: 'encrypted on' },
    { regex: /закодированспутнике/iu, replacement: 'encrypted on satellite' },
    { regex: /закодирован/iu, replacement: 'encrypted on satellite' },
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
      regex: /з'явився на супутнику|появился на спутнике/iu,
      replacement: 'appeared on the satellite',
    },
    {
      regex: /припинив трансляції|перестал транслироваться/iu,
      replacement: 'stopped broadcasting',
    },
    {
      regex: /змінилися параметри|изменились параметры/iu,
      replacement: 'parameters have changed',
    },
    { regex: /поверну(вся|лись)|верну(лся|лись)/iu, replacement: 'returned' },
    { regex: /стар(ий|і|ый|ые)/iu, replacement: 'old' },
    {
      regex: /супутник(и|ів|ах|ам|ами)|спутник(м|ов|ам|ами)/iu,
      replacement: 'satellites',
    },
    { regex: /супутник(у|а|ом)?|спутник(е|у|а)?/iu, replacement: 'satellite' },
    { regex: /зараз|сейчас/iu, replacement: 'now' },
    { regex: /знову|снова/iu, replacement: 'again' },
    { regex: /на/iu, replacement: 'on' },
  ];

  return replacements.reduce(
    (acc, { regex, replacement }) => acc.replace(regex, replacement),
    text
  );
};

const updateDataInBatches = async (
  data: { id: string; text_en: string }[],
  tblName: string
) => {
  const extractErrors = [];
  if (!data || data.length === 0)
    return [new Error('Error: Received empty data for batch update')];

  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const sql = `
      UPDATE ${tblName}
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

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQuery = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);
  const year = parseInt(searchQuery, 10) || 0;
  let tblName = 'tbl_digest';
  if (year) tblName += `_${year}`;

  const sql = `SELECT id, text FROM ${tblName}`;

  const oldData = await poolExecute<{ id: string; text: string }[]>(sql);
  if (oldData instanceof Error) return JSON.stringify(oldData);

  const translatedRows = oldData.map((row) => ({
    id: row.id,
    text_en: translateToEnglish(row.text),
  }));

  const insertRes = await updateDataInBatches(translatedRows, tblName);

  if (insertRes.length > 0) return JSON.stringify(insertRes);

  return JSON.stringify(insertRes);
}
