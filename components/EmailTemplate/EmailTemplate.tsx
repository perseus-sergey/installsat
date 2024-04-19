'use server';

import { makeUrlSearchParams } from '@/libs/utils';
import { encrypt } from '@/libs/utilsServer';
import { EDBTableTitles } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
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

const baseUrl = process.env.BASE_URL || '';
const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

interface IEmailTemplateProps {
  authorName: string;
  commentText: string;
  authorEmail: string;
  articleId?: number;
  articleName?: string;
  articlePath?: string;
  tblCommentName?: EDBTableTitles;
}

export const CommentToAdminEmail = ({
  authorName,
  authorEmail,
  commentText,
}: IEmailTemplateProps) => {
  return (
    <Html lang="en">
      <Heading as="h1">New Form Submission</Heading>
      <Text>You just submitted a form. Here are the details:</Text>
      <Text>Name: {authorName}</Text>
      <Text>Email: {authorEmail}</Text>
      <Text>Message: {commentText}</Text>
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
}: IEmailTemplateProps) => {
  const previewText = `Read ${authorName}'s comment`;
  const delCommentSearchParams = makeUrlSearchParams({
    [COMMENT_DEL_AUTHOR_EMAIL]: authorEmail,
    [COMMENT_DEL_ARTICLE_ID]: await encrypt(`${articleId}`, emailKey),
    [COMMENT_DEL_ARTICLE_NAME]: articleName,
    [COMMENT_DEL_DB_TABLE]: await encrypt(tblCommentName || '', emailKey),
  });
  const removeSubscriptionUrl = `${baseUrl}/${EUrlBaseParam.DELETE_COMMENT_SUBSCRIPTION}?${delCommentSearchParams}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

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
                Додано новий коментар до сторінки:
                <br />
                <Link
                  href={`${baseUrl}${articlePath}`}
                  style={{ ...link, fontSize: '20px' }}
                  target="_blank"
                >
                  {`✧${articleName}✧`}
                </Link>
              </Text>

              <Text style={heading}>
                Додав:
                <span style={coloredText}> {authorName}</span>
              </Text>

              <Hr style={hr} />

              <Text style={heading}>Зміст:</Text>
              <Text style={review}>
                <em>{commentText}</em>
              </Text>

              <Hr style={hr} />
            </Row>
          </Section>

          <Section style={{ paddingBottom: '20px' }}>
            <Row>
              <Text style={paragraph}>
                Читати повністю коментар на сторінці
                <Link
                  href={`${baseUrl}${articlePath}`}
                  style={link}
                  target="_blank"
                >
                  {articleName}
                </Link>
              </Text>
              <Text style={paragraph}>
                Коментар може бути схвалений або вилучений після перевірки
                модератором.
              </Text>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Row>
              <Text style={{ ...paragraph, fontWeight: '700' }}>
                Дякуємо за інтерес до нашого сайту
                <br />
                З повагою,
                <br />
                Адміністрація сайту{' '}
                <Link href={baseUrl} target="_blank">
                  <span style={coloredText}>Installsat.TV</span>
                </Link>
              </Text>

              <Hr style={hr} />

              <Text style={{ ...paragraph, fontSize: '1rem' }}>
                На це листування не потрібно відповідати, воно було створено
                автоматично.
                <br />
                Для відповіді на коментар, будь ласка, перейдіть на відповідну
                сторінку сайту:{' '}
                <Link href={`${baseUrl}${articlePath}`} target="_blank">
                  <span style={coloredText}>{articleName}</span>
                </Link>
              </Text>
              <Text style={footer}>
                Щоб відписатися від сповіщень про нові коментарі на цій
                сторінці, перейдіть за{' '}
                <Link
                  href={removeSubscriptionUrl}
                  target="_blank"
                  style={{ ...reportLink, color: '#267f00' }}
                >
                  <span style={coloredText}>ПОСИЛАННЯМ</span>
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
  // fontFamily:
  //   '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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
