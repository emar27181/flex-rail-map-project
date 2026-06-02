/**
 * MobileBottomPanel
 *
 * スマホフルスクリーン用の下部折りたたみパネル。
 *
 * ■ 設計方針
 * - マジックナンバー禁止。寸法はすべて名前付き定数で管理。
 * - パネル高さは dvh（Dynamic Viewport Height）を使用し、
 *   未対応ブラウザ向けに svh → vh の順でフォールバック。
 * - 「駅設定」と「表示切替」を同時に表示（タブ切替不要）。
 * - 詳細設定は折りたたみ式サブセクションで表示。
 * - パネル全体は折りたたみ可能（ドラッグハンドル or ▲/▼ボタン）。
 */

import React, { useEffect, useRef, useState } from 'react';
import { getThemeColors } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation';

// ── 寸法定数 ─────────────────────────────────────────────────────────

/** Apple HIG / Material Design 最小タッチ目標 */
const TOUCH_SIZE = 44;

/**
 * パネルの最大高さ。
 * dvh: アドレスバー等を除いた動的視野高さ（iOS Safari 対応）
 * svh: 小さい方の視野高さ（Safari 旧版フォールバック）
 * vh:  最終フォールバック
 * 上マージン 80px を確保して地図が少し見えるようにする。
 */
const PANEL_MAX_H = 'min(70dvh, min(70svh, min(70vh, calc(100% - 80px))))';

/** パネル上部の角丸 */
const RADIUS = 16;

/** CSS 注入用 ID */
const STYLE_ID = 'mbp-styles';

// ─────────────────────────────────────────────────────────────────────

export interface MobileBottomPanelProps {
  isExpanded: boolean;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  onToggle: () => void;

  /** 駅選択コンテンツ（StationSelector） */
  stationContent: React.ReactNode;

  /** 表示切替コンテンツ（LegendDisplayOptions など） */
  displayToggleContent: React.ReactNode;

  /** 詳細設定コンテンツ（LegendRouteList 等、折りたたみ式） */
  detailedSettingsContent: React.ReactNode;

  /** 折りたたみ時のサマリー表示用 */
  departureName?: string;
  arrivalName?: string;
  mapViewMode?: 'realistic' | 'schematic';
}

const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({
  isExpanded,
  theme,
  language,
  onToggle,
  stationContent,
  displayToggleContent,
  detailedSettingsContent,
  departureName,
  arrivalName,
  mapViewMode,
}) => {
  const colors = getThemeColors(theme);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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

  // 閉じるときに詳細設定も折りたたむ
  useEffect(() => {
    if (!isExpanded) setDetailOpen(false);
  }, [isExpanded]);

  const safeBottom = 'env(safe-area-inset-bottom, 0px)';

  // ── 折りたたみ時のサマリーバー ──────────────────────────────────────
  if (!isExpanded) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label="パネルを開く"
        onClick={onToggle}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: colors.surfaceElevated,
          borderTop: `1px solid ${colors.border}`,
          borderRadius: `${RADIUS}px ${RADIUS}px 0 0`,
          boxShadow: `0 -4px 20px ${colors.shadow}`,
          paddingBottom: safeBottom,
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* ドラッグハンドル */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: TOUCH_SIZE,
          gap: 8,
        }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
        </div>

        {/* サマリー行 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px 10px',
          fontSize: 12,
          color: colors.textSecondary,
          gap: 8,
        }}>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            🚉 {departureName ?? '—'} → {arrivalName ?? '—'}
          </span>
          <span style={{
            flexShrink: 0,
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 11,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}>
            {mapViewMode === 'schematic'
              ? translateUI('schematicView', language)
              : translateUI('realisticView', language)}
          </span>
          <span style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>▲</span>
        </div>
      </div>
    );
  }

  // ── 展開時パネル ────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: PANEL_MAX_H,
        zIndex: 100,
        backgroundColor: colors.surfaceElevated,
        borderTop: `1px solid ${colors.border}`,
        borderRadius: `${RADIUS}px ${RADIUS}px 0 0`,
        boxShadow: `0 -4px 24px ${colors.shadow}`,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: safeBottom,
      }}
    >
      {/* ヘッダー: ドラッグハンドル + 閉じるボタン */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: TOUCH_SIZE,
        flexShrink: 0,
        position: 'relative',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
        <button
          onClick={onToggle}
          aria-label="パネルを閉じる"
          style={{
            position: 'absolute',
            right: 4,
            top: 0,
            width: TOUCH_SIZE,
            height: TOUCH_SIZE,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: colors.textSecondary,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ▼
        </button>
      </div>

      {/* スクロール可能コンテンツ */}
      <div ref={scrollRef} className="mbp-scroll" style={{ flex: 1, minHeight: 0 }}>

        {/* ── 駅設定 ── */}
        <section style={{ padding: '0 10px 10px' }}>
          {stationContent}
        </section>

        {/* 区切り線 */}
        <hr style={{ margin: '0 10px', border: 'none', borderTop: `1px solid ${colors.border}` }} />

        {/* ── 表示切替 ── */}
        <section style={{ padding: '8px 10px' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 'bold',
            color: colors.textSecondary,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {translateUI('mapDisplayMode', language)}
          </div>
          {displayToggleContent}
        </section>

        {/* 区切り線 */}
        <hr style={{ margin: '0 10px', border: 'none', borderTop: `1px solid ${colors.border}` }} />

        {/* ── 詳細設定（折りたたみ式） ── */}
        <section>
          <button
            onClick={() => setDetailOpen(v => !v)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: colors.text,
              fontSize: 13,
              fontWeight: 'bold',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span>⚙ {translateUI('displaySettings', language)}</span>
            <span style={{
              color: colors.textSecondary,
              fontSize: 11,
              transition: 'transform 0.2s',
              display: 'inline-block',
              transform: detailOpen ? 'rotate(180deg)' : 'none',
            }}>▼</span>
          </button>

          {detailOpen && (
            <div style={{ padding: '0 10px 10px' }}>
              {detailedSettingsContent}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MobileBottomPanel;
