/**
 * MobileBottomPanel
 *
 * スマホのフルスクリーンモードで画面下部に表示する
 * タブバー + スライドアップパネル UI。
 *
 * 設計方針
 * - マジックナンバー禁止。寸法はすべて名前付き定数で管理。
 * - パネル高さは CSS dvh（dynamic viewport height）を使用。
 *   dvh 未対応ブラウザ向けに svh → vh の順でフォールバック。
 * - スクロールコンテナは thin-scrollbar クラスで統一。
 * - タブを押すと開く / 同じタブを再度押すと閉じる（トグル）。
 * - 表示切替（マップモード変更）時はパネルを自動で閉じない。
 *   ユーザーが手動で閉じる（ドラッグハンドル / ▼ボタン）。
 */

import React, { useEffect, useRef } from 'react';
import { getThemeColors } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation';

// ── 寸法定数（ハードコーディング禁止のため名前付き管理） ──────────────

/** タブバーの高さ（Apple HIG / Material Design の最小タッチ目標 44pt） */
const TAB_BAR_H = 44;

/**
 * パネルコンテンツの最大高さ。
 * dvh = Dynamic Viewport Height（アドレスバー等の動的 UI を除いた実視野高）
 * svh = Small Viewport Height（UI が出ているときの高さ、Safari 旧版フォールバック）
 * vh  = CSS Viewport Height（最終フォールバック）
 * min() で画面の 55% かつ「全体 - 上マージン 110px」の小さい方を取る。
 */
const PANEL_MAX_HEIGHT_CSS =
  'min(55dvh, min(55svh, min(55vh, calc(100% - 110px))))';

/** パネル上部の角丸半径 */
const PANEL_BORDER_RADIUS = 16;

/** CSS を一度だけ注入するための ID */
const STYLE_ID = 'mobile-bottom-panel-styles';

// ─────────────────────────────────────────────────────────────────────

export type PanelTab = 'station' | 'legend';

export interface MobileBottomPanelProps {
  activeTab: PanelTab;
  isExpanded: boolean;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  /** タブを切り替える（開く方向） */
  onTabChange: (tab: PanelTab) => void;
  /** パネルを閉じる */
  onCollapse: () => void;
  stationContent: React.ReactNode;
  legendContent: React.ReactNode;
}

const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({
  activeTab,
  isExpanded,
  theme,
  language,
  onTabChange,
  onCollapse,
  stationContent,
  legendContent,
}) => {
  const colors = getThemeColors(theme);
  const scrollRef = useRef<HTMLDivElement>(null);

  // CSS を一度だけ <head> に注入
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

  // タブが変わったらスクロール位置をリセット
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeTab]);

  /** タブボタンのクリックハンドラ。同じタブを再押しで閉じる。 */
  const handleTabPress = (tab: PanelTab) => {
    if (isExpanded && activeTab === tab) {
      onCollapse();
    } else {
      onTabChange(tab);
    }
  };

  const safeAreaBottom = 'env(safe-area-inset-bottom, 0px)';

  return (
    <>
      {/* ── コンテンツパネル ── */}
      {isExpanded && (
        <div
          role="dialog"
          aria-label={
            activeTab === 'station'
              ? translateUI('departure', language) + '/' + translateUI('arrival', language)
              : translateUI('displaySettings', language)
          }
          style={{
            position: 'absolute',
            bottom: `calc(${TAB_BAR_H}px + ${safeAreaBottom})`,
            left: 0,
            right: 0,
            maxHeight: PANEL_MAX_HEIGHT_CSS,
            zIndex: 100,
            backgroundColor: colors.surfaceElevated,
            borderTop: `1px solid ${colors.border}`,
            borderRadius: `${PANEL_BORDER_RADIUS}px ${PANEL_BORDER_RADIUS}px 0 0`,
            boxShadow: `0 -4px 24px ${colors.shadow}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ドラッグハンドル + 閉じるボタン */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: TAB_BAR_H,
            flexShrink: 0,
            position: 'relative',
          }}>
            {/* ドラッグハンドル（視覚的なヒント） */}
            <div style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.border,
            }} />

            {/* 閉じるボタン（右端） */}
            <button
              onClick={onCollapse}
              aria-label="パネルを閉じる"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: TAB_BAR_H,
                height: TAB_BAR_H,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: colors.textSecondary,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ▼
            </button>
          </div>

          {/* スクロール可能コンテンツ */}
          <div
            ref={scrollRef}
            className="mbp-scroll"
            style={{ flex: 1, minHeight: 0 }}
          >
            {activeTab === 'station' && stationContent}
            {activeTab === 'legend' && (
              <div style={{ padding: '0 10px 10px' }}>
                {legendContent}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── タブバー ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 101,
        backgroundColor: colors.surfaceElevated,
        borderTop: isExpanded ? 'none' : `1px solid ${colors.border}`,
        borderRadius: isExpanded
          ? '0'
          : `${PANEL_BORDER_RADIUS}px ${PANEL_BORDER_RADIUS}px 0 0`,
        boxShadow: isExpanded ? 'none' : `0 -4px 20px ${colors.shadow}`,
        /* padding は上部 0、左右 8px、下部はセーフエリア */
        padding: `0 8px ${safeAreaBottom}`,
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        minHeight: `calc(${TAB_BAR_H}px + ${safeAreaBottom})`,
      }}>
        <TabButton
          active={activeTab === 'station' && isExpanded}
          colors={colors}
          onClick={() => handleTabPress('station')}
        >
          🚉 {translateUI('departure', language)}/{translateUI('arrival', language)}
        </TabButton>

        <TabButton
          active={activeTab === 'legend' && isExpanded}
          colors={colors}
          onClick={() => handleTabPress('legend')}
        >
          ⚙ {translateUI('displaySettings', language)}
        </TabButton>
      </div>
    </>
  );
};

// ── 内部コンポーネント: タブボタン ────────────────────────────────────

interface TabButtonProps {
  active: boolean;
  colors: ReturnType<typeof getThemeColors>;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, colors, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      height: TAB_BAR_H,
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 'bold',
      backgroundColor: active ? colors.primary : 'transparent',
      color: active ? '#fff' : colors.textSecondary,
      transition: 'background-color 0.15s ease, color 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
    }}
  >
    {children}
  </button>
);

export default MobileBottomPanel;
