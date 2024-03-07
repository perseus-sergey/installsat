// import styles from './ErrorPage.module.scss';
import { EUITitles, MUITitles } from '@/models/ui.model';
import TextButton from '../TextButton/TextButton';

interface IErrorPageProps {
  error: Error & { digest?: string };
  resetFn: () => void;
}

const ErrorPage = ({ error, resetFn }: IErrorPageProps) => (
  <section className="flex flex-col justify-center items-center min-h-screen space-y-5">
    <h1>{MUITitles.get(EUITitles.ERROR_PAGE_TITLE)?.ua}</h1>
    <h6 className="text-xs">{error.message}</h6>
    <TextButton onClick={() => resetFn()}>Try again</TextButton>
  </section>
);

export default ErrorPage;
