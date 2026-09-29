/*
 * 【必読】編集する前に docs/data-editing-guide.md を読むこと（共通ルール: 推測で書かない・出典を残す・
 *   値だけを書く・編集後に npm run test:data）。
 */
/**
 * 同じ線路・並行する線路を別の運行系統が走る区間（首都圏）。
 *
 * 例えば東京〜大宮の東北本線上には宇都宮線・高崎線・湘南新宿ライン・
 * 京浜東北線・埼京線が並んで走る。以前は宇都宮線・高崎線・湘南新宿ライン・
 * 東海道線がすべて同じ橙（#F68B1E）で、重ねてずらして描いても
 * どの線がどの系統か見分けられなかった。
 *
 * ここに挙げた区間の路線どうしは、地図上で見分けられる色にする。
 * tests/unit/data/sharedCorridors.test.ts が routeColors の色差
 * （CIE76 ΔE が MIN_CORRIDOR_COLOR_DISTANCE 以上）を検証する。
 *
 * 路線データの重複（同じ運行系統が2つの路線キーで登録されている）は
 * 別系統ではないので含めない。記録は docs/through-services.md の2章。
 */
import type { RouteKey } from './routes';

export interface SharedCorridor {
  id: string;
  /** 区間の説明（記録用） */
  section: string;
  routes: RouteKey[];
}

/** 並走区間の路線どうしに求める最小の色差（CIE76 ΔE） */
export const MIN_CORRIDOR_COLOR_DISTANCE = 20;

/**
 * 案内上は同じ路線名で、あえて同じ色にしている系統の組。
 * 色差の検証から外す（違いは始発・行先 serviceSystems.ts で示す）。
 */
export const SAME_BRAND_ROUTES: RouteKey[][] = [
  ['jrShonanShinjukuLine', 'jrShonanShinjukuTakasakiTokaido'],
];

export const SHARED_CORRIDORS: SharedCorridor[] = [
  {
    id: 'tokaido',
    section: '東京・品川〜大船（東海道線・横須賀線・湘南新宿ライン・京浜東北線、武蔵小杉〜西大井は相鉄・JR直通線）',
    routes: ['jrTokaidoMainLine', 'yokosukaLine', 'jrShonanShinjukuLine', 'jrShonanShinjukuTakasakiTokaido', 'keihinTohoku', 'sotetsuJRLine'],
  },
  {
    id: 'tohoku',
    section: '東京・上野〜大宮（宇都宮線・高崎線・湘南新宿ライン・京浜東北線・埼京線）',
    routes: ['jrUtsunomiyaLine', 'jrTakasakiLine', 'jrShonanShinjukuLine', 'jrShonanShinjukuTakasakiTokaido', 'keihinTohoku', 'jrSaikyoLine'],
  },
  {
    id: 'yamanote-freight',
    section: '大崎〜池袋（山手線と、山手貨物線を走る埼京線・湘南新宿ライン・相鉄・JR直通線）',
    routes: ['yamanote', 'jrSaikyoLine', 'jrShonanShinjukuLine', 'jrShonanShinjukuTakasakiTokaido', 'sotetsuJRLine'],
  },
  {
    id: 'toyoko-meguro',
    section: '田園調布〜日吉（東急東横線と目黒線の複々線）',
    routes: ['tokyuToyokoLine', 'tokyuMeguro'],
  },
  {
    id: 'joban',
    section: '北千住〜金町（常磐線快速と、千代田線直通の常磐線各駅停車）',
    routes: ['jrJobanLine', 'chiyodaLine'],
  },
];
