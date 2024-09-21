import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { encrypt } from '@/libs/utils/encrypt';
import { makeUrlSearchParams } from '@/libs/utils/utils';
import { ISubscribersEmails } from '@/models/comments.model';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import {
  EUrlAdminParam,
  EUrlBaseParam,
  EUrlSearchParam,
} from '@/models/url.model';

const {
  COMMENT_DEL_ARTICLE_ID,
  COMMENT_DEL_ARTICLE_NAME,
  COMMENT_DEL_AUTHOR_EMAIL,
  COMMENT_DEL_DB_TABLE,
} = EUrlSearchParam;

interface IEmailTemplateProps {
  authorName: string | undefined;
  commentText: string | undefined;
  authorEmail: string | undefined;
  articleName: string;
  articleId: string | number;
  articlePath: string;
  baseUrl: string;
  emailKey: string;
  tblCommentName: EDBTableTitles;
  subscribers?: ISubscribersEmails[];
  lang: ELanguage;
}

export const getCommentToAdminEmail = async ({
  authorName = '',
  authorEmail = '',
  commentText = '',
  articleName,
  articlePath,
  articleId,
  tblCommentName,
  subscribers,
  baseUrl,
  emailKey,
}: IEmailTemplateProps) => {
  const commentSearchParams = makeUrlSearchParams({
    [COMMENT_DEL_ARTICLE_ID]: await encrypt(articleId, emailKey),
    [COMMENT_DEL_DB_TABLE]: await encrypt(tblCommentName || '', emailKey),
  });
  const commentEditUrl = `${baseUrl}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.EDIT_COMMENT}?${commentSearchParams}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Comment to: ✧${articleName}✧</title>
        <style>
          body { background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; }
          .container { margin: 0 auto; padding: 20px 0 48px; width: 580px; max-width: 100%; }
          .heading { font-size: 24px; line-height: 1.3; font-weight: 700; color: #484848; }
          .paragraph { font-size: 18px; line-height: 1.4; color: #484848; }
          .review { font-size: 18px; line-height: 1.4; color: #009; padding: 24px; background-color: #f2f3f3; border-radius: 4px; }
          .link { font-size: 18px; line-height: 1.4; color: #267f00; display: block; text-decoration: none; }
          .coloredText { color: #267f00; }
          .reportLink { font-size: 14px; color: #9ca299; text-decoration: underline; }
          .hr { border-bottom: 2px groove #e2e2e2; margin: 20px 0; }
          .footer { color: #9ca299; font-size: 14px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td>
              <h1 class="heading">
                New Comment to:
                <br />
                <a href="${baseUrl}${articlePath}" class="link" target="_blank">
                  ✧${articleName}✧
                </a>
              </h1>
            </td>
          </tr>
          <tr>
            <td>
              <hr class="hr" />
              <p class="heading">Author: <span class="coloredText">${authorName}</span></p>
              <p class="heading">EMAIL: <span class="coloredText">${authorEmail}</span></p>
              <hr class="hr" />
              <p class="heading">Content:</p>
              <p class="review"><em>${commentText || ''}</em></p>
              <hr class="hr" />
            </td>
          </tr>

          ${
            subscribers && subscribers.length > 0
              ? `
            <tr>
              <td>
                <p class="heading">Sent to subscribers:</p>
                <ul>
                  ${subscribers
                    .map(
                      ({ author, date, mail }) => `
                    <li>${author}: ${mail} (${getFormattedDateStrYearFirst(date)})</li>
                  `
                    )
                    .join('')}
                </ul>
                <hr class="hr" />
              </td>
            </tr>
          `
              : ''
          }

          <tr>
            <td>
              <p class="footer">
                <a href="${commentEditUrl}" target="_blank" class="reportLink" style="color: #267f00;">
                  Edit comments for this page
                </a>
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const getCommentToUserEmail = async ({
  authorName,
  authorEmail,
  commentText,
  articleId,
  articleName,
  articlePath,
  tblCommentName,
  baseUrl,
  emailKey,
  lang,
}: IEmailTemplateProps) => {
  const styledArticleName = `✧${articleName}✧`;
  const previewText =
    lang === ELanguage.UA
      ? `Залишено новий коментар від ${authorName || ''} на сторінці ${styledArticleName}`
      : `The new comment from ${authorName || ''} was left on the page ${styledArticleName}`;
  const delCommentSearchParams = makeUrlSearchParams({
    [COMMENT_DEL_AUTHOR_EMAIL]: authorEmail || '',
    [COMMENT_DEL_ARTICLE_ID]: await encrypt(articleId, emailKey),
    [COMMENT_DEL_ARTICLE_NAME]: articleName,
    [COMMENT_DEL_DB_TABLE]: await encrypt(tblCommentName || '', emailKey),
  });
  const removeSubscriptionUrl = `${baseUrl}/${lang}/${EUrlBaseParam.DELETE_COMMENT_SUBSCRIPTION}?${delCommentSearchParams}`;

  return `
    <!DOCTYPE html>
    <html lang="${lang === ELanguage.UA ? 'uk' : 'en'}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${lang === ELanguage.UA ? 'Новий коментар до сторінки' : 'New comment for page'}: ${styledArticleName}</title>
        <meta name="description" content="${previewText}" />
        <style>
          body { background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; }
          .container { margin: 0 auto; padding: 20px 0 48px; width: 580px; max-width: 100%; }
          .heading { font-size: 24px; line-height: 1.3; font-weight: 700; color: #484848; }
          .paragraph { font-size: 18px; line-height: 1.4; color: #484848; }
          .review { font-size: 18px; line-height: 1.4; color: #009; padding: 24px; background-color: #f2f3f3; border-radius: 4px; }
          .link { font-size: 18px; line-height: 1.4; color: #267f00; display: block; text-decoration: none; }
          .coloredText { color: #267f00; }
          .reportLink { font-size: 14px; color: #9ca299; text-decoration: underline; }
          .hr { border-bottom: 2px groove #e2e2e2; margin: 20px 0; }
          .footer { color: #9ca299; font-size: 14px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div style="display: none; opacity: 0; visibility: hidden; height: 0; max-height: 0; max-width: 0; overflow: hidden;">${previewText}</div>
        <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="text-align: right;">
              <a href="${baseUrl}/${lang}" target="_blank">
                <img src="${baseUrl}/Images/installsat_mail.jpg" width="212" height="90" alt="Installsat logo" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 20px;">
              <h1 class="heading">
                ${lang === ELanguage.UA ? 'Додано новий коментар до сторінки:' : 'New comment added to the page:'}
                <br />
                <a href="${baseUrl}${articlePath}" class="link" target="_blank">${styledArticleName}</a>
              </h1>

              <p class="heading">${lang === ELanguage.UA ? 'Додав:' : 'Author:'} <span class="coloredText">${authorName}</span></p>
              <hr class="hr" />

              <p class="heading">${lang === ELanguage.UA ? 'Зміст:' : 'Content:'}</p>
              <p class="review"><em>${commentText || ''}</em></p>

              <hr class="hr" />
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 20px;">
              <p class="paragraph">
                ${lang === ELanguage.UA ? 'Читати повністю коментар на сторінці' : 'Read the full comment on the page'}:
                <a href="${baseUrl}${articlePath}" class="link" target="_blank">${articleName}</a>
              </p>
              <p class="paragraph">
                ${
                  lang === ELanguage.UA
                    ? 'Коментар може бути схвалений або вилучений після перевірки модератором.'
                    : 'A comment can be approved or removed after review by a moderator.'
                }
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <hr class="hr" />
              <p class="paragraph" style="font-weight: 700;">
                ${lang === ELanguage.UA ? 'Дякуємо за інтерес до нашого сайту' : 'Thank you for your interest in our site'}
                <br />
                ${lang === ELanguage.UA ? 'З повагою' : 'Cencarelly'},<br />
                ${lang === ELanguage.UA ? 'Адміністрація сайту' : 'Site administration'} <a href="${baseUrl}/${lang}" target="_blank"><span class="coloredText">Installsat.TV</span></a>
              </p>

              <hr class="hr" />

              <p class="paragraph" style="font-size: 1rem;">
                ${
                  lang === ELanguage.UA
                    ? 'На це листування не потрібно відповідати, воно було створено автоматично.'
                    : 'You do not need to reply to this correspondence, it was created automatically.'
                }
                <br />
                ${
                  lang === ELanguage.UA
                    ? 'Для відповіді на коментар, будь ласка, перейдіть на відповідну сторінку сайту'
                    : 'To respond to a comment, please go to the relevant page of the site'
                }: 
                <a href="${baseUrl}${articlePath}#${EUrlSearchParam.COMMENT_ID}" target="_blank">
                  <span class="coloredText">${articleName}</span>
                </a>
              </p>
              <p class="footer">
                ${
                  lang === ELanguage.UA
                    ? 'Щоб відписатися від сповіщень про нові коментарі на цій сторінці, перейдіть за'
                    : 'To unsubscribe from notifications of new comments on this page, go to'
                }: 
                <a href="${removeSubscriptionUrl}" class="reportLink" target="_blank">
                  <span class="coloredText">${lang === ELanguage.UA ? 'ПОСИЛАННЯМ' : 'LINK'}</span>
                </a>
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
