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
