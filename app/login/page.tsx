import LoginForm from '@/components/LoginForm/LoginForm';
import { Title } from '@/components/ui/Titles/Title';

export const LoginPage = () => (
  <article className="article">
    <Title>Please log in to continue.</Title>
    <LoginForm />
  </article>
);

export default LoginPage;
