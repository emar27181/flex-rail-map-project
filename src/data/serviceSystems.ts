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

/** 上野東京ラインの東海道線側の行先（熱海・沼津・伊東） */
const UENO_TOKYO_TOKAIDO_ENDS: ServiceEnd[] = [
  { stations: ['熱海'] },
  { via: 'jrShizuokaLine', stations: ['沼津'] },
  { via: 'jrItoLine', stations: ['伊東'] },
];

/** 高崎線側の行先（高崎・籠原、両毛線の前橋） */
const TAKASAKI_ENDS: ServiceEnd[] = [
  { stations: ['高崎', '籠原'] },
  { via: 'jrRyomoline', stations: ['前橋'] },
];

/** 総武快速線から先の直通先（千葉から総武本線・内房線・外房線・成田線） */
const SOBU_RAPID_ENDS: ServiceEnd[] = [
  { stations: ['千葉'] },
  { via: 'jrSobuMainLine', stations: ['成東'] },
  { via: 'jrUchiboLine', stations: ['君津'] },
  { via: 'jrSotoboLine', stations: ['上総一ノ宮'] },
  { via: 'jrNaritaLine', stations: ['成田空港'] },
];

const SRC_UENO_TOKYO = [
  'https://media.jreast.co.jp/articles/2938',
  'https://www.tokyo-train-master.com/jtjujj-uenotokyo',
  'https://trafficnews.jp/post/128269',
];
const SRC_SHONAN_SHINJUKU = [
  'https://raillab.jp/transport/73',
  'https://raillab.jp/transport/74',
  'https://www.tokyo-train-master.com/js-shonanshinjuku',
];
const SRC_YOKOSUKA_SOBU = [
  'https://www.tokyo-train-master.com/jo-sobu-rapid',
  'https://rosen-zu.net/jr_yokosuka_sobu/',
];

export const SERVICE_SYSTEMS: ServiceSystem[] = [
  // ── 上野東京ライン（東海道線 ⇔ 宇都宮線・高崎線）──
  // 常磐線からの上野東京ラインは品川止まりで東海道線には直通しない
  {
    route: 'jrTokaidoMainLine', // 東京 → 熱海
    brand: 'uenoTokyoLine',
    head: [{ via: 'jrUtsunomiyaLine', stations: ['宇都宮', '小金井'] }, ...TAKASAKI_ENDS.map(e => ({ via: e.via ?? 'jrTakasakiLine', stations: e.stations }))],
    tail: UENO_TOKYO_TOKAIDO_ENDS,
    sources: SRC_UENO_TOKYO,
  },
  {
    route: 'jrUtsunomiyaLine', // 上野 → 宇都宮
    brand: 'uenoTokyoLine',
    head: UENO_TOKYO_TOKAIDO_ENDS.map(e => ({ via: e.via ?? 'jrTokaidoMainLine', stations: e.stations })),
    tail: [{ stations: ['宇都宮', '小金井'] }],
    sources: SRC_UENO_TOKYO,
  },
  {
    route: 'jrTakasakiLine', // 東京 → 高崎
    brand: 'uenoTokyoLine',
    head: UENO_TOKYO_TOKAIDO_ENDS.map(e => ({ via: e.via ?? 'jrTokaidoMainLine', stations: e.stations })),
    tail: TAKASAKI_ENDS,
    sources: SRC_UENO_TOKYO,
  },

  // ── 湘南新宿ライン（2系統は交差しない）──
  {
    route: 'jrShonanShinjukuTakasakiTokaido', // 高崎 → 小田原
    brand: 'shonanShinjukuLine',
    head: TAKASAKI_ENDS,
    tail: [{ stations: ['小田原', '国府津', '平塚'] }],
    sources: SRC_SHONAN_SHINJUKU,
  },
  {
    route: 'jrShonanShinjukuLine', // 宇都宮 → 逗子
    brand: 'shonanShinjukuLine',
    head: [{ stations: ['宇都宮', '小金井'] }],
    tail: [{ stations: ['逗子', '大船'] }],
    sources: SRC_SHONAN_SHINJUKU,
  },

  // ── 横須賀・総武快速線 ──
  // 鹿島線（鹿島神宮）への直通もあるが、鹿島線の路線データが無いため載せていない
  {
    route: 'yokosukaLine', // 東京 → 久里浜
    brand: 'yokosukaSobuRapid',
    head: SOBU_RAPID_ENDS.map(e => ({ via: e.via ?? 'jrSobuLine', stations: e.stations })),
    tail: [{ stations: ['久里浜'] }],
    sources: SRC_YOKOSUKA_SOBU,
  },
  {
    route: 'jrSobuLine', // 東京 → 千葉
    brand: 'yokosukaSobuRapid',
    head: [{ via: 'yokosukaLine', stations: ['久里浜'] }],
    tail: SOBU_RAPID_ENDS,
    sources: SRC_YOKOSUKA_SOBU,
  },
];

const byRoute = new Map(SERVICE_SYSTEMS.map(s => [s.route, s]));

/** 路線の運行系統。登録が無ければ undefined */
export function getServiceSystem(route: RouteKey): ServiceSystem | undefined {
  return byRoute.get(route);
}
