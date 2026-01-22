import { yamanote } from './yamanote';
import { chuo } from './chuo';
import { keihinTohoku } from './keihin-tohoku';
import { tokaido } from './tokaido';
import { ginzaLine } from './ginza-line';
import { marunouchiLine } from './marunouchi-line';
import { hibiyaLine } from './hibiya-line';
import { tozaiLine } from './tozai-line';
import { chiyodaLine } from './chiyoda-line';
import { yurakuchoLine } from './yurakucho-line';
import { hanzomonLine } from './hanzomon-line';
import { nambokuLine } from './namboku-line';
import { fukutoshinLine } from './fukutoshin-line';
import { toeiAsakusaLine } from './toei-asakusa-line';
import { toeiMitaLine } from './toei-mita-line';
import { toeiShinjukuLine } from './toei-shinjuku-line';
import { toeiOedoLine } from './toei-oedo-line';
import { jrSobuLine } from './jr-sobu-line';
import { jrJobanLine } from './jr-joban-line';
import { jrSaikyoLine } from './jr-saikyo-line';
import { jrTakasakiLine } from './jr-takasaki-line';
import { jrTokaidoMainLine } from './jr-tokaido-main-line';
import { odakyuLine } from './odakyu-line';
import { odakyuEnoshimaLine } from './odakyu-enoshima-line';
import { keioLine } from './keio-line';
import { tokyuToyokoLine } from './tokyu-toyoko-line';
import { tokyuDenEnToshiLine } from './tokyu-den-en-toshi-line';
import { seibuIkebukuroLine } from './seibu-ikebukuro-line';
import { seibuShinjukuLine } from './seibu-shinjuku-line';
import { tobuTojoLine } from './tobu-tojo-line';
import { keikyuLine } from './keikyu-line';
import { jrMusashinoLine } from './jr-musashino-line';
import { tokyoMonorail } from './tokyo-monorail';
import { keiseiMainLine } from './keisei-main-line';
import { jrYokohamaLine } from './jr-yokohama-line';
import { yokohamaBlueLine } from './yokohama-blue-line';
import { rinkaiLine } from './rinkai-line';
import { yurikamomeLine } from './yurikamome-line';
import { tsukubaExpress } from './tsukuba-express';
import { jrNanbuLine } from './jr-nanbu-line';
import { jrNegishiLine } from './jr-negishi-line';
import { sotetsuMainLine, sotetsuIzumino } from './sotetsu-line';
import { jrSobuChiba, jrKeiyo } from './jr-sobu-chiba';
import { jrKeihinTohokuSaitama, jrTokaidoUtsunomiya } from './jr-keihin-tohoku-saitama';
import { jrTokaidoKanagawa, jrTsurumi } from './jr-tokaido-kanagawa';
import { tokyuMeguro, tokyuTamagawa, tokyuIkegami } from './tokyu-additional';
import { yokohamaGreenLine } from './yokohama-green-line';
import { enoshimaElectricRailway } from './enoshima-electric-railway';
import { jrUchiboLine, jrSotoboLine, jrNaritaLine } from './jr-chiba-comprehensive';
import { shinkeisei, toyoRapid } from './chiba-private-railways';
import { tamaMonorail } from './tama-monorail';
import { todenArakawaLine } from './toden-arakawa-line';
import { nipporiToneriLiner } from './nippori-toneri-liner';
import { jrOmeLine } from './jr-ome-line';
import { keioInokashiraLine } from './keio-inokashira-line';
import { tokyuSetagayaLine } from './tokyu-setagaya-line';
import { tokyuOimachiLine } from './tokyu-oimachi-line';
import { tobuIsesakiLine } from './tobu-isesaki-line';
import { jrHachikoLine } from './jr-hachiko-line';
import { jrItsukaichiLine } from './jr-itsukaichi-line';
import { tobuDaishiLine } from './tobu-daishi-line';
import { tobuKameidoLine } from './tobu-kameido-line';

export const routes = {
  yamanote,
  chuo,
  keihinTohoku,
  tokaido,
  ginzaLine,
  marunouchiLine,
  hibiyaLine,
  tozaiLine,
  chiyodaLine,
  yurakuchoLine,
  hanzomonLine,
  nambokuLine,
  fukutoshinLine,
  toeiAsakusaLine,
  toeiMitaLine,
  toeiShinjukuLine,
  toeiOedoLine,
  jrSobuLine,
  jrJobanLine,
  jrSaikyoLine,
  jrTakasakiLine,
  jrTokaidoMainLine,
  odakyuLine,
  odakyuEnoshimaLine,
  keioLine,
  tokyuToyokoLine,
  tokyuDenEnToshiLine,
  seibuIkebukuroLine,
  seibuShinjukuLine,
  tobuTojoLine,
  keikyuLine,
  jrMusashinoLine,
  tokyoMonorail,
  keiseiMainLine,
  jrYokohamaLine,
  yokohamaBlueLine,
  rinkaiLine,
  yurikamomeLine,
  tsukubaExpress,
  jrNanbuLine,
  jrNegishiLine,
  sotetsuMainLine,
  sotetsuIzumino,
  jrSobuChiba,
  jrKeiyo,
  jrKeihinTohokuSaitama,
  jrTokaidoUtsunomiya,
  jrTokaidoKanagawa,
  jrTsurumi,
  tokyuMeguro,
  tokyuTamagawa,
  tokyuIkegami,
  yokohamaGreenLine,
  enoshimaElectricRailway,
  jrUchiboLine,
  jrSotoboLine,
  jrNaritaLine,
  shinkeisei,
  toyoRapid,
  tamaMonorail,
  todenArakawaLine,
  nipporiToneriLiner,
  jrOmeLine,
  keioInokashiraLine,
  tokyuSetagayaLine,
  tokyuOimachiLine,
  tobuIsesakiLine,
  jrHachikoLine,
  jrItsukaichiLine,
  tobuDaishiLine,
  tobuKameidoLine,
};

export type RouteKey = keyof typeof routes;

export const routeColors = {
  yamanote: '#58B848', // JR Yamanote Line green
  chuo: '#F15A22', // JR Chuo Line orange
  keihinTohoku: '#00B5E2', // JR Keihin-Tohoku Line blue
  tokaido: '#F68B1E', // JR Tokaido Line orange
  ginzaLine: '#FF9500', // Tokyo Metro Ginza Line orange
  marunouchiLine: '#F62E36', // Tokyo Metro Marunouchi Line red
  hibiyaLine: '#B5B5AC', // Tokyo Metro Hibiya Line silver
  tozaiLine: '#009BBF', // Tokyo Metro Tozai Line light blue
  chiyodaLine: '#00BB85', // Tokyo Metro Chiyoda Line green
  yurakuchoLine: '#C1A470', // Tokyo Metro Yurakucho Line gold
  hanzomonLine: '#8F76D6', // Tokyo Metro Hanzomon Line purple
  nambokuLine: '#00ADA9', // Tokyo Metro Namboku Line emerald
  fukutoshinLine: '#9C5F2C', // Tokyo Metro Fukutoshin Line brown
  toeiAsakusaLine: '#E85298', // Toei Asakusa Line pink
  toeiMitaLine: '#0079C2', // Toei Mita Line blue
  toeiShinjukuLine: '#6CBB5A', // Toei Shinjuku Line leaf green
  toeiOedoLine: '#B6007A', // Toei Oedo Line magenta
  jrSobuLine: '#FED100', // JR Sobu Line yellow
  jrJobanLine: '#417036', // JR Joban Line green
  jrSaikyoLine: '#00B5AD', // JR Saikyo Line teal
  jrTakasakiLine: '#F68B1E', // JR Takasaki Line orange
  jrTokaidoMainLine: '#F68B1E', // JR Tokaido Main Line orange
  odakyuLine: '#0066CC', // Odakyu Line blue
  odakyuEnoshimaLine: '#0066CC', // Odakyu Enoshima Line blue
  keioLine: '#DD0077', // Keio Line magenta
  tokyuToyokoLine: '#DA020E', // Tokyu Toyoko Line red
  tokyuDenEnToshiLine: '#009639', // Tokyu Den-en-toshi Line green
  seibuIkebukuroLine: '#004098', // Seibu Ikebukuro Line navy blue
  seibuShinjukuLine: '#F39700', // Seibu Shinjuku Line orange
  tobuTojoLine: '#004098', // Tobu Tojo Line navy blue
  keikyuLine: '#C8102E', // Keikyu Line red
  jrMusashinoLine: '#F15A22', // JR Musashino Line orange  
  tokyoMonorail: '#0066CC', // Tokyo Monorail blue
  keiseiMainLine: '#3165B1', // Keisei Main Line blue
  jrYokohamaLine: '#41A541', // JR Yokohama Line green
  yokohamaBlueLine: '#0066FF', // Yokohama Blue Line blue
  rinkaiLine: '#00B5E2', // Rinkai Line light blue
  yurikamomeLine: '#00BFFF', // Yurikamome Line sky blue
  tsukubaExpress: '#8B4513', // Tsukuba Express brown
  jrNanbuLine: '#FFCC00', // JR Nanbu Line yellow
  jrNegishiLine: '#00B5AD', // JR Negishi Line teal
  sotetsuMainLine: '#2E8B57', // Sotetsu Main Line sea green
  sotetsuIzumino: '#32CD32', // Sotetsu Izumino Line lime green
  jrSobuChiba: '#FFD700', // JR Sobu Chiba Line gold
  jrKeiyo: '#FF6347', // JR Keiyo Line tomato
  jrKeihinTohokuSaitama: '#00CED1', // JR Keihin-Tohoku Saitama dark turquoise
  jrTokaidoUtsunomiya: '#FF8C00', // JR Tokaido Utsunomiya Line dark orange
  jrTokaidoKanagawa: '#FF4500', // JR Tokaido Kanagawa orange red
  jrTsurumi: '#4682B4', // JR Tsurumi Line steel blue
  tokyuMeguro: '#008B8B', // Tokyu Meguro Line dark cyan
  tokyuTamagawa: '#FF1493', // Tokyu Tamagawa Line deep pink
  tokyuIkegami: '#9370DB', // Tokyu Ikegami Line medium purple
  yokohamaGreenLine: '#32CD32', // Yokohama Green Line lime green
  enoshimaElectricRailway: '#228B22', // Enoshima Electric Railway forest green
  jrUchiboLine: '#B22222', // JR Uchibo Line fire brick
  jrSotoboLine: '#DC143C', // JR Sotobo Line crimson
  jrNaritaLine: '#800080', // JR Narita Line purple
  shinkeisei: '#FF6347', // Shin-Keisei tomato
  toyoRapid: '#4169E1', // Toyo Rapid royal blue
  tamaMonorail: '#20B2AA', // Tama Monorail light sea green
  todenArakawaLine: '#EE82EE', // Toden Arakawa Line violet
  nipporiToneriLiner: '#FF1493', // Nippori-Toneri Liner deep pink
  jrOmeLine: '#FF8C00', // JR Ome Line dark orange
  keioInokashiraLine: '#48D1CC', // Keio Inokashira Line medium turquoise
  tokyuSetagayaLine: '#2E8B57', // Tokyu Setagaya Line sea green
  tokyuOimachiLine: '#FF4500', // Tokyu Oimachi Line orange red
  tobuIsesakiLine: '#1E88E5', // Tobu Isesaki Line (Sky Tree Line) blue
  jrHachikoLine: '#F5A623', // JR Hachiko Line orange
  jrItsukaichiLine: '#FFB300', // JR Itsukaichi Line amber
  tobuDaishiLine: '#AB47BC', // Tobu Daishi Line purple
  tobuKameidoLine: '#66BB6A', // Tobu Kameido Line green
};

export const routeNames = {
  yamanote: '山手線',
  chuo: '中央線',
  keihinTohoku: '京浜東北線',
  tokaido: '東海道線',
  ginzaLine: '銀座線',
  marunouchiLine: '丸ノ内線',
  hibiyaLine: '日比谷線',
  tozaiLine: '東西線',
  chiyodaLine: '千代田線',
  yurakuchoLine: '有楽町線',
  hanzomonLine: '半蔵門線',
  nambokuLine: '南北線',
  fukutoshinLine: '副都心線',
  toeiAsakusaLine: '都営浅草線',
  toeiMitaLine: '都営三田線',
  toeiShinjukuLine: '都営新宿線',
  toeiOedoLine: '都営大江戸線',
  jrSobuLine: '総武線',
  jrJobanLine: '常磐線',
  jrSaikyoLine: '埼京線',
  jrTakasakiLine: '高崎線',
  jrTokaidoMainLine: '東海道本線',
  odakyuLine: '小田急小田原線',
  odakyuEnoshimaLine: '小田急江ノ島線',
  keioLine: '京王線',
  tokyuToyokoLine: '東急東横線',
  tokyuDenEnToshiLine: '東急田園都市線',
  seibuIkebukuroLine: '西武池袋線',
  seibuShinjukuLine: '西武新宿線',
  tobuTojoLine: '東武東上線',
  keikyuLine: '京急本線',
  jrMusashinoLine: 'JR武蔵野線',
  tokyoMonorail: '東京モノレール',
  keiseiMainLine: '京成本線',
  jrYokohamaLine: 'JR横浜線',
  yokohamaBlueLine: '横浜市営地下鉄ブルーライン',
  rinkaiLine: 'りんかい線',
  yurikamomeLine: 'ゆりかもめ',
  tsukubaExpress: 'つくばエクスプレス',
  jrNanbuLine: 'JR南武線',
  jrNegishiLine: 'JR根岸線',
  sotetsuMainLine: '相鉄本線',
  sotetsuIzumino: '相鉄いずみ野線',
  jrSobuChiba: 'JR総武線（千葉方面）',
  jrKeiyo: 'JR京葉線',
  jrKeihinTohokuSaitama: 'JR京浜東北線（埼玉方面）',
  jrTokaidoUtsunomiya: 'JR東海道線・宇都宮線',
  jrTokaidoKanagawa: 'JR東海道線（神奈川方面）',
  jrTsurumi: 'JR鶴見線',
  tokyuMeguro: '東急目黒線',
  tokyuTamagawa: '東急多摩川線',
  tokyuIkegami: '東急池上線',
  yokohamaGreenLine: '横浜市営地下鉄グリーンライン',
  enoshimaElectricRailway: '江ノ島電鉄',
  jrUchiboLine: 'JR内房線',
  jrSotoboLine: 'JR外房線',
  jrNaritaLine: 'JR成田線',
  shinkeisei: '新京成電鉄',
  toyoRapid: '東葉高速鉄道',
  tamaMonorail: '多摩モノレール',
  todenArakawaLine: '都電荒川線',
  nipporiToneriLiner: '日暮里・舎人ライナー',
  jrOmeLine: 'JR青梅線',
  keioInokashiraLine: '京王井の頭線',
  tokyuSetagayaLine: '東急世田谷線',
  tokyuOimachiLine: '東急大井町線',
  tobuIsesakiLine: '東武伊勢崎線（スカイツリーライン）',
  jrHachikoLine: 'JR八高線',
  jrItsukaichiLine: 'JR五日市線',
  tobuDaishiLine: '東武大師線',
  tobuKameidoLine: '東武亀戸線',
};