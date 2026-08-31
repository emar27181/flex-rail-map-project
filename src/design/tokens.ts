/**
 * v2 UI デザイントークン(単一の情報源)
 *
 * v2配下のコンポーネントは色・フォント・余白・角丸・影などの生値を
 * インラインで直書きせず、必ずこのファイル(またはCSS変数経由)を参照する。
 * v1 (src/components/*.tsx) は対象外 — 既存のThemeContext/constants/ui.tsを使い続ける。
 */
import { NEUTRAL } from '../constants/ui';

export interface ColorTokens {
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  primary: string;
  primaryHover: string;
  primaryActive: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  overlay: string;
  shadow: string;
}

export const colorTokens: { light: ColorTokens; dark: ColorTokens } = {
  light: {
    bg: '#f7f8fa',
    bgElevated: NEUTRAL.white,
    surface: NEUTRAL.white,
    surfaceHover: '#f0f2f5',
    border: '#e2e5ea',
    borderStrong: '#c7ccd4',
    text: '#1a1d23',
    textSecondary: '#5b6270',
    textMuted: '#8a909c',
    textOnPrimary: NEUTRAL.white,
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryActive: '#1e40af',
    accent: '#7c3aed',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0891b2',
    overlay: 'rgba(15, 18, 25, 0.45)',
    shadow: 'rgba(15, 18, 25, 0.12)',
  },
  dark: {
    bg: '#12141a',
    bgElevated: '#1b1e26',
    surface: '#1b1e26',
    surfaceHover: '#252933',
    border: '#2b3039',
    borderStrong: '#3d4350',
    text: '#f2f3f5',
    textSecondary: '#a8adb8',
    textMuted: '#767c88',
    textOnPrimary: NEUTRAL.white,
    primary: '#5b8def',
    primaryHover: '#79a2f2',
    primaryActive: '#3d6fd6',
    accent: '#a685f2',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#38bdf8',
    overlay: 'rgba(0, 0, 0, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
};

export const typographyTokens = {
  fontFamily: '"Noto Sans JP", system-ui, -apple-system, "Segoe UI", sans-serif',
  fontFamilyMono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  size: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '22px',
    xxl: '28px',
  },
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
  lineHeight: {
    tight: '1.2',
    base: '1.5',
    relaxed: '1.7',
  },
} as const;

/** 4pxベースのスペーシングスケール */
export const spaceTokens = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const radiusTokens = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '24px',
  pill: '999px',
} as const;

export const shadowTokens = {
  sm: '0 1px 2px var(--v2-color-shadow)',
  md: '0 4px 12px var(--v2-color-shadow)',
  lg: '0 12px 32px var(--v2-color-shadow)',
} as const;

/** px単位。メディアクエリでは数値をそのまま使う */
export const breakpointTokens = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export const zIndexTokens = {
  base: 0,
  dropdown: 20,
  sticky: 50,
  overlay: 100,
  modal: 200,
  toast: 300,
} as const;

export const transitionTokens = {
  fast: '120ms ease',
  base: '200ms ease',
  slow: '320ms ease',
} as const;

export const defaultTokens = {
  color: colorTokens,
  typography: typographyTokens,
  space: spaceTokens,
  radius: radiusTokens,
  shadow: shadowTokens,
  breakpoint: breakpointTokens,
  zIndex: zIndexTokens,
  transition: transitionTokens,
};

export type DesignTokens = typeof defaultTokens;
