/**
 * 「表示路線の切替」の推薦候補数と、終電モードの接続路線探索の共通設定。
 * UIにモード専用の件数入力は追加しない。初期値変更もここだけで行う。
 */
export const ROUTE_RECOMMENDATION_LIMIT_OPTIONS = [1, 2, 3, 5, 10] as const;
export const DEFAULT_ROUTE_RECOMMENDATION_LIMIT = 5;
