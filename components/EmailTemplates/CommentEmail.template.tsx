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
import { IUserLocation } from '@/models/userLocation.model';
import {
  Heading,
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

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
  articleId: string;
  articlePath: string;
  baseUrl: string;
  emailKey: string;
  tblCommentName: EDBTableTitles;
  subscribers?: ISubscribersEmails[];
  userLocation?: IUserLocation | null;
  lang: ELanguage;
}

export const CommentToAdminEmail = async ({
  authorName = '',
  authorEmail = '',
  commentText = '',
  articleName,
  articlePath,
  articleId,
  tblCommentName,
  subscribers,
  userLocation,
  baseUrl,
  emailKey,
}: IEmailTemplateProps) => {
  const commentSearchParams = makeUrlSearchParams({
    [COMMENT_DEL_ARTICLE_ID]: await encrypt(articleId, emailKey),
    [COMMENT_DEL_DB_TABLE]: await encrypt(tblCommentName || '', emailKey),
  });
  const commentEditUrl = `${baseUrl}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.EDIT_COMMENT}?${commentSearchParams}`;

  return (
    <Html>
      <Heading as="h1">
        New Comment to:
        <br />
        <Link
          href={`${baseUrl}${articlePath}`}
          style={{ ...link, fontSize: '20px' }}
          target="_blank"
        >
          {`✧${articleName}✧`}
        </Link>
      </Heading>

      <Hr style={hr} />

      <Text style={heading}>
        Author:
        <span style={coloredText}> {authorName}</span>
      </Text>

      <Text style={heading}>
        EMAIL:
        <span style={coloredText}> {authorEmail}</span>
      </Text>

      <Text style={heading}>
        IP:
        <span style={coloredText}>
          {' '}
          {userLocation && userLocation.status === 'success'
            ? userLocation.query
            : 'Not defined'}
        </span>
      </Text>

      <Text style={heading}>
        Country:
        <span style={coloredText}>
          {' '}
          {userLocation && userLocation.status === 'success'
            ? `${userLocation.country} / ${userLocation.city}`
            : 'Not defined'}
        </span>
      </Text>

      <Hr style={hr} />

      <Text style={heading}>Content:</Text>
      <Text style={review}>
        <em>{commentText}</em>
      </Text>

      <Hr style={hr} />

      {subscribers && subscribers.length > 0 && (
        <>
          <Text style={heading}>Sent to subscribers:</Text>
          <Text>
            <ul>
              {subscribers.map(({ author, date, mail }) => (
                <li key={mail}>
                  {author}: {mail} ({getFormattedDateStrYearFirst(date)})
                </li>
              ))}
            </ul>
          </Text>
          <Hr style={hr} />
        </>
      )}

      <Text style={footer}>
        <Link
          href={commentEditUrl}
          target="_blank"
          style={{ ...reportLink, color: '#267f00' }}
        >
          Edit comments for this page
        </Link>
      </Text>
    </Html>
  );
};

export const CommentToUserEmail = async ({
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
      ? `Залишено новий коментар від ${authorName || ''}' на сторінці ${styledArticleName}`
      : `The new comment from ${authorName || ''}' was left on the page ${styledArticleName}`;
  const delCommentSearchParams = makeUrlSearchParams({
    [COMMENT_DEL_AUTHOR_EMAIL]: authorEmail || '',
    [COMMENT_DEL_ARTICLE_ID]: await encrypt(articleId, emailKey),
    [COMMENT_DEL_ARTICLE_NAME]: articleName,
    [COMMENT_DEL_DB_TABLE]: await encrypt(tblCommentName || '', emailKey),
  });
  const removeSubscriptionUrl = `${baseUrl}/${EUrlBaseParam.DELETE_COMMENT_SUBSCRIPTION}?${delCommentSearchParams}`;

  return (
    <Html lang={lang === ELanguage.UA ? 'uk' : 'en'}>
      <Preview>{previewText}</Preview>
      <Head>
        <title>{`${lang === ELanguage.UA ? 'Новий коментар до сторінки' : 'New comment for page'}: ${styledArticleName}`}</title>
      </Head>

      <Body style={main}>
        <Container style={container}>
          <Section style={{ textAlign: 'right' }}>
            <Link
              href={`${baseUrl}`}
              target="_blank"
              style={{ display: 'inline-block' }}
            >
              <Img
                src={`${baseUrl}/Images/installsat_mail.jpg`}
                width="212"
                height="90"
                alt="Installsat logo"
              />
            </Link>
          </Section>
          <Section style={{ paddingBottom: '20px' }}>
            <Row>
              <Text style={heading}>
                {lang === ELanguage.UA
                  ? 'Додано новий коментар до сторінки:'
                  : 'New comment added to the page:'}
                <br />
                <Link
                  href={`${baseUrl}${articlePath}`}
                  style={{ ...link, fontSize: '20px' }}
                  target="_blank"
                >
                  {styledArticleName}
                </Link>
              </Text>

              <Text style={heading}>
                {lang === ELanguage.UA ? 'Додав:' : 'Author:'}
                <span style={coloredText}> {authorName}</span>
              </Text>

              <Hr style={hr} />

              <Text style={heading}>
                {lang === ELanguage.UA ? 'Зміст:' : 'Content:'}
              </Text>
              <Text style={review}>
                <em>{commentText || ''}</em>
              </Text>

              <Hr style={hr} />
            </Row>
          </Section>

          <Section style={{ paddingBottom: '20px' }}>
            <Row>
              <Text style={paragraph}>
                {lang === ELanguage.UA
                  ? 'Читати повністю коментар на сторінці'
                  : 'Read the full comment on the page'}
                <Link
                  href={`${baseUrl}${articlePath}`}
                  style={link}
                  target="_blank"
                >
                  {articleName}
                </Link>
              </Text>
              <Text style={paragraph}>
                {lang === ELanguage.UA
                  ? 'Коментар може бути схвалений або вилучений після перевірки модератором.'
                  : 'A comment can be approved or removed after review by a moderator.'}
              </Text>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Row>
              <Text style={{ ...paragraph, fontWeight: '700' }}>
                {lang === ELanguage.UA
                  ? 'Дякуємо за інтерес до нашого сайту'
                  : 'Thank you for your interest in our site'}
                <br />
                {lang === ELanguage.UA ? 'З повагою' : 'Cencarelly'},
                <br />
                {lang === ELanguage.UA
                  ? 'Адміністрація сайту'
                  : 'Site administration'}{' '}
                <Link href={baseUrl} target="_blank">
                  <span style={coloredText}>Installsat.TV</span>
                </Link>
              </Text>

              <Hr style={hr} />

              <Text style={{ ...paragraph, fontSize: '1rem' }}>
                {lang === ELanguage.UA
                  ? 'На це листування не потрібно відповідати, воно було створено автоматично.'
                  : 'You do not need to reply to this correspondence, it was created automatically.'}
                <br />
                {lang === ELanguage.UA
                  ? 'Для відповіді на коментар, будь ласка, перейдіть на відповідну сторінку сайту'
                  : 'To respond to a comment, please go to the relevant page of the site'}
                :{' '}
                <Link
                  href={`${baseUrl}${articlePath}#${EUrlSearchParam.COMMENT_ID}`}
                  target="_blank"
                >
                  <span style={coloredText}>{articleName}</span>
                </Link>
              </Text>
              <Text style={footer}>
                {lang === ELanguage.UA
                  ? 'Щоб відписатися від сповіщень про нові коментарі на цій сторінці, перейдіть за'
                  : 'To unsubscribe from notifications of new comments on this page, go to'}{' '}
                <Link
                  href={removeSubscriptionUrl}
                  target="_blank"
                  style={{ ...reportLink, color: '#267f00' }}
                >
                  <span style={coloredText}>
                    {lang === ELanguage.UA ? 'ПОСИЛАННЯМ' : 'LINK'}
                  </span>
                </Link>
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
};

const review = {
  ...paragraph,
  color: '#009',
  padding: '24px',
  backgroundColor: '#f2f3f3',
  borderRadius: '4px',
};

const link = {
  ...paragraph,
  color: '#267f00',
  display: 'block',
};

const coloredText = {
  color: '#267f00',
};

const reportLink = {
  fontSize: '14px',
  color: '#9ca299',
  textDecoration: 'underline',
};

const hr = {
  borderBottom: '2px groove #e2e2e2',
  margin: '20px 0',
};

const footer = {
  color: '#9ca299',
  fontSize: '14px',
  marginBottom: '10px',
};
