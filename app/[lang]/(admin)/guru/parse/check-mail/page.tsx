import { sendMail } from '@/libs/mail/sendMail';

export default async function Page() {
  await sendMail({
    subject: `Check Email from installsat`,
    body: '<h1>Hello from Zoho - Installsat Mail!</h1>',
  });

  return <h1 className="font-bold text-2xl text-center">Mail Sent</h1>;
}
