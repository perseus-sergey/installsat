import { ELanguage } from './ui.model';

export const COMMENTS_MODEL = {
  commentForm: {
    title: {
      [ELanguage.UA]: 'Додати коментар',
      [ELanguage.EN]: 'Add comment',
    },
    authorName: {
      placeholder: {
        [ELanguage.UA]: `Ім'я...`,
        [ELanguage.EN]: 'Name...',
      },
      ariaLabel: {
        [ELanguage.UA]: `Введіть своє Ім'я`,
        [ELanguage.EN]: 'Enter your name',
      },
      labelText: {
        [ELanguage.UA]: `Ваше Ім'я`,
        [ELanguage.EN]: 'Your name',
      },
      minSize: {
        value: 1,
        warningText: {
          [ELanguage.UA]: 'Введіть щонайменш 1 символ',
          [ELanguage.EN]: 'Enter at least 1 character',
        },
      },
      maxSize: {
        value: 30,
        warningText: {
          [ELanguage.UA]: 'Не більше 30 символів',
          [ELanguage.EN]: 'Maximum 30 characters allowed',
        },
      },
    },
    commentText: {
      placeholder: {
        [ELanguage.UA]: `Введіть коментар...`,
        [ELanguage.EN]: 'Enter your comment...',
      },
      ariaLabel: {
        [ELanguage.UA]: 'Введіть коментар',
        [ELanguage.EN]: 'Enter your comment',
      },
      labelText: {
        [ELanguage.UA]: 'Зміст',
        [ELanguage.EN]: 'Content',
      },
      minSize: {
        value: 2,
        warningText: {
          [ELanguage.UA]: 'Введіть щонайменш 2 символи',
          [ELanguage.EN]: 'Enter at least 2 characters',
        },
      },
      maxSize: {
        value: 450,
        warningText: {
          [ELanguage.UA]: 'Не більше 450 символів',
          [ELanguage.EN]: 'Maximum 450 characters allowed',
        },
      },
    },
    authorEmail: {
      placeholder: 'your@email.com',
      ariaLabel: {
        [ELanguage.UA]: 'Введіть свою електронну пошту',
        [ELanguage.EN]: 'Enter your email',
      },
      labelText: {
        [ELanguage.UA]: 'Адреса електронної пошти (ніде не відображається)',
        [ELanguage.EN]: 'Email address (will not be displayed)',
      },
      warningText: {
        [ELanguage.UA]: 'Не коректний формат електронної пошти!',
        [ELanguage.EN]: 'Incorrect email format!',
      },
    },
    submit: {
      ariaLabel: {
        [ELanguage.UA]: 'Відправити коментар',
        [ELanguage.EN]: 'Send comment',
      },
      innerText: {
        [ELanguage.UA]: 'Відправити',
        [ELanguage.EN]: 'Send',
      },
      pendingInnerText: {
        [ELanguage.UA]: 'Відправлення...',
        [ELanguage.EN]: 'Sending...',
      },
    },
  },
  commentList: {
    commentsPerPage: 15,
    paginationOffset: 3,
    title: {
      [ELanguage.UA]: 'Коментарі',
      [ELanguage.EN]: 'Comments',
    },
    image: {
      alt: {
        [ELanguage.UA]: 'Зображення поштовоЇ розсилки коментарів',
        [ELanguage.EN]: 'Postcard image for comments',
      },
      src: '/Images/mail_post_to_5295.png',
    },
  },

  email: {
    subjectPreTitle: {
      [ELanguage.UA]: 'Новий коментар до сторінки:',
      [ELanguage.EN]: 'New comment on the page:',
    },
  },

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
    confirmButton: {
      ariaLabel: {
        [ELanguage.UA]: 'Видалити поштову адресу зі списку розсилки',
        [ELanguage.EN]: 'Delete E-Mail address from the newsletter list',
      },
      pendingText: {
        [ELanguage.UA]: 'Видалення...',
        [ELanguage.EN]: 'Deleting...',
      },
      title: {
        [ELanguage.UA]: 'Так',
        [ELanguage.EN]: 'Yes',
      },
    },
    cancelButton: {
      ariaLabel: {
        [ELanguage.UA]: 'Не видаляти мою поштову адресу зі списку розсилки',
        [ELanguage.EN]:
          "Don't delete my E-Mail address from the newsletter list",
      },
      title: {
        [ELanguage.UA]: 'Ні',
        [ELanguage.EN]: 'No',
      },
    },
  },
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

export interface ICommentsModel {
  id: number;
  total_count: number;
  post: number;
  author: string;
  parent_id: number;
  mail: string;
  text: string;
  date: Date;
  ip: string;
  country: string;
}
