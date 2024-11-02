import { ELanguage } from '../language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const USER_COMMENT_MODEL = {
  getPreviewText(articleName: string, authorName: string = '') {
    return {
      [UA]: `Залишено новий коментар від ${authorName} на сторінці ${articleName}`,
      [EN]: `A new comment from ${authorName} was left on the page ${articleName}`,
      [RU]: `Оставлен новый комментарий от ${authorName} на странице ${articleName}`,
      [ES]: `Se dejó un nuevo comentario de ${authorName} en la página ${articleName}`,
      [AR]: `تم ترك تعليق جديد من ${authorName} على الصفحة ${articleName}`,
      [DE]: `Ein neuer Kommentar von ${authorName} wurde auf der Seite ${articleName} hinterlassen`,
      [FR]: `Un nouveau commentaire de ${authorName} a été laissé sur la page ${articleName}`,
      [IT]: `È stato lasciato un nuovo commento da ${authorName} sulla pagina ${articleName}`,
    };
  },

  preTitle: {
    [UA]: 'Новий коментар до сторінки:',
    [EN]: 'New comment on the page:',
    [RU]: 'Новый комментарий к странице:',
    [ES]: 'Nuevo comentario en la página:',
    [AR]: 'تعليق جديد على الصفحة:',
    [DE]: 'Neuer Kommentar zur Seite:',
    [FR]: 'Nouveau commentaire sur la page:',
    [IT]: 'Nuovo commento sulla pagina:',
  },

  preCaption: {
    [UA]: 'Додано новий коментар до сторінки:',
    [EN]: 'A new comment has been added to the page:',
    [RU]: 'Добавлен новый комментарий к странице:',
    [ES]: 'Se ha agregado un nuevo comentario a la página:',
    [AR]: 'تمت إضافة تعليق جديد إلى الصفحة:',
    [DE]: 'Ein neuer Kommentar wurde zur Seite hinzugefügt:',
    [FR]: 'Un nouveau commentaire a été ajouté à la page:',
    [IT]: 'È stato aggiunto un nuovo commento alla pagina:',
  },

  authorCaption: {
    [UA]: 'Додав:',
    [EN]: 'Author:',
    [RU]: 'Автор:',
    [ES]: 'Autor:',
    [AR]: 'المؤلف:',
    [DE]: 'Autor:',
    [FR]: 'Auteur:',
    [IT]: 'Autore:',
  },

  articleLinkTitle: {
    [UA]: 'Читати повністю коментар на сторінці',
    [EN]: 'Read the full comment on the page',
    [RU]: 'Читать полный комментарий на странице',
    [ES]: 'Leer el comentario completo en la página',
    [AR]: 'اقرأ التعليق الكامل على الصفحة',
    [DE]: 'Den gesamten Kommentar auf der Seite lesen',
    [FR]: 'Lire le commentaire complet sur la page',
    [IT]: 'Leggi il commento completo sulla pagina',
  },

  contentCaption: {
    [UA]: 'Зміст:',
    [EN]: 'Content:',
    [RU]: 'Содержание:',
    [ES]: 'Contenido:',
    [AR]: 'المحتوى:',
    [DE]: 'Inhalt:',
    [FR]: 'Contenu:',
    [IT]: 'Contenuto:',
  },

  cencarelly: {
    [UA]: 'З повагою',
    [EN]: 'Cencarelly',
    [RU]: 'С уважением',
    [ES]: 'Atentamente',
    [AR]: 'مع الاحترام',
    [DE]: 'Mit freundlichen Grüßen',
    [FR]: 'Cordialement',
    [IT]: 'Cordiali saluti',
  },

  siteAdmin: {
    [UA]: 'Адміністрація сайту',
    [EN]: 'Site administration',
    [RU]: 'Администрация сайта',
    [ES]: 'Administración del sitio',
    [AR]: 'إدارة الموقع',
    [DE]: 'Website-Administration',
    [FR]: 'Administration du site',
    [IT]: 'Amministrazione del sito',
  },

  thanks: {
    [UA]: 'Дякуємо за інтерес до нашого сайту',
    [EN]: 'Thank you for your interest in our site',
    [RU]: 'Спасибо за интерес к нашему сайту',
    [ES]: 'Gracias por su interés en nuestro sitio',
    [AR]: 'شكرًا لاهتمامك بموقعنا',
    [DE]: 'Danke für Ihr Interesse an unserer Website',
    [FR]: 'Merci de votre intérêt pour notre site',
    [IT]: 'Grazie per il tuo interesse nel nostro sito',
  },

  notReply: {
    [UA]: 'На це листування не потрібно відповідати, воно було створено автоматично.',
    [EN]: 'No reply is needed for this correspondence, it was created automatically.',
    [RU]: 'На это письмо не нужно отвечать, оно создано автоматически.',
    [ES]: 'No es necesario responder a esta correspondencia, fue creada automáticamente.',
    [AR]: 'لا حاجة للرد على هذه المراسلة ، فقد تم إنشاؤها تلقائيًا.',
    [DE]: 'Auf diese Korrespondenz muss nicht geantwortet werden, sie wurde automatisch erstellt.',
    [FR]: `Aucune réponse n'est nécessaire pour cette correspondance, elle a été créée automatiquement.`,
    [IT]: 'Non è necessaria alcuna risposta a questa corrispondenza, è stata creata automaticamente.',
  },

  toRespond: {
    [UA]: 'Для відповіді на коментар, будь ласка, перейдіть на відповідну сторінку сайту',
    [EN]: 'To respond to the comment, please go to the respective page of the site',
    [RU]: 'Чтобы ответить на комментарий, перейдите на соответствующую страницу сайта',
    [ES]: 'Para responder al comentario, visite la página correspondiente del sitio',
    [AR]: 'للرد على التعليق، يرجى الانتقال إلى الصفحة المعنية من الموقع',
    [DE]: 'Um auf den Kommentar zu antworten, gehen Sie bitte zur entsprechenden Seite der Website',
    [FR]: 'Pour répondre au commentaire, veuillez vous rendre sur la page correspondante du site',
    [IT]: 'Per rispondere al commento, vai alla pagina corrispondente del sito',
  },

  unsubscribe: {
    [UA]: 'Щоб відписатися від сповіщень про нові коментарі на цій сторінці, перейдіть за',
    [EN]: 'To unsubscribe from notifications about new comments on this page, go to',
    [RU]: 'Чтобы отписаться от уведомлений о новых комментариях на этой странице, перейдите по',
    [ES]: 'Para darse de baja de las notificaciones sobre nuevos comentarios en esta página, vaya al',
    [AR]: 'لإلغاء الاشتراك من الإشعارات حول التعليقات الجديدة على هذه الصفحة، انتقل إلى',
    [DE]: 'Um sich von Benachrichtigungen über neue Kommentare auf dieser Seite abzumelden, gehen Sie zum',
    [FR]: 'Pour vous désinscrire des notifications concernant les nouveaux commentaires sur cette page, allez au',
    [IT]: `Per annullare l'iscrizione alle notifiche sui nuovi commenti su questa pagina, andare al`,
  },

  unsubscribeLink: {
    [UA]: 'ПОСИЛАННЯМ',
    [EN]: 'LINK',
    [RU]: 'ССЫЛКЕ',
    [ES]: 'ENLACE',
    [AR]: 'رابط',
    [DE]: 'LINK',
    [FR]: 'LIEN',
    [IT]: 'COLLEGAMENTO',
  },

  contentCheckWarning: {
    [UA]: 'Коментар може бути схвалений або вилучений після перевірки модератором.',
    [EN]: 'The comment may be approved or removed after moderation.',
    [RU]: 'Комментарий может быть одобрен или удален после модерации.',
    [ES]: 'El comentario puede ser aprobado o eliminado después de la moderación.',
    [AR]: 'قد تتم الموافقة على التعليق أو إزالته بعد المراجعة.',
    [DE]: 'Der Kommentar kann nach der Moderation genehmigt oder entfernt werden.',
    [FR]: 'Le commentaire peut être approuvé ou supprimé après modération.',
    [IT]: 'Il commento può essere approvato o rimosso dopo la moderazione.',
  },
};
