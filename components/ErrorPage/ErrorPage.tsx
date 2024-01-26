import styles from './ErrorPage.module.scss';
import TextButton from '../TextButton/TextButton';

interface IErrorPageProps {
  error: Error & { digest?: string };
  resetFn: () => void;
}

const ErrorPage = ({ error, resetFn }: IErrorPageProps) => (
  <section className={styles.ErrorPage}>
    <h1>Warning! Something went wrong!</h1>
    <h2>{error.message}</h2>
    <TextButton onClick={() => resetFn()}>Try again</TextButton>
  </section>
);

export default ErrorPage;
