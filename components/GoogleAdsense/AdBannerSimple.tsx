'use client';

import React, { useEffect } from 'react';

const AdBannerSimple = ({ adsenseId }: { adsenseId: string }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <ins
      data-ad-client={`ca-pub-${adsenseId}`}
      data-ad-slot="1581071444"
      data-full-width-responsive="true"
      data-ad-format="auto"
    />
  );
};

export default AdBannerSimple;
