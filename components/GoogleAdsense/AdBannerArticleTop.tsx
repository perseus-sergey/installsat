import { ELanguage } from '@/models/ui.model';
import AdBannerWrapper from './AdBannerWrapper';

const adsenseId = process.env.G_ADSENSE_ID || '';

const AdBannerArticleTop = ({ lang }: { lang: ELanguage }) => {
  return (
    <AdBannerWrapper
      lang={lang}
      className="min-h-64 w-full flex justify-center items-center"
    >
      <ins
        className="adsbygoogle block"
        data-ad-client={`ca-pub-${adsenseId}`}
        data-ad-slot="1581071444"
        data-full-width-responsive="true"
        data-ad-format="auto"
      />
    </AdBannerWrapper>
  );
};

export default AdBannerArticleTop;
