import React, { useEffect, useRef } from 'react';
import { requestAd } from '../utils/adsense';
import { L } from './legend/legendStyles';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  style = {},
  className = ''
}) => {
  const adRef = useRef<HTMLElement>(null);

  useEffect(() => {
    requestAd(adRef.current);
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        margin: `${L.sp['3xl']} 0`,
        ...style
      }}
      className={className}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client="ca-pub-2444529114040977"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseAd;
