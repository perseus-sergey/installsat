export const satSql = `
SELECT title, id, position, grade
FROM tbl_chan_sat
WHERE title!=''
ORDER BY grade
`;

export interface ISat {
  id: number;
  parent: number;
  title: number;
  cpu: string;
  description: string;
  position: string;
  grade: number;
  map_img: string;
  logo: string;
  view: number;
  fill: number;
}
