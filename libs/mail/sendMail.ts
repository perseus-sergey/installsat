'use server';

interface IProps {
  to?: string;
  subject: string;
  body: string;
}

export async function sendMail({ to, subject, body }: IProps) {
  const MAIN_EMAIL = process.env.MAIN_EMAIL;
  const MAIL_SMTP_PASS = process.env.MAIL_SMTP_PASS;
  const SMTP_HOST = 'smtp.zoho.eu';
  const SMTP_PORT = 465;

  const nodemailer = await import('nodemailer');

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // true для порту 465, false для інших портів
    auth: {
      user: MAIN_EMAIL,
      pass: MAIL_SMTP_PASS,
    },
  });

  // const transport = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: MAIN_EMAIL,
  //     pass: MAIL_SMTP_PASS,
  //   },
  // });

  try {
    await transport.verify();
  } catch (error) {
    console.error({ error });

    return;
  }

  try {
    await transport.sendMail({
      from: `Installsat <${MAIN_EMAIL}>`,
      to: to || MAIN_EMAIL,
      subject,
      html: body,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
