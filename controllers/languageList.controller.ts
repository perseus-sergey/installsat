import { poolExecute } from '@/libs/db/mysqldb';
import { DB_ARRAY_SEPARATOR } from '@/models/channels/channel.model';
import { IStateOption } from '@/models/satDigest.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { audioLanguages, wrongAudio } from '@cron/libs/languages.mjs';
import { cache } from 'react';

const { FLY_CHANNELS, FLY_SATELLITES } = EDBTableTitles;

interface IGradeSlug {
  satGrades?: string[];
  satSlug?: string;
}

const getDBChannelsAudio = cache(async ({ satGrades, satSlug }: IGradeSlug) => {
  let where = 'sat.grade = 0';
  if (satGrades) {
    where = `sat.grade IN ("${satGrades.join('","')}")`;
  } else if (satSlug) {
    where = `ch.sat_slug = "${satSlug}"`;
  }

  const sql = `
    SELECT ch.a_pid
    FROM ${FLY_CHANNELS} AS ch 
    LEFT JOIN ${FLY_SATELLITES} AS sat ON ch.sat_slug = sat.slug 
    WHERE ${where}
    AND ch.is_removed != 1
  `;
  const resp = await poolExecute<{ a_pid: string }[]>(sql);

  return resp instanceof Error || resp.length === 0 ? [] : resp;
});

export interface ILanguageObjects {
  value: string;
  label: string;
}

export const getLanguageList = (audioPids: string[]): ILanguageObjects[] => {
  const langsSet = new Set<string>();

  const addToSet = (value: string) => {
    const langPart = value.trim().toLowerCase();

    if (isNaN(Number(langPart)) && !wrongAudio.includes(langPart)) {
      langsSet.add(langPart);
    }
  };

  audioPids.forEach((aPid) => {
    const aPidParts = aPid.split(DB_ARRAY_SEPARATOR);

    aPidParts.forEach((part) => {
      const parts = part.trim().split(/\s+/);

      if (parts[1]) {
        addToSet(parts[1]);
      } else {
        addToSet(parts[0]);
      }
    });
  });

  return Array.from(langsSet)
    .sort()
    .map((lang) => ({
      value: lang,
      label: (audioLanguages as Record<string, string>)[lang] || lang,
    }));
};

export const getChannelsLangList = async ({
  satGrades,
  satSlug,
}: IGradeSlug): Promise<IStateOption[]> => {
  const dbAudioList = await getDBChannelsAudio({
    satGrades,
    satSlug,
  });

  const audioPids = dbAudioList.map((item) => item.a_pid);

  const langList = getLanguageList(audioPids);

  return langList;
};
