import AdBannerArticleTop from '@/components/GoogleAdsense/AdBannerArticleTop';
import { DEFAULT_LANG } from '@/models/ui.model';

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdBannerArticleTop lang={DEFAULT_LANG} />
      {children}
    </>
  );
}
