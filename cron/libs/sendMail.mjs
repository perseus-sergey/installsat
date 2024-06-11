import nodemailer from 'nodemailer';
import '../../dotenv-config.mjs';

const MAIN_EMAIL = process.env.MAIN_EMAIL;
export async function sendMail({ to, subject, body }) {
  const MAIL_SMTP = process.env.MAIL_SMTP;
  const MAIL_SMTP_PASS = process.env.MAIL_SMTP_PASS;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MAIL_SMTP,
      pass: MAIL_SMTP_PASS,
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
      from: `Installsat <${MAIL_SMTP}>`,
      to: to || MAIN_EMAIL,
      subject,
      html: body,
    });
  } catch (error) {
    console.error(error);
  }
}
