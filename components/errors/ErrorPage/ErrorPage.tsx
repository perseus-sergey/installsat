import { DEFAULT_LANG, ERRORS } from '@/models/ui.model';
import TextButton from '../../ui/buttons/TextButton/TextButton';
import FillingImg from '@/components/ui/Images/FillingImage';
import { Title } from '@/components/ui/Titles/Title';
import { isAdminAuth } from '@/controllers/login.controller';

const { width, height, src } = ERRORS.EMPTY_DATE_NEWS_PAGE.img;

interface IErrorPageProps {
  error: Error & { digest?: string };
  resetFn: () => void;
}

const ErrorPage = async ({ error, resetFn }: IErrorPageProps) => (
  <section className="flex flex-col justify-center items-center min-h-screen space-y-5 bg-blue-100 rounded-md">
    <Title>{ERRORS.ERROR_PAGE_TITLE[DEFAULT_LANG]}</Title>
    <FillingImg
      src={src}
      alt="Error page image"
      width={width}
      height={height}
      isPriority
    />
    <h6 className="text-xs hidden">{error.message}</h6>
    <h6 className={`text-xs${!(await isAdminAuth()) && ' hidden'}`}>
      {error.message}
    </h6>
    <TextButton ariaLabel="" onClick={() => resetFn()}>
      Try again
    </TextButton>
  </section>
);

export default ErrorPage;
