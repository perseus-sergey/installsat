import { poolExecute } from '@/libs/db/mysqldb';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';

const translateToEnglish = (text: string) => {
  const replacements = [
    { regex: /пакет/giu, replacement: 'package' },
    {
      regex: /транслюється відкрито|идет открыто/giu,
      replacement: 'free broadcasting',
    },
    {
      regex: /открыт/giu,
      replacement: 'FTA',
    },
    {
      regex: /возобновил\w*/giu,
      replacement: 'resumed',
    },
    {
      regex: /после перерыва/giu,
      replacement: 'after the break',
    },
    {
      regex: /(?<!\S)обновил[^\s]*/giu,
      replacement: 'updated',
    },
    {
      regex: /нова SR\(симв.+ швид.+\)/giu,
      replacement: 'new SR (symbol rate)',
    },
    { regex: /закодовано на|закодирован на/giu, replacement: 'encrypted on' },
    { regex: /закодирован/giu, replacement: 'encrypted on ' },
    { regex: /відновив мовлення/giu, replacement: 'restored broadcasting' },
    { regex: /Знову в пакеті/giu, replacement: 'restored in the package' },

    {
      regex: /розпочав тестове мовлення/giu,
      replacement: 'started test broadcasting',
    },
    {
      regex: /розпочав регулярне мовлення/giu,
      replacement: 'started regular broadcasting',
    },
    { regex: /розпочав транслювати/giu, replacement: 'started translating' },
    { regex: /розпочав мовлення/giu, replacement: 'started broadcasting' },
    {
      regex: /повернувся з новими параметрами/giu,
      replacement: 'returned with new parameters',
    },
    { regex: /після зникнення/giu, replacement: 'after disappearance' },
    {
      regex: /з'явився на супутнику|появился на спутнике/giu,
      replacement: 'appeared on the satellite',
    },
    {
      regex: /припинив трансляції|перестал транслироваться/giu,
      replacement: 'stopped broadcasting',
    },
    {
      regex: /змінилися параметри|изменились параметры/giu,
      replacement: 'parameters have changed',
    },
    { regex: /поверну(вся|лись)|верну(лся|лись)/giu, replacement: 'returned' },
    { regex: /стар(ий|і|ый|ые)/giu, replacement: 'old' },
    {
      regex: /супутник(и|ів|ах|ам|ами)|спутник(м|ов|ам|ами)/giu,
      replacement: 'satellites',
    },
    { regex: /супутник(у|а|ом)?|спутник(е|у|а)?/giu, replacement: 'satellite' },
    { regex: /вещание/giu, replacement: 'broadcasting' },
    { regex: /зараз|сейчас/giu, replacement: 'now' },
    { regex: /знову|снова/giu, replacement: 'again' },
    { regex: /(?<!\S)на/giu, replacement: 'on' },
  ];

  return replacements.reduce(
    (acc, { regex, replacement }) => acc.replaceAll(regex, replacement),
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
