import { cutText } from '@/libs/utils/cutText';
import { ELanguage } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const SIMILAR_ONLINE_CHANNELS_TITLE = {
  getOnlineChannelTitle(channelTitle: string) {
    return {
      [UA]: `Дивитись канал "${channelTitle}" у прямому ефірі онлайн`,
      [EN]: `Watch the channel "${channelTitle}" live online`,
      [RU]: `Смотреть канал "${channelTitle}" в прямом эфире онлайн`,
      [ES]: `Ver el canal "${channelTitle}" en vivo en línea`,
      [AR]: `شاهد القناة "${channelTitle}" مباشرة على الإنترنت`,
      [DE]: `Sehen Sie den Kanal "${channelTitle}" live online`,
      [FR]: `Regardez la chaîne "${channelTitle}" en direct en ligne`,
      [IT]: `Guarda il canale "${channelTitle}" in diretta online`,
    };
  },
};

export const META_CHANNEL_ONLINE = {
  getTitle(channelTitle: string) {
    return {
      [UA]: `${channelTitle} онлайн`,
      [EN]: `${channelTitle} online`,
      [RU]: `${channelTitle} онлайн`,
      [ES]: `${channelTitle} en línea`,
      [AR]: `${channelTitle} على الإنترنت`,
      [DE]: `${channelTitle} online`,
      [FR]: `${channelTitle} en direct`,
      [IT]: `${channelTitle} online`,
    };
  },
  getH1(channelTitle: string) {
    return {
      [UA]: `Канал «${channelTitle}» онлайн`,
      [EN]: `«${channelTitle}» channel online`,
      [RU]: `Канал «${channelTitle}» онлайн`,
      [ES]: `Canal «${channelTitle}» en línea`,
      [AR]: `قناة «${channelTitle}» على الإنترنت`,
      [DE]: `«${channelTitle}» Kanal online`,
      [FR]: `Chaîne «${channelTitle}» en direct`,
      [IT]: `Canale «${channelTitle}» online`,
    };
  },
  getDescription(channelTitle: string, description: string) {
    return {
      [UA]: `Дивіться онлайн канал ${channelTitle} безкоштовно у прямому ефірі. ${cutText(description, 120)}`,
      [EN]: `Watch the online channel ${channelTitle} for free live. ${cutText(description, 120)}`,
      [RU]: `Смотрите онлайн канал ${channelTitle} бесплатно в прямом эфире. ${cutText(description, 120)}`,
      [ES]: `Mire el canal ${channelTitle} en línea gratis en vivo. ${cutText(description, 120)}`,
      [AR]: `شاهد قناة ${channelTitle} على الإنترنت مجانًا مباشرة. ${cutText(description, 120)}`,
      [DE]: `Sehen Sie den Kanal ${channelTitle} online kostenlos live. ${cutText(description, 120)}`,
      [FR]: `Regardez le canal ${channelTitle} en ligne gratuitement en direct. ${cutText(description, 120)}`,
      [IT]: `Guarda il canale ${channelTitle} online gratuitamente in diretta. ${cutText(description, 120)}`,
    };
  },
  getKeywords(channelTitle: string) {
    return {
      [UA]: `${channelTitle} дивитись, онлайн, online, безкоштовно, тб, канал, прямий ефір, інтернет тб`,
      [EN]: `${channelTitle} watch, online, free, live, tv, channel, satellite, internet tv`,
      [RU]: `${channelTitle} смотреть, онлайн, бесплатно, прямой эфир, тв, канал, спутник, интернет тв`,
      [ES]: `${channelTitle} ver, en línea, gratis, en vivo, tv, canal, satélite, tv por internet`,
      [AR]: `${channelTitle} مشاهدة, على الإنترنت, مجانًا, مباشر, تلفاز, قناة, قمر صناعي, تلفاز عبر الإنترنت`,
      [DE]: `${channelTitle} ansehen, online, kostenlos, live, tv, kanal, satellit, internet tv`,
      [FR]: `${channelTitle} regarder, en direct, gratuit, tv, chaîne, satellite, tv par internet`,
      [IT]: `${channelTitle} guarda, online, gratis, in diretta, tv, canale, satellite, tv su internet`,
    };
  },
};

export const FAKE_PLAYER = {
  button: {
    ariaLabel: {
      [UA]: 'Перейти до перегляду',
      [EN]: 'Go to playback',
      [RU]: 'Перейти к просмотру',
      [ES]: 'Ir a la reproducción',
      [AR]: 'اذهب إلى العرض',
      [DE]: 'Zur Wiedergabe gehen',
      [FR]: 'Aller à la lecture',
      [IT]: 'Vai alla riproduzione',
    },
    titleStart: {
      [UA]: 'Дивитись онлайн',
      [EN]: 'Watch online',
      [RU]: 'Смотреть онлайн',
      [ES]: 'Ver en línea',
      [AR]: 'شاهد عبر الإنترنت',
      [DE]: 'Online ansehen',
      [FR]: 'Regarder en ligne',
      [IT]: 'Guarda online',
    },
  },
  getCopyrightText(chanTitle: string) {
    return {
      [UA]: `Онлайн трансляція телеканалу ${chanTitle} призупинена за вимогою власника
        авторських прав.`,
      [EN]: `The online broadcast of the ${chanTitle} channel has been suspended due to the owner's
        copyrights.`,
      [RU]: `Онлайн трансляция телеканала ${chanTitle} приостановлена по требованию владельца
        авторских прав.`,
      [ES]: `La transmisión en línea del canal ${chanTitle} ha sido suspendida debido a los derechos de
        autor del propietario.`,
      [AR]: `تم تعليق البث المباشر لقناة ${chanTitle} بناءً على طلب مالك حقوق الطبع والنشر.`,
      [DE]: `Die Online-Übertragung des Kanals ${chanTitle} wurde aufgrund der Rechte des Eigentümers
        an den Urheberrechten eingestellt.`,
      [FR]: `La diffusion en ligne de la chaîne ${chanTitle} a été suspendue en raison des droits d'auteur
        du propriétaire.`,
      [IT]: `La trasmissione online del canale ${chanTitle} è stata sospesa a causa dei diritti d'autore
        del proprietario.`,
    };
  },
  openNewWindowFeatures:
    'left=0,top=0,width=665,height=550,status=no,toolbar=yes,menubar=no,scrollbars=yes',
};

export const YOUTUBE_PLAYER = {
  width: 700,
  height: 395,
  embedPath: 'https://www.youtube.com/embed/',
};

export const ONLINE_TABS = {
  button: {
    getAriaLabel(streamNumber: number) {
      return {
        [UA]: `Дивитись із ${streamNumber}-го Джерела`,
        [EN]: `Watch from ${streamNumber} source`,
        [RU]: `Смотреть из ${streamNumber}-го Источника`,
        [ES]: `Ver desde la fuente ${streamNumber}`,
        [AR]: `شاهد من المصدر رقم ${streamNumber}`,
        [DE]: `Vom ${streamNumber}. Quelle ansehen`,
        [FR]: `Regarder depuis la source ${streamNumber}`,
        [IT]: `Guarda dalla fonte ${streamNumber}`,
      };
    },
    getTitle(streamNumber: number) {
      return {
        [UA]: `${streamNumber} Канал`,
        [EN]: `Channel ${streamNumber}`,
        [RU]: `Канал ${streamNumber}`,
        [ES]: `Canal ${streamNumber}`,
        [AR]: `قناة ${streamNumber}`,
        [DE]: `Kanal ${streamNumber}`,
        [FR]: `Chaîne ${streamNumber}`,
        [IT]: `Canale ${streamNumber}`,
      };
    },
  },
};

export const BREAD_ONLINE_CHANNEL_LIST = {
  href: EUrlBaseParam.ONLINE_CHANNEL_LIST,
  title: {
    [UA]: 'Список онлайн каналів',
    [EN]: 'Online channel list',
    [RU]: 'Список онлайн каналов',
    [ES]: 'Lista de canales en línea',
    [AR]: 'قائمة القنوات عبر الإنترنت',
    [DE]: 'Liste der Online-Kanäle',
    [FR]: 'Liste des chaînes en ligne',
    [IT]: 'Elenco dei canali online',
  },
};
