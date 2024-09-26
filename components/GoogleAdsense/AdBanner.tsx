'use client';

import React, { useEffect } from 'react';

const AdBanner = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return children;
};

export default AdBanner;
