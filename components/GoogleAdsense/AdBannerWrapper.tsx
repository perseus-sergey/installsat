import { Suspense } from 'react';
import { ELanguage } from '@/models/language.model';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const ariaLabel = {
  [ELanguage.UA]: 'Реклама',
  [ELanguage.EN]: 'Advertising',
  [ELanguage.RU]: 'Реклама',
  [ELanguage.ES]: 'Publicidad',
  [ELanguage.AR]: 'إعلان',
  [ELanguage.DE]: 'Werbung',
  [ELanguage.FR]: 'Publicité',
  [ELanguage.IT]: 'Pubblicità',
};

const AdBannerWrapper = ({ children, lang, className }: IProps) => {
  return (
    <section
      className={className}
      role="complementary"
      aria-label={ariaLabel[lang]}
    >
      <Suspense>{children}</Suspense>
    </section>
  );
};

export default AdBannerWrapper;
