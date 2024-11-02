import { DEFAULT_ARTICLE_LOGO_PATH } from './ui/image.model';
import { ELanguage } from './language.model';
import { EUrlBaseParam } from './url/url.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const META_ALL_SAT_MAPS_MODEL = {
  metaTitle: {
    [UA]: 'Карти покриття супутників',
    [EN]: 'Satellite coverage maps',
    [RU]: 'Карты покрытия спутников',
    [ES]: 'Mapas de cobertura satelital',
    [AR]: 'خرائط تغطية الأقمار الصناعية',
    [DE]: 'Satellitenabdeckungskarten',
    [FR]: 'Cartes de couverture satellite',
    [IT]: 'Mappe di copertura satellitare',
  },
  metaDescription: {
    [UA]: 'Карти покриття телевізійних супутників',
    [EN]: 'Satellite coverage maps of television satellites',
    [RU]: 'Карты покрытия телевизионных спутников',
    [ES]: 'Mapas de cobertura de satélites de televisión',
    [AR]: 'خرائط تغطية الأقمار الصناعية التلفزيونية',
    [DE]: 'Satellitenabdeckungskarten von Fernsehsatelliten',
    [FR]: 'Cartes de couverture des satellites de télévision',
    [IT]: 'Mappe di copertura dei satelliti televisivi',
  },
  metaKeywords: {
    [UA]: 'Карти покриття телевізійні супутники територія промінь напрямок сигнал',
    [EN]: 'Coverage maps television satellites territory beam direction signal',
    [RU]: 'Карты покрытия телевизионные спутники территория луч направление сигнал',
    [ES]: 'Mapas de cobertura satélites televisión territorio haz dirección señal',
    [AR]: 'خرائط تغطية الأقمار الصناعية التلفزيونية الإشارة الاتجاه الحزمة',
    [DE]: 'Abdeckungskarten Fernsehsatelliten Gebiet Strahlrichtung Signal',
    [FR]: 'Cartes de couverture satellites télévision territoire faisceau direction signal',
    [IT]: 'Mappe di copertura satelliti televisivi territorio fascio direzione segnale',
  },
  makePostDescription(satTitle: string) {
    return {
      [UA]: `Карта покриття телевізійного супутника ${satTitle}.`,
      [EN]: `Coverage map of the ${satTitle} television satellite`,
      [RU]: `Карта покрытия телевизионного спутника ${satTitle}.`,
      [ES]: `Mapa de cobertura del satélite de televisión ${satTitle}`,
      [AR]: `خريطة تغطية القمر الصناعي التلفزيوني ${satTitle}`,
      [DE]: `Abdeckungskarte des Fernsehsatelliten ${satTitle}`,
      [FR]: `Carte de couverture du satellite de télévision ${satTitle}`,
      [IT]: `Mappa di copertura del satellite televisivo ${satTitle}`,
    };
  },
  images: {
    h1ImageAlt: {
      [UA]: 'Зображення телевізійного супутника, транслюючого сигнал на Землю',
      [EN]: 'An image of a television satellite broadcasting a signal to Earth',
      [RU]: 'Изображение телевизионного спутника, транслирующего сигнал на Землю',
      [ES]: 'Una imagen de un satélite de televisión transmitiendo señal a la Tierra',
      [AR]: 'صورة لقمر صناعي تلفزيوني يبث إشارة إلى الأرض',
      [DE]: 'Ein Bild eines Fernsehsatelliten, der ein Signal zur Erde sendet',
      [FR]: `Une image d'un satellite de télévision diffusant un signal vers la Terre`,
      [IT]: `Un'immagine di un satellite televisivo che trasmette un segnale alla Terra`,
    },
  },
};

export const getMapCardAriaLabel = (title: string) => ({
  [UA]: `Перейти до перегляду карт покриття супутника "${title}"`,
  [EN]: `Go to view the coverage maps of the satellite "${title}"`,
  [RU]: `Перейти к просмотру карт покрытия спутника "${title}"`,
  [ES]: `Ir a ver los mapas de cobertura del satélite "${title}"`,
  [AR]: `الانتقال لعرض خرائط تغطية القمر الصناعي "${title}"`,
  [DE]: `Zur Ansicht der Abdeckkarten des Satelliten "${title}" gehen`,
  [FR]: `Aller voir les cartes de couverture du satellite "${title}"`,
  [IT]: `Vai a visualizzare le mappe di copertura del satellite "${title}"`,
});

export const META_SINGLE_SAT_MAP = {
  metaTitle: {
    [UA]: 'Карта покриття супутника',
    [EN]: 'Satellite coverage map',
    [RU]: 'Карта покрытия спутника',
    [ES]: 'Mapa de cobertura del satélite',
    [AR]: 'خريطة تغطية القمر الصناعي',
    [DE]: 'Abdeckungskarte des Satelliten',
    [FR]: 'Carte de couverture du satellite',
    [IT]: 'Mappa di copertura del satellite',
  },
  getDescription(satTitle: string) {
    return {
      [UA]: `Детальна карта покриття телевізійного супутника ${satTitle}.`,
      [EN]: `Detailed coverage map of the ${satTitle} television satellite.`,
      [RU]: `Детальная карта покрытия телевизионного спутника ${satTitle}.`,
      [ES]: `Mapa detallado de cobertura del satélite de televisión ${satTitle}.`,
      [AR]: `خريطة تغطية تفصيلية للقمر الصناعي التلفزيوني ${satTitle}.`,
      [DE]: `Detaillierte Abdeckungskarte des Fernsehsatelliten ${satTitle}.`,
      [FR]: `Carte de couverture détaillée du satellite de télévision ${satTitle}.`,
      [IT]: `Mappa di copertura dettagliata del satellite televisivo ${satTitle}.`,
    };
  },
  getH1(satTitle: string) {
    return {
      [UA]: `Супутник ${satTitle}. Карти покриття`,
      [EN]: `${satTitle} satellite. Coverage maps`,
      [RU]: `Спутник ${satTitle}. Карты покрытия`,
      [ES]: `Satélite ${satTitle}. Mapas de cobertura`,
      [AR]: `القمر الصناعي ${satTitle}. خرائط التغطية`,
      [DE]: `Satellit ${satTitle}. Abdeckungskarten`,
      [FR]: `Satellite ${satTitle}. Cartes de couverture`,
      [IT]: `Satellite ${satTitle}. Mappe di copertura`,
    };
  },
  metaKeywords: {
    [UA]: 'карта покриття телевізійний супутник тв промінь',
    [EN]: 'coverage map television satellite TV beam',
    [RU]: 'карта покрытия телевизионный спутник тв луч',
    [ES]: 'mapa de cobertura satélite televisión TV haz',
    [AR]: 'خريطة التغطية القمر الصناعي التلفزيوني التلفزيون الشعاع',
    [DE]: 'Abdeckungskarte Fernsehsatellit TV Strahl',
    [FR]: 'carte de couverture satellite télévision TV faisceau',
    [IT]: 'mappa di copertura satellite televisivo TV fascio',
  },
  h2Start: {
    [UA]: 'Промінь:',
    [EN]: 'Beam:',
    [RU]: 'Луч:',
    [ES]: 'Haz:',
    [AR]: 'الشعاع:',
    [DE]: 'Strahl:',
    [FR]: 'Faisceau :',
    [IT]: 'Fascio:',
  },
};

export const SINGLE_SAT_MAP_DATA = {
  images: {
    h1Image: {
      currentImg: {
        path: '/Images/satellites/',
        height: 100,
        width: 140,
      },
      defaultImg: {
        src: DEFAULT_ARTICLE_LOGO_PATH,
        height: 100,
        width: 100,
      },
      altStart: {
        [UA]: `Логотип до статті:`,
        [EN]: `Logo for article:`,
        [RU]: `Логотип к статье:`,
        [ES]: `Logotipo para el artículo:`,
        [AR]: `شعار للمقالة:`,
        [DE]: `Logo für den Artikel:`,
        [FR]: `Logo pour l'article :`,
        [IT]: `Logo per l'articolo:`,
      },
    },

    mapParams: {
      path: '/Images/News/setting_eqp/maps/',
      height: 350,
      width: 600,
      getAlt(satTitle: string, beamTitle: string) {
        return {
          [UA]: `Карта покриття телевізійного супутника ${satTitle}. Промінь ${beamTitle}`,
          [EN]: `Coverage map of the ${satTitle} television satellite. Beam ${beamTitle}`,
          [RU]: `Карта покрытия телевизионного спутника ${satTitle}. Луч ${beamTitle}`,
          [ES]: `Mapa de cobertura del satélite de televisión ${satTitle}. Haz ${beamTitle}`,
          [AR]: `خريطة تغطية القمر الصناعي التلفزيوني ${satTitle}. الحزمة ${beamTitle}`,
          [DE]: `Abdeckungskarte des Fernsehsatelliten ${satTitle}. Strahl ${beamTitle}`,
          [FR]: `Carte de couverture du satellite de télévision ${satTitle}. Faisceau ${beamTitle}`,
          [IT]: `Mappa di copertura del satellite televisivo ${satTitle}. Fascio ${beamTitle}`,
        };
      },
    },

    bigMapParams: {
      path: '/Images/News/setting_eqp/maps/big_',
      height: 630,
      width: 1000,
    },
  },
  similar: {
    similarTitle: {
      [UA]: 'До уваги',
      [EN]: 'To note',
      [RU]: 'К сведению',
      [ES]: 'Para tomar en cuenta',
      [AR]: 'للتنويه',
      [DE]: 'Zur Kenntnis',
      [FR]: 'À noter',
      [IT]: 'Da notare',
    },
    similarStart: {
      [UA]: 'Список доступних телеканалів супутника',
      [EN]: 'List of available television channels from',
      [RU]: 'Список доступных телеканалов спутника',
      [ES]: 'Lista de canales de televisión disponibles desde',
      [AR]: 'قائمة القنوات التلفزيونية المتاحة من',
      [DE]: 'Liste der verfügbaren Fernsehsender von',
      [FR]: 'Liste des chaînes de télévision disponibles depuis',
      [IT]: 'Elenco dei canali televisivi disponibili da',
    },
    similarLinkTitle: {
      [UA]: 'Перейти до списку каналів з супутника',
      [EN]: 'Go to related channel list from satellite',
      [RU]: 'Перейти к списку каналов со спутника',
      [ES]: 'Ir a la lista de canales relacionados del satélite',
      [AR]: 'انتقل إلى قائمة القنوات ذات الصلة من القمر الصناعي',
      [DE]: 'Zur Senderliste vom Satelliten wechseln',
      [FR]: 'Accéder à la liste des chaînes du satellite',
      [IT]: `Vai all'elenco dei canali dal satellite`,
    },
  },
};

export const BREAD_SAT_COVERAGE_MAP = {
  href: EUrlBaseParam.SAT_COVERAGE_MAP,
  title: {
    [UA]: 'Мапи покриття супутників',
    [EN]: 'Satellite coverage maps',
    [RU]: 'Карты покрытия спутников',
    [ES]: 'Mapas de cobertura satelital',
    [AR]: 'خرائط تغطية الأقمار الصناعية',
    [DE]: 'Satellitenabdeckungs-Karten',
    [FR]: 'Cartes de couverture satellite',
    [IT]: 'Mappe di copertura satellitare',
  },
};

export interface IAllMapsModel {
  id: number;
  title: string;
  cpu: string;
  description: string;
  logo: string;
  view: number;
  beam_id: number;
  position: string;
  comment_count: number | null;
}

export interface IMapModel {
  sat_id: number;
  sat_title: string;
  position: string;
  logo: string;
  view: number;
  beam_title: string;
  beam_description: string;
  beam_slug: string;
  map_img: string;
  grade: string;
}
