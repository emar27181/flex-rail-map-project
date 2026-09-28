/*
 * 【必読】編集する前に docs/seo.md の「観光地と最寄り駅」を読むこと（確認は npm run test:unit）。
 */
/**
 * 観光地 → 最寄り駅の対応（駅ページ・観光地の内部リンクに使う）。
 *
 * - 駅は「駅名＋その駅がある路線キー」で指定する。駅名だけだと
 *   長谷（江ノ電）と長谷（JR播但線）のような同名の別駅を取り違えるため
 * - 載せるのは「その観光地の最寄り駅として一般に案内されている駅」だけ。
 *   徒歩分数・距離などは確かめた出典が無いので書かない
 * - 駅名・路線キーが路線データに無いとテストが落ちる
 *   （tests/unit/seo/pageModel.test.ts）
 */
import type { RouteKey } from './routes';

export interface TouristSpotStation {
  /** 路線データ上の駅名（表記を一字一句合わせる） */
  name: string;
  /** その駅がある路線（同名の別駅と区別するため） */
  route: RouteKey;
}

export interface TouristSpot {
  /** URLや識別に使う英小文字の名前 */
  id: string;
  name: { ja: string; en: string };
  stations: TouristSpotStation[];
}

export const TOURIST_SPOTS: TouristSpot[] = [
  {
    id: 'sensoji',
    name: { ja: '浅草寺', en: 'Senso-ji Temple' },
    stations: [{ name: '浅草', route: 'ginzaLine' }],
  },
  {
    id: 'tokyo-skytree',
    name: { ja: '東京スカイツリー', en: 'Tokyo Skytree' },
    stations: [
      { name: 'とうきょうスカイツリー', route: 'tobuIsesakiLine' },
      { name: '押上', route: 'hanzomonLine' },
    ],
  },
  {
    id: 'tokyo-tower',
    name: { ja: '東京タワー', en: 'Tokyo Tower' },
    stations: [
      { name: '赤羽橋', route: 'toeiOedoLine' },
      { name: '神谷町', route: 'hibiyaLine' },
    ],
  },
  {
    id: 'meiji-jingu',
    name: { ja: '明治神宮', en: 'Meiji Jingu Shrine' },
    stations: [
      { name: '原宿', route: 'yamanote' },
      { name: '明治神宮前', route: 'chiyodaLine' },
    ],
  },
  {
    id: 'kamakura-daibutsu',
    name: { ja: '鎌倉大仏（高徳院）', en: 'Great Buddha of Kamakura (Kotoku-in)' },
    stations: [{ name: '長谷', route: 'enoshimaElectricRailway' }],
  },
  {
    id: 'enoshima',
    name: { ja: '江の島', en: 'Enoshima Island' },
    stations: [
      { name: '片瀬江ノ島', route: 'odakyuEnoshimaLine' },
      { name: '江ノ島', route: 'enoshimaElectricRailway' },
      { name: '湘南江の島', route: 'shonanMonorail' },
    ],
  },
  {
    id: 'yokohama-chinatown',
    name: { ja: '横浜中華街', en: 'Yokohama Chinatown' },
    stations: [{ name: '元町・中華街', route: 'minatomirai' }],
  },
  {
    id: 'tokyo-disney-resort',
    name: { ja: '東京ディズニーリゾート', en: 'Tokyo Disney Resort' },
    stations: [{ name: '舞浜', route: 'jrKeiyo' }],
  },
];
