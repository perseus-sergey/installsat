import { Suspense } from 'react';
import { LOGO } from '@/models/header.model';
import { ELanguage } from '@/models/ui.model';
import LangSwitchButton from '../LangSwitchButton/LangSwitchButton';
import SeoLink from '../ui/SeoLink/SeoLink';
import siteLogotype from 'public/Images/InstallsatOrigBlue_200.png';
import Image from 'next/image';

// import AdsterraAd from '../AdsterraAd/AdsterraAd';
// import dynamic from 'next/dynamic';

// const AdBanner = dynamic(() => import('../GoogleAdsense/AdsBanner'), {
//   ssr: false,
// });

const { title, siteLogo } = LOGO.link;
// const adsterraDesktopKey = process.env.ADSTERRA_728_KEY || '';
// const adsterraMobileKey = process.env.ADSTERRA_320_KEY || '';
// const adsenseId = process.env.G_ADSENSE_ID || '';

const Header = ({ lang }: { lang: ELanguage }) => (
  <header
    id="top"
    className="w-full p-2 bg-gradient-to-b from-blue-800"
    data-testid="Header"
  >
    <div className="max-w-5xl mx-auto flex items-center justify-between">
      <SeoLink href={`/${lang}`} title={title[lang]} className="sm:px-5">
        <Image
          className="h-12 w-28 sm:h-20 sm:w-48 ml-24 sm:ml-16 xl:m-0"
          src={siteLogotype}
          alt={siteLogo.alt[lang]}
          priority
        />
      </SeoLink>
      <Suspense>
        <LangSwitchButton />
      </Suspense>
    </div>
  </header>
);

export default Header;

{
  /* <AdBanner
      data-ad-client={adsenseId}
      data-ad-slot="1581071444"
      data-full-width-responsive="true"
      data-ad-layout="in-article"
      data-ad-format="fluid"
    /> */
}

// {process.env.NODE_ENV === 'production' && (
//   <div className="block mx-auto my-2">
//     <AdsterraAd
//       desktopKey={adsterraDesktopKey}
//       mobileKey={adsterraMobileKey}
//     />
//   </div>
// )}
