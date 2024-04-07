import { ELanguage } from './ui.model';

export const SAT_FINDER_META_DATA = {
  keywords: {
    [ELanguage.UA]:
      'напрям антени на супутник, карта Google, супутникова антена, точний напрямок, місце розташування антени, магазин, супутниковий сигнал, перешкоди для сигналу, встановлення супутникової антени, самостійна настройка',
    [ELanguage.EN]:
      'satellite dish direction, Google Maps, satellite antenna, accurate direction, antenna placement, store, satellite signal, signal obstacles, satellite antenna installation, DIY setup',
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
