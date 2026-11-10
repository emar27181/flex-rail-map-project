/**
 * 地図右下の「表示中の路線」の凡例を折りたたんだかどうかの保持。
 * 既定は開いた状態（2026-11 ユーザー指示「凡例はデフォルト展開で」。どの色の線がどの路線かを開かずに見られる。
 * 2026-10-07 から閉じて始めていたが、色と路線名の対応が分からないままになっていた）。
 * 一度閉じた人には次も閉じた状態で出すよう、言語・テーマと同じく持ち越す。
 * 開いても一覧は5件ぶんの高さで、それより多い路線は凡例の中でスクロールする（VisibleRoutesLegend）。
 * 保存に失敗しても表示は続けられるべきなので、読み書きは黙って諦める。
 */
export const VISIBLE_ROUTES_LEGEND_COLLAPSED_KEY = 'frm-visible-routes-legend-collapsed';

export const getInitialLegendCollapsed = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    // 閉じたことを保存した人（'1'）だけ閉じて始める
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
