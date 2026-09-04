import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import IconButton from './ui/atoms/IconButton';
import { L } from './legend/legendStyles';

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
  const [isVisible, setIsVisible] = useState(false); // 広告が実際に配信されるまで非表示
  const insRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const adDismissed = localStorage.getItem('stickyAdDismissed');
    if (adDismissed) return;

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Sticky AdSense error:', error);
      return;
    }

    // data-ad-status が "filled" になったら表示、"unfilled" なら非表示のまま
    const ins = insRef.current;
    if (!ins) return;

    const observer = new MutationObserver(() => {
      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled') {
        setIsVisible(true);
        observer.disconnect();
      } else if (status === 'unfilled') {
        observer.disconnect(); // 非表示のまま
      }
    });

    observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });

    // 5秒後に広告ステータスが確定しない場合もフォールバックで非表示のまま
    const timeout = setTimeout(() => {
      observer.disconnect();
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('stickyAdDismissed', 'true');
  };

  return (
    <>
      {/* ins要素は常にDOMに置いてAdSenseに認識させる（非表示時はvisibility:hiddenで隠す） */}
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
          padding: L.sp.md,
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          visibility: isVisible ? 'visible' : 'hidden',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
      >
        {/* 閉じるボタン */}
        <IconButton
          theme={theme}
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
          label="広告を閉じる"
          icon={<X size={16} />}
          styleOverride={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10000,
            boxShadow: `0 2px 4px ${colors.shadow}`,
          }}
        />

        {/* 広告枠 */}
        <div
          style={{
            width: '100%',
            maxWidth: '728px',
            textAlign: 'center'
          }}
        >
          <ins
            ref={insRef as any}
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
    </>
  );
};

export default StickyBottomAd;
