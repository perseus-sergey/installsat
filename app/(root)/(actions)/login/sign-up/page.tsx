import SignUpForm from '@/components/SignUpForm/SignUpForm';
import { Title } from '@/components/ui/Titles/Title';

const SignUpPage = () => (
  <article className="article">
    <Title>Create a new account.</Title>
    <SignUpForm />
  </article>
);

export default SignUpPage;
