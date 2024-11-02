import { z } from 'zod';

export enum EChannelEditFields {
  title = 'title',
  logo = 'logo',
  chan_slug = 'chan_slug',
  text = 'text',
  text_en = 'text_en',
  description = 'description',
  description_en = 'description_en',
  keywords = 'keywords',
  keywords_en = 'keywords_en',
  cat_id = 'cat_id',
  parent_cat_id = 'parent_cat_id',
  canonical = 'canonical',
  sat_id = 'sat_id',
  frequency_id = 'frequency_id',
  beam_id = 'beam_id',
  genre_id = 'genre_id',
  lang_id = 'lang_id',
  compress_id = 'compress_id',
  country_id = 'country_id',
  url = 'url',
  biss = 'biss',
  ip_deny = 'ip_deny',
  no_googlads = 'no_googlads',
  encryption_id = 'encryption_id',
  vsetv = 'vsetv',
  vipiko = 'vipiko',
  potok = 'potok',
  pars_uppod = 'pars_uppod',
  pattern = 'pattern',
  tvforsite_net = 'tvforsite_net',
  other_stream = 'other_stream',
  mark = 'mark',
}

const zodEmptyOr2 = z
  .string()
  .transform((val) => val.trim())
  .refine((val) => val === '' || val.length >= 2, {
    message: 'Must be EMPTY || 2+ characters',
  });

export const editChannelSchema = z.object({
  [EChannelEditFields.title]: z.string().min(2).trim(),
  [EChannelEditFields.chan_slug]: z.string().min(2).trim(),
  [EChannelEditFields.description]: z.string().min(2).trim(),
  [EChannelEditFields.text]: z.string().min(2).trim(),
  [EChannelEditFields.text_en]: z.string().min(2).trim(),
  [EChannelEditFields.description_en]: z.string().min(2).trim(),
  [EChannelEditFields.keywords]: z.string().min(2).trim(),
  [EChannelEditFields.keywords_en]: z.string().min(2).trim(),

  //   [EChannelEditFields.cat_id]: z.number().min(1).minValue(1),
  [EChannelEditFields.cat_id]: z.coerce
    .number()
    .min(1, 'Choose relative category'),

  [EChannelEditFields.canonical]: z.string().min(2).trim(),
  [EChannelEditFields.genre_id]: z.coerce.number(),
  [EChannelEditFields.lang_id]: z.coerce.number(),
  [EChannelEditFields.compress_id]: z.coerce.number(),
  [EChannelEditFields.country_id]: z.coerce.number(),
  [EChannelEditFields.no_googlads]: z.coerce.number(),

  [EChannelEditFields.parent_cat_id]: z.coerce.number().optional(),
  [EChannelEditFields.sat_id]: z.coerce
    .number({ message: 'Satellite should be number!' })
    .optional(),
  [EChannelEditFields.frequency_id]: z.coerce
    .number({ message: 'Frequency should be number!' })
    .optional(),
  [EChannelEditFields.beam_id]: z.coerce
    .number({ message: 'Beam should be number!' })
    .optional(),
  [EChannelEditFields.ip_deny]: z.coerce.number().optional(),
  [EChannelEditFields.encryption_id]: z.coerce.number().optional(),
  [EChannelEditFields.vsetv]: z.coerce.number().optional(),
  [EChannelEditFields.vipiko]: z.coerce.number().optional(),

  [EChannelEditFields.logo]: z.string().trim().optional(),
  [EChannelEditFields.url]: z.string().trim().optional(),
  [EChannelEditFields.biss]: z.string().trim().optional(),
  [EChannelEditFields.potok]: zodEmptyOr2,
  [EChannelEditFields.pars_uppod]: zodEmptyOr2,
  [EChannelEditFields.pattern]: zodEmptyOr2,
  [EChannelEditFields.tvforsite_net]: zodEmptyOr2,
  [EChannelEditFields.other_stream]: zodEmptyOr2,
  [EChannelEditFields.mark]: z.string().trim().optional(),
});
export type TChannelEditModel = z.infer<typeof editChannelSchema>;
