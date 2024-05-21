import SignUpForm from '@/components/SignUpForm/SignUpForm';
import { Title } from '@/components/ui/Titles/Title';

export const LoginPage = () => (
  <article className="article">
    <Title>Please log in to continue.</Title>
    <SignUpForm isLoginForm />
  </article>
);

export default LoginPage;
