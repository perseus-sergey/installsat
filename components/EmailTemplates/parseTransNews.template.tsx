import { Heading, Hr, Html, Link, Text } from '@react-email/components';
import * as React from 'react';

interface IEmailTemplateProps {
  pathToMainParsePage: string;
  dbTableLength?: string;
  errorMessages: string[];
  dbTableHref?: string;
  hrefSources?: string[];
}

export const ParseTransNews = async ({
  pathToMainParsePage,
  dbTableLength,
  errorMessages,
}: IEmailTemplateProps) => {
  return (
    <Html>
      <Heading as="h1">
        <Link
          href={`${pathToMainParsePage}`}
          style={{ ...link, fontSize: '20px' }}
          target="_blank"
        >
          Parse Trans News
        </Link>
      </Heading>

      <Hr style={hr} />

      <Text style={heading}>
        The number of records in the database table:
        <span style={coloredText}> {dbTableLength}</span>
      </Text>

      {errorMessages.length > 0 && (
        <>
          <Text style={heading}>Messages:</Text>
          <ul>
            {errorMessages.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </>
      )}

      <Hr style={hr} />

      <Text style={footer}>
        <Link
          href={`${pathToMainParsePage}`}
          target="_blank"
          style={{ ...reportLink, color: '#267f00' }}
        >
          Parse Transponder news again
        </Link>
      </Text>
    </Html>
  );
};

export const ParseSatNewsTemplate = async ({
  pathToMainParsePage,
  errorMessages,
  dbTableHref,
  hrefSources,
}: IEmailTemplateProps) => {
  return (
    <Html>
      <Heading as="h1">
        <Link
          href={`${pathToMainParsePage}`}
          style={{ ...link, fontSize: '20px' }}
          target="_blank"
        >
          Parse Satellite News
        </Link>
      </Heading>

      <Hr style={hr} />

      {errorMessages.length > 0 && (
        <>
          <Text style={heading}>Messages:</Text>
          <ul>
            {errorMessages.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </>
      )}
      <Text style={footer}>
        <Link
          href={dbTableHref}
          target="_blank"
          style={{ ...reportLink, color: '#267f00' }}
        >
          DB Table
        </Link>

        {hrefSources && hrefSources.length > 0 && (
          <>
            <Text style={heading}>Messages:</Text>
            <ul>
              {hrefSources.map((source, i) => (
                <li key={i}>
                  <Link
                    href={source}
                    target="_blank"
                    style={{ ...reportLink, color: '#267f00' }}
                  >
                    {source}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Text>
    </Html>
  );
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

const link = {
  ...paragraph,
  color: '#267f00',
  display: 'block',
};

const coloredText = {
  color: '#267f00',
};

// const redText = {
//   color: 'red',
// };

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
