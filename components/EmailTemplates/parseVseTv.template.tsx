import { IVseTvErrorChannel } from '@/models/scheduleTV.model';
import { Heading, Hr, Html, Link, Text } from '@react-email/components';
import * as React from 'react';

interface IEmailTemplateProps {
  dbTableHref?: string;
  pathToMainParsePage: string;
  errorChannels?: IVseTvErrorChannel[];
  dbTableLength?: string;
  allFailedChannelsUrl?: string;
  errorMessages: string[];
}

export const ParseVipikoEmailTemplate = async ({
  pathToMainParsePage,
  errorMessages,
  dbTableHref,
}: IEmailTemplateProps) => {
  return (
    <Html>
      <Heading as="h1">
        <Link
          href={`${pathToMainParsePage}`}
          style={{ ...link, fontSize: '20px' }}
          target="_blank"
        >
          Parse Schedule Vipiko
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
      </Text>
    </Html>
  );
};

export const ParseVseTvEmailTemplate = async ({
  pathToMainParsePage,
  dbTableLength,
  errorMessages,
  errorChannels,
  allFailedChannelsUrl,
}: IEmailTemplateProps) => {
  return (
    <Html>
      <Heading as="h1">
        <Link
          href={`${pathToMainParsePage}`}
          style={{ ...link, fontSize: '20px' }}
          target="_blank"
        >
          Parse Schedule VseTv
          {/* {`✧${articleName}✧`} */}
        </Link>
      </Heading>

      <Hr style={hr} />

      {dbTableLength !== undefined && (
        <Text style={heading}>
          The number of records in the database table:
          <span style={coloredText}> {dbTableLength}</span>
        </Text>
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

      {errorChannels && errorChannels.length > 0 && (
        <>
          <Text style={heading}>Channels with errors:</Text>
          <ul>
            {errorChannels.map((channel) => (
              <li key={channel.id}>
                <span>
                  <Link href={channel.channelEditUrl}>
                    Edit «{channel.title}»
                  </Link>
                  {' | '}
                  <Link
                    href={channel.sourceChannelUrl}
                    style={{ color: 'darkgray' }}
                  >
                    SOURCE
                  </Link>
                  {' | '}
                  <Link href={channel.parseUrl} style={{ color: 'darkgreen' }}>
                    Parse Again
                  </Link>
                </span>
                <span style={{ color: 'gray' }}> ({channel.error})</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <Hr style={hr} />

      <Text style={footer}>
        <Link
          href={allFailedChannelsUrl}
          target="_blank"
          style={{ ...reportLink, color: '#267f00' }}
        >
          Parse all failed channels
        </Link>
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
