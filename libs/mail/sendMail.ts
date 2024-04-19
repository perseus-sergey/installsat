'use server';

import nodemailer from 'nodemailer';

interface IProps {
  to?: string;
  subject: string;
  body: string;
}

const { MAIN_EMAIL } = process.env;
export async function sendMail({ to, subject, body }: IProps) {
  const { GOOGLE_APP_MAIL_SMTP, GOOGLE_APP_MAIL_SMTP_PASS } = process.env;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GOOGLE_APP_MAIL_SMTP,
      pass: GOOGLE_APP_MAIL_SMTP_PASS,
    },
  });

  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.error({ error });

    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: `Installsat <${GOOGLE_APP_MAIL_SMTP}>`,
      to: to || MAIN_EMAIL,
      subject,
      html: body,
    });
    console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
}
