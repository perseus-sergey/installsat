import { ELanguage } from './language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const SAT_FINDER_META_DATA = {
  keywords: {
    [UA]: 'напрям антени на супутник, карта Google, супутникова антена, точний напрямок, місце розташування антени, магазин, супутниковий сигнал, перешкоди для сигналу, встановлення супутникової антени, самостійна настройка',
    [EN]: 'satellite dish direction, Google Maps, satellite antenna, accurate direction, antenna placement, store, satellite signal, signal obstacles, satellite antenna installation, DIY setup',
    [RU]: 'направление антенны на спутник, карта Google, спутниковая антенна, точное направление, размещение антенны, магазин, спутниковый сигнал, помехи сигнала, установка спутниковой антенны, самостоятельная настройка',
    [ES]: 'dirección de la antena satelital, Google Maps, antena satelital, dirección precisa, ubicación de la antena, tienda, señal satelital, obstáculos de señal, instalación de antena satelital, configuración DIY',
    [AR]: 'اتجاه طبق الأقمار الصناعية، خرائط جوجل، هوائي الأقمار الصناعية، اتجاه دقيق، موقع الهوائي، متجر، إشارة الأقمار الصناعية، عوائق الإشارة، تركيب هوائي الأقمار الصناعية، إعداد DIY',
    [DE]: 'Satellitenschüsselrichtung, Google Maps, Satellitenantenne, genaue Richtung, Antennenplatzierung, Geschäft, Satellitensignal, Signalhindernisse, Installation der Satellitenantenne, DIY-Einrichtung',
    [FR]: "direction de l'antenne satellite, Google Maps, antenne satellite, direction précise, emplacement de l'antenne, magasin, signal satellite, obstacles au signal, installation de l'antenne satellite, configuration DIY",
    [IT]: "direzione dell'antenna satellitare, Google Maps, antenna satellitare, direzione precisa, posizionamento dell'antenna, negozio, segnale satellitare, ostacoli al segnale, installazione dell'antenna satellitare, configurazione fai-da-te",
  },
  googleMap: {
    initialCamera: {
      center: { lat: 49.064829, lng: 33.421671 },
      zoom: 18,
    },
    marker: {
      markerImage: {
        src: '/Images/Installsat_googlemap.gif',
        height: 25,
        width: 55,
        alt: {
          [UA]: 'Installsat - Логотип нашої компанії на Google Maps',
          [EN]: 'Installsat - Logo of our company on Google Maps',
          [RU]: 'Installsat - Логотип нашей компании на Google Maps',
          [ES]: 'Installsat - Logotipo de nuestra empresa en Google Maps',
          [AR]: 'Installsat - شعار شركتنا على خرائط جوجل',
          [DE]: 'Installsat - Logo unseres Unternehmens auf Google Maps',
          [FR]: 'Installsat - Logo de notre entreprise sur Google Maps',
          [IT]: 'Installsat - Logo della nostra azienda su Google Maps',
        },
      },
    },
  },
  dbArticleId: '74',
  searchForm: {
    fieldsetTitle: {
      [UA]: 'Виберіть адресу та супутники',
      [EN]: 'Select address and satellites',
      [RU]: 'Выберите адрес и спутники',
      [ES]: 'Seleccione dirección y satélites',
      [AR]: 'اختر العنوان والأقمار الصناعية',
      [DE]: 'Wählen Sie Adresse und Satelliten',
      [FR]: "Sélectionnez l'adresse et les satellites",
      [IT]: 'Seleziona indirizzo e satelliti',
    },
    inputField: {
      placeholder: {
        [UA]: 'Місто вулиця будинок...',
        [EN]: 'Address...',
        [RU]: 'Адрес...',
        [ES]: 'Dirección...',
        [AR]: 'عنوان...',
        [DE]: 'Adresse...',
        [FR]: 'Adresse...',
        [IT]: 'Indirizzo...',
      },
      labelName: {
        [UA]: 'Введіть назву міста, вулицю, номер будинку',
        [EN]: 'Enter the name of the city, street, house number',
        [RU]: 'Введите название города, улицу, номер дома',
        [ES]: 'Ingrese el nombre de la ciudad, calle, número de casa',
        [AR]: 'أدخل اسم المدينة، الشارع، رقم المنزل',
        [DE]: 'Geben Sie den Namen der Stadt, Straße, Hausnummer ein',
        [FR]: 'Entrez le nom de la ville, rue, numéro de maison',
        [IT]: 'Inserisci il nome della città, via, numero civico',
      },
      cancelBtnAriaLabel: {
        [UA]: 'Скасувати',
        [EN]: 'Cancel',
        [RU]: 'Отменить',
        [ES]: 'Cancelar',
        [AR]: 'إلغاء',
        [DE]: 'Abbrechen',
        [FR]: 'Annuler',
        [IT]: 'Annulla',
      },
      searchIconStr: '⏿',
    },
    submitButton: {
      title: '🔎',
      ariaLabel: {
        [UA]: 'Підтвердити зміни',
        [EN]: 'Confirm changes',
        [RU]: 'Подтвердить изменения',
        [ES]: 'Confirmar cambios',
        [AR]: 'تأكيد التغييرات',
        [DE]: 'Änderungen bestätigen',
        [FR]: 'Confirmer les modifications',
        [IT]: 'Conferma modifiche',
      },
      imgAlt: {
        [UA]: 'Схематичне зображення збільшуваного скла поруч із глобусом',
        [EN]: 'Schematic image of a magnifying glass next to a globe',
        [RU]: 'Схематическое изображение увеличительного стекла рядом с глобусом',
        [ES]: 'Imagen esquemática de una lupa junto a un globo terráqueo',
        [AR]: 'صورة تخطيطية لعدسة مكبرة بجانب كرة أرضية',
        [DE]: 'Schematische Darstellung einer Lupe neben einem Globus',
        [FR]: `Image schématique d'une loupe à côté d’un globe`,
        [IT]: 'Immagine schematica di una lente d’ingrandimento accanto a un globo',
      },
    },
  },
  images: {
    h1Image: {
      src: '/Images/starthere_6100.png',
      alt: {
        [UA]: 'Компас на карті Google, який вказує напрям антени на супутник',
        [EN]: 'Compass on Google Map indicating antenna direction towards satellite',
        [RU]: 'Компас на карте Google, указывающий направление антенны на спутник',
        [ES]: 'Brújula en Google Map indicando la dirección de la antena hacia el satélite',
        [AR]: 'بوصلة على خرائط جوجل تشير إلى اتجاه الهوائي نحو القمر الصناعي',
        [DE]: 'Kompass auf Google Map, der die Antennenrichtung zum Satelliten anzeigt',
        [FR]: "Boussole sur Google Map indiquant la direction de l'antenne vers le satellite",
        [IT]: "Bussola su Google Map che indica la direzione dell'antenna verso il satellite",
      },
    },
  },
};
