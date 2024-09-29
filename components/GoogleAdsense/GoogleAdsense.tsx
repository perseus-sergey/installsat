import Script from 'next/script';

const GoogleAdsense = ({ pId }: { pId: string }) => {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      // strategy="lazyOnload"
    />
  );
};

export default GoogleAdsense;
