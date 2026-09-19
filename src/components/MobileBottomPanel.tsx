/**
 * MobileBottomPanel
 *
 * モバイルフルスクリーン用のボトムナビゲーション。
 * 地図を主役にするため、常時表示する操作は画面下部のタブに集約し、
 * 詳細はボトムシートとして必要なときだけ展開する。
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import IconButton from './ui/atoms/IconButton';
import { L } from './legend/legendStyles';

const NAV_H = 64;
const NAV_MARGIN = 10;
const POPOVER_MAX_W = 420;
const POPOVER_MAX_H = '68dvh';
const POPOVER_MIN_H = 140;
const Z_BACKDROP = 10000;
const Z_NAV = 10001;
const Z_POPOVER = 10002;
const STYLE_ID = 'mbp-bottom-nav-v3';

export type PopoverKey = 'station' | 'settings' | 'routes';

export interface FloatingButtonDef {
  key: PopoverKey;
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

export interface MobileBottomPanelProps {
  buttons: FloatingButtonDef[];
  theme: 'light' | 'dark';
  safeAreaBottom?: number;
}

const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({
  buttons,
  theme,
  safeAreaBottom = 0,
}) => {
  const colors = getThemeColors(theme);
  const [openKey, setOpenKey] = useState<PopoverKey | null>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startY: number; startH: number } | null>(null);

  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = `
      .mbp-scroll { overflow-y:auto; overflow-x:hidden; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; touch-action:pan-y; }
      .mbp-scroll::-webkit-scrollbar { width:3px; }
      .mbp-scroll::-webkit-scrollbar-thumb { background:rgba(128,128,128,.35); border-radius:2px; }
      .mbp-drag-handle { touch-action:none; user-select:none; -webkit-user-select:none; }
    `;
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [openKey]);

  const toggle = useCallback((key: PopoverKey) => {
    setPanelHeight(null);
    setOpenKey(prev => (prev === key ? null : key));
  }, []);
  const close = useCallback(() => setOpenKey(null), []);

  const handleDragStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const el = popoverRef.current;
    if (!el) return;
    dragStartRef.current = { startY: e.touches[0].clientY, startH: el.getBoundingClientRect().height };
  }, []);
  const handleDragMove = useCallback((e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    e.stopPropagation();
    const delta = dragStartRef.current.startY - e.touches[0].clientY;
    setPanelHeight(Math.max(POPOVER_MIN_H, Math.min(window.innerHeight * .9, dragStartRef.current.startH + delta)));
  }, []);
  const handleDragEnd = useCallback(() => { dragStartRef.current = null; }, []);

  const safeBottom = safeAreaBottom + NAV_MARGIN;
  const activeButton = buttons.find(button => button.key === openKey);

  return (
    <>
      {openKey !== null && (
        <div aria-hidden="true" onClick={close} style={{ position: 'fixed', inset: 0, zIndex: Z_BACKDROP, background: 'rgba(0,0,0,.08)' }} />
      )}

      {activeButton && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={activeButton.label}
          style={{
            position: 'fixed',
            left: NAV_MARGIN,
            right: NAV_MARGIN,
            bottom: safeBottom + NAV_H + 8,
            width: `min(${POPOVER_MAX_W}px, calc(100vw - ${NAV_MARGIN * 2}px))`,
            margin: '0 auto',
            ...(panelHeight !== null ? { height: panelHeight } : { maxHeight: POPOVER_MAX_H }),
            zIndex: Z_POPOVER,
            backgroundColor: colors.glassOpen,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            boxShadow: `0 12px 40px ${colors.shadow}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div className="mbp-drag-handle" onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: `${L.sp.md} 0 ${L.sp.sm}`, flexShrink: 0 }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: colors.border }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${L.sp.sm} ${L.sp['2xl']} ${L.sp.md}`, borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              {activeButton.icon}{activeButton.label}
            </span>
            <IconButton theme={theme} size="sm" onClick={close} label="閉じる" icon={<X size={18} />} />
          </div>
          <div ref={scrollRef} className="mbp-scroll" style={{ flex: 1, minHeight: 0, padding: `${L.sp.lg} ${L.sp['2xl']}` }}>
            {activeButton.content}
          </div>
        </div>
      )}

      <nav
        aria-label="地図表示メニュー"
        style={{
          position: 'fixed',
          left: NAV_MARGIN,
          right: NAV_MARGIN,
          bottom: safeBottom,
          height: NAV_H,
          zIndex: Z_NAV,
          display: 'flex',
          alignItems: 'stretch',
          maxWidth: 420,
          margin: '0 auto',
          padding: 4,
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.glassOpen,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: `0 6px 24px ${colors.shadow}`,
        }}
      >
        {buttons.map(button => {
          const active = openKey === button.key;
          return (
            <button
              key={button.key}
              type="button"
              onClick={() => toggle(button.key)}
              aria-expanded={active}
              aria-controls={`mbp-popover-${button.key}`}
              style={{
                flex: 1,
                minWidth: 0,
                border: 0,
                borderRadius: 14,
                background: active ? 'rgba(33,150,243,.14)' : 'transparent',
                color: active ? '#2196f3' : colors.textSecondary,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                font: 'inherit',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 22 }}>{button.icon}</span>
              <span style={{ fontSize: 11, lineHeight: 1.1, fontWeight: active ? 700 : 600, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {button.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default MobileBottomPanel;
