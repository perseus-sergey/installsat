'use client';

import { useEffect, useRef } from 'react';

const AdsterraAd = ({ adsterraKey }: { adsterraKey: string }) => {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const atOptions = {
      key: adsterraKey,
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    };

    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement('script');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.topcreativeformat.com/${adsterraKey}/invoke.js`;
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      banner.current.append(conf);
      banner.current.append(script);
    }
  }, [adsterraKey, banner]);

  return (
    <div
      className="flex justify-center items-center text-white text-center"
      ref={banner}
    ></div>
  );
};

export default AdsterraAd;
