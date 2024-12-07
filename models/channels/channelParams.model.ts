import { localeStringMaker } from '@/libs/utils/localeStringMaker';
import { ELanguage } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';
import { TDbBoolean } from './channel.model';
import { getLanguageList } from '@/controllers/languageList.controller';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const CHANNEL_PARAMS_BLOCK = {
  getParamsTitle(channelTitle: string) {
    return {
      [UA]: `Параметри мовлення каналу "${channelTitle}"`,
      [EN]: `Broadcast options for channel "${channelTitle}"`,
      [RU]: `Параметры трансляции канала "${channelTitle}"`,
      [ES]: `Opciones de transmisión para el canal "${channelTitle}"`,
      [AR]: `خيارات البث للقناة "${channelTitle}"`,
      [DE]: `Übertragungsoptionen für den Kanal "${channelTitle}"`,
      [FR]: `Options de diffusion pour la chaîne "${channelTitle}"`,
      [IT]: `Opzioni di trasmissione per il canale "${channelTitle}"`,
    };
  },
  paramsLanguage: {
    [UA]: `Мова мовлення (перекладу)`,
    [EN]: `Broadcast (translation) language`,
    [RU]: `Язык трансляции (перевода)`,
    [ES]: `Idioma de transmisión (traducción)`,
    [AR]: `لغة البث (الترجمة)`,
    [DE]: `Übertragungssprache (Übersetzung)`,
    [FR]: `Langue de diffusion (traduction)`,
    [IT]: `Lingua di trasmissione (traduzione)`,
  },
  paramsFormat: {
    [UA]: `Формат мовлення`,
    [EN]: `Broadcast format`,
    [RU]: `Формат трансляции`,
    [ES]: `Formato de transmisión`,
    [AR]: `تنسيق البث`,
    [DE]: `Übertragungsformat`,
    [FR]: `Format de diffusion`,
    [IT]: `Formato di trasmissione`,
  },
  paramsStandard: {
    [UA]: `Стандарт мовлення`,
    [EN]: `Broadcast Standard`,
    [RU]: `Стандарт трансляции`,
    [ES]: `Estándar de transmisión`,
    [AR]: `معيار البث`,
    [DE]: `Übertragungsstandard`,
    [FR]: `Norme de diffusion`,
    [IT]: `Standard di trasmissione`,
  },
  paramsSatellite: {
    [UA]: `Супутник`,
    [EN]: `Satellite`,
    [RU]: `Спутник`,
    [ES]: `Satélite`,
    [AR]: `القمر الصناعي`,
    [DE]: `Satellit`,
    [FR]: `Satellite`,
    [IT]: `Satellite`,
  },
  paramsFrequency: {
    [UA]: `Частота`,
    [EN]: `Frequency`,
    [RU]: `Частота`,
    [ES]: `Frecuencia`,
    [AR]: `التردد`,
    [DE]: `Frequenz`,
    [FR]: `Fréquence`,
    [IT]: `Frequenza`,
  },
  paramsFEC: {
    [UA]: `FEC`,
    [EN]: `FEC`,
    [RU]: `FEC`,
    [ES]: `FEC`,
    [AR]: `FEC`,
    [DE]: `FEC`,
    [FR]: `FEC`,
    [IT]: `FEC`,
  },
  paramsEncryption: {
    [UA]: `Шифрування`,
    [EN]: `Encryption`,
    [RU]: `Шифрование`,
    [ES]: `Cifrado`,
    [AR]: `تشفير`,
    [DE]: `Verschlüsselung`,
    [FR]: `Chiffrement`,
    [IT]: `Crittografia`,
  },
  paramsTypeTitle: {
    [UA]: `Тип`,
    [EN]: `Type`,
    [RU]: `Тип`,
    [ES]: `Tipo`,
    [AR]: `نوع`,
    [DE]: `Typ`,
    [FR]: `Type`,
    [IT]: `Tipo`,
  },

  paramsLangTitle: {
    [UA]: `Мова`,
    [EN]: `Languages`,
    [RU]: `Язык`,
    [ES]: `Idiomas`,
    [AR]: `لغات`,
    [DE]: `Sprachen`,
    [FR]: `Langues`,
    [IT]: `Lingue`,
  },

  paramsBandTitle: {
    [UA]: `Діапазон`,
    [EN]: `Band`,
    [RU]: `Диапазон`,
    [ES]: `Banda`,
    [AR]: `نطاق`,
    [DE]: `Band`,
    [FR]: `Bande`,
    [IT]: `Banda`,
  },

  paramsPolarizationTitle: {
    [UA]: `Поляризація`,
    [EN]: `Polarization`,
    [RU]: `Поляризация`,
    [ES]: `Polarización`,
    [AR]: `استقطاب`,
    [DE]: `Polarisation`,
    [FR]: `Polarisation`,
    [IT]: `Polarizzazione`,
  },

  paramsFecTooltip: {
    [UA]: 'Коефіцієнт корекції помилок',
    [EN]: 'Forward Error Correction',
    [RU]: 'Коэффициент коррекции ошибок',
    [ES]: 'Corrección de errores hacia adelante',
    [AR]: 'تصحيح الخطأ الأمامي',
    [DE]: 'Vorwärtsfehlerkorrektur',
    [FR]: "Correction d'erreur de transmission",
    [IT]: 'Correzione degli errori in avanti',
  },

  paramsAPid: {
    tooltip: {
      [UA]: 'Унікальний ідентифікатор потоку аудіо',
      [EN]: 'Audio Packet Identifier',
      [RU]: 'Уникальный идентификатор аудиопотока',
      [ES]: 'Identificador de paquete de audio',
      [AR]: 'معرّف حزمة الصوت',
      [DE]: 'Audio-Paketkennung',
      [FR]: 'Identifiant de paquet audio',
      [IT]: 'Identificatore di pacchetto audio',
    },
    title: {
      [UA]: 'Аудіо PID',
      [EN]: 'Audio PId',
      [RU]: 'Аудио PID',
      [ES]: 'Audio PID',
      [AR]: 'معرّف PID الصوتي',
      [DE]: 'Audio-PID',
      [FR]: 'PID audio',
      [IT]: 'PID audio',
    },
  },

  paramsVPid: {
    tooltip: {
      [UA]: 'Унікальний ідентифікатор потоку відео',
      [EN]: 'Video Packet Identifier',
      [RU]: 'Уникальный идентификатор видеопотока',
      [ES]: 'Identificador de paquete de video',
      [AR]: 'معرف حزمة الفيديو',
      [DE]: 'Video-Paket-Identifikator',
      [FR]: 'Identifiant de paquet vidéo',
      [IT]: 'Identificatore pacchetto video',
    },
    title: {
      [UA]: 'Відео PId',
      [EN]: 'Video PId',
      [RU]: 'Видео PId',
      [ES]: 'PId de Video',
      [AR]: 'معرف الفيديو',
      [DE]: 'Video-PId',
      [FR]: 'PId Vidéo',
      [IT]: 'PId Video',
    },
  },

  paramsFreqDescription: {
    [UA]: `ГГц`,
    [EN]: `GHz`,
    [RU]: `ГГц`,
    [ES]: `GHz`,
    [AR]: `غز`,
    [DE]: `GHz`,
    [FR]: `GHz`,
    [IT]: `GHz`,
  },

  getSatLinkTitle(satTitle: string) {
    return {
      [UA]: `Перейти до перегляду списку каналів, що транслюються з супутника "${satTitle}"`,
      [EN]: `Go to view the list of channels broadcast from the "${satTitle}" satellite`,
      [RU]: `Перейти к просмотру списка каналов, транслируемых со спутника "${satTitle}"`,
      [ES]: `Ir a ver la lista de canales transmitidos desde el satélite "${satTitle}"`,
      [AR]: `انتقل لعرض قائمة القنوات التي تبث من القمر الصناعي "${satTitle}"`,
      [DE]: `Gehe zur Ansicht der Liste der von dem Satelliten "${satTitle}" ausgestrahlten Kanäle`,
      [FR]: `Allez voir la liste des chaînes diffusées par le satellite "${satTitle}"`,
      [IT]: `Vai a vedere l'elenco dei canali trasmessi dal satellite "${satTitle}"`,
    };
  },

  paramsT2: {
    tooltipText: {
      [UA]: `Потік для цифрового ефірного телебачення`,
      [EN]: `For second Generation Terrestrial`,
      [RU]: `Поток для цифрового эфирного телевидения`,
      [ES]: `Flujo para televisión terrestre de segunda generación`,
      [AR]: `تدفق للتلفزيون الأرضي من الجيل الثاني`,
      [DE]: `Stream für terrestrisches Fernsehen der zweiten Generation`,
      [FR]: `Flux pour la télévision terrestre de deuxième génération`,
      [IT]: `Flusso per la televisione terrestre di seconda generazione`,
    },
    title: {
      [UA]: `Потік для DVB-T2`,
      [EN]: `Stream for DVB-T2`,
      [RU]: `Поток для DVB-T2`,
      [ES]: `Flujo para DVB-T2`,
      [AR]: `تدفق لـ DVB-T2`,
      [DE]: `Stream für DVB-T2`,
      [FR]: `Flux pour DVB-T2`,
      [IT]: `Flusso per DVB-T2`,
    },
  },

  paramsSR: {
    tooltipText: {
      [UA]: `Символьна швидкість`,
      [EN]: `Symbol Rate`,
      [RU]: `Символьная скорость`,
      [ES]: `Tasa de símbolo`,
      [AR]: `معدل الرمز`,
      [DE]: `Symbolrate`,
      [FR]: `Taux de symbole`,
      [IT]: `Tasso simbolico`,
    },
    description: {
      [UA]: `симв/сек`,
      [EN]: `symb/sec`,
      [RU]: `симв/сек`,
      [ES]: `símb/sec`,
      [AR]: `رمز/ثانية`,
      [DE]: `Symb/s`,
      [FR]: `symb/sec`,
      [IT]: `simboli/sec`,
    },
  },

  getParamsSite(channelTitle: string) {
    return {
      [UA]: `Сайт каналу "${channelTitle}"`,
      [EN]: `Channel website "${channelTitle}"`,
      [RU]: `Сайт канала "${channelTitle}"`,
      [ES]: `Sitio web del canal "${channelTitle}"`,
      [AR]: `موقع القناة "${channelTitle}"`,
      [DE]: `Website des Kanals "${channelTitle}"`,
      [FR]: `Site web de la chaîne "${channelTitle}"`,
      [IT]: `Sito web del canale "${channelTitle}"`,
    };
  },
};

export const getPolarDescription = (polarization: string, lang: ELanguage) => {
  const descriptions = {
    h: {
      [UA]: 'Горизонтальна',
      [EN]: 'Horizontal',
      [RU]: 'Горизонтальная',
      [ES]: 'Horizontal',
      [AR]: 'أفقي',
      [DE]: 'Horizontal',
      [FR]: 'Horizontal',
      [IT]: 'Orizzontale',
    },
    v: {
      [UA]: 'Вертикальна',
      [EN]: 'Vertical',
      [RU]: 'Вертикальная',
      [ES]: 'Vertical',
      [AR]: 'عمودي',
      [DE]: 'Vertikal',
      [FR]: 'Verticale',
      [IT]: 'Verticale',
    },
    r: {
      [UA]: 'Права',
      [EN]: 'Right',
      [RU]: 'Правая',
      [ES]: 'Derecha',
      [AR]: 'يمين',
      [DE]: 'Rechts',
      [FR]: 'Droite',
      [IT]: 'Destra',
    },
    l: {
      [UA]: 'Ліва',
      [EN]: 'Left',
      [RU]: 'Левая',
      [ES]: 'Izquierda',
      [AR]: 'يسار',
      [DE]: 'Links',
      [FR]: 'Gauche',
      [IT]: 'Sinistra',
    },
  };

  const polarizationKey =
    polarization.toLowerCase() as keyof typeof descriptions;
  const langKey = lang as keyof (typeof descriptions)['h'];

  return descriptions[polarizationKey]?.[langKey] || '';
};
export const getChannelScheduleLinkTitle = (title: string) => ({
  [UA]: `Дивитись розклад передач каналу "${title}" на сьогодні`,
  [EN]: `Watch the program schedule of channel "${title}" for today`,
  [RU]: `Смотреть расписание передач канала "${title}" на сегодня`,
  [ES]: `Ver el horario del canal "${title}" para hoy`,
  [AR]: `شاهد جدول برامج قناة "${title}" لليوم`,
  [DE]: `Das Programm des Senders "${title}" für heute ansehen`,
  [FR]: `Regarder le programme de la chaîne "${title}" pour aujourd'hui`,
  [IT]: `Guarda il programma del canale "${title}" per oggi`,
});

export const getSimilarSatChannelsTitle = (
  satTitle: string,
  chanName: string
) => ({
  [UA]: `Дивитись параметри каналу "${chanName}" на супутнику "${satTitle}"`,
  [EN]: `Watch "${chanName}" channel parameters on satellite "${satTitle}"`,
  [RU]: `Смотреть параметры канала "${chanName}" на спутнике "${satTitle}"`,
  [ES]: `Ver los parámetros del canal "${chanName}" en el satélite "${satTitle}"`,
  [AR]: `شاهد معلمات قناة "${chanName}" على القمر الصناعي "${satTitle}"`,
  [DE]: `Parameter des Kanals "${chanName}" auf dem Satelliten "${satTitle}" ansehen`,
  [FR]: `Voir les paramètres de la chaîne "${chanName}" sur le satellite "${satTitle}"`,
  [IT]: `Guarda i parametri del canale "${chanName}" sul satellite "${satTitle}"`,
});

export const getSimilarPackageChannelsTitle = (
  packageTitle: string,
  chanName: string
) => ({
  [UA]: `Дивитись параметри каналу "${chanName}" в пакеті "${packageTitle}"`,
  [EN]: `Watch "${chanName}" channel parameters in package "${packageTitle}"`,
  [RU]: `Смотреть параметры канала "${chanName}" в пакете "${packageTitle}"`,
  [ES]: `Ver los parámetros del canal "${chanName}" en el paquete "${packageTitle}"`,
  [AR]: `شاهد معلمات قناة "${chanName}" في الحزمة "${packageTitle}"`,
  [DE]: `Parameter des Kanals "${chanName}" im Paket "${packageTitle}" ansehen`,
  [FR]: `Voir les paramètres de la chaîne "${chanName}" dans le package "${packageTitle}"`,
  [IT]: `Guarda i parametri del canale "${chanName}" nel pacchetto "${packageTitle}"`,
});

export const BREAD_SAT_CHANNEL_LIST = {
  href: EUrlBaseParam.SAT_CHANNEL_LIST,
  title: {
    [UA]: 'Список каналів супутників',
    [EN]: 'List of satellite channels',
    [RU]: 'Список спутниковых каналов',
    [ES]: 'Lista de canales satelitales',
    [AR]: 'قائمة القنوات الفضائية',
    [DE]: 'Liste der Satellitenkanäle',
    [FR]: 'Liste des chaînes satellites',
    [IT]: 'Elenco dei canali satellitari',
  },
};

export const getDefaultChannelKeywords = ({
  lang,
  title,
  is_radio,
  sat_title,
  sat_position,
  frequency,
  polarization,
  t2_stream,
  encryptions,
  compress,
  modeList,
  v_pid,
}: {
  title: string;
  lang: ELanguage;
  is_radio: TDbBoolean;
  sat_title: string;
  sat_position: number;
  frequency: number;
  polarization: string;
  t2_stream: string | null;
  encryptions: string;
  compress: string;
  modeList: string;
  v_pid: number | null;
}) => {
  return `${CHANNEL_PARAMS_BLOCK.getParamsTitle(title)[lang]}, ${is_radio ? 'Radio' : 'TV'}, ${sat_title ? `${CHANNEL_PARAMS_BLOCK.paramsSatellite[lang]}, ${sat_title} / ${sat_position}` : ''}, ${CHANNEL_PARAMS_BLOCK.paramsBandTitle[lang]}, ${frequency < 10700 ? 'C' : 'Ku'}, ${CHANNEL_PARAMS_BLOCK.paramsFrequency[lang]}, ${localeStringMaker(frequency)} ${CHANNEL_PARAMS_BLOCK.paramsFreqDescription[lang]}, ${polarization ? `${CHANNEL_PARAMS_BLOCK.paramsPolarizationTitle[lang]}, ${getPolarDescription(polarization, lang)}` : ''}, ${t2_stream ? `${CHANNEL_PARAMS_BLOCK.paramsT2.title[lang]}, ${t2_stream}` : ''}, ${encryptions ? `${CHANNEL_PARAMS_BLOCK.paramsEncryption[lang]}, ${encryptions}` : ''}, ${compress ? `${CHANNEL_PARAMS_BLOCK.paramsFormat[lang]}, ${compress}` : ''}, ${CHANNEL_PARAMS_BLOCK.paramsStandard[lang]}, ${modeList || ''}, ${CHANNEL_PARAMS_BLOCK.paramsSR.tooltipText[lang]}, ${CHANNEL_PARAMS_BLOCK.paramsFecTooltip[lang]}, ${v_pid ? CHANNEL_PARAMS_BLOCK.paramsVPid.title[lang] : ''}, ${CHANNEL_PARAMS_BLOCK.paramsAPid.title[lang]}`;
};

export const getDefaultChannelDescription = ({
  lang,
  title,
  is_radio,
  sat_title,
  sat_position,
  frequency,
  polarization,
  t2_stream,
  encryptions,
  compress,
  modeList,
  v_pid,
  aPidList,
  sr,
  fec,
  sid,
}: {
  title: string;
  lang: ELanguage;
  is_radio: TDbBoolean;
  sat_title: string;
  sat_position: number;
  frequency: number;
  polarization: string;
  t2_stream: string | null;
  encryptions: string;
  compress: string;
  modeList: string;
  v_pid: number | null;
  aPidList: string[];
  sr: number;
  fec: string;
  sid: number | null;
}) => {
  const languageObjects = getLanguageList(aPidList);

  return `
    ${CHANNEL_PARAMS_BLOCK.getParamsTitle(title)[lang]}
    ${CHANNEL_PARAMS_BLOCK.paramsTypeTitle[lang]}: ${is_radio ? 'Radio' : 'TV'}
    ${languageObjects.length > 0 ? `${CHANNEL_PARAMS_BLOCK.paramsLangTitle[lang]}: ${languageObjects.map((item) => item.label).join(', ')}` : ''}
    ${t2_stream ? `${CHANNEL_PARAMS_BLOCK.paramsT2.title[lang]}: ${t2_stream}` : ''}
    ${encryptions ? `${CHANNEL_PARAMS_BLOCK.paramsEncryption[lang]}: ${encryptions}` : ''}
    ${compress ? `${CHANNEL_PARAMS_BLOCK.paramsFormat[lang]}: ${compress}` : ''}
    ${modeList ? `${CHANNEL_PARAMS_BLOCK.paramsStandard[lang]}: ${modeList} ` : ''}
    ${sat_title ? `${CHANNEL_PARAMS_BLOCK.paramsSatellite[lang]}: ${sat_title} / ${sat_position}` : ''}
    ${CHANNEL_PARAMS_BLOCK.paramsBandTitle[lang]}: ${frequency < 10700 ? 'C' : 'Ku'}
    ${frequency ? `${CHANNEL_PARAMS_BLOCK.paramsFrequency[lang]}: ${localeStringMaker(frequency)} ${CHANNEL_PARAMS_BLOCK.paramsFreqDescription[lang]}` : ''}
    ${polarization ? `${CHANNEL_PARAMS_BLOCK.paramsPolarizationTitle[lang]}: ${getPolarDescription(polarization, lang)}` : ''}
    ${sr ? `SR: ${localeStringMaker(sr)} ${CHANNEL_PARAMS_BLOCK.paramsSR.description[lang]}` : ''}
    ${fec ? `${CHANNEL_PARAMS_BLOCK.paramsFEC[lang]}: ${fec}` : ''}
    ${sid ? `SID: ${localeStringMaker(sid)}` : ''}
    ${v_pid ? `${CHANNEL_PARAMS_BLOCK.paramsVPid.title[lang]}: ${localeStringMaker(v_pid)}` : ''}
    ${aPidList.length > 0 ? `${CHANNEL_PARAMS_BLOCK.paramsAPid.title[lang]}: ${aPidList.map((a) => `'${a.replace(/\s+/g, ' ')}'`).join(', ')}` : ''}
    `;
};
