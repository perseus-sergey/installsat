import { poolExecute } from '@/libs/db/mysqldb';
import { IAllMapsModel, IMapModel } from '@/models/mapCoverage.model';
import { decode } from 'html-entities';
import { cache } from 'react';

export const satMapListSql = `
  SELECT 
    MAX(b.id) AS beam_id,
    s.id,
    s.title,
    s.description,
    s.cpu,
    s.logo,
    s.view,
    s.position,
    MAX(C.comment_count) AS comment_count
  FROM tbl_chan_beam AS b
  LEFT JOIN tbl_chan_sat AS s ON b.sat = s.id
  LEFT JOIN (
      SELECT post, COUNT(id) AS comment_count 
      FROM tbl_comments_maps 
      GROUP BY post
  ) AS C ON s.id = C.post
  WHERE b.map_img != ''
  GROUP BY s.id, s.title, s.description, s.cpu, s.logo, s.view, s.position, s.grade
  ORDER BY s.grade;
`;

export const getSatMapList = cache(async () => {
  const res = await poolExecute<IAllMapsModel[]>(satMapListSql);

  return res instanceof Error
    ? []
    : res.map((r) => ({
        ...r,
        title: decode(r.title),
        description: decode(r.description),
        position: decode(r.position),
      }));
});

export const getSatMap = cache(async (slug: string) => {
  const sql = `
  SELECT 
    s.id AS sat_id,
    s.title AS sat_title,
    s.position,
    s.view,
    s.logo,
    s.grade,

    b.title AS beam_title,
    b.description AS beam_description,
    b.cpu AS beam_slug,
    b.map_img
  FROM tbl_chan_sat AS s
  JOIN tbl_chan_beam AS b ON s.id = b.sat
  WHERE s.cpu = ?
  AND b.map_img != ''
`;
  const res = await poolExecute<IMapModel[]>(sql, [slug]);

  return res instanceof Error ? [] : res;
});
