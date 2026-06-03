/**
 * MobileBottomPanel
 *
 * スマホフルスクリーン用の左下フローティングボタン UI。
 *
 * ■ 設計方針
 * - 底部に張り付かず、左下にアイコン＋名前のボタンを縦に配置。
 * - ボタンをタップするとツールチップ（ポップオーバー）が展開。
 * - 別ボタンをタップ or 背景をタップで閉じる。
 * - 寸法はすべて名前付き定数で管理（マジックナンバー禁止）。
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getThemeColors } from '../contexts/ThemeContext';

// ── 寸法定数 ─────────────────────────────────────────────────────────

/** ボタンの高さ */
const BTN_H = 34;

/** ボタンの最小幅（アイコンなし・テキストのみなので小さめ） */
const BTN_MIN_W = 0;

/** ボタン間のギャップ */
const BTN_GAP = 6;

/** ボタングループの左オフセット */
const GROUP_LEFT = 10;

/** ポップオーバーの最大幅 */
const POPOVER_MAX_W = 320;

/** ポップオーバーの最大高さ */
const POPOVER_MAX_H = '65dvh';

/**
 * position: fixed + high z-index で確実に最前面に出す。
 * 外側の position:fixed コンテナ (z-index:9999) より高くする必要がある。
 */
const Z_BTN = 10001;
const Z_POPOVER = 10002;
const Z_BACKDROP = 10000;

/** CSS 注入用 ID */
const STYLE_ID = 'mbp-styles-v2';

// ─────────────────────────────────────────────────────────────────────

export type PopoverKey = 'station' | 'settings';

export interface FloatingButtonDef {
  key: PopoverKey;
  icon: string;
  label: string;
  content: React.ReactNode;
}

export interface MobileBottomPanelProps {
  buttons: FloatingButtonDef[];
  theme: 'light' | 'dark';
  /** セーフエリア下部の余白（px）。デフォルト 0。 */
  safeAreaBottom?: number;
}

const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({
  buttons,
  theme,
  safeAreaBottom = 0,
}) => {
  const colors = getThemeColors(theme);
  const [openKey, setOpenKey] = useState<PopoverKey | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // CSS を一度だけ注入
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = `
      .mbp-scroll {
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
      }
      .mbp-scroll::-webkit-scrollbar { width: 3px; }
      .mbp-scroll::-webkit-scrollbar-thumb {
        background: rgba(128,128,128,0.35);
        border-radius: 2px;
      }
    `;
    document.head.appendChild(el);
  }, []);

  // ポップオーバーが変わったらスクロールをリセット
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [openKey]);

  const toggle = useCallback((key: PopoverKey) => {
    setOpenKey(prev => (prev === key ? null : key));
  }, []);

  const close = useCallback(() => setOpenKey(null), []);

  const safeBottom = safeAreaBottom + 10; // ボタンを少し上に浮かせる

  const activeButton = buttons.find(b => b.key === openKey);

  return (
    <>
      {/* 背景クリックで閉じる透明レイヤー */}
      {openKey !== null && (
        <div
          aria-hidden="true"
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: Z_BACKDROP,
          }}
        />
      )}

      {/* ポップオーバー */}
      {openKey !== null && activeButton && (
        <div
          role="dialog"
          aria-label={activeButton.label}
          style={{
            position: 'fixed',
            bottom: safeBottom + BTN_H * buttons.length + BTN_GAP * (buttons.length - 1) + 8,
            left: GROUP_LEFT,
            width: `min(${POPOVER_MAX_W}px, calc(100vw - ${GROUP_LEFT * 2}px))`,
            maxHeight: POPOVER_MAX_H,
            zIndex: Z_POPOVER,
            backgroundColor: colors.surfaceElevated,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            boxShadow: `0 4px 24px ${colors.shadow}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ポップオーバーヘッダー */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderBottom: `1px solid ${colors.border}`,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 14, fontWeight: 'bold', color: colors.text }}>
              {activeButton.icon} {activeButton.label}
            </span>
            <button
              onClick={close}
              aria-label="閉じる"
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: colors.textSecondary,
                fontSize: 18,
                lineHeight: 1,
                padding: '4px 8px',
                borderRadius: 6,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              ✕
            </button>
          </div>

          {/* スクロール可能コンテンツ */}
          <div
            ref={scrollRef}
            className="mbp-scroll"
            style={{ flex: 1, minHeight: 0, padding: '10px 14px' }}
          >
            {activeButton.content}
          </div>
        </div>
      )}

      {/* フローティングボタングループ（左下） */}
      <div
        ref={groupRef}
        style={{
          position: 'fixed',
          bottom: safeBottom,
          left: GROUP_LEFT,
          zIndex: Z_BTN,
          display: 'flex',
          flexDirection: 'column',
          gap: BTN_GAP,
          alignItems: 'flex-start',
        }}
      >
        {buttons.map(btn => {
          const isActive = openKey === btn.key;
          return (
            <button
              key={btn.key}
              onClick={() => toggle(btn.key)}
              aria-expanded={isActive}
              aria-controls={`mbp-popover-${btn.key}`}
              style={{
                height: BTN_H,
                padding: '0 12px',
                border: `1px solid ${isActive ? colors.primary : colors.border}`,
                borderRadius: 10,
                cursor: 'pointer',
                backgroundColor: isActive ? colors.primary : colors.surfaceElevated,
                color: isActive ? '#fff' : colors.text,
                fontSize: 13,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: btn.icon ? 6 : 0,
                boxShadow: `0 2px 8px ${colors.shadow}`,
                transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {btn.icon && <span style={{ fontSize: 16 }}>{btn.icon}</span>}
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default MobileBottomPanel;
