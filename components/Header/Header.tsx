import React, { Suspense } from 'react';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import { LOGO, TOGGLE_SIDEBAR_BUTTON_TITLE } from '@/models/header.model';
import FillingImg from '../ui/Images/FillingImage';
import { ELanguage } from '@/models/ui.model';
import LangSwitchButton from '../LangSwitchButton/LangSwitchButton';
import SeoLink from '../ui/SeoLink/SeoLink';
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
    className="w-full bg-gradient-to-b from-blue-800 to-white/0"
    data-testid="Header"
  >
    <div className="flex items-center justify-between">
      <nav className="flex items-center">
        <ToggleSidebarLabel className="px-2 pb-1 text-4xl text-gray-400 cursor-pointer border border-gray-300 rounded-md my-0 mx-4">
          {TOGGLE_SIDEBAR_BUTTON_TITLE}
        </ToggleSidebarLabel>
        <SeoLink
          href={`/${lang}`}
          title={title[lang]}
          className="inline-block p-5"
        >
          <div className="hidden sm:block">
            <FillingImg {...siteLogo} alt={siteLogo.alt[lang]} isPriority />
          </div>
          <i className="block sm:hidden text-blue-100 text-2xl">Installsat</i>
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
