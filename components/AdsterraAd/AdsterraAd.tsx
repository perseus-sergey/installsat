'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const AdsterraAd = ({ adsterraKey }: { adsterraKey: string }) => {
  useEffect(() => {
    // Ініціалізуємо параметри Adsterra
    window.atOptions = {
      key: adsterraKey,
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    };
  }, []);

  return (
    <div id="adsterra-ad">
      <Script
        src={`//www.topcreativeformat.com/${adsterraKey}/invoke.js`}
        type="text/javascript"
        strategy="afterInteractive"
      />
    </div>
  );
};

export default AdsterraAd;
