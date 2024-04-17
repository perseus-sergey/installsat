// import styles from './ErrorPage.module.scss';
import { LANGUAGE, ERRORS } from '@/models/ui.model';
import TextButton from '../../ui/buttons/TextButton/TextButton';

interface IErrorPageProps {
  error: Error & { digest?: string };
  resetFn: () => void;
}

const ErrorPage = ({ error, resetFn }: IErrorPageProps) => (
  <section className="flex flex-col justify-center items-center min-h-screen space-y-5">
    <h1>{ERRORS.ERROR_PAGE_TITLE[LANGUAGE]}</h1>
    <h6 className="text-xs">{error.message}</h6>
    <TextButton ariaLabel="" onClick={() => resetFn()}>
      Try again
    </TextButton>
  </section>
);

export default ErrorPage;
