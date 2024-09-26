'use client';

import { useEffect } from 'react';

const AdBanner = ({ adsId }: { adsId: string }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block w-[728px] h-[90px]"
      // style="display:inline-block;width:728px;height:90px"
      data-ad-client={`ca-pub-${adsId}`}
      data-ad-slot="4614458113"
    />
  );
};

export default AdBanner;
