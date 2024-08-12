import { Heading, Hr, Html, Link, Text } from '@react-email/components';
import * as React from 'react';

interface IEmailTemplateProps {
  title: string;
  pathToMainParsePage: string;
  dbTableLength?: string;
  errorMessages: string[];
  dbTableHref?: string;
  hrefSources: string[] | string;
  children?: React.ReactNode;
}

export const ParseTransNews = async ({
  title,
  pathToMainParsePage,
  dbTableLength,
  errorMessages,
  dbTableHref,
  hrefSources,
  children,
}: IEmailTemplateProps) => {
  return (
    <Html>
      <Heading as="h1">
        <Link
          href={`${pathToMainParsePage}`}
          style={{ ...link, fontSize: '20px' }}
          target="_blank"
        >
          {title}
        </Link>
      </Heading>

      <Hr style={hr} />

      {dbTableLength && (
        <Text style={heading}>
          The number of records in the database table:
          <span style={coloredText}> {dbTableLength}</span>
        </Text>
      )}

      {children && (
        <>
          <Hr style={hr} />
          {children}
          <Hr style={hr} />
        </>
      )}

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
        <ul>
          {[
            {
              href: pathToMainParsePage,
              text: 'Main Parsing Page',
            },
            {
              href: dbTableHref,
              text: 'Check DB Table',
            },
            {
              href: hrefSources,
              text: 'Source Page',
            },
          ].map(({ href, text }) => (
            <li key={text}>
              {Array.isArray(href) ? (
                <>
                  <Text style={heading}>{text}s:</Text>
                  <ul>
                    {href.map((link) => (
                      <li key={link}>
                        <Link
                          href={link}
                          target="_blank"
                          style={{ ...reportLink, color: '#267f00' }}
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={href}
                  target="_blank"
                  style={{ ...reportLink, color: '#267f00' }}
                >
                  {text}
                </Link>
              )}
            </li>
          ))}
        </ul>
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
