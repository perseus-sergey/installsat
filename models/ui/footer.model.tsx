import React from 'react';

import { EUrlBaseParam } from '../url/url.model';
import SeoSVG from '@/components/ui/icons-svg/SeoSVG';
import { ELanguage, ILang } from '../language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export interface IFooterMenuItem {
  title: ILang;
  href: string;
}

type TFooterMenu = {
  [key in EFooterColumns]: IFooterMenuItem[];
};

type TFooterColumnTitles = {
  [key in EFooterColumns]: {
    title: ILang;
    image: React.ReactNode;
  };
};

const CURRENT_YEAR = new Date().getFullYear();

export const COPYRIGHT_SECTION = {
  title: {
    [UA]: `Copyright © 2009 - ${CURRENT_YEAR} Copyright in Installsat. В разі копіюванні контенту, посилання на сайт є обов'язковим.`,
    [EN]: `Copyright © 2009 - ${CURRENT_YEAR} Copyright in Installsat. The link to the site is required when copying content.`,
    [RU]: `Copyright © 2009 - ${CURRENT_YEAR} Copyright на Installsat. При копировании контента ссылка на сайт обязательна.`,
    [ES]: `Copyright © 2009 - ${CURRENT_YEAR} Derechos de autor en Installsat. Se requiere el enlace al sitio al copiar contenido.`,
    [AR]: `© حقوق النشر 2009 - ${CURRENT_YEAR} حقوق النشر في Installsat. الرابط إلى الموقع مطلوب عند نسخ المحتوى.`,
    [DE]: `Urheberrecht © 2009 - ${CURRENT_YEAR} Urheberrecht bei Installsat. Ein Link zur Website ist beim Kopieren von Inhalten erforderlich.`,
    [FR]: `Droits d'auteur © 2009 - ${CURRENT_YEAR} Droits d'auteur sur Installsat. Le lien vers le site est requis lors de la copie de contenu.`,
    [IT]: `Copyright © 2009 - ${CURRENT_YEAR} Copyright in Installsat. Il link al sito è richiesto quando si copia il contenuto.`,
  },
};

export enum EFooterColumns {
  NEWS = 'news',
  SETTINGS = 'settings',
  CHANNEL_LISTS = 'channel-lists',
}

export const footerColumnTitles: TFooterColumnTitles = {
  [EFooterColumns.NEWS]: {
    title: {
      [UA]: 'Новини',
      [EN]: 'News',
      [RU]: 'Новости',
      [ES]: 'Noticias',
      [AR]: 'أخبار',
      [DE]: 'Nachrichten',
      [FR]: 'Actualités',
      [IT]: 'Notizie',
    },
    image: (
      <SeoSVG strokeWidth={0.1}>
        <path
          fill="currentColor"
          d="M12.123 24q-.303 0-.603-.017a.5.5 0 0 1-.043-.287a.7.7 0 0 0-.022-.263h-2.23a1.2 1.2 0 0 1-.785.39a.7.7 0 0 1-.507-.228a.915.915 0 0 1-.065-1.1a.7.7 0 0 1 .557-.266a1.22 1.22 0 0 1 .703.267h2.328a2 2 0 0 0 0-.614H10.26a1.14 1.14 0 0 1-.55-.13a22 22 0 0 0-1.487-.808a1.4 1.4 0 0 0-.71-.194a7 7 0 0 1-.476.015q-.236-.001-.464-.007a19 19 0 0 0-.45-.008a1.35 1.35 0 0 1-.814.37a.68.68 0 0 1-.512-.24a.76.76 0 0 1 0-1.067a.72.72 0 0 1 .537-.272a1.3 1.3 0 0 1 .756.337h1.681a1.14 1.14 0 0 1 .55.129c.14.082.293.162.441.239a6 6 0 0 1 .754.44a1.95 1.95 0 0 0 1.116.33a3 3 0 0 0 .178-.007a2 2 0 0 1 .219-.014q.101 0 .208.007q.118.007.251.007v-1.034h-1.164a1.27 1.27 0 0 1-.71.3a.84.84 0 0 1-.615-.332c-.37-.404-.134-.803.13-1.067a.56.56 0 0 1 .353-.125a1.35 1.35 0 0 1 .842.448h1.1v-.905a.4.4 0 0 0-.178-.04q-.04 0-.083.004q-.044.003-.095.004H4.959a.84.84 0 0 1-.743-.356c-.172-.228-.37-.459-.545-.663l-.07-.08c-.743-.065-.97-.285-.937-.905a.75.75 0 0 1 .84-.679c.492 0 .711.33.711 1.067q.09.105.183.22c.136.164.276.335.432.491h6.658a5.5 5.5 0 0 0 0-1.034H6.64a1.32 1.32 0 0 1-.795.37a.66.66 0 0 1-.498-.24a.746.746 0 0 1 0-1.1a.7.7 0 0 1 .508-.268a1.17 1.17 0 0 1 .72.365h4.88v-1.002h-8.24q-.234.259-.502.535c-.158.166-.321.337-.5.531a.84.84 0 0 1-.792.752a1 1 0 0 1-.114-.008a.846.846 0 0 1-.646-1.002c.059-.383.372-.602.86-.602a2 2 0 0 1 .271.02c.177-.206.444-.508.711-.776a.96.96 0 0 1 .776-.323h8.177v-1.099H1.63a1.23 1.23 0 0 1-.744.344a.68.68 0 0 1-.55-.312a.85.85 0 0 1 .098-1.13a.75.75 0 0 1 .479-.195a1.15 1.15 0 0 1 .814.485h3.2l-.102-.097c-.56-.528-1.138-1.075-1.838-1.713a.755.755 0 0 1-.776-.808c0-.514.22-.743.711-.743c.662 0 .84.212.873 1.034c.248.238.492.469.75.713a81 81 0 0 1 1.674 1.614h5.236v-.743H9.161a1.3 1.3 0 0 1-.705.263a.75.75 0 0 1-.588-.296a.81.81 0 0 1 .129-1.098a.64.64 0 0 1 .437-.168a1.28 1.28 0 0 1 .824.394h2.198v-.84q-.342-.001-.671-.008h-.007a39 39 0 0 0-.656-.007c-.248 0-.467.005-.67.014a1 1 0 0 1-.115.005a1.23 1.23 0 0 1-.855-.36l-.6-.507l-.012-.01l-.008-.007A261 261 0 0 0 6.64 7.272H3.052a1.24 1.24 0 0 1-.72.29a.73.73 0 0 1-.573-.29a.776.776 0 0 1 .097-1.099a.7.7 0 0 1 .474-.223a1.36 1.36 0 0 1 .819.45h3.135a1.6 1.6 0 0 1 1.164.452c.373.351.795.69 1.203 1.019h.001c.19.153.388.311.573.466h2.198V7.271c-.138 0-.282-.004-.42-.007H11a18 18 0 0 0-.44-.008q-.24 0-.428.015a1 1 0 0 1-.115.005a1.34 1.34 0 0 1-.856-.327a11 11 0 0 0-.305-.24c-.103-.08-.212-.162-.31-.245c-.8-.064-1.098-.29-1.066-.808a.776.776 0 0 1 .776-.743c.497 0 .775.302.808.872c.129.097.258.204.388.307l.001.002c.127.103.259.21.388.306h1.584V5.14h-.55a1.35 1.35 0 0 1-.765.36a.69.69 0 0 1-.528-.296a.8.8 0 0 1 .033-1.1a.7.7 0 0 1 .5-.214a1.1 1.1 0 0 1 .759.376h.517a.5.5 0 0 0 .043-.346a1 1 0 0 1-.01-.138v-.517a3 3 0 0 1-.292.012a9 9 0 0 1-.355-.01h-.007a8 8 0 0 0-.364-.01a1.96 1.96 0 0 0-1.018.234a11 11 0 0 1-1.115.582H8.27c-.153.073-.312.148-.466.224a.9.9 0 0 1-.42.065H5.22a1.1 1.1 0 0 1-.696.328a.78.78 0 0 1-.598-.327a.72.72 0 0 1-.181-.545a.85.85 0 0 1 .31-.586a.74.74 0 0 1 .473-.197a1.07 1.07 0 0 1 .755.456h2.101a.6.6 0 0 0 .223-.053a1 1 0 0 1 .133-.044q.197-.099.39-.19a10 10 0 0 0 .935-.489a2.56 2.56 0 0 1 1.353-.362q.097 0 .198.006a2 2 0 0 0 .258.014q.127 0 .26-.006h.001q.138-.007.286-.008a2.1 2.1 0 0 0 .037-.59q-.004-.105-.004-.218H9.416a1.46 1.46 0 0 1-.766.332a.68.68 0 0 1-.526-.3a.83.83 0 0 1 .065-1.098a.72.72 0 0 1 .487-.205a1.24 1.24 0 0 1 .776.366h2.004q.002-.133.014-.276c.009-.114.018-.231.018-.37h.126c4.196 0 7.492 1.642 9.797 4.88a12.23 12.23 0 0 1 2.408 6.457c.12 2.203-.44 4.457-1.665 6.698a11.4 11.4 0 0 1-4.433 4.477A11.5 11.5 0 0 1 12.123 24m.367-5.577v4.46a1.6 1.6 0 0 0 .27.022a3.5 3.5 0 0 0 .491-.045c.11-.015.22-.033.337-.041a15 15 0 0 0 2.392-4.396zm4.654 0a19 19 0 0 1-1.842 3.944a10.38 10.38 0 0 0 5.3-3.944zm1.035-5.785a20.5 20.5 0 0 1-.68 4.654h3.815a11.2 11.2 0 0 0 1.293-4.654zm-5.69 0v4.622h3.88a18.2 18.2 0 0 0 .678-4.622zm.033-5.786v4.654h4.557a18.7 18.7 0 0 0-.71-4.654zm4.945-.032a21.4 21.4 0 0 1 .711 4.654h4.428a10.9 10.9 0 0 0-1.325-4.654zM15.27 1.778a20 20 0 0 1 1.875 3.943h3.459a10.6 10.6 0 0 0-5.333-3.943zm-2.747-.582c0 1.562 0 3.038.032 4.493h3.459a.12.12 0 0 1-.032-.097a16.2 16.2 0 0 0-2.23-4.105l-.038-.04a.28.28 0 0 0-.189-.122a10 10 0 0 0-1.002-.13"
        />
      </SeoSVG>
    ),
  },

  [EFooterColumns.SETTINGS]: {
    title: {
      [UA]: 'Налаштування',
      [EN]: 'Settings',
      [RU]: 'Настройки',
      [ES]: 'Configuración',
      [AR]: 'إعدادات',
      [DE]: 'Einstellungen',
      [FR]: 'Paramètres',
      [IT]: 'Impostazioni',
    },
    image: (
      <SeoSVG strokeWidth={0.1}>
        <path
          fill="currentColor"
          d="M3 6h18v5h2V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9v-2H3z"
        ></path>
        <path
          fill="currentColor"
          d="M15 12L9 8v8zm7.71 6.43c.03-.29.04-.58.01-.86l1.07-.85c.1-.08.12-.21.06-.32l-1.03-1.79c-.06-.11-.19-.15-.31-.11l-1.28.5a3.4 3.4 0 0 0-.75-.42l-.2-1.36a.25.25 0 0 0-.25-.22h-2.07c-.12 0-.23.09-.25.21l-.2 1.36c-.26.11-.51.26-.74.42l-1.28-.5c-.12-.05-.25 0-.31.11l-1.03 1.79c-.06.11-.04.24.06.32l1.07.86c-.03.29-.04.58-.01.86l-1.07.85c-.1.08-.12.21-.06.32l1.03 1.79c.06.11.19.15.31.11l1.27-.5q.345.255.75.42l.2 1.36c.02.12.12.21.25.21h2.07c.12 0 .23-.09.25-.21l.2-1.36c.26-.11.51-.26.74-.42l1.28.5c.12.05.25 0 .31-.11l1.03-1.79c.06-.11.04-.24-.06-.32zM19 19.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5"
        ></path>
      </SeoSVG>
    ),
  },
  [EFooterColumns.CHANNEL_LISTS]: {
    title: {
      [UA]: 'Списки каналів',
      [EN]: 'Channel lists',
      [RU]: 'Списки каналов',
      [ES]: 'Listas de canales',
      [AR]: 'قوائم القنوات',
      [DE]: 'Kanallisten',
      [FR]: 'Listes de chaînes',
      [IT]: 'Elenchi dei canali',
    },
    image: (
      <SeoSVG strokeWidth={0.1} viewBox="0 0 36 36">
        <path
          fill="currentColor"
          d="M20 18h2v2h-2zm4 0h2v2h-2zm-4 4h2v2h-2zm4 0h2v2h-2zM8.81 10h8.14v2H8.81zm0 4h8.14v2H8.81zm0 4h8.14v2H8.81zm0 4h8.14v2H8.81zm0 4h8.14v2H8.81z"
        />
        <path
          fill="currentColor"
          d="M30 15.4V30H6V6h15.27l1.18-2H6a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h1.88v1.57a1 1 0 0 0 2 0V32h16v1.57a1 1 0 0 0 2 0V32H30a2 2 0 0 0 2-2V15.4Z"
        />
        <path
          fill="currentColor"
          d="m26.85 1.14l-5.72 9.91a1.27 1.27 0 0 0 1.1 1.95h11.45a1.27 1.27 0 0 0 1.1-1.91l-5.72-9.95a1.28 1.28 0 0 0-2.21 0"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
        />
      </SeoSVG>
    ),
  },
};

export const footerMenuList: TFooterMenu = {
  [EFooterColumns.NEWS]: [
    {
      title: {
        [UA]: 'Супутникові транспондерні новини',
        [EN]: 'Satellite transponder news',
        [RU]: 'Новости спутниковых транспондеров',
        [ES]: 'Noticias de transpondedores satelitales',
        [AR]: 'أخبار محولات الإشارة الفضائية',
        [DE]: 'Satellitentransponder-Nachrichten',
        [FR]: 'Actualités des transpondeurs satellitaires',
        [IT]: 'Notizie sui transponder satellitari',
      },
      href: '/',
    },

    {
      title: {
        [UA]: 'Новини телевізійного супутникового мовлення',
        [EN]: 'News of television satellite broadcasting',
        [RU]: 'Новости спутникового телевещания',
        [ES]: 'Noticias de transmisión satelital de televisión',
        [AR]: 'أخبار البث التلفزيوني الفضائي',
        [DE]: 'Nachrichten des Satellitenfernsehens',
        [FR]: 'Actualités de la diffusion satellite',
        [IT]: 'Notizie sulla trasmissione satellitare',
      },
      href: EUrlBaseParam.NEWS_AND_ARTICLES,
    },
  ],

  [EFooterColumns.SETTINGS]: [
    {
      title: {
        [UA]: 'Як встановити супутникову антену',
        [EN]: 'How to install satellite antenna',
        [RU]: 'Как установить спутниковую антенну',
        [ES]: 'Cómo instalar una antena satelital',
        [AR]: 'كيفية تركيب هوائي فضائي',
        [DE]: 'Wie installiere ich eine Satellitenantenne',
        [FR]: 'Comment installer une antenne satellite',
        [IT]: "Come installare un'antenna satellitare",
      },
      href: `${EUrlBaseParam.ARTICLE}/samostoyatelnaya-ustanovka-sputnikovoi-antenni`,
    },
    {
      title: {
        [UA]: 'Як визначити напрямок антени',
        [EN]: 'How to determine the direction of the antenna',
        [RU]: 'Как определить направление антенны',
        [ES]: 'Cómo determinar la dirección de la antena',
        [AR]: 'كيفية تحديد اتجاه الهوائي',
        [DE]: 'Wie man die Richtung der Antenne bestimmt',
        [FR]: "Comment déterminer la direction de l'antenne",
        [IT]: "Come determinare la direzione dell'antenna",
      },
      href: EUrlBaseParam.SAT_FINDER,
    },
    {
      title: {
        [UA]: 'Карти покриття супутникового сигналу',
        [EN]: 'Satellite beam coverage maps',
        [RU]: 'Карты покрытия спутникового сигнала',
        [ES]: 'Mapas de cobertura de haz satelital',
        [AR]: 'خرائط تغطية حزمة الأقمار الصناعية',
        [DE]: 'Abdeckungskarten des Satellitensignals',
        [FR]: 'Cartes de couverture du faisceau satellite',
        [IT]: 'Mappe di copertura del fascio satellitare',
      },
      href: EUrlBaseParam.SAT_COVERAGE_MAP,
    },
    {
      title: {
        [UA]: 'Як налаштувати супутниковий приймач',
        [EN]: 'How to set up satellite receiver',
        [RU]: 'Как настроить спутниковый приемник',
        [ES]: 'Cómo configurar un receptor satelital',
        [AR]: 'كيفية إعداد جهاز استقبال الأقمار الصناعية',
        [DE]: 'Wie man einen Satellitenempfänger einrichtet',
        [FR]: 'Comment configurer un récepteur satellite',
        [IT]: 'Come impostare il ricevitore satellitare',
      },
      href: `${EUrlBaseParam.ARTICLE}/kak-sviazati-tuner-s-antennoi`,
    },
    {
      title: {
        [UA]: 'Biss Ключі',
        [EN]: 'Biss Keys',
        [RU]: 'Ключи Biss',
        [ES]: 'Claves Biss',
        [AR]: 'مفاتيح Biss',
        [DE]: 'Biss-Schlüssel',
        [FR]: 'Clés Biss',
        [IT]: 'Chiavi Biss',
      },
      href: `${EUrlBaseParam.ARTICLE}/key-biss`,
    },
  ],

  [EFooterColumns.CHANNEL_LISTS]: [
    {
      title: {
        [UA]: 'Підбір каналів за параметрами',
        [EN]: 'Select channels by parameters',
        [RU]: 'Выбор каналов по параметрам',
        [ES]: 'Seleccionar canales por parámetros',
        [AR]: 'اختر القنوات حسب المعايير',
        [DE]: 'Kanäle nach Parametern auswählen',
        [FR]: 'Sélectionner les chaînes par paramètres',
        [IT]: 'Seleziona i canali per parametri',
      },
      href: EUrlBaseParam.SAT_CHANNEL_LIST,
    },
    {
      title: {
        [UA]: 'ТБ Онлайн',
        [EN]: 'Online TV',
        [RU]: 'Онлайн ТВ',
        [ES]: 'TV en línea',
        [AR]: 'التلفزيون عبر الإنترنت',
        [DE]: 'Online-TV',
        [FR]: 'TV en ligne',
        [IT]: 'TV online',
      },
      href: EUrlBaseParam.ONLINE_CHANNEL_LIST,
    },
    {
      title: {
        [UA]: 'Розклад передач каналів',
        [EN]: 'TV schedule',
        [RU]: 'Расписание передач',
        [ES]: 'Programación de TV',
        [AR]: 'جدول البرامج التلفزيونية',
        [DE]: 'TV-Programm',
        [FR]: 'Programme TV',
        [IT]: 'Programmazione TV',
      },
      href: EUrlBaseParam.CHANNELS_TV_PROGRAM,
    },
  ],
};

export const getFooterLinkAriaLabel = (pageTitle: string) => ({
  [UA]: `Натисніть, щоб перейти до перегляду сторінки "${pageTitle}"`,
  [EN]: `Click to go to the view of the "${pageTitle}" page`,
  [RU]: `Нажмите, чтобы перейти к просмотру страницы "${pageTitle}"`,
  [ES]: `Haz clic para ir a la vista de la página "${pageTitle}"`,
  [AR]: `انقر للانتقال إلى عرض الصفحة "${pageTitle}"`,
  [DE]: `Klicken Sie, um zur Ansicht der Seite "${pageTitle}" zu gelangen`,
  [FR]: `Cliquez pour accéder à la vue de la page "${pageTitle}"`,
  [IT]: `Clicca per andare alla visualizzazione della pagina "${pageTitle}"`,
});
