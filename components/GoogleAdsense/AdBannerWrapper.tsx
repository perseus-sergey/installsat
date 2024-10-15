import { Suspense } from 'react';
import { ELanguage } from '@/models/language.model';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const AdBannerWrapper = ({ children, lang, className }: IProps) => {
  return (
    <section
      className={className}
      role="complementary"
      aria-label={lang === ELanguage.UA ? 'Реклама' : 'Advertising'}
    >
      <Suspense>{children}</Suspense>
    </section>
  );
};

export default AdBannerWrapper;
