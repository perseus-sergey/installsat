import { translateChannels } from './libs/channelTranslate.controller.mjs';
import { sendMail } from './libs/sendMail.mjs';

// =================================================================
// trans news (main page) reduce number of days to 14 and add limit to sql request 70*days
// logs rotation
// =================================================================

const sendReportMail = async (messages, quantity) => {
  const reportMessages = messages.length
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p><ul style="padding-bottom: 10px">${messages.map((msg) => `<li>${msg}</li>`).join('')}</ul>`
    : '';

  await sendMail({
    title: `AI translating "${quantity}" FLY channels`,
    subject: `AI translating "${quantity}" FLY channels`,
    body: reportMessages,
  });
};

const R_U_N = async () => {
  const quantity = 30;

  const messages = await translateChannels(quantity);

  await sendReportMail(messages, quantity);
};

R_U_N();
