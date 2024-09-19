import { DEFAULT_LANG, ERROR_PAGE_TITLE } from '@/models/ui.model';
import TextButton from '../../ui/buttons/TextButton/TextButton';
import Image from 'next/image';
import emptyPageImg from 'public/Images/empty_page.png';
import { Title } from '@/components/ui/Titles/Title';

interface IErrorPageProps {
  error: Error & { digest?: string };
  resetFn: () => void;
}

const ErrorPage = ({ error, resetFn }: IErrorPageProps) => (
  <section className="flex flex-col justify-center items-center min-h-screen space-y-5 bg-blue-100 rounded-md">
    <Title>{ERROR_PAGE_TITLE[DEFAULT_LANG]}</Title>
    <Image
      src={emptyPageImg}
      alt={'Image of space for marking an empty result'}
    />
    <h6 className="text-xs hidden">{error.message}</h6>
    <TextButton ariaLabel="" onClick={() => resetFn()}>
      Try again
    </TextButton>
  </section>
);

export default ErrorPage;
