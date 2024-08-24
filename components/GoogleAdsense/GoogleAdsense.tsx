import Script from 'next/script';

type Props = {
  pId: string;
};

const GoogleAdsense = ({ pId }: Props) => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export const GoogleAdsenseMediaHoriz = ({ pId }: Props) => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-8343784915002692"
      data-ad-slot="1581071444"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAdsense;
