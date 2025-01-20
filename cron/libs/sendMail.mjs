import nodemailer from 'nodemailer';
import '../../dotenv-config.mjs';

const makeMailHtml = (title, body) => `
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center">
        <p style="color: green; font-size: 24px; padding: 10px 0">${title}</p>
        <hr />
        ${body}
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export async function sendMail({ to = undefined, subject, title, body }) {
  const MAIN_EMAIL = process.env.MAIN_EMAIL;
  const MAIL_SMTP_PASS = process.env.MAIL_SMTP_PASS;
  const SMTP_HOST = 'smtp.hostinger.com';
  const SMTP_PORT = 465;

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
      html: makeMailHtml(title, body),
    });
  } catch (error) {
    console.error(error);
  }
}
