import nodemailer from 'nodemailer';

interface IProps {
  to: string;
  subject: string;
  body: string;
}

export async function sendMail({ to, subject, body }: IProps) {
  const { GOOGLE_APP_MAIL_SMTP, GOOGLE_APP_MAIL_SMTP_PASS } = process.env;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GOOGLE_APP_MAIL_SMTP,
      pass: GOOGLE_APP_MAIL_SMTP_PASS,
    },
  });

  const testResult = await transport.verify();

  if (testResult) {
    await transport.sendMail({
      from: GOOGLE_APP_MAIL_SMTP,
      to,
      subject,
      html: body,
    });
  }
}
