import { Suspense } from 'react';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import { LOGO, OPEN_SIDE_BAR_BTN } from '@/models/header.model';
import { ELanguage } from '@/models/ui.model';
import LangSwitchButton from '../LangSwitchButton/LangSwitchButton';
import SeoLink from '../ui/SeoLink/SeoLink';
import siteLogotype from 'public/Images/InstallsatOrigBlue_200.png';
import Image from 'next/image';
import sideBarIconImg from 'public/Images/accordion/sidebar_icon.png';

const { sideBarIcon } = OPEN_SIDE_BAR_BTN;

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
    <div className="flex items-center justify-between">
      <nav className="flex items-center gap-2">
        <ToggleSidebarLabel
          ariaLabel={sideBarIcon.ariaLabel[lang]}
          className="cursor-pointer px-4"
        >
          <Image src={sideBarIconImg} alt={sideBarIcon.alt[lang]} />
        </ToggleSidebarLabel>
        <SeoLink href={`/${lang}`} title={title[lang]} className="sm:px-5">
          <Image
            className="h-12 w-28 sm:h-20 sm:w-48"
            src={siteLogotype}
            alt={siteLogo.alt[lang]}
          />
        </SeoLink>
      </nav>
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
