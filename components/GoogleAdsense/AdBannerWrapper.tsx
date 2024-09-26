import { Suspense } from 'react';
import { ELanguage } from '@/models/ui.model';
import dynamic from 'next/dynamic';

const AdBanner = dynamic(() => import('./AdBanner'), {
  ssr: false,
});

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const AdBannerWrapper = ({ children, lang, className }: IProps) => {
  return (
    <div
      className={className}
      role="complementary"
      aria-label={lang === ELanguage.UA ? 'Реклама' : 'Advertising'}
    >
      <Suspense>
        <AdBanner>{children}</AdBanner>
      </Suspense>
    </div>
  );
};

export default AdBannerWrapper;
