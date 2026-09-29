/*
 * 【必読】編集する前に docs/data-editing-guide.md を読むこと（共通ルール: 推測で書かない・出典を残す・
 *   値だけを書く・編集後に npm run test:data）。
 */
/**
 * 運行系統（列車の案内上の系統名と、主な始発・行先）の唯一の定義。
 *
 * 同じ線路を別の系統が走る区間では、路線名だけでは「この駅に来る列車が
 * どこから来てどこへ行くか」が分からない。例えば藤沢には東海道線
 * （上野東京ライン: 宇都宮・高崎方面⇔熱海・沼津・伊東）と湘南新宿ライン
 * （籠原・高崎方面⇔小田原）の2系統が来るが、以前は地図上に区別が無かった。
 *
 * - 系統名は SERVICE_BRAND_LABEL_KEY が指す translation.ts のUIキーで多言語化する
 * - 始発・行先は路線データの駅名で書く。分岐して別の路線へ直通する先は
 *   `via` にその路線キーを書く（表示時に路線名が付く）
 * - 画面には `ServiceTermini`（src/components/ServiceTermini.tsx）で出す。
 *   ここ以外に始発・行先や系統名を書かない
 * - 出典は各系統の `sources`。検索で確認できた行先だけを書き、
 *   確認できないもの（例: 上野東京ラインの小田原・平塚止まり）は入れていない
 */
import type { RouteKey } from './routes';

/** 案内上の系統名 */
export type ServiceBrand = 'uenoTokyoLine' | 'shonanShinjukuLine' | 'yokosukaSobuRapid';

/** 系統名の表示文言（translation.ts の UI キー） */
export const SERVICE_BRAND_LABEL_KEY: Record<ServiceBrand, string> = {
  uenoTokyoLine: 'serviceBrandUenoTokyoLine',
  shonanShinjukuLine: 'serviceBrandShonanShinjukuLine',
  yokosukaSobuRapid: 'serviceBrandYokosukaSobuRapid',
};

export interface ServiceEnd {
  /** 分岐して直通する先の路線。省略時はこの路線の中の駅 */
  via?: RouteKey;
  /** 主な始発・行先（路線データの駅名） */
  stations: string[];
}

export interface ServiceSystem {
  /** 地図上でこの系統を描いている路線 */
  route: RouteKey;
  brand: ServiceBrand;
  /** 路線データの先頭側の主な始発・行先（分岐先ごと） */
  head: ServiceEnd[];
  /** 路線データの末尾側の主な始発・行先（分岐先ごと） */
  tail: ServiceEnd[];
  sources: string[];
}

// ─────────────────────────────────────────────────────────────
// データ本体。1系統＝1ブロック。定数の参照や .map などの計算は使わず、
// 値をそのまま書く（他のAI・人が1か所だけ見て直せるように）。
// 編集ルールは docs/data-editing-guide.md の「serviceSystems.ts」。
// ─────────────────────────────────────────────────────────────
export const SERVICE_SYSTEMS: ServiceSystem[] = [
  // ── 上野東京ライン（東海道線 ⇔ 宇都宮線・高崎線）──
  // 常磐線からの上野東京ラインは品川止まりで東海道線には直通しない
  {
    route: 'jrTokaidoMainLine', // 路線データの向き: 東京 → 熱海
    brand: 'uenoTokyoLine',
    head: [
      { via: 'jrUtsunomiyaLine', stations: ['宇都宮', '小金井'] },
      { via: 'jrTakasakiLine', stations: ['高崎', '籠原'] },
      { via: 'jrRyomoline', stations: ['前橋'] },
    ],
    tail: [
      { stations: ['熱海'] },
      { via: 'jrShizuokaLine', stations: ['沼津'] },
      { via: 'jrItoLine', stations: ['伊東'] },
    ],
    sources: [
      'https://media.jreast.co.jp/articles/2938',
      'https://www.tokyo-train-master.com/jtjujj-uenotokyo',
      'https://trafficnews.jp/post/128269',
    ],
  },
  {
    route: 'jrUtsunomiyaLine', // 上野 → 宇都宮
    brand: 'uenoTokyoLine',
    head: [
      { via: 'jrTokaidoMainLine', stations: ['熱海'] },
      { via: 'jrShizuokaLine', stations: ['沼津'] },
      { via: 'jrItoLine', stations: ['伊東'] },
    ],
    tail: [{ stations: ['宇都宮', '小金井'] }],
    sources: [
      'https://media.jreast.co.jp/articles/2938',
      'https://www.tokyo-train-master.com/jtjujj-uenotokyo',
    ],
  },
  {
    route: 'jrTakasakiLine', // 東京 → 高崎
    brand: 'uenoTokyoLine',
    head: [
      { via: 'jrTokaidoMainLine', stations: ['熱海'] },
      { via: 'jrShizuokaLine', stations: ['沼津'] },
      { via: 'jrItoLine', stations: ['伊東'] },
    ],
    tail: [
      { stations: ['高崎', '籠原'] },
      { via: 'jrRyomoline', stations: ['前橋'] },
    ],
    sources: [
      'https://media.jreast.co.jp/articles/2938',
      'https://www.tokyo-train-master.com/jtjujj-uenotokyo',
    ],
  },

  // ── 湘南新宿ライン（2系統は交差しない）──
  {
    route: 'jrShonanShinjukuTakasakiTokaido', // 高崎 → 小田原
    brand: 'shonanShinjukuLine',
    head: [
      { stations: ['高崎', '籠原'] },
      { via: 'jrRyomoline', stations: ['前橋'] },
    ],
    tail: [{ stations: ['小田原', '国府津', '平塚'] }],
    sources: [
      'https://raillab.jp/transport/74',
      'https://www.tokyo-train-master.com/js-shonanshinjuku',
    ],
  },
  {
    route: 'jrShonanShinjukuLine', // 宇都宮 → 逗子
    brand: 'shonanShinjukuLine',
    head: [{ stations: ['宇都宮', '小金井'] }],
    tail: [{ stations: ['逗子', '大船'] }],
    sources: [
      'https://raillab.jp/transport/73',
      'https://www.tokyo-train-master.com/js-shonanshinjuku',
    ],
  },

  // ── 横須賀・総武快速線 ──
  // 鹿島線（鹿島神宮）への直通もあるが、鹿島線の路線データが無いため載せていない
  {
    route: 'yokosukaLine', // 東京 → 久里浜
    brand: 'yokosukaSobuRapid',
    head: [
      { via: 'jrSobuLine', stations: ['千葉'] },
      { via: 'jrSobuMainLine', stations: ['成東'] },
      { via: 'jrUchiboLine', stations: ['君津'] },
      { via: 'jrSotoboLine', stations: ['上総一ノ宮'] },
      { via: 'jrNaritaLine', stations: ['成田空港'] },
    ],
    tail: [{ stations: ['久里浜'] }],
    sources: [
      'https://www.tokyo-train-master.com/jo-sobu-rapid',
      'https://rosen-zu.net/jr_yokosuka_sobu/',
    ],
  },
  {
    route: 'jrSobuLine', // 東京 → 千葉
    brand: 'yokosukaSobuRapid',
    head: [{ via: 'yokosukaLine', stations: ['久里浜'] }],
    tail: [
      { stations: ['千葉'] },
      { via: 'jrSobuMainLine', stations: ['成東'] },
      { via: 'jrUchiboLine', stations: ['君津'] },
      { via: 'jrSotoboLine', stations: ['上総一ノ宮'] },
      { via: 'jrNaritaLine', stations: ['成田空港'] },
    ],
    sources: [
      'https://www.tokyo-train-master.com/jo-sobu-rapid',
      'https://rosen-zu.net/jr_yokosuka_sobu/',
    ],
  },
];

const byRoute = new Map(SERVICE_SYSTEMS.map(s => [s.route, s]));

/** 路線の運行系統。登録が無ければ undefined */
export function getServiceSystem(route: RouteKey): ServiceSystem | undefined {
  return byRoute.get(route);
}
