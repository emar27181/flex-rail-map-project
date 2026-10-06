/**
 * 地図右下の「表示中の路線」の凡例を折りたたんだかどうかの保持。
 * 既定は閉じた状態（2026-10-07: 表示の設定は必要なときに開くものとして、閉じて始める）。
 * 一度開いた人には次も開いた状態で出すよう、言語・テーマと同じく持ち越す。
 * 保存に失敗しても表示は続けられるべきなので、読み書きは黙って諦める。
 */
export const VISIBLE_ROUTES_LEGEND_COLLAPSED_KEY = 'frm-visible-routes-legend-collapsed';

export const getInitialLegendCollapsed = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    // 開いたことを保存した人（'0'）だけ開いて始める
    return window.localStorage.getItem(VISIBLE_ROUTES_LEGEND_COLLAPSED_KEY) !== '0';
  } catch {
    return true;
  }
};

export const persistLegendCollapsed = (collapsed: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(VISIBLE_ROUTES_LEGEND_COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {
    // 保存できなくても表示は続ける
  }
};
