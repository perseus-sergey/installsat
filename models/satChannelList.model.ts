import { ILang } from './ui.model';

export const META_SAT_CHANNEL_LIST = {
  getH1(dateStr: string) {
    return `Транспондерні новини за ${dateStr}`;
    // return `Транспондерні новини за ${getDate(date, lang)}`;
  },
  h1DefaultImagePath: 'images/satellite_7144.png',
  getTitle() {
    return {
      ua: 'Список каналів супутника',
      en: 'List of satellite channels',
    };
  },
  getKeywords(lang: keyof ILang) {
    return `${this.getTitle()[lang]} ${this.getDescription()[lang]}`;
  },
  getDescription() {
    return {
      ua: 'Список доступних некодованих каналів, які ведуть мовлення з супутника',
      en: 'List of available unencrypted channels broadcast from satellite',
    };
  },
};

export const START_CONTENT = `В приведенном списке показаны только те каналы, которые транслируются без абонентской платы<br />
Более детальное описание интересующих каналов, а также программу передач для многих из них можно увидеть, 
кликнув левой кнопкой мыши на соответствующем логотипе выбранного канала.`;

const satChannelListEmptyModel = {
  id: -1,
  title: '',
  cpu: '',
  frequency: '',
  tema: -1,
  logo: '',
  programma: -1,
  encryption: '',
  biss: '',
  description: '',
  freq: -1,
  sr: -1,
  fec: '',
  polar: '',
  beam: '',
  tem: '',
  compr: '',
  lan: '',
};

export type TSatChannelListModel = typeof satChannelListEmptyModel;
