import { ELanguage } from './ui.model';

export const SAT_FINDER_META_DATA = {
  keywords: {
    [ELanguage.UA]:
      'напрям антени на супутник, карта Google, супутникова антена, точний напрямок, місце розташування антени, магазин, супутниковий сигнал, перешкоди для сигналу, встановлення супутникової антени, самостійна настройка',
    [ELanguage.EN]:
      'satellite dish direction, Google Maps, satellite antenna, accurate direction, antenna placement, store, satellite signal, signal obstacles, satellite antenna installation, DIY setup',
  },
  googleMap: {
    initialCamera: {
      center: { lat: 49.064829, lng: 33.421671 },
      zoom: 18,
    },
    marker: {
      markerImage: {
        src: '/Images/Installsat_googlemap.gif',
        height: '25px',
        width: '55px',
        alt: {
          [ELanguage.UA]: 'Installsat - Логотип нашої компанії на Google Maps',
          [ELanguage.EN]: 'Installsat - Logo of our company on Google Maps',
        },
      },
    },
  },
  searchForm: {
    fieldsetTitle: {
      [ELanguage.UA]: 'Виберіть адресу та супутники',
      [ELanguage.EN]: 'Select address and satellites',
    },
    inputField: {
      placeholder: {
        [ELanguage.UA]: 'Місто вулиця будинок...',
        [ELanguage.EN]: 'Address...',
      },
      labelName: {
        [ELanguage.UA]: 'Введіть назву міста, вулицю, номер будинку',
        [ELanguage.EN]: 'Enter the name of the city, street, house number',
      },
      cancelButton: {
        [ELanguage.UA]: {
          ariaLabel: 'Скасувати',
          content: 'x',
        },
        [ELanguage.EN]: {
          ariaLabel: 'Cancel',
          content: 'x',
        },
      },
      searchIconStr: '⏿',
    },
    submitButton: {
      title: {
        [ELanguage.UA]: '🔎',
        [ELanguage.EN]: '🔎',
      },
      ariaLabel: {
        [ELanguage.UA]: 'Підтвердити зміни',
        [ELanguage.EN]: 'Confirm changes',
      },
    },
  },
  images: {
    h1Image: {
      src: '/Images/starthere_6100.png',
      height: '128px',
      width: '128px',
      alternativeStr: { title: '🧭', fontSize: '8rem' },
      alt: {
        [ELanguage.UA]:
          'Компас на карті Google, який вказує напрям антени на супутник',
        [ELanguage.EN]:
          'Compass on Google Map indicating antenna direction towards satellite',
      },
    },
  },
};
