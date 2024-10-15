export type TSearchParams = { [key: string]: string | string[] | undefined };

export enum EUrlSearchParam {
  ARTICLE = 'q',
  SAT = 'sat',
  CHANNEL = 'channel',
  INTERVAL = 'interval',
  PAGE = 'page',
  DATE = 'date',
  LANGUAGE_URL = 'lang',
  CHANNEL_FORMAT_T2MI = 't2-mi',
  CHANNEL_FORMAT_MPG4 = 'mpeg4',
  CHANNEL_NOT_ENCRYPTED = 'no-coded',
  CHANNEL_RADIO = 'radio',
  CHANNEL_C_BAND = 'c-band',
  LATITUDE = 'lat',
  LONGITUDE = 'lng',
  COMMENT_ID = 'comm-id',
  COMMENT_DEL_DB_TABLE = 't',
  COMMENT_DEL_ARTICLE_ID = 'i',
  COMMENT_DEL_ARTICLE_NAME = 'n',
  COMMENT_DEL_AUTHOR_EMAIL = 'm',
}
