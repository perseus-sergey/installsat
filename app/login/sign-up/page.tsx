import SignUpForm from '@/components/SignUpForm/SignUpForm';
import { Title } from '@/components/ui/Titles/Title';

export const SignUpPage = () => (
  <article className="article">
    <Title>Create new account.</Title>
    <SignUpForm />
  </article>
);

export default SignUpPage;
