/**
 * 地図右下の「表示中の路線」の凡例を折りたたんだかどうかの保持。
 * 一度たたんだ人に毎回開いた状態で出さないよう、言語・テーマと同じく持ち越す。
 * 保存に失敗しても表示は続けられるべきなので、読み書きは黙って諦める。
 */
export const VISIBLE_ROUTES_LEGEND_COLLAPSED_KEY = 'frm-visible-routes-legend-collapsed';

export const getInitialLegendCollapsed = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(VISIBLE_ROUTES_LEGEND_COLLAPSED_KEY) === '1';
  } catch {
    return false;
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
