import { ELanguage } from './ui.model';

export const COMMENTS_MODEL = {
  deleteSubscriptionPage: {
    meta: {
      title: 'Delete Comment Subscription',
      description: 'Remove Subscription for certain user',
      keywords: 'installsat tv resource news remove subscription',
    },
    h1: {
      [ELanguage.UA]: 'Видалення підписки для користувача',
      [ELanguage.EN]: 'Delete Subscription for user',
    },
    askText: {
      [ELanguage.UA]: 'Ви впевнені, що хочете видалити підписку до сторінки',
      [ELanguage.EN]:
        'Are you sure you want to delete the subscription to the page',
    },
    answerText: {
      [ELanguage.UA]:
        'Вашу E-Mail адресу було вдало видалено із розсилки оновлень коментарів до сторінки',
      [ELanguage.EN]:
        'Your E-Mail address has been successfully deleted from the newsletter updates to the page',
    },
  },
  // searchForm: {
  //   fieldsetTitle: {
  //     [ELanguage.UA]: 'Виберіть адресу та супутники',
  //     [ELanguage.EN]: 'Select address and satellites',
  //   },
  //   inputField: {
  //     placeholder: {
  //       [ELanguage.UA]: 'Місто вулиця будинок...',
  //       [ELanguage.EN]: 'Address...',
  //     },
  //     labelName: {
  //       [ELanguage.UA]: 'Введіть назву міста, вулицю, номер будинку',
  //       [ELanguage.EN]: 'Enter the name of the city, street, house number',
  //     },
  //     cancelBtnAriaLabel: {
  //       [ELanguage.UA]: 'Скасувати',
  //       [ELanguage.EN]: 'Cancel',
  //     },
  //     searchIconStr: '⏿',
  //   },
  //   submitButton: {
  //     title: {
  //       [ELanguage.UA]: '🔎',
  //       [ELanguage.EN]: '🔎',
  //     },
  //     ariaLabel: {
  //       [ELanguage.UA]: 'Підтвердити зміни',
  //       [ELanguage.EN]: 'Confirm changes',
  //     },
  //   },
  // },
  // images: {
  //   h1Image: {
  //     src: '/Images/starthere_6100.png',
  //     height: '128px',
  //     width: '128px',
  //     alternativeStr: { title: '🧭', fontSize: '8rem' },
  //     alt: {
  //       [ELanguage.UA]:
  //         'Компас на карті Google, який вказує напрям антени на супутник',
  //       [ELanguage.EN]:
  //         'Compass on Google Map indicating antenna direction towards satellite',
  //     },
  //   },
  // },
};

export enum ECommentFormNames {
  AUTHOR = 'comment-author',
  EMAIL = 'comment-email',
  TEXT = 'comment-text',
}

export interface ISubscribersEmails {
  mail: string;
  author: string;
  ip: string;
  date: Date;
}
