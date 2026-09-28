/**
 * 直通運転（1本の列車で複数の路線をまたいで走る運行系統）の定義。
 *
 * 出発駅だけを選んだとき、その駅を通る路線に加えて「乗り換えずに1本で
 * 行ける範囲」も地図に出すために使う。例えば藤沢（小田急江ノ島線）からは
 * 相模大野で小田原線に直通する列車で新宿まで乗り換えなしで行けるが、
 * 路線データ上は江ノ島線と小田原線が別路線のため、以前は藤沢を選んでも
 * 江ノ島線（相模大野〜片瀬江ノ島）しか表示されなかった。
 *
 * ■ 収録方針
 * - 各社の直通運転案内・時刻表で定期列車として案内されている系統のみ
 *   （2026-09時点）。臨時列車や、特急（座席指定が必要な列車）だけの直通は含めない
 *   （例: 小田急ロマンスカーの箱根湯本・千代田線直通、西武の特急「ちちぶ」単独）
 * - 区間（from〜to）はその系統の列車が実際に走る範囲。省略した側は路線データの端まで。
 *   駅名は路線データ（src/data/*.ts）の表記に合わせる
 *   （tests/unit/data/throughServices.test.ts が存在を検証する）
 * - 「A〜B が直通」「B〜C が直通」でも A〜C を1本で行けるとは限らない。
 *   連鎖は推論せず、1本の列車が通る路線をまとめて1つの系統として書く
 *   （例: 江ノ島線→小田原線は直通、小田原線→千代田線も直通だが、
 *   江ノ島線から千代田線へ直通する定期列車は無いので別系統）
 * - 路線データ側の都合で、区間が実際の直通範囲より広く/狭くなる箇所がある
 *   （総武線データは快速・緩行が1本にまとまっている、京急本線データは横浜までなど）。
 *   これはデータ側の問題として docs/through-services.md に記録している
 */
import type { RouteKey } from './routes';

export interface ThroughSection {
  route: RouteKey;
  /** 系統が走る区間の端の駅。省略時は路線データの端 */
  from?: string;
  to?: string;
}

export interface ThroughService {
  id: string;
  /** 系統の通称（記録用。画面には出さない） */
  name: string;
  sections: ThroughSection[];
}

export const THROUGH_SERVICES: ThroughService[] = [
  // ── 小田急 ──
  {
    id: 'odakyu-enoshima',
    name: '小田急江ノ島線⇔小田原線（相模大野で直通、新宿〜藤沢・片瀬江ノ島）',
    sections: [
      { route: 'odakyuLine', from: '新宿', to: '相模大野' },
      { route: 'odakyuEnoshimaLine' },
    ],
  },
  {
    id: 'odakyu-tama',
    name: '小田急多摩線⇔小田原線（新百合ヶ丘で直通、新宿〜唐木田）',
    sections: [
      { route: 'odakyuLine', from: '新宿', to: '新百合ヶ丘' },
      { route: 'odakyuTamaLine' },
    ],
  },
  {
    id: 'chiyoda-odakyu',
    name: '東京メトロ千代田線⇔小田急小田原線（代々木上原で直通）',
    sections: [
      { route: 'chiyodaLine' },
      { route: 'odakyuLine', from: '代々木上原', to: '本厚木' },
    ],
  },

  // ── 東急・東京メトロ・東武・西武 ──
  {
    id: 'toyoko-fukutoshin-tojo',
    name: 'みなとみらい線・東急東横線⇔副都心線⇔東武東上線',
    sections: [
      { route: 'minatomirai' },
      { route: 'tokyuToyokoLine' },
      { route: 'fukutoshinLine' },
      { route: 'tobuTojoLine', from: '和光市', to: '森林公園' },
    ],
  },
  {
    id: 'toyoko-fukutoshin-seibu',
    name: 'みなとみらい線・東急東横線⇔副都心線⇔西武池袋線（小竹向原〜練馬は西武有楽町線）',
    sections: [
      { route: 'minatomirai' },
      { route: 'tokyuToyokoLine' },
      { route: 'fukutoshinLine', from: '小竹向原', to: '渋谷' },
      { route: 'seibuIkebukuroLine', from: '練馬' },
    ],
  },
  {
    id: 'yurakucho-tojo',
    name: '東京メトロ有楽町線⇔東武東上線（和光市で直通）',
    sections: [
      { route: 'yurakuchoLine' },
      { route: 'tobuTojoLine', from: '和光市', to: '森林公園' },
    ],
  },
  {
    id: 'yurakucho-seibu',
    name: '東京メトロ有楽町線⇔西武池袋線（小竹向原〜練馬は西武有楽町線）',
    sections: [
      { route: 'yurakuchoLine', from: '小竹向原', to: '新木場' },
      { route: 'seibuIkebukuroLine', from: '練馬' },
    ],
  },
  {
    id: 'seibu-chichibu',
    name: '西武池袋線⇔西武秩父線（吾野で直通、池袋〜西武秩父の快速急行など）',
    sections: [
      { route: 'seibuIkebukuroLine' },
      { route: 'seibuChichibuLine' },
    ],
  },
  {
    id: 'denentoshi-hanzomon-tobu',
    name: '東急田園都市線⇔半蔵門線⇔東武スカイツリーライン（押上で直通）',
    sections: [
      { route: 'tokyuDenEnToshiLine' },
      { route: 'hanzomonLine' },
      { route: 'tobuIsesakiLine', from: '押上', to: '竹ノ塚' },
    ],
  },
  {
    id: 'oimachi-denentoshi',
    name: '東急大井町線⇔田園都市線（二子玉川〜溝の口）',
    sections: [
      { route: 'tokyuOimachiLine' },
      { route: 'tokyuDenEnToshiLine', from: '二子玉川', to: '溝の口' },
    ],
  },
  {
    id: 'hibiya-tobu',
    name: '東京メトロ日比谷線⇔東武スカイツリーライン（北千住で直通）',
    sections: [
      { route: 'hibiyaLine' },
      { route: 'tobuIsesakiLine', from: '北千住', to: '竹ノ塚' },
    ],
  },
  {
    id: 'tozai-toyo',
    name: '東京メトロ東西線⇔東葉高速鉄道（西船橋で直通）',
    sections: [
      { route: 'tozaiLine' },
      { route: 'toyoRapid' },
    ],
  },
  {
    id: 'meguro-namboku-saitama',
    name: '東急目黒線⇔南北線⇔埼玉高速鉄道',
    sections: [
      { route: 'tokyuMeguro' },
      { route: 'nambokuLine' },
      { route: 'saitamaRailway' },
    ],
  },
  {
    id: 'meguro-mita',
    name: '東急目黒線⇔都営三田線（目黒で直通）',
    sections: [
      { route: 'tokyuMeguro' },
      { route: 'toeiMitaLine' },
    ],
  },

  // ── 都営浅草線・京急・京成・北総 ──
  {
    id: 'keikyu-asakusa-hokuso',
    name: '京急線⇔都営浅草線⇔京成押上線⇔北総線（羽田空港〜印旛日本医大など）',
    sections: [
      { route: 'keikyuLine' },
      { route: 'keikyuAirportLine' },
      { route: 'toeiAsakusaLine' },
      { route: 'keiseiOshiageLine' },
      { route: 'hokusouLine' },
    ],
  },
  {
    id: 'asakusa-keisei',
    name: '都営浅草線⇔京成押上線⇔京成本線（西馬込〜京成佐倉など）',
    sections: [
      { route: 'toeiAsakusaLine' },
      { route: 'keiseiOshiageLine' },
      { route: 'keiseiMainLine', from: '青砥', to: '京成佐倉' },
    ],
  },
  {
    id: 'keikyu-kurihama',
    name: '京急本線⇔久里浜線（品川〜三崎口の快特など）',
    sections: [
      { route: 'keikyuLine' },
      { route: 'keikyuKurihamaLine' },
    ],
  },
  {
    id: 'keikyu-airport-zushi',
    name: '京急空港線⇔京急本線⇔逗子線（羽田空港〜逗子・葉山のエアポート急行）',
    sections: [
      { route: 'keikyuAirportLine' },
      { route: 'keikyuLine', from: '京急蒲田', to: '横浜' },
      { route: 'keikyuZushiLine' },
    ],
  },

  // ── 京王・都営新宿線 ──
  {
    id: 'keio-sagamihara',
    name: '京王線⇔京王相模原線（調布で直通、新宿〜橋本）',
    sections: [
      { route: 'keioLine', from: '新宿', to: '調布' },
      { route: 'keioSagamiharaLine' },
    ],
  },
  {
    id: 'shinjuku-keio',
    name: '都営新宿線⇔京王線⇔京王相模原線（新線新宿で直通、本八幡〜橋本など）',
    sections: [
      { route: 'toeiShinjukuLine' },
      { route: 'keioLine', from: '笹塚', to: '調布' },
      { route: 'keioSagamiharaLine' },
    ],
  },

  // ── JR ──
  {
    id: 'ueno-tokyo-line',
    name: '上野東京ライン（東海道線⇔宇都宮線・高崎線）',
    sections: [
      { route: 'jrTokaidoMainLine' },
      { route: 'jrUtsunomiyaLine' },
      { route: 'jrTakasakiLine' },
    ],
  },
  {
    id: 'shonan-shinjuku-takasaki-tokaido',
    name: '湘南新宿ライン（高崎線⇔東海道線）',
    sections: [
      { route: 'jrTakasakiLine', from: '大宮', to: '高崎' },
      { route: 'jrShonanShinjukuLine', from: '大宮', to: '大船' },
      { route: 'jrTokaidoMainLine', from: '大船', to: '小田原' },
    ],
  },
  {
    id: 'shonan-shinjuku-utsunomiya-yokosuka',
    name: '湘南新宿ライン（宇都宮線⇔横須賀線）',
    sections: [
      { route: 'jrUtsunomiyaLine', from: '大宮', to: '宇都宮' },
      { route: 'jrShonanShinjukuLine' },
    ],
  },
  {
    id: 'yokosuka-sobu',
    name: '横須賀線⇔総武快速線（東京で直通）',
    sections: [
      { route: 'yokosukaLine' },
      { route: 'jrSobuLine' },
    ],
  },
  {
    id: 'chuo-ome',
    name: '中央線快速⇔青梅線（立川で直通、東京〜青梅の青梅特快など）',
    sections: [
      { route: 'chuo' },
      { route: 'jrOmeLine', from: '立川', to: '青梅' },
    ],
  },
  {
    id: 'saikyo-rinkai',
    name: '埼京線⇔りんかい線（大崎で直通）',
    sections: [
      { route: 'jrSaikyoLine' },
      { route: 'rinkaiLine' },
    ],
  },
  {
    id: 'sotetsu-jr',
    name: '相鉄・JR直通線⇔埼京線（新宿から埼京線方面へ直通する列車）',
    sections: [
      { route: 'sotetsuJRLine' },
      { route: 'jrSaikyoLine', from: '新宿', to: '大宮' },
    ],
  },
];
