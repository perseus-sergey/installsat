import { Title } from '@/components/ui/Titles/Title';
import { sendMail } from '@/libs/mail/sendMail';

export const dynamic = 'force-dynamic';

// =================================================================
// Email sending test
// =================================================================

const sendReportMail = async () => {
  console.log('🚀 ~ sendReportMail ~ START');

  await sendMail({
    subject: `Parse Fly Satellites`,
    body: 'Test Message',
  });
};

export default async function Page() {
  await sendReportMail();

  return <Title>EMAIL TESTING</Title>;
}
