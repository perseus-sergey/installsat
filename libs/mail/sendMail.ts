'use server';

import nodemailer from 'nodemailer';

interface IProps {
  to?: string;
  subject: string;
  body: string;
}

const MAIN_EMAIL = process.env.MAIN_EMAIL;
export async function sendMail({ to, subject, body }: IProps) {
  const GOOGLE_APP_MAIL_SMTP = process.env.GOOGLE_APP_MAIL_SMTP;
  const GOOGLE_APP_MAIL_SMTP_PASS = process.env.GOOGLE_APP_MAIL_SMTP_PASS;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GOOGLE_APP_MAIL_SMTP,
      pass: GOOGLE_APP_MAIL_SMTP_PASS,
    },
  });

  try {
    await transport.verify();
  } catch (error) {
    console.error({ error });

    return;
  }

  try {
    await transport.sendMail({
      from: `Installsat <${GOOGLE_APP_MAIL_SMTP}>`,
      to: to || MAIN_EMAIL,
      subject,
      html: body,
    });
  } catch (error) {
    console.error(error);
  }
}
