import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';

interface StickyBottomAdProps {
  adSlot: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const StickyBottomAd: React.FC<StickyBottomAdProps> = ({ adSlot }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [isVisible, setIsVisible] = useState(true);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adDismissed = localStorage.getItem('stickyAdDismissed');
    console.log('Sticky ad - checking localStorage:', adDismissed);
    if (adDismissed) {
      console.log('Sticky ad - previously dismissed, hiding');
      setIsVisible(false);
      return;
    }

    console.log('Sticky ad - showing for first time');
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        setIsAdLoaded(true);
      }
    } catch (error) {
      console.error('Sticky AdSense error:', error);
    }
  }, []);

  const handleClose = () => {
    console.log('Sticky ad close button clicked');
    setIsVisible(false);
    localStorage.setItem('stickyAdDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderBottom: 'none',
        boxShadow: `0 -2px 8px ${colors.shadow}`,
        zIndex: 9999,
        padding: '8px',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 閉じるボタン */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClose();
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          cursor: 'pointer',
          color: colors.textSecondary,
          padding: '6px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          zIndex: 10000,
          minWidth: '28px',
          minHeight: '28px',
          boxShadow: `0 2px 4px ${colors.shadow}`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.surfaceElevated;
          e.currentTarget.style.color = colors.text;
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.surface;
          e.currentTarget.style.color = colors.textSecondary;
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="広告を閉じる"
        aria-label="広告を閉じる"
      >
        <X size={16} />
      </button>

      {/* 広告枠 */}
      <div
        ref={adRef}
        style={{
          width: '100%',
          maxWidth: '728px',
          textAlign: 'center'
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: '90px'
          }}
          data-ad-client="ca-pub-2444529114040977"
          data-ad-slot={adSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default StickyBottomAd;