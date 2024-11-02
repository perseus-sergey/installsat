import { ELanguage } from '../language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const META_CHANNEL = {
  getH1(satTitle: string) {
    return {
      [UA]: `Безкоштовні канали з супутника ${satTitle}`,
      [EN]: `Free satellite channels on ${satTitle}`,
      [RU]: `Бесплатные спутниковые каналы на ${satTitle}`,
      [ES]: `Canales satelitales gratuitos en ${satTitle}`,
      [AR]: `قنوات مجانية على القمر الصناعي ${satTitle}`,
      [DE]: `Kostenlose Satellitenkanäle auf ${satTitle}`,
      [FR]: `Chaînes satellites gratuites sur ${satTitle}`,
      [IT]: `Canali satellitari gratuiti su ${satTitle}`,
    };
  },
  getTitle() {
    return {
      [UA]: 'Список каналів супутника',
      [EN]: 'List of satellite channels',
      [RU]: 'Список спутниковых каналов',
      [ES]: 'Lista de canales satelitales',
      [AR]: 'قائمة قنوات الأقمار الصناعية',
      [DE]: 'Liste der Satellitenkanäle',
      [FR]: 'Liste des chaînes satellites',
      [IT]: 'Elenco dei canali satellitari',
    };
  },
  titleBefore: {
    [UA]: `Канал`,
    [EN]: `Channel`,
    [RU]: `Канал`,
    [ES]: `Canal`,
    [AR]: `قناة`,
    [DE]: `Kanal`,
    [FR]: `Chaîne`,
    [IT]: `Canale`,
  },
  preText: {
    [UA]: `Канал відключено/закодовано на поточних параметрах`,
    [EN]: `Channel is disabled/encoded on current parameters`,
    [RU]: `Канал отключен/закодирован по текущим параметрам`,
    [ES]: `El canal está deshabilitado/codificado en los parámetros actuales`,
    [AR]: `القناة معطلة/مشفرة على المعلمات الحالية`,
    [DE]: `Der Kanal ist deaktiviert/verschlüsselt bei aktuellen Parametern`,
    [FR]: `La chaîne est désactivée/chiffrée avec les paramètres actuels`,
    [IT]: `Il canale è disabilitato/codificato con i parametri attuali`,
  },
  keywordsBefore: {
    [UA]: `Телевізійний канал `,
    [EN]: `Television channel `,
    [RU]: `Телевизионный канал `,
    [ES]: `Canal de televisión `,
    [AR]: `قناة تلفزيونية `,
    [DE]: `Fernsehkanal `,
    [FR]: `Chaîne de télévision `,
    [IT]: `Canale televisivo `,
  },
};

export const CHANNEL_IMAGES = {
  channelLogo: {
    big: {
      path: '/Images/channelsOptimized/',
      height: 99,
      width: 132,
      defaultImage: {
        src: '/Images/channelsOptimized/channel_placeholder_99-132.png',
        height: 99,
        width: 132,
      },
      alt: {
        [UA]: `Логотип каналу`,
        [EN]: `Logo of the channel`,
        [RU]: `Логотип канала`,
        [ES]: `Logo del canal`,
        [AR]: `شعار القناة`,
        [DE]: `Logo des Kanals`,
        [FR]: `Logo de la chaîne`,
        [IT]: `Logo del canale`,
      },
    },
    small: {
      path: '/Images/channel_55/',
      height: 42,
      width: 55,
      defaultImage: {
        src: '/Images/channel_55/channel_placeholder_55-42.gif',
        height: 42,
        width: 55,
      },
    },
  },
};

export const SCHEDULE_LINK = {
  scheduleImgAlt: {
    [UA]: `Іконка з зображенням бобіни з телевізійною плівкою і документу зі списком`,
    [EN]: `An icon depicting a reel of television film and a document with a list`,
    [RU]: `Иконка с изображением катушки с телевизионной пленкой и документа со списком`,
    [ES]: `Un ícono que representa un carrete de película de televisión y un documento con una lista`,
    [AR]: `أيقونة تصور بكرة من فيلم التلفزيون ووثيقة تحتوي على قائمة`,
    [DE]: `Ein Symbol, das eine Filmrolle und ein Dokument mit einer Liste darstellt`,
    [FR]: `Une icône représentant une bobine de film télévisé et un document avec une liste`,
    [IT]: `Un'icona che raffigura una bobina di film televisivo e un documento con un elenco`,
  },
  scheduleLinkText: {
    channel: {
      [UA]: 'Телепрограма на',
      [EN]: 'TV Schedule for',
      [RU]: 'Телепрограмма на',
      [ES]: 'Horario de TV para',
      [AR]: 'جدول التلفزيون لـ',
      [DE]: 'TV-Programm für',
      [FR]: 'Programme TV pour',
      [IT]: 'Programma TV per',
    },
    onlineChannel: {
      [UA]: 'Повна програма',
      [EN]: 'Full Schedule',
      [RU]: 'Полное расписание',
      [ES]: 'Horario completo',
      [AR]: 'جدول كامل',
      [DE]: 'Vollständiger Zeitplan',
      [FR]: 'Horaire complet',
      [IT]: 'Programma completo',
    },
  },
};

export const ONLINE_CHANNEL_LINK = {
  imageAlt: {
    [UA]: 'Антена, що віщає сигнал',
    [EN]: 'Antenna broadcasting a signal',
    [RU]: 'Антенна, передающая сигнал',
    [ES]: 'Antena transmitiendo una señal',
    [AR]: 'هوائي يبث إشارة',
    [DE]: 'Antenne, die ein Signal sendet',
    [FR]: 'Antenne diffusant un signal',
    [IT]: 'Antenna che trasmette un segnale',
  },
  getOnlineLinkText(channelTitle: string) {
    return {
      [UA]: `Канал "${channelTitle}" онлайн`,
      [EN]: `Channel "${channelTitle}" online`,
      [RU]: `Канал "${channelTitle}" онлайн`,
      [ES]: `Canal "${channelTitle}" en línea`,
      [AR]: `القناة "${channelTitle}" على الإنترنت`,
      [DE]: `Kanal "${channelTitle}" online`,
      [FR]: `Chaîne "${channelTitle}" en ligne`,
      [IT]: `Canale "${channelTitle}" online`,
    };
  },
};

export const SIMILAR_ARTICLE_TITLE = {
  [UA]: 'Новини каналу:',
  [EN]: 'Channel news:',
  [RU]: 'Новости канала:',
  [ES]: 'Noticias del canal:',
  [AR]: 'أخبار القناة:',
  [DE]: 'Kanalnachrichten:',
  [FR]: 'Nouvelles de la chaîne:',
  [IT]: 'Notizie del canale:',
};

export const SIMILAR_CHANNELS_TITLE = {
  [UA]: 'Де дивитись',
  [EN]: 'Where to watch',
  [RU]: 'Где смотреть',
  [ES]: 'Dónde ver',
  [AR]: 'أين تشاهد',
  [DE]: 'Wo zu sehen',
  [FR]: 'Où regarder',
  [IT]: 'Dove guardare',
};

export const SIMILAR_CHANNELS = {
  getSatChannelTitle(satTitle: string, satPosition: string | number) {
    return {
      [UA]: `Супутник: ${satTitle} ${satPosition}`,
      [EN]: `Satellite: ${satTitle} ${satPosition}`,
      [RU]: `Спутник: ${satTitle} ${satPosition}`,
      [ES]: `Satélite: ${satTitle} ${satPosition}`,
      [AR]: `القمر الصناعي: ${satTitle} ${satPosition}`,
      [DE]: `Satellit: ${satTitle} ${satPosition}`,
      [FR]: `Satellite: ${satTitle} ${satPosition}`,
      [IT]: `Satellite: ${satTitle} ${satPosition}`,
    };
  },
  getFrequencyTitle(frequency: number | string) {
    return {
      [UA]: `| Частота: ${frequency}`,
      [EN]: `| Frequency: ${frequency}`,
      [RU]: `| Частота: ${frequency}`,
      [ES]: `| Frecuencia: ${frequency}`,
      [AR]: `| التردد: ${frequency}`,
      [DE]: `| Frequenz: ${frequency}`,
      [FR]: `| Fréquence: ${frequency}`,
      [IT]: `| Frequenza: ${frequency}`,
    };
  },
  packageTitle: {
    [UA]: 'Пакет:',
    [EN]: 'Package:',
    [RU]: 'Пакет:',
    [ES]: 'Paquete:',
    [AR]: 'الحزمة:',
    [DE]: 'Paket:',
    [FR]: 'Paquet:',
    [IT]: 'Pacchetto:',
  },
};
