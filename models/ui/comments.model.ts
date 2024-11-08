import { ELanguage } from '../language.model';

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

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const COMMENTS_MODEL = {
  commentForm: {
    title: {
      [UA]: 'Додати коментар',
      [EN]: 'Add comment',
      [RU]: 'Добавить комментарий',
      [ES]: 'Agregar comentario',
      [AR]: 'أضف تعليق',
      [DE]: 'Kommentar hinzufügen',
      [FR]: 'Ajouter un commentaire',
      [IT]: 'Aggiungi commento',
    },
    authorName: {
      placeholder: {
        [UA]: `Ім'я...`,
        [EN]: 'Name...',
        [RU]: 'Имя...',
        [ES]: 'Nombre...',
        [AR]: 'الاسم...',
        [DE]: 'Name...',
        [FR]: 'Nom...',
        [IT]: 'Nome...',
      },
      ariaLabel: {
        [UA]: `Введіть своє Ім'я`,
        [EN]: 'Enter your name',
        [RU]: 'Введите ваше имя',
        [ES]: 'Ingresa tu nombre',
        [AR]: 'أدخل اسمك',
        [DE]: 'Geben Sie Ihren Namen ein',
        [FR]: 'Entrez votre nom',
        [IT]: 'Inserisci il tuo nome',
      },
      labelText: {
        [UA]: `Ваше Ім'я`,
        [EN]: 'Your name',
        [RU]: 'Ваше имя',
        [ES]: 'Tu nombre',
        [AR]: 'اسمك',
        [DE]: 'Ihr Name',
        [FR]: 'Votre nom',
        [IT]: 'Il tuo nome',
      },
      minSize: {
        value: 1,
        warningText: {
          [UA]: 'Введіть щонайменш 1 символ',
          [EN]: 'Enter at least 1 character',
          [RU]: 'Введите хотя бы 1 символ',
          [ES]: 'Ingrese al menos 1 carácter',
          [AR]: 'أدخل حرفًا واحدًا على الأقل',
          [DE]: 'Geben Sie mindestens 1 Zeichen ein',
          [FR]: 'Entrez au moins 1 caractère',
          [IT]: 'Inserisci almeno 1 carattere',
        },
      },
      maxSize: {
        value: 30,
        warningText: {
          [UA]: 'Не більше 30 символів',
          [EN]: 'Maximum 30 characters allowed',
          [RU]: 'Не более 30 символов',
          [ES]: 'Máximo 30 caracteres permitidos',
          [AR]: 'أقصى حد 30 حرفًا',
          [DE]: 'Maximal 30 Zeichen erlaubt',
          [FR]: 'Maximum 30 caractères autorisés',
          [IT]: 'Massimo 30 caratteri consentiti',
        },
      },
    },
    commentText: {
      placeholder: {
        [UA]: `Введіть коментар...`,
        [EN]: 'Enter your comment...',
        [RU]: 'Введите комментарий...',
        [ES]: 'Ingresa tu comentario...',
        [AR]: 'أدخل تعليقك...',
        [DE]: 'Geben Sie Ihren Kommentar ein...',
        [FR]: 'Entrez votre commentaire...',
        [IT]: 'Inserisci il tuo commento...',
      },
      ariaLabel: {
        [UA]: 'Введіть коментар',
        [EN]: 'Enter your comment',
        [RU]: 'Введите ваш комментарий',
        [ES]: 'Ingresa tu comentario',
        [AR]: 'أدخل تعليقك',
        [DE]: 'Geben Sie Ihren Kommentar ein',
        [FR]: 'Entrez votre commentaire',
        [IT]: 'Inserisci il tuo commento',
      },
      labelText: {
        [UA]: 'Зміст',
        [EN]: 'Content',
        [RU]: 'Содержимое',
        [ES]: 'Contenido',
        [AR]: 'المحتوى',
        [DE]: 'Inhalt',
        [FR]: 'Contenu',
        [IT]: 'Contenuto',
      },
      minSize: {
        value: 2,
        warningText: {
          [UA]: 'Введіть щонайменш 2 символи',
          [EN]: 'Enter at least 2 characters',
          [RU]: 'Введите хотя бы 2 символа',
          [ES]: 'Ingrese al menos 2 caracteres',
          [AR]: 'أدخل حرفين على الأقل',
          [DE]: 'Geben Sie mindestens 2 Zeichen ein',
          [FR]: 'Entrez au moins 2 caractères',
          [IT]: 'Inserisci almeno 2 caratteri',
        },
      },
      maxSize: {
        value: 450,
        warningText: {
          [UA]: 'Не більше 450 символів',
          [EN]: 'Maximum 450 characters allowed',
          [RU]: 'Не более 450 символов',
          [ES]: 'Máximo 450 caracteres permitidos',
          [AR]: 'أقصى حد 450 حرفًا',
          [DE]: 'Maximal 450 Zeichen erlaubt',
          [FR]: 'Maximum 450 caractères autorisés',
          [IT]: 'Massimo 450 caratteri consentiti',
        },
      },
    },

    forbiddenCommentMsg: {
      [UA]: 'Коментар містить заборонений контент',
      [EN]: 'Comment contains forbidden content',
      [RU]: 'Комментарий содержит запрещённый контент',
      [ES]: 'El comentario contiene contenido prohibido',
      [AR]: 'التعليق يحتوي على محتوى محظور',
      [DE]: 'Der Kommentar enthält verbotenen Inhalt',
      [FR]: 'Le commentaire contient un contenu interdit',
      [IT]: 'Il commento contiene contenuti vietati',
    },

    authorEmail: {
      placeholder: 'your@email.com',
      ariaLabel: {
        [UA]: 'Введіть свою електронну пошту',
        [EN]: 'Enter your email',
        [RU]: 'Введите свой адрес электронной почты',
        [ES]: 'Ingrese su correo electrónico',
        [AR]: 'أدخل بريدك الإلكتروني',
        [DE]: 'Geben Sie Ihre E-Mail-Adresse ein',
        [FR]: 'Entrez votre adresse e-mail',
        [IT]: 'Inserisci il tuo indirizzo email',
      },
      labelText: {
        [UA]: 'Адреса електронної пошти (ніде не відображається)',
        [EN]: 'Email address (will not be displayed)',
        [RU]: 'Адрес электронной почты (не будет отображаться)',
        [ES]: 'Dirección de correo electrónico (no se mostrará)',
        [AR]: 'عنوان البريد الإلكتروني (لن يتم عرضه)',
        [DE]: 'E-Mail-Adresse (wird nicht angezeigt)',
        [FR]: 'Adresse e-mail (ne sera pas affichée)',
        [IT]: 'Indirizzo email (non verrà visualizzato)',
      },
      warningText: {
        [UA]: 'Не коректний формат електронної пошти!',
        [EN]: 'Incorrect email format!',
        [RU]: 'Неверный формат электронной почты!',
        [ES]: '¡Formato de correo electrónico incorrecto!',
        [AR]: 'صيغة البريد الإلكتروني غير صحيحة!',
        [DE]: 'Ungültiges E-Mail-Format!',
        [FR]: "Format d'e-mail incorrect!",
        [IT]: 'Formato e-mail non valido!',
      },
    },
    submit: {
      ariaLabel: {
        [UA]: 'Відправити коментар',
        [EN]: 'Send comment',
        [RU]: 'Отправить комментарий',
        [ES]: 'Enviar comentario',
        [AR]: 'إرسال تعليق',
        [DE]: 'Kommentar senden',
        [FR]: 'Envoyer le commentaire',
        [IT]: 'Invia commento',
      },
      innerText: {
        [UA]: 'Відправити',
        [EN]: 'Send',
        [RU]: 'Отправить',
        [ES]: 'Enviar',
        [AR]: 'إرسال',
        [DE]: 'Senden',
        [FR]: 'Envoyer',
        [IT]: 'Invia',
      },
      pendingInnerText: {
        [UA]: 'Відправлення...',
        [EN]: 'Sending...',
        [RU]: 'Отправка...',
        [ES]: 'Enviando...',
        [AR]: 'يتم الإرسال...',
        [DE]: 'Wird gesendet...',
        [FR]: 'Envoi...',
        [IT]: 'Invio...',
      },
    },
  },
  commentList: {
    commentsPerPage: 15,
    paginationOffset: 3,
    title: {
      [UA]: 'Коментарі',
      [EN]: 'Comments',
      [RU]: 'Комментарии',
      [ES]: 'Comentarios',
      [AR]: 'تعليقات',
      [DE]: 'Kommentare',
      [FR]: 'Commentaires',
      [IT]: 'Commenti',
    },
    image: {
      alt: {
        [UA]: 'Зображення поштової розсилки коментарів',
        [EN]: 'Postcard image for comments',
        [RU]: 'Изображение для комментариев',
        [ES]: 'Imagen de tarjeta para comentarios',
        [AR]: 'صورة بريدية للتعليقات',
        [DE]: 'Postkartenbild für Kommentare',
        [FR]: 'Image de carte postale pour les commentaires',
        [IT]: 'Immagine di cartolina per commenti',
      },
      src: '/Images/mail_post_to_5295.png',
    },
  },
};

export const EMAIL_DATA = {
  subjectPreTitle: {
    [UA]: 'Новий коментар до сторінки:',
    [EN]: 'New comment on the page:',
    [RU]: 'Новый комментарий к странице:',
    [ES]: 'Nuevo comentario en la página:',
    [AR]: 'تعليق جديد على الصفحة:',
    [DE]: 'Neuer Kommentar zur Seite:',
    [FR]: 'Nouveau commentaire sur la page:',
    [IT]: 'Nuovo commento sulla pagina:',
  },
};

export const DELETE_SUBSCRIPTION_PAGE = {
  meta: {
    title: 'Delete Comment Subscription',
    description: 'Remove Subscription for certain user',
    keywords: 'installsat tv resource news remove subscription',
  },
  h1: {
    [UA]: 'Видалення підписки для користувача',
    [EN]: 'Delete Subscription for user',
    [RU]: 'Удаление подписки для пользователя',
    [ES]: 'Eliminar suscripción para el usuario',
    [AR]: 'حذف الاشتراك للمستخدم',
    [DE]: 'Abonnement für Benutzer löschen',
    [FR]: "Supprimer l'abonnement pour l'utilisateur",
    [IT]: "Elimina l'abbonamento per l'utente",
  },
  askText: {
    [UA]: 'Ви впевнені, що хочете видалити підписку до сторінки',
    [EN]: 'Are you sure you want to delete the subscription to the page',
    [RU]: 'Вы уверены, что хотите удалить подписку на страницу',
    [ES]: '¿Está seguro de que desea eliminar la suscripción a la página?',
    [AR]: 'هل أنت متأكد أنك تريد حذف الاشتراك في الصفحة؟',
    [DE]: 'Sind Sie sicher, dass Sie das Abonnement für die Seite löschen möchten?',
    [FR]: "Êtes-vous sûr de vouloir supprimer l'abonnement à la page ?",
    [IT]: "Sei sicuro di voler eliminare l'abbonamento alla pagina?",
  },
  answerText: {
    [UA]: 'Вашу E-Mail адресу було вдало видалено із розсилки оновлень коментарів до сторінки',
    [EN]: 'Your E-Mail address has been successfully deleted from the newsletter updates to the page',
    [RU]: 'Ваш адрес электронной почты был успешно удален из обновлений рассылки на странице',
    [ES]: 'Su dirección de correo electrónico ha sido eliminada con éxito de las actualizaciones del boletín para la página',
    [AR]: 'تم حذف عنوان بريدك الإلكتروني بنجاح من تحديثات النشرة الإخبارية للصفحة',
    [DE]: 'Ihre E-Mail-Adresse wurde erfolgreich aus den Newsletter-Updates zur Seite gelöscht',
    [FR]: 'Votre adresse e-mail a été supprimée avec succès des mises à jour de la newsletter pour la page',
    [IT]: 'Il tuo indirizzo e-mail è stato eliminato con successo dagli aggiornamenti della newsletter per la pagina',
  },
  confirmButton: {
    ariaLabel: {
      [UA]: 'Видалити поштову адресу зі списку розсилки',
      [EN]: 'Delete E-Mail address from the newsletter list',
      [RU]: 'Удалить адрес электронной почты из списка рассылки',
      [ES]: 'Eliminar la dirección de correo electrónico de la lista de boletines',
      [AR]: 'حذف عنوان البريد الإلكتروني من قائمة النشرة',
      [DE]: 'E-Mail-Adresse aus der Newsletter-Liste löschen',
      [FR]: "Supprimer l'adresse e-mail de la liste de diffusion",
      [IT]: "Elimina l'indirizzo e-mail dalla lista della newsletter",
    },
    pendingText: {
      [UA]: 'Видалення...',
      [EN]: 'Deleting...',
      [RU]: 'Удаление...',
      [ES]: 'Eliminando...',
      [AR]: 'جارٍ الحذف...',
      [DE]: 'Löschen...',
      [FR]: 'Suppression...',
      [IT]: 'Eliminazione...',
    },
    title: {
      [UA]: 'Так',
      [EN]: 'Yes',
      [RU]: 'Да',
      [ES]: 'Sí',
      [AR]: 'نعم',
      [DE]: 'Ja',
      [FR]: 'Oui',
      [IT]: 'Sì',
    },
  },
  cancelButton: {
    ariaLabel: {
      [UA]: 'Не видаляти мою поштову адресу зі списку розсилки',
      [EN]: "Don't delete my E-Mail address from the newsletter list",
      [RU]: 'Не удалять мой адрес электронной почты из списка рассылки',
      [ES]: 'No eliminar mi dirección de correo electrónico de la lista de boletines',
      [AR]: 'لا تحذف عنوان بريدي الإلكتروني من قائمة النشرة',
      [DE]: 'Meine E-Mail-Adresse nicht aus der Newsletter-Liste löschen',
      [FR]: 'Ne pas supprimer mon adresse e-mail de la liste de diffusion',
      [IT]: 'Non eliminare il mio indirizzo e-mail dalla lista della newsletter',
    },
    title: {
      [UA]: 'Ні',
      [EN]: 'No',
      [RU]: 'Нет',
      [ES]: 'No',
      [AR]: 'لا',
      [DE]: 'Nein',
      [FR]: 'Non',
      [IT]: 'No',
    },
  },
};

export const COMMENTS_BANS_TEXT = {
  [UA]: {
    title: 'Заборонено:',
    items: [
      'Рекламувати інші ресурси',
      'Використовувати нецензурну лексику',
      'Образливо висловлюватися щодо інтересів інших користувачів',
    ],
    warning:
      'Подібні коментарі будуть редагуватися або видалятися без попередження.',
    blockMessage: 'Зловмисникам доступ до даного ресурсу буде заблоковано.',
  },
  [EN]: {
    title: 'Prohibited:',
    items: [
      'Promote other resources',
      'Use obscene language',
      'To speak offensively about the interests of other users',
    ],
    warning: 'Such comments will be edited or deleted without notice.',
    blockMessage: 'Access to this resource will be blocked for intruders.',
  },
  [RU]: {
    title: 'Запрещено:',
    items: [
      'Рекламировать другие ресурсы',
      'Использовать нецензурную лексику',
      'Оскорбительно высказываться о интересах других пользователей',
    ],
    warning:
      'Подобные комментарии будут редактироваться или удаляться без предупреждения.',
    blockMessage:
      'Доступ к этому ресурсу будет заблокирован для злоумышленников.',
  },
  [ES]: {
    title: 'Prohibido:',
    items: [
      'Promover otros recursos',
      'Usar lenguaje obsceno',
      'Hablar de manera ofensiva sobre los intereses de otros usuarios',
    ],
    warning: 'Tales comentarios serán editados o eliminados sin previo aviso.',
    blockMessage: 'El acceso a este recurso será bloqueado para intrusos.',
  },
  [AR]: {
    title: 'محظور:',
    items: [
      'الترويج لموارد أخرى',
      'استخدام لغة فاحشة',
      'التحدث بطريقة مسيئة عن اهتمامات المستخدمين الآخرين',
    ],
    warning: 'سيتم تعديل هذه التعليقات أو حذفها دون سابق إنذار.',
    blockMessage: 'سيتم حظر الوصول إلى هذه الموارد للمتسللين.',
  },
  [DE]: {
    title: 'Verboten:',
    items: [
      'Andere Ressourcen bewerben',
      'Obszöne Sprache verwenden',
      'Abfällig über die Interessen anderer Benutzer sprechen',
    ],
    warning:
      'Solche Kommentare werden ohne Vorwarnung bearbeitet oder gelöscht.',
    blockMessage:
      'Der Zugang zu dieser Ressource wird für Eindringlinge gesperrt.',
  },
  [FR]: {
    title: 'Interdit :',
    items: [
      "Promouvoir d'autres ressources",
      'Utiliser un langage obscène',
      'Parler de manière offensante des intérêts des autres utilisateurs',
    ],
    warning: 'Ces commentaires seront modifiés ou supprimés sans préavis.',
    blockMessage: 'L’accès à cette ressource sera bloqué pour les intrus.',
  },
  [IT]: {
    title: 'Proibito:',
    items: [
      'Promuovere altre risorse',
      'Usare linguaggio osceno',
      'Parlare in modo offensivo degli interessi di altri utenti',
    ],
    warning: 'Tali commenti saranno modificati o eliminati senza preavviso.',
    blockMessage: 'L’accesso a questa risorsa sarà bloccato per gli intrusi.',
  },
};
