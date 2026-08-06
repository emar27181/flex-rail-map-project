import { defaultTokens, type DesignTokens } from './tokens';
import type { Theme } from '../contexts/ThemeContext';

/** v2専用のCSS変数プレフィックス。v1のグローバルスタイルと衝突させないため */
export const CSS_VAR_PREFIX = '--v2-';

export type CssVarMap = Record<string, string>;

function kebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * テーマを解決した状態でトークン全体をフラットなCSS変数マップに変換する。
 * DesignTokensProvider(DOMへの適用)とDesignDebugPanel(編集UIの列挙)の両方が
 * このマップのキー集合をそのまま使う — 新しいトークンを追加してもここを
 * 1箇所直すだけで両方に反映される。
 */
export function buildCssVariables(tokens: DesignTokens, theme: Theme): CssVarMap {
  const vars: CssVarMap = {};
  const color = tokens.color[theme];
  (Object.keys(color) as Array<keyof typeof color>).forEach((key) => {
    vars[`${CSS_VAR_PREFIX}color-${kebab(key)}`] = color[key];
  });

  vars[`${CSS_VAR_PREFIX}font-family`] = tokens.typography.fontFamily;
  vars[`${CSS_VAR_PREFIX}font-family-mono`] = tokens.typography.fontFamilyMono;
  Object.entries(tokens.typography.size).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}font-size-${kebab(k)}`] = v;
  });
  Object.entries(tokens.typography.weight).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}font-weight-${kebab(k)}`] = v;
  });
  Object.entries(tokens.typography.lineHeight).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}line-height-${kebab(k)}`] = v;
  });

  Object.entries(tokens.space).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}space-${k}`] = v;
  });
  Object.entries(tokens.radius).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}radius-${kebab(k)}`] = v;
  });
  Object.entries(tokens.shadow).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}shadow-${kebab(k)}`] = v;
  });
  Object.entries(tokens.transition).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}transition-${kebab(k)}`] = v;
  });
  Object.entries(tokens.zIndex).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}z-${kebab(k)}`] = String(v);
  });
  Object.entries(tokens.breakpoint).forEach(([k, v]) => {
    vars[`${CSS_VAR_PREFIX}breakpoint-${kebab(k)}`] = String(v);
  });

  return vars;
}

/** デフォルト値（ライトテーマ基準）。編集UIでの「初期値」表示・比較に使う */
export const defaultCssVariablesByTheme: Record<Theme, CssVarMap> = {
  light: buildCssVariables(defaultTokens, 'light'),
  dark: buildCssVariables(defaultTokens, 'dark'),
};
