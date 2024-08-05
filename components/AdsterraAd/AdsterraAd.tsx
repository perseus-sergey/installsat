'use client';

import { useEffect, useRef } from 'react';

interface IOptions {
  key: string;
  format: 'iframe';
  height: number;
  width: number;
  params: {};
}

const AdsterraAd = ({
  desktopKey,
  mobileKey,
}: {
  desktopKey: string;
  mobileKey: string;
}) => {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAdScript = (atOptions: IOptions) => {
      if (banner.current && !banner.current.firstChild) {
        const conf = document.createElement('script');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//www.topcreativeformat.com/${atOptions.key}/invoke.js`;
        conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

        banner.current.append(conf);
        banner.current.append(script);
      }
    };

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        loadAdScript({
          key: mobileKey,
          format: 'iframe',
          height: 50,
          width: 320,
          params: {},
        });
      } else {
        loadAdScript({
          key: desktopKey,
          format: 'iframe',
          height: 90,
          width: 728,
          params: {},
        });
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="w-80 h-[50px] md:w-[728px] md:h-[90px] block m-auto"
      ref={banner}
    ></div>
  );
};

export default AdsterraAd;
