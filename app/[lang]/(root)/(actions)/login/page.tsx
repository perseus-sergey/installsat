import { auth } from '@/auth';
import SignUpForm from '@/components/SignUpForm/SignUpForm';
import { Title } from '@/components/ui/Titles/Title';
import { ELanguage } from '@/models/ui.model';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  if (await auth()) return redirect(`/${ELanguage.EN}`);

  return (
    <article className="article">
      {/* Auth: {JSON.stringify(await auth())} */}
      <Title>Please log in to continue.</Title>
      <SignUpForm isLoginForm />
    </article>
  );
};

export default LoginPage;
