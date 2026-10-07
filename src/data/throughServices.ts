/*
 * 【必読】編集する前に docs/data-editing-guide.md を読むこと（共通ルール: 推測で書かない・出典を残す・
 *   値だけを書く・編集後に npm run test:data）。
 */
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
    // 2025-03 改正時点: 新百合ヶ丘以西は朝・夕夜間のみ、伊勢原発着は夕夜間の下りと平日朝の上り3本
    name: '東京メトロ千代田線⇔小田急小田原線（代々木上原で直通）',
    sections: [
      { route: 'chiyodaLine' },
      { route: 'odakyuLine', from: '代々木上原', to: '伊勢原' },
    ],
  },
  {
    // 2025-03 改正で日中の急行が唐木田発着になり、多摩線直通が復活
    id: 'chiyoda-odakyu-tama',
    name: '東京メトロ千代田線⇔小田急小田原線⇔多摩線（代々木上原〜唐木田）',
    sections: [
      { route: 'chiyodaLine' },
      { route: 'odakyuLine', from: '代々木上原', to: '新百合ヶ丘' },
      { route: 'odakyuTamaLine' },
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
  // 上野東京ラインは東海道線から宇都宮線・高崎線のどちらかへ直通する。宇都宮線⇔高崎線の
  // 直通列車は無いので、行き先ごとに2系統に分ける（1つにすると経路検索で
  // 宇都宮線から高崎線へ1本で行けることになってしまう）
  {
    id: 'ueno-tokyo-line-utsunomiya',
    name: '上野東京ライン（東海道線⇔宇都宮線、東京・上野経由）',
    sections: [
      { route: 'jrTokaidoMainLine' },
      { route: 'jrUtsunomiyaLine' },
    ],
  },
  {
    id: 'ueno-tokyo-line-takasaki',
    name: '上野東京ライン（東海道線⇔高崎線、東京・上野経由）',
    sections: [
      { route: 'jrTokaidoMainLine' },
      { route: 'jrTakasakiLine' },
    ],
  },
  // 湘南新宿ラインの2系統（宇都宮線⇔横須賀線、高崎線⇔東海道線）は、
  // 系統ごとに1本の路線データ（jrShonanShinjukuLine / jrShonanShinjukuTakasakiTokaido）に
  // したので、直通としては書かない（路線そのものが1本で行ける範囲）
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
    id: 'yokohama-negishi',
    name: 'JR横浜線⇔根岸線（東神奈川から横浜・桜木町・磯子・大船へ直通。快速は全列車）',
    sections: [
      { route: 'jrYokohamaLine' },
      { route: 'keihinTohoku', from: '東神奈川', to: '大船' },
    ],
  },
  {
    id: 'musashino-keiyo',
    name: 'JR武蔵野線⇔京葉線（西船橋・市川塩浜から東京・海浜幕張へ直通）',
    sections: [
      { route: 'jrMusashinoLine' },
      { route: 'jrKeiyo', from: '東京', to: '海浜幕張' },
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

  // ══════════ 全国（2026-09-28 追加。出典は docs/through-services.md） ══════════

  // ── 関西: JR西日本 ──
  {
    id: 'jrw-special-rapid',
    name: '新快速（敦賀・近江今津〜米原・京都〜大阪〜神戸〜姫路・網干）',
    sections: [
      { route: 'jrHokurikuMaibaraToTsuruga' },
      { route: 'jrKosaiLine', from: '山科', to: '近江今津' },
      { route: 'jrBiwako' },
      { route: 'jrKyotoLine' },
      { route: 'jrKobeLine' },
      { route: 'jrSanyoMainLine', from: '神戸', to: '網干' },
    ],
  },
  {
    id: 'jrw-tozai-gakken',
    name: 'JR学研都市線⇔JR東西線⇔JR宝塚線・JR神戸線（木津〜新三田・西明石）',
    sections: [
      { route: 'jrGakkenLine' },
      { route: 'jrOsakaTozaiLine' },
      { route: 'jrFukuchiyamaLine', from: '尼崎', to: '新三田' },
      { route: 'jrKobeLine', from: '尼崎', to: '住吉' },
      { route: 'jrSanyoMainLine', from: '神戸', to: '西明石' },
    ],
  },
  {
    id: 'jrw-yamatoji-rapid',
    name: '大和路快速（大阪環状線⇔大和路線、環状線を一周して奈良・加茂方面へ）',
    sections: [
      { route: 'osakaLoopLine' },
      { route: 'jrOsakaLoop' },
      { route: 'jrYamatoji', from: '天王寺', to: '加茂' },
    ],
  },
  {
    id: 'jrw-kanku-kishuji-rapid',
    name: '関空快速・紀州路快速（大阪環状線⇔阪和線）',
    sections: [
      { route: 'osakaLoopLine' },
      { route: 'jrOsakaLoop' },
      { route: 'jrHanwaLine' },
    ],
  },
  {
    id: 'jrw-osaka-higashi-direct-rapid',
    name: 'おおさか東線 直通快速（大阪・新大阪〜久宝寺〜奈良）',
    sections: [
      { route: 'jrKyotoLine', from: '新大阪', to: '大阪' },
      { route: 'jrOsakaHigashiLine' },
      { route: 'jrYamatoji', from: '久宝寺', to: '奈良' },
    ],
  },

  // ── 関西: 私鉄・地下鉄 ──
  {
    id: 'sakaisuji-hankyu-kyoto',
    // 高槻市より先（京都河原町）への直通は準急の一部のみのため含めない
    name: 'Osaka Metro堺筋線⇔阪急千里線⇔京都線（天神橋筋六丁目〜淡路〜高槻市）',
    sections: [
      { route: 'osakaSakaisuji' },
      { route: 'hankyuSenriLine', from: '天神橋筋六丁目', to: '淡路' },
      { route: 'hankyuKyotoLine', from: '淡路', to: '高槻市' },
    ],
  },
  {
    id: 'sakaisuji-hankyu-senri',
    name: 'Osaka Metro堺筋線⇔阪急千里線（天下茶屋〜北千里）',
    sections: [
      { route: 'osakaSakaisuji' },
      { route: 'hankyuSenriLine' },
    ],
  },
  {
    id: 'midosuji-kitakyu',
    name: 'Osaka Metro御堂筋線⇔北大阪急行（江坂で直通、全列車）',
    sections: [
      { route: 'osakaMidosujiMain' },
      { route: 'kitaosakaKyuko' },
    ],
  },
  {
    id: 'chuo-keihanna',
    name: 'Osaka Metro中央線⇔近鉄けいはんな線（長田で直通）',
    sections: [
      { route: 'osakaChuoLine' },
      { route: 'kintetsuKeihanna' },
    ],
  },
  {
    id: 'hanshin-kintetsu-nara',
    name: '阪神本線⇔阪神なんば線⇔近鉄奈良線（快速急行 神戸三宮〜近鉄奈良）',
    sections: [
      { route: 'hanshinMainLine', from: '尼崎', to: '神戸三宮' },
      { route: 'hanshinNamba' },
      { route: 'kintetsuNaraLine' },
      { route: 'kintetsuNaraLine2' },
    ],
  },
  {
    id: 'karasuma-kintetsu',
    name: '京都市営地下鉄烏丸線⇔近鉄京都線（竹田で直通、国際会館〜新田辺・近鉄奈良）',
    sections: [
      { route: 'kyotoSubwayKarasuma' },
      { route: 'kintetsuKyotoLine', from: '竹田', to: '大和西大寺' },
      { route: 'kintetsuNaraLine', from: '大和西大寺', to: '近鉄奈良' },
      { route: 'kintetsuNaraLine2', from: '大和西大寺', to: '近鉄奈良' },
    ],
  },
  {
    id: 'kintetsu-kyoto-nara',
    name: '近鉄京都線⇔奈良線（急行 京都〜近鉄奈良）',
    sections: [
      { route: 'kintetsuKyotoLine' },
      { route: 'kintetsuNaraLine', from: '大和西大寺', to: '近鉄奈良' },
      { route: 'kintetsuNaraLine2', from: '大和西大寺', to: '近鉄奈良' },
    ],
  },
  {
    id: 'kintetsu-kyoto-kashihara',
    name: '近鉄京都線⇔橿原線（急行 京都〜橿原神宮前）',
    sections: [
      { route: 'kintetsuKyotoLine' },
      { route: 'kintetsuKasharaLine' },
    ],
  },
  {
    id: 'kintetsu-minamiosaka-nagano',
    name: '近鉄南大阪線⇔長野線（準急 大阪阿部野橋〜河内長野）',
    sections: [
      { route: 'kintetsuMinamiOsakaLine', from: '大阪阿部野橋', to: '古市' },
      { route: 'kintetsuNaganoLine' },
    ],
  },
  {
    id: 'keihan-oto',
    name: '京阪本線⇔鴨東線（淀屋橋〜出町柳）',
    sections: [
      { route: 'keihanMainLine' },
      { route: 'keihanKamotoline' },
    ],
  },
  {
    id: 'keihan-nakanoshima',
    name: '京阪中之島線⇔本線⇔鴨東線（中之島〜出町柳）',
    sections: [
      { route: 'keihanNakanoshima' },
      { route: 'keihanMainLine', from: '天満橋', to: '三条' },
      { route: 'keihanKamotoline' },
    ],
  },
  {
    id: 'hankyu-noseden-nissei',
    name: '阪急宝塚線⇔能勢電鉄妙見線・日生線（日生エクスプレス 大阪梅田〜日生中央、平日朝夕）',
    sections: [
      { route: 'hankyuTakarazukaLine', from: '大阪梅田', to: '川西能勢口' },
      { route: 'nosedenMyokenLine', from: '川西能勢口', to: '山下' },
      { route: 'noseDentetsuMyoken', from: '川西能勢口', to: '山下' },
      { route: 'noseDentetsuNisshoLine' },
    ],
  },
  {
    id: 'nankai-airport',
    name: '南海本線⇔空港線（空港急行など なんば〜関西空港）',
    sections: [
      { route: 'nankaMainLine', from: 'なんば', to: '泉佐野' },
      { route: 'nankaAirportLine' },
    ],
  },

  // ── 中京 ──
  {
    id: 'tsurumai-inuyama',
    name: '名古屋市営地下鉄鶴舞線⇔名鉄犬山線（上小田井で直通、〜岩倉・犬山）',
    sections: [
      { route: 'nagoyaTsurumai' },
      { route: 'meitetsuInuyamaLine', from: '上小田井', to: '犬山' },
    ],
  },
  {
    id: 'tsurumai-toyota',
    // 実際は梅坪から三河線で豊田市まで直通するが、三河線データに豊田市が無い
    name: '名古屋市営地下鉄鶴舞線⇔名鉄豊田線（赤池で直通、〜豊田市）',
    sections: [
      { route: 'nagoyaTsurumai' },
      { route: 'meitetsuToyotaLine' },
    ],
  },
  {
    id: 'meitetsu-inuyama-tokoname',
    // 空港線（常滑〜中部国際空港）は路線データが無い
    name: '名鉄犬山線⇔名古屋本線⇔常滑線（新鵜沼・犬山〜名鉄名古屋〜中部国際空港）',
    sections: [
      { route: 'meitetsuInuyamaLine' },
      { route: 'meitetsuNagoyaMainLine', from: '神宮前', to: '東枇杷島' },
      { route: 'meitetsuTokonameLine' },
    ],
  },
  {
    id: 'meitetsu-kowa-chita',
    // 常滑線データに分岐駅の太田川が無いため、常滑線は聚楽園までで代用
    name: '名鉄河和線・知多新線⇔常滑線⇔名古屋本線（河和・内海〜名鉄名古屋）',
    sections: [
      { route: 'meitetsuNagoyaMainLine', from: '神宮前', to: '名鉄名古屋' },
      { route: 'meitetsuTokonameLine', from: '神宮前', to: '聚楽園' },
      { route: 'meitetsuKowaLine' },
      { route: 'meitetsuChitaShinLine' },
    ],
  },
  {
    id: 'kintetsu-nagoya-yamada',
    name: '近鉄名古屋線⇔山田線（急行 近鉄名古屋〜松阪）',
    sections: [
      { route: 'kintetsuNagoyaLine' },
      { route: 'kintetsuYamadaLine', from: '伊勢中川', to: '松阪' },
    ],
  },

  // ── 九州 ──
  {
    id: 'fukuoka-airport-chikuhi',
    // 筑肥線データは駅の並びが一部入れ替わっている（docs/through-services.md）
    name: '福岡市地下鉄空港線⇔JR筑肥線（姪浜で直通、福岡空港〜筑前前原・唐津・西唐津）',
    sections: [
      { route: 'fukuokaAirportLine' },
      { route: 'jrChikuhiLine', from: '姪浜', to: '唐津' },
    ],
  },

  // ── 東北・北陸 ──
  {
    id: 'sendai-airport-access',
    name: '仙台空港アクセス線（仙台空港鉄道⇔JR東北本線、全列車が仙台まで直通）',
    sections: [
      { route: 'sendaiAirportRailway' },
      { route: 'jrTohokuMainLine', from: '名取', to: '仙台' },
    ],
  },
  {
    id: 'igr-aoimori',
    name: 'IGRいわて銀河鉄道⇔青い森鉄道（目時で直通、盛岡〜八戸）',
    sections: [
      { route: 'igrIwateGinga' },
      { route: 'aoimoriRailway', from: '目時', to: '八戸' },
    ],
  },
  {
    id: 'ainokaze-ir',
    name: 'あいの風とやま鉄道⇔IRいしかわ鉄道（倶利伽羅で直通、富山〜金沢）',
    sections: [
      { route: 'ainokaze', from: '倶利伽羅', to: '富山' },
      { route: 'irIshikawaRailway' },
    ],
  },

  // ── 中国・四国 ──
  {
    id: 'marine-liner',
    // 本四備讃線（茶屋町〜宇多津）は路線データが無い。予讃線データは駅の並びが一部入れ替わっている
    name: '快速マリンライナー（宇野線⇔本四備讃線⇔予讃線、岡山〜高松）',
    sections: [
      { route: 'jrUnoline', from: '岡山', to: '茶屋町' },
      { route: 'jrYosanLine', from: '高松', to: '坂出' },
    ],
  },
];
