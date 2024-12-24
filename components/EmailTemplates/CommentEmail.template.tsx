import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { encrypt } from '@/libs/utils/encrypt';
import { ISubscribersEmails } from '@/models/ui/comments.model';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { EUrlBaseParam } from '@/models/url/url.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';
// import { IUserLocation } from '@/models/userLocation.model';
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
import { makeUrlSearchParams } from '@/libs/utils/urlMaker';
import { USER_COMMENT_MODEL } from '@/models/ui/commentsEmail.model';

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
  // userLocation?: IUserLocation | null;
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
  // userLocation,
  baseUrl,
  emailKey,
}: IEmailTemplateProps) => {
  const commentSearchParams = makeUrlSearchParams({
    [COMMENT_DEL_ARTICLE_ID]: await encrypt(articleId, emailKey),
    [COMMENT_DEL_DB_TABLE]: await encrypt(tblCommentName || '', emailKey),
  });
  const commentEditUrl = `${baseUrl}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.EDIT_COMMENT}?${commentSearchParams}`;

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

      {/* <Text style={heading}>
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
      </Text> */}

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
                  {author}: {mail} (
                  {getFormattedDateStrYearFirst(date, DEFAULT_LANG)})
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
  const {
    preTitle,
    preCaption,
    authorCaption,
    contentCaption,
    articleLinkTitle,
    contentCheckWarning,
    thanks,
    cencarelly,
    siteAdmin,
    notReply,
    toRespond,
    unsubscribe,
    unsubscribeLink,
    getPreviewText,
  } = USER_COMMENT_MODEL;

  const styledArticleName = `✧${articleName}✧`;
  const previewText = getPreviewText(styledArticleName, authorName)[lang];

  const delCommentSearchParams = makeUrlSearchParams({
    [COMMENT_DEL_AUTHOR_EMAIL]: authorEmail || '',
    [COMMENT_DEL_ARTICLE_ID]: await encrypt(articleId, emailKey),
    [COMMENT_DEL_ARTICLE_NAME]: articleName,
    [COMMENT_DEL_DB_TABLE]: await encrypt(tblCommentName || '', emailKey),
  });
  const removeSubscriptionUrl = `${baseUrl}/${lang}/${EUrlBaseParam.DELETE_COMMENT_SUBSCRIPTION}?${delCommentSearchParams}`;

  const languageMap: { [_key in ELanguage]: string } = {
    [ELanguage.UA]: 'uk',
    [ELanguage.EN]: 'en',
    [ELanguage.RU]: 'ru',
    [ELanguage.ES]: 'es',
    [ELanguage.AR]: 'ar',
    [ELanguage.DE]: 'de',
    [ELanguage.FR]: 'fr',
    [ELanguage.IT]: 'it',
  };

  return (
    <Html
      lang={languageMap[lang] || 'en'}
      dir={lang === ELanguage.AR ? 'rtl' : 'ltr'}
    >
      <Preview>{previewText}</Preview>
      <Head>
        <title>{`${preTitle[lang]}: ${styledArticleName}`}</title>
      </Head>

      <Body style={main}>
        <Container style={container}>
          <Section style={{ textAlign: 'right' }}>
            <Link
              href={`${baseUrl}/${lang}`}
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
                {preCaption[lang]}
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
                {authorCaption[lang]}
                <span style={coloredText}> {authorName}</span>
              </Text>

              <Hr style={hr} />

              <Text style={heading}>{contentCaption[lang]}</Text>
              <Text style={review}>
                <em>{commentText || ''}</em>
              </Text>

              <Hr style={hr} />
            </Row>
          </Section>

          <Section style={{ paddingBottom: '20px' }}>
            <Row>
              <Text style={paragraph}>
                {articleLinkTitle[lang]}
                <Link
                  href={`${baseUrl}${articlePath}`}
                  style={link}
                  target="_blank"
                >
                  {articleName}
                </Link>
              </Text>
              <Text style={paragraph}>{contentCheckWarning[lang]}</Text>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Row>
              <Text style={{ ...paragraph, fontWeight: '700' }}>
                {thanks[lang]}
                <br />
                {cencarelly[lang]},
                <br />
                {siteAdmin[lang]}{' '}
                <Link href={`${baseUrl}/${lang}`} target="_blank">
                  <span style={coloredText}>Installsat.TV</span>
                </Link>
              </Text>

              <Hr style={hr} />

              <Text style={{ ...paragraph, fontSize: '1rem' }}>
                {notReply[lang]}
                <br />
                {toRespond[lang]}:{' '}
                <Link
                  href={`${baseUrl}${articlePath}#${EUrlSearchParam.COMMENT_ID}`}
                  target="_blank"
                >
                  <span style={coloredText}>{articleName}</span>
                </Link>
              </Text>
              <Text style={footer}>
                {unsubscribe[lang]}{' '}
                <Link
                  href={removeSubscriptionUrl}
                  target="_blank"
                  style={{ ...reportLink, color: '#267f00' }}
                >
                  <span style={coloredText}>{unsubscribeLink[lang]}</span>
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
