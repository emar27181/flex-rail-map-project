/**
 * 凡例パネル共通デザイントークン & スタイルファクトリ
 *
 * 使い方:
 *   import { L, section, btn, text } from './legendStyles';
 *   <div style={section.wrap(colors)}>
 *     <div style={section.header}>...</div>
 *   </div>
 */
import type { CSSProperties } from 'react';
import { tintColor } from '../../utils/contrast';

// ── Design tokens ──────────────────────────────────────────────────────────

export const L = {
  /** Font sizes */
  fs: {
    xs:  '10px',  // muted notes, disclaimers
    sm:  '11px',  // body text, labels, inputs
    md:  '12px',  // section title, item label
    lg:  '13px',  // prominent label
    xl:  '14px',  // panel heading
  },
  /** Spacing (padding / margin / gap) */
  sp: {
    xs:  '4px',
    sm:  '6px',
    md:  '8px',
    lg:  '10px',
    xl:  '12px',
    '2xl': '16px',
  },
  /** Border radius */
  r: {
    sm:   '3px',
    md:   '4px',
    pill: '8px',
  },
  /**
   * セクション間の標準余白。
   * section.wrap の上下 margin/padding に使うことで
   * 凡例パネル内の各ブロックを均一に区切る。
   */
  sectionGap: '10px',
} as const;

type Colors = {
  text: string;
  textSecondary: string;
  border: string;
  borderLight?: string;
  surface: string;
  surfaceElevated: string;
  primary?: string;
};

// ── Section (collapsible panel block) ─────────────────────────────────────

export const section = {
  /** Outer wrapper: top divider + padding */
  wrap(colors: Colors): CSSProperties {
    return {
      borderTop:     `1px solid ${colors.border}`,
      paddingTop:    L.sectionGap,
      marginTop:     L.sectionGap,
      paddingBottom: L.sectionGap,
    };
  },

  /** Clickable header row (arrow + title) */
  header: {
    display:        'flex',
    alignItems:     'center',
    gap:            L.sp.sm,
    cursor:         'pointer',
  } satisfies CSSProperties,

  /** Expanded body */
  body: {
    marginTop:      L.sp.md,
    display:        'flex',
    flexDirection:  'column',
    gap:            L.sp.md,
  } satisfies CSSProperties,

  /** ▶ / ▼ toggle arrow */
  arrow(colors: Colors): CSSProperties {
    return { fontSize: L.fs.sm, color: colors.textSecondary, userSelect: 'none' };
  },

  /** Bold section title */
  title(colors: Colors): CSSProperties {
    return { fontSize: L.fs.md, fontWeight: 'bold', color: colors.text, userSelect: 'none' };
  },
} as const;

// ── Text helpers ───────────────────────────────────────────────────────────

export const text = {
  /** Normal body text in legend (11px) */
  body(colors: Colors): CSSProperties {
    return { fontSize: L.fs.sm, color: colors.text };
  },

  /** Secondary / descriptor (11px, muted) */
  desc(colors: Colors): CSSProperties {
    return { fontSize: L.fs.sm, color: colors.textSecondary, marginBottom: L.sp.xs };
  },

  /** Italicised disclaimer (10px) */
  muted(colors: Colors): CSSProperties {
    return { fontSize: L.fs.xs, color: colors.textSecondary, fontStyle: 'italic' };
  },
} as const;

// ── Interactive elements ───────────────────────────────────────────────────

/** Small action button used throughout legend panels */
export function btn(colors: Colors): CSSProperties {
  return {
    fontSize:      L.fs.sm,
    padding:       `${L.sp.xs} ${L.sp.md}`,
    cursor:        'pointer',
    borderRadius:  L.r.md,
    border:        `1px solid ${colors.border}`,
    background:    colors.surfaceElevated,
    color:         colors.text,
  };
}

/** Full-width variant */
export function btnFull(colors: Colors): CSSProperties {
  return { ...btn(colors), width: '100%', boxSizing: 'border-box' };
}

/** Checkbox / radio label row in legend */
export function checkboxLabel(colors: Colors): CSSProperties {
  return {
    display:       'flex',
    alignItems:    'center',
    fontSize:      L.fs.md,
    color:         colors.text,
    cursor:        'pointer',
    padding:       `${L.sp.sm} 0`,
    userSelect:    'none',
  };
}

/**
 * Checkbox input element (accent color = primary blue)
 *
 * 大きさは指定しない。チェックボックスは必ずクリック可能な
 * ラベル行（実測 257×40px）の中に置く運用なので、WCAG 2.2 AA の
 * 2.5.8「ターゲットサイズ(最小)」で測るべき対象はその行の方であり、
 * 入力欄そのものを 24px に広げると白い四角が目立つだけで得がない。
 *
 * チェックボックスを単独で（クリック可能な行の外に）置く場合は、
 * ここではなく置く側で 24px 以上の当たり判定を用意すること。
 */
export function checkboxInput(colors: Colors): CSSProperties {
  return {
    marginRight:  L.sp.sm,
    cursor:       'pointer',
    accentColor:  colors.primary ?? '#2196F3',
    // 長いラベルに押されて潰れないようにする
    flexShrink:   0,
  };
}

/** Single-line text input / number input */
export function input(colors: Colors): CSSProperties {
  return {
    fontSize:      L.fs.sm,
    padding:       `${L.sp.xs} ${L.sp.xs}`,
    border:        `1px solid ${colors.border}`,
    borderRadius:  L.r.md,
    background:    colors.surface,
    color:         colors.text,
  };
}

/** Multi-line textarea */
export function textarea(colors: Colors): CSSProperties {
  return {
    ...input(colors),
    width:         '100%',
    display:       'block',
    resize:        'vertical',
    boxSizing:     'border-box',
  };
}

// ── 選択できるカード・行 ───────────────────────────────────────────────

/**
 * 選択状態を示す枠線の太さ。選択・非選択で変えない。
 *
 * 「選択時だけ枠線を太くする」書き方が3箇所にあり、box-sizing が
 * content-box のままだと選択した瞬間に幅と高さが変わって並びがずれていた。
 * 太さは固定し、色と背景だけを切り替える。
 */
export const SELECTION_BORDER_WIDTH = 2;

/**
 * 選択できるカード・行の共通スタイル。
 *
 * 選択は「枠線の色」だけでなく「背景を薄く塗る」ことでも示す。
 * 枠線だけだと細くて気づきにくく、色覚特性によっては差が分かりにくいため。
 *
 * @param accent 選択時の色。省略時は primary（青）
 */
export function selectableCard(
  colors: Colors,
  opts: { selected: boolean; accent?: string; radius?: string },
): CSSProperties {
  const accent = opts.accent ?? colors.primary ?? '#2196F3';
  return {
    boxSizing: 'border-box',
    borderRadius: opts.radius ?? L.r.md,
    // 太さは常に同じ。非選択時は色を透明にして場所だけ確保する
    border: `${SELECTION_BORDER_WIDTH}px solid ${opts.selected ? accent : 'transparent'}`,
    backgroundColor: opts.selected ? tintColor(accent, 0.18) : colors.surface,
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  };
}
