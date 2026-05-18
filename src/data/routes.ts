import { yamanote } from './yamanote';
import { chuo } from './chuo';
import { keihinTohoku } from './keihin-tohoku';

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

import { sotetsuMainLine, sotetsuIzumino } from './sotetsu-line';
import { jrSobuChiba, jrKeiyo } from './jr-sobu-chiba';


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
import { osakaLoopLine } from './osaka-loop-line';
import { midosujiLine } from './osaka-midosuji-line';
import { jrKyotoLine } from './jr-kyoto-line';
import { jrKobeLine } from './jr-kobe-line';
import { tokaidoShinkansen } from './tokaido-shinkansen';
import { yokosukaLine } from './yokosuka-line';
import { odakyuTamaLine } from './odakyu-tama-line';
import { keioSagamiharaLine } from './keio-sagamihara-line';
import { jrItoLine, izukyuLine, hakoneTozan, izuHakoneSunzu } from './izu-hakone-lines';
import { keikyuKurihamaLine, keikyuAirportLine } from './keikyu-branch-lines';
import { keiseiOshiageLine, hokusouLine } from './keisei-branch-lines';
import { saitamaRailway, newShuttle } from './saitama-lines';
import { jrUtsunomiyaLine, jrNegishiLine } from './jr-kanto-additional';
import { tobuNikkoLine } from './tobu-nikko-line';
import { shonanMonorail } from './shonan-monorail';
import { sotetsuJRLine } from './sotetsu-jr-line';
import { tobuNodaLine } from './tobu-noda-line';
import { jrSagamiLine } from './jr-sagami-line';
import { jrTsurumiLine, jrTsurumiUmiShiba } from './jr-tsurumi-line';
import { seibuTamagawaLine } from './seibu-tamagawa-line';
import { jrNambuBranchLine } from './jr-nambu-branch';
import { tohokuShinkansen, sanyoShinkansen, kyushuShinkansen, hokurikuShinkansen, joetsuShinkansen } from './shinkansen-lines';
import { nagoyaHigashiyamaLine, nagoyaMeijoline, meitetsuNagoyaMainLine, jrNagoyaLine } from './nagoya-lines';
import { osakaTanimachi, osakaYotsubashi, osakaChuoLine, hankyuKyotoLine, hankyuKobeLine, hanshinMainLine, osakaSakaisuji } from './osaka-lines';
import { fukuokaAirportLine, fukuokaHakozakiLine, fukuokaShichikumaLine, nishitetsuTenjinOmutaLine, jrKagoshimaMainLineFukuoka } from './fukuoka-lines';
import { sapporoNambokuLine, sapporoTozaiLine, sapporoTohoLine, jrHakodateMainLine, jrChitoseLine } from './sapporo-lines';
import { jrTohokuMainLine, sendaiNambokuLine, sendaiTozaiLine, jrSensekiLine } from './tohoku-lines';
import { kintetsuOsakaLine, kintetsuNaraLine, keihanMainLine } from './kinki-lines';
import { jrSanyoMainLine, jrShizuokaLine, jrChuoNagoyaLine, jrSaninMainLine } from './jr-regional-lines';
import { jrNagasakiMainLine, nagasakiTram, jrHohibMainLine, jrNippoMainLineNorth, kumamotoTram } from './kyushu-lines';
import { shizuokaRailway, enshuRailway, jrIidaLine, nagoyaTsurumai, nagoyaSakuradori, jrHamamatsuToyohashi, aichiLoopRailway } from './chubu-lines';
import { jrHakodateLineHakodate, jrSoyaMainLine, jrSekihokuMainLine, jrHanasakiLine } from './hokkaido-lines';
import { jrYosanLine, jrDosanLine, iyotetsuTram, jrKotokuLine, jrTokushimaLine } from './sanin-shikoku-lines';
import { jrYamatoji, jrGakkenLine, kintetsuKyotoLine, nankaMainLine, nankaKoyaLine } from './kansai-more-lines';
import { jrKagoshimaMainLineSouth, kagoshimaTram, jrIbusukinMakurazakiLine, jrSaseboLine, nishitetsuKaizukaLine, kumamotoElecRailway } from './kyushu-more-lines';
import { jrSeikanTunnel, jrUetsuMainLine, jrKitakamiLine, jrKamaishiLine, jrTsugaRuLine, jrGonoLine, jrRikuuEastLine } from './jr-more-regional';
import { jrSaninMainLineWest, jrYamaguchiLine, hiroshimaTram, jrKabeLine, jrUnoline, jrKureLine, okayamaTram, jrMurotozakiLine } from './chugoku-kyushu-lines';
import { jrBiwako, jrOsakaLoop, kintetsuMinamiOsakaLine, jrKosaiLine, jrKusatsuLine } from './kinki-more-lines';
import { osakaChangbori, osakaImazatosuji, hankyuTakarazukaLine, kobeSeishinYamate, kobeKaigan, kintetsuKasharaLine } from './osaka-metro-more';
import { jrChikuhiLine, jrOmuraLine, shimabaraRailway, okinawaMonorail, jrNichinanLine, jrNippoMainLineSouth } from './kyushu-okinawa-lines';
import { jrYamagataShinkansen, jrAkitaShinkansen, jrOuMainLineAkita, jrJobanLineNorth, jrBanetsusaiLine, jrShinetsuLine } from './tohoku-more-lines';
import { jrMitoLine, jrJobanLineMain, jrNikkoLine, kantetsJososen, chichibuRailway } from './kanto-more-lines';
import { toyamaChihoMainLine, echizentetsudoKatsuyamaLine, fukuiRailwayFukubuLine, hokurikuTetsudoIshikawaLine, jrHokurikuKanazawaToToyama, toyamaLightRail } from './hokuriku-lines';
import { jrMuroranMainLine, jrNemuroMainLine, jrHidakaMainLine, jrFuranoLine, sapporoShiden } from './hokkaido-more-lines';
import { kotohiraLine, jrMugiLine, tosaCuroshioAsaLine, tosaCuroshioNahariLine, jrYodoLine } from './shikoku-more-lines';
import { jrHanwaLine, jrNaraLine, jrKansaiMainLine, wakayamaDenwKishiLine, nankaAirportLine } from './jr-kinki-more';
import { toyamaTramLoop, manyoLine, toyohashiTramLine, meitetsuTokonameLine, meitetsuInuyamaLine, kintetsuNagoyaLine } from './chubu-private-lines';

export const routes = {
  yamanote,
  chuo,
  keihinTohoku,

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

  sotetsuMainLine,
  sotetsuIzumino,
  jrSobuChiba,
  jrKeiyo,


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
  osakaLoopLine,
  midosujiLine,
  jrKyotoLine,
  jrKobeLine,
  tokaidoShinkansen,
  yokosukaLine,
  odakyuTamaLine,
  keioSagamiharaLine,
  jrItoLine,
  izukyuLine,
  hakoneTozan,
  izuHakoneSunzu,
  keikyuKurihamaLine,
  keikyuAirportLine,
  keiseiOshiageLine,
  hokusouLine,
  saitamaRailway,
  newShuttle,
  jrUtsunomiyaLine,
  jrNegishiLine,
  tobuNikkoLine,
  shonanMonorail,
  sotetsuJRLine,
  tobuNodaLine,
  jrSagamiLine,
  jrTsurumiLine,
  jrTsurumiUmiShiba,
  seibuTamagawaLine,
  jrNambuBranchLine,
  // 新幹線
  tohokuShinkansen,
  sanyoShinkansen,
  kyushuShinkansen,
  hokurikuShinkansen,
  joetsuShinkansen,
  // 名古屋エリア
  nagoyaHigashiyamaLine,
  nagoyaMeijoline,
  meitetsuNagoyaMainLine,
  jrNagoyaLine,
  // 大阪・関西エリア
  osakaTanimachi,
  osakaYotsubashi,
  osakaChuoLine,
  hankyuKyotoLine,
  hankyuKobeLine,
  hanshinMainLine,
  osakaSakaisuji,
  kintetsuOsakaLine,
  kintetsuNaraLine,
  keihanMainLine,
  // 福岡・九州エリア
  fukuokaAirportLine,
  fukuokaHakozakiLine,
  fukuokaShichikumaLine,
  nishitetsuTenjinOmutaLine,
  jrKagoshimaMainLineFukuoka,
  // 札幌・北海道エリア
  sapporoNambokuLine,
  sapporoTozaiLine,
  sapporoTohoLine,
  jrHakodateMainLine,
  jrChitoseLine,
  // 東北エリア
  jrTohokuMainLine,
  sendaiNambokuLine,
  sendaiTozaiLine,
  jrSensekiLine,
  // 広域JR
  jrSanyoMainLine,
  jrShizuokaLine,
  jrChuoNagoyaLine,
  jrSaninMainLine,
  // 九州エリア
  jrNagasakiMainLine,
  nagasakiTram,
  jrHohibMainLine,
  jrNippoMainLineNorth,
  kumamotoTram,
  // 中部エリア追加
  shizuokaRailway,
  enshuRailway,
  jrIidaLine,
  nagoyaTsurumai,
  nagoyaSakuradori,
  jrHamamatsuToyohashi,
  aichiLoopRailway,
  // 北海道エリア追加
  jrHakodateLineHakodate,
  jrSoyaMainLine,
  jrSekihokuMainLine,
  jrHanasakiLine,
  // 四国エリア
  jrYosanLine,
  jrDosanLine,
  iyotetsuTram,
  jrKotokuLine,
  jrTokushimaLine,
  // 関西エリア追加
  jrYamatoji,
  jrGakkenLine,
  kintetsuKyotoLine,
  nankaMainLine,
  nankaKoyaLine,
  // 九州エリアさらに追加
  jrKagoshimaMainLineSouth,
  kagoshimaTram,
  jrIbusukinMakurazakiLine,
  jrSaseboLine,
  nishitetsuKaizukaLine,
  kumamotoElecRailway,
  // 東北エリアさらに追加
  jrYamagataShinkansen,
  jrAkitaShinkansen,
  jrOuMainLineAkita,
  jrJobanLineNorth,
  jrBanetsusaiLine,
  jrShinetsuLine,
  // 関東エリアさらに追加
  jrMitoLine,
  jrJobanLineMain,
  jrNikkoLine,
  kantetsJososen,
  chichibuRailway,
  // 広域JRさらに追加
  jrSeikanTunnel,
  jrUetsuMainLine,
  jrKitakamiLine,
  jrKamaishiLine,
  jrTsugaRuLine,
  jrGonoLine,
  jrRikuuEastLine,
  // 中国・四国エリア
  jrSaninMainLineWest,
  jrYamaguchiLine,
  hiroshimaTram,
  jrKabeLine,
  jrUnoline,
  jrKureLine,
  okayamaTram,
  jrMurotozakiLine,
  // 近畿エリア追加
  jrBiwako,
  jrOsakaLoop,
  kintetsuMinamiOsakaLine,
  jrKosaiLine,
  jrKusatsuLine,
  osakaChangbori,
  osakaImazatosuji,
  hankyuTakarazukaLine,
  kobeSeishinYamate,
  kobeKaigan,
  kintetsuKasharaLine,
  // 九州・沖縄追加
  jrChikuhiLine,
  jrOmuraLine,
  shimabaraRailway,
  okinawaMonorail,
  jrNichinanLine,
  jrNippoMainLineSouth,
  // 北陸エリア
  toyamaChihoMainLine,
  echizentetsudoKatsuyamaLine,
  fukuiRailwayFukubuLine,
  hokurikuTetsudoIshikawaLine,
  jrHokurikuKanazawaToToyama,
  toyamaLightRail,
  // 北海道追加
  jrMuroranMainLine,
  jrNemuroMainLine,
  jrHidakaMainLine,
  jrFuranoLine,
  sapporoShiden,
  // 四国追加
  kotohiraLine,
  jrMugiLine,
  tosaCuroshioAsaLine,
  tosaCuroshioNahariLine,
  jrYodoLine,
  // 近畿さらに追加
  jrHanwaLine,
  jrNaraLine,
  jrKansaiMainLine,
  wakayamaDenwKishiLine,
  nankaAirportLine,
  // 中部私鉄追加
  toyamaTramLoop,
  manyoLine,
  toyohashiTramLine,
  meitetsuTokonameLine,
  meitetsuInuyamaLine,
  kintetsuNagoyaLine,
};

export type RouteKey = keyof typeof routes;

export const routeColors = {
  yamanote: '#58B848', // JR Yamanote Line green
  chuo: '#F15A22', // JR Chuo Line orange
  keihinTohoku: '#00B5E2', // JR Keihin-Tohoku Line blue

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

  sotetsuMainLine: '#2E8B57', // Sotetsu Main Line sea green
  sotetsuIzumino: '#32CD32', // Sotetsu Izumino Line lime green
  jrSobuChiba: '#FFD700', // JR Sobu Chiba Line gold
  jrKeiyo: '#FF6347', // JR Keiyo Line tomato


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
  osakaLoopLine: '#FF0000', // JR Osaka Loop Line red
  midosujiLine: '#D90000', // Osaka Metro Midosuji Line red
  jrKyotoLine: '#0072BC', // JR Kyoto Line blue
  jrKobeLine: '#0072BC', // JR Kobe Line blue
  tokaidoShinkansen: '#0072BC', // Tokaido Shinkansen blue
  yokosukaLine: '#0072BC', // Yokosuka Line blue
  odakyuTamaLine: '#0066CC', // Odakyu Tama Line blue
  keioSagamiharaLine: '#DD0077', // Keio Sagamihara Line magenta
  jrItoLine: '#F68B1E', // JR Ito Line orange
  izukyuLine: '#0066CC', // Izukyu Line blue
  hakoneTozan: '#E85298', // Hakone Tozan Railway pink
  izuHakoneSunzu: '#008B8B', // Izu Hakone Sunzu Line teal
  keikyuKurihamaLine: '#C8102E', // Keikyu Kurihama Line red
  keikyuAirportLine: '#C8102E', // Keikyu Airport Line red
  keiseiOshiageLine: '#3165B1', // Keisei Oshiage Line blue
  hokusouLine: '#39A0DC', // Hokuso Line sky blue
  saitamaRailway: '#2E8B57', // Saitama Railway green
  newShuttle: '#FF6347', // New Shuttle tomato
  jrUtsunomiyaLine: '#F68B1E', // JR Utsunomiya Line orange
  jrNegishiLine: '#00B5E2', // JR Negishi Line blue
  tobuNikkoLine: '#F68B1E', // Tobu Nikko Line orange
  shonanMonorail: '#2E8B57', // Shonan Monorail green
  sotetsuJRLine: '#2E8B57', // Sotetsu-JR Direct Line green
  tobuNodaLine: '#004098', // Tobu Noda Line (Urban Park Line) navy blue
  jrSagamiLine: '#8FCF57', // JR Sagami Line light green
  jrTsurumiLine: '#F68B1E', // JR Tsurumi Line orange
  jrTsurumiUmiShiba: '#F68B1E', // JR Tsurumi Line (Umishibaura branch) orange
  seibuTamagawaLine: '#F39700', // Seibu Tamagawa Line orange
  jrNambuBranchLine: '#FFCC00', // JR Nambu Branch Line yellow
  // 新幹線
  tohokuShinkansen: '#35A0D5', // Tohoku Shinkansen ice blue
  sanyoShinkansen: '#0072BC', // Sanyo Shinkansen blue
  kyushuShinkansen: '#D60026', // Kyushu Shinkansen red
  hokurikuShinkansen: '#00A0A0', // Hokuriku Shinkansen teal
  joetsuShinkansen: '#009B6C', // Joetsu Shinkansen green
  // 名古屋エリア
  nagoyaHigashiyamaLine: '#FFCC00', // Nagoya Higashiyama Line yellow
  nagoyaMeijoline: '#9B1889', // Nagoya Meijo Line purple
  meitetsuNagoyaMainLine: '#E50012', // Meitetsu red
  jrNagoyaLine: '#F68B1E', // JR Tokaido Nagoya orange
  // 大阪・関西エリア
  osakaTanimachi: '#8B3FAB', // Osaka Tanimachi Line purple
  osakaYotsubashi: '#0066CC', // Osaka Yotsubashi Line blue
  osakaChuoLine: '#00A0A0', // Osaka Chuo Line teal
  hankyuKyotoLine: '#8B5A2B', // Hankyu Kyoto Line brown
  hankyuKobeLine: '#8B5A2B', // Hankyu Kobe Line brown
  hanshinMainLine: '#0070C0', // Hanshin Main Line blue
  osakaSakaisuji: '#D0A030', // Osaka Sakaisuji Line gold
  kintetsuOsakaLine: '#F08000', // Kintetsu Osaka Line orange
  kintetsuNaraLine: '#F08000', // Kintetsu Nara Line orange
  keihanMainLine: '#008E42', // Keihan Main Line green
  // 福岡・九州エリア
  fukuokaAirportLine: '#E4000F', // Fukuoka Airport Line red
  fukuokaHakozakiLine: '#FF8C00', // Fukuoka Hakozaki Line orange
  fukuokaShichikumaLine: '#007DB7', // Fukuoka Shichikuma Line blue
  nishitetsuTenjinOmutaLine: '#E60026', // Nishitetsu red
  jrKagoshimaMainLineFukuoka: '#F68B1E', // JR Kagoshima Main Line orange
  // 札幌・北海道エリア
  sapporoNambokuLine: '#007243', // Sapporo Namboku Line green
  sapporoTozaiLine: '#E4007F', // Sapporo Tozai Line pink
  sapporoTohoLine: '#E4942A', // Sapporo Toho Line orange
  jrHakodateMainLine: '#4D8B2E', // JR Hakodate Main Line green
  jrChitoseLine: '#00B5E2', // JR Chitose Line blue
  // 東北エリア
  jrTohokuMainLine: '#009944', // JR Tohoku Main Line green
  sendaiNambokuLine: '#009944', // Sendai Namboku Line green
  sendaiTozaiLine: '#0099D0', // Sendai Tozai Line blue
  jrSensekiLine: '#009944', // JR Senseki Line green
  // 広域JR
  jrSanyoMainLine: '#0072BC', // JR Sanyo Main Line blue
  jrShizuokaLine: '#F68B1E', // JR Shizuoka (Tokaido) orange
  jrChuoNagoyaLine: '#E60026', // JR Chuo Nagoya Line red
  jrSaninMainLine: '#009944', // JR Sanin Main Line green
  // 九州エリア
  jrNagasakiMainLine: '#009944',
  nagasakiTram: '#E60026',
  jrHohibMainLine: '#F68B1E',
  jrNippoMainLineNorth: '#009944',
  kumamotoTram: '#E60026',
  // 中部エリア追加
  shizuokaRailway: '#FF6347',
  enshuRailway: '#F68B1E',
  jrIidaLine: '#009944',
  nagoyaTsurumai: '#0072BC',
  nagoyaSakuradori: '#E60026',
  jrHamamatsuToyohashi: '#F68B1E',
  aichiLoopRailway: '#009944',
  // 北海道エリア追加
  jrHakodateLineHakodate: '#4D8B2E',
  jrSoyaMainLine: '#009944',
  jrSekihokuMainLine: '#F68B1E',
  jrHanasakiLine: '#009944',
  // 四国エリア
  jrYosanLine: '#0072BC',
  jrDosanLine: '#009944',
  iyotetsuTram: '#E60026',
  jrKotokuLine: '#F68B1E',
  jrTokushimaLine: '#009944',
  // 関西エリア追加
  jrYamatoji: '#009944',
  jrGakkenLine: '#0072BC',
  kintetsuKyotoLine: '#F08000',
  nankaMainLine: '#0072BC',
  nankaKoyaLine: '#009944',
  // 九州エリアさらに追加
  jrKagoshimaMainLineSouth: '#F68B1E',
  kagoshimaTram: '#E60026',
  jrIbusukinMakurazakiLine: '#009944',
  jrSaseboLine: '#0072BC',
  nishitetsuKaizukaLine: '#E60026',
  kumamotoElecRailway: '#009944',
  // 東北エリアさらに追加
  jrYamagataShinkansen: '#B5008E',
  jrAkitaShinkansen: '#008F1D',
  jrOuMainLineAkita: '#F68B1E',
  jrJobanLineNorth: '#417036',
  jrBanetsusaiLine: '#009944',
  jrShinetsuLine: '#0072BC',
  // 関東エリアさらに追加
  jrMitoLine: '#009944',
  jrJobanLineMain: '#417036',
  jrNikkoLine: '#F68B1E',
  kantetsJososen: '#009944',
  chichibuRailway: '#E60026',
  // 広域JRさらに追加
  jrSeikanTunnel: '#0072BC',
  jrUetsuMainLine: '#F68B1E',
  jrKitakamiLine: '#009944',
  jrKamaishiLine: '#F68B1E',
  jrTsugaRuLine: '#009944',
  jrGonoLine: '#0072BC',
  jrRikuuEastLine: '#009944',
  // 中国・四国エリア
  jrSaninMainLineWest: '#009944',
  jrYamaguchiLine: '#F68B1E',
  hiroshimaTram: '#E60026',
  jrKabeLine: '#009944',
  jrUnoline: '#F68B1E',
  jrKureLine: '#0072BC',
  okayamaTram: '#E60026',
  jrMurotozakiLine: '#009944',
  // 近畿エリア追加
  jrBiwako: '#F68B1E',
  jrOsakaLoop: '#009944',
  kintetsuMinamiOsakaLine: '#F08000',
  jrKosaiLine: '#0072BC',
  jrKusatsuLine: '#009944',
  osakaChangbori: '#35A0D5',
  osakaImazatosuji: '#E60026',
  hankyuTakarazukaLine: '#8B5A2B',
  kobeSeishinYamate: '#E60026',
  kobeKaigan: '#0072BC',
  kintetsuKasharaLine: '#F08000',
  // 九州・沖縄追加
  jrChikuhiLine: '#F68B1E',
  jrOmuraLine: '#009944',
  shimabaraRailway: '#E60026',
  okinawaMonorail: '#00B5E2',
  jrNichinanLine: '#009944',
  jrNippoMainLineSouth: '#F68B1E',
  // 北陸エリア
  toyamaChihoMainLine: '#E60026',
  echizentetsudoKatsuyamaLine: '#009944',
  fukuiRailwayFukubuLine: '#F68B1E',
  hokurikuTetsudoIshikawaLine: '#E60026',
  jrHokurikuKanazawaToToyama: '#009944',
  toyamaLightRail: '#00B5E2',
  // 北海道追加
  jrMuroranMainLine: '#009944',
  jrNemuroMainLine: '#F68B1E',
  jrHidakaMainLine: '#009944',
  jrFuranoLine: '#E60026',
  sapporoShiden: '#009944',
  // 四国追加
  kotohiraLine: '#F68B1E',
  jrMugiLine: '#009944',
  tosaCuroshioAsaLine: '#E60026',
  tosaCuroshioNahariLine: '#009944',
  jrYodoLine: '#F68B1E',
  // 近畿さらに追加
  jrHanwaLine: '#009944',
  jrNaraLine: '#F68B1E',
  jrKansaiMainLine: '#009944',
  wakayamaDenwKishiLine: '#E60026',
  nankaAirportLine: '#E60026',
  // 中部私鉄追加
  toyamaTramLoop: '#009944',
  manyoLine: '#00B5E2',
  toyohashiTramLine: '#E60026',
  meitetsuTokonameLine: '#E60026',
  meitetsuInuyamaLine: '#E60026',
  kintetsuNagoyaLine: '#009944',
};

export const routeNames = {
  yamanote: '山手線',
  chuo: '中央線',
  keihinTohoku: '京浜東北線',

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

  sotetsuMainLine: '相鉄本線',
  sotetsuIzumino: '相鉄いずみ野線',
  jrSobuChiba: 'JR総武線（千葉方面）',
  jrKeiyo: 'JR京葉線',


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
  osakaLoopLine: '大阪環状線',
  midosujiLine: '御堂筋線',
  jrKyotoLine: 'JR京都線',
  jrKobeLine: 'JR神戸線',
  tokaidoShinkansen: '東海道新幹線',
  yokosukaLine: '横須賀線',
  odakyuTamaLine: '小田急多摩線',
  keioSagamiharaLine: '京王相模原線',
  jrItoLine: 'JR伊東線',
  izukyuLine: '伊豆急行線',
  hakoneTozan: '箱根登山鉄道',
  izuHakoneSunzu: '伊豆箱根鉄道駿豆線',
  keikyuKurihamaLine: '京急久里浜線',
  keikyuAirportLine: '京急空港線',
  keiseiOshiageLine: '京成押上線',
  hokusouLine: '北総鉄道',
  saitamaRailway: '埼玉高速鉄道',
  newShuttle: 'ニューシャトル',
  jrUtsunomiyaLine: 'JR宇都宮線',
  jrNegishiLine: 'JR根岸線',
  tobuNikkoLine: '東武日光線',
  shonanMonorail: '湘南モノレール',
  sotetsuJRLine: '相鉄・JR直通線',
  tobuNodaLine: '東武アーバンパークライン',
  jrSagamiLine: 'JR相模線',
  jrTsurumiLine: 'JR鶴見線',
  jrTsurumiUmiShiba: 'JR鶴見線（海芝浦支線）',
  seibuTamagawaLine: '西武多摩川線',
  jrNambuBranchLine: 'JR南武支線',
  // 新幹線
  tohokuShinkansen: '東北新幹線',
  sanyoShinkansen: '山陽新幹線',
  kyushuShinkansen: '九州新幹線',
  hokurikuShinkansen: '北陸新幹線',
  joetsuShinkansen: '上越新幹線',
  // 名古屋エリア
  nagoyaHigashiyamaLine: '名古屋市営地下鉄東山線',
  nagoyaMeijoline: '名古屋市営地下鉄名城線',
  meitetsuNagoyaMainLine: '名鉄名古屋本線',
  jrNagoyaLine: 'JR東海道本線（名古屋〜米原）',
  // 大阪・関西エリア
  osakaTanimachi: '大阪メトロ谷町線',
  osakaYotsubashi: '大阪メトロ四つ橋線',
  osakaChuoLine: '大阪メトロ中央線',
  hankyuKyotoLine: '阪急京都線',
  hankyuKobeLine: '阪急神戸線',
  hanshinMainLine: '阪神本線',
  osakaSakaisuji: '大阪メトロ堺筋線',
  kintetsuOsakaLine: '近鉄大阪線',
  kintetsuNaraLine: '近鉄奈良線',
  keihanMainLine: '京阪本線',
  // 福岡・九州エリア
  fukuokaAirportLine: '福岡市地下鉄空港線',
  fukuokaHakozakiLine: '福岡市地下鉄箱崎線',
  fukuokaShichikumaLine: '福岡市地下鉄七隈線',
  nishitetsuTenjinOmutaLine: '西鉄天神大牟田線',
  jrKagoshimaMainLineFukuoka: 'JR鹿児島本線（福岡〜熊本）',
  // 札幌・北海道エリア
  sapporoNambokuLine: '札幌市営地下鉄南北線',
  sapporoTozaiLine: '札幌市営地下鉄東西線',
  sapporoTohoLine: '札幌市営地下鉄東豊線',
  jrHakodateMainLine: 'JR函館本線（札幌〜旭川）',
  jrChitoseLine: 'JR千歳線',
  // 東北エリア
  jrTohokuMainLine: 'JR東北本線',
  sendaiNambokuLine: '仙台市地下鉄南北線',
  sendaiTozaiLine: '仙台市地下鉄東西線',
  jrSensekiLine: 'JR仙石線',
  // 広域JR
  jrSanyoMainLine: 'JR山陽本線',
  jrShizuokaLine: 'JR東海道本線（静岡〜浜松）',
  jrChuoNagoyaLine: 'JR中央本線（名古屋〜塩尻）',
  jrSaninMainLine: 'JR山陰本線',
  // 九州エリア
  jrNagasakiMainLine: 'JR長崎本線',
  nagasakiTram: '長崎市電',
  jrHohibMainLine: 'JR豊肥本線',
  jrNippoMainLineNorth: 'JR日豊本線（小倉〜大分）',
  kumamotoTram: '熊本市電',
  // 中部エリア追加
  shizuokaRailway: '静岡鉄道',
  enshuRailway: '遠州鉄道',
  jrIidaLine: 'JR飯田線',
  nagoyaTsurumai: '名古屋市営地下鉄鶴舞線',
  nagoyaSakuradori: '名古屋市営地下鉄桜通線',
  jrHamamatsuToyohashi: 'JR東海道本線（浜松〜豊橋）',
  aichiLoopRailway: '愛知環状鉄道',
  // 北海道エリア追加
  jrHakodateLineHakodate: 'JR函館本線（函館〜小樽）',
  jrSoyaMainLine: 'JR宗谷本線',
  jrSekihokuMainLine: 'JR石北本線',
  jrHanasakiLine: 'JR花咲線',
  // 四国エリア
  jrYosanLine: 'JR予讃線',
  jrDosanLine: 'JR土讃線',
  iyotetsuTram: '伊予鉄道市内電車',
  jrKotokuLine: 'JR高徳線',
  jrTokushimaLine: 'JR徳島線',
  // 関西エリア追加
  jrYamatoji: 'JR大和路線',
  jrGakkenLine: 'JR学研都市線',
  kintetsuKyotoLine: '近鉄京都線',
  nankaMainLine: '南海本線',
  nankaKoyaLine: '南海高野線',
  // 九州エリアさらに追加
  jrKagoshimaMainLineSouth: 'JR鹿児島本線（熊本〜鹿児島中央）',
  kagoshimaTram: '鹿児島市電',
  jrIbusukinMakurazakiLine: 'JR指宿枕崎線',
  jrSaseboLine: 'JR佐世保線',
  nishitetsuKaizukaLine: '西鉄貝塚線',
  kumamotoElecRailway: '熊本電気鉄道',
  // 東北エリアさらに追加
  jrYamagataShinkansen: 'JR山形新幹線',
  jrAkitaShinkansen: 'JR秋田新幹線',
  jrOuMainLineAkita: 'JR奥羽本線（秋田〜青森）',
  jrJobanLineNorth: 'JR常磐線（いわき〜仙台）',
  jrBanetsusaiLine: 'JR磐越西線',
  jrShinetsuLine: 'JR信越本線',
  // 関東エリアさらに追加
  jrMitoLine: 'JR水戸線',
  jrJobanLineMain: 'JR常磐線（上野〜いわき）',
  jrNikkoLine: 'JR日光線',
  kantetsJososen: '関東鉄道常総線',
  chichibuRailway: '秩父鉄道',
  // 広域JRさらに追加
  jrSeikanTunnel: 'JR海峡線（青函トンネル）',
  jrUetsuMainLine: 'JR羽越本線',
  jrKitakamiLine: 'JR北上線',
  jrKamaishiLine: 'JR釜石線',
  jrTsugaRuLine: 'JR津軽線',
  jrGonoLine: 'JR五能線',
  jrRikuuEastLine: 'JR陸羽東線',
  // 中国・四国エリア
  jrSaninMainLineWest: 'JR山陰本線（西部）',
  jrYamaguchiLine: 'JR山口線',
  hiroshimaTram: '広島電鉄',
  jrKabeLine: 'JR可部線',
  jrUnoline: 'JR宇野線（瀬戸大橋線）',
  jrKureLine: 'JR呉線',
  okayamaTram: '岡山電気軌道',
  jrMurotozakiLine: 'JR土讃線（高知付近）',
  // 近畿エリア追加
  jrBiwako: 'JR琵琶湖線',
  jrOsakaLoop: 'JR大阪環状線',
  kintetsuMinamiOsakaLine: '近鉄南大阪線',
  jrKosaiLine: 'JR湖西線',
  jrKusatsuLine: 'JR草津線',
  osakaChangbori: '大阪メトロ長堀鶴見緑地線',
  osakaImazatosuji: '大阪メトロ今里筋線',
  hankyuTakarazukaLine: '阪急宝塚線',
  kobeSeishinYamate: '神戸市営地下鉄西神・山手線',
  kobeKaigan: '神戸市営地下鉄海岸線',
  kintetsuKasharaLine: '近鉄橿原線',
  // 九州・沖縄追加
  jrChikuhiLine: 'JR筑肥線',
  jrOmuraLine: 'JR大村線',
  shimabaraRailway: '島原鉄道',
  okinawaMonorail: '沖縄都市モノレール（ゆいレール）',
  jrNichinanLine: 'JR日南線',
  jrNippoMainLineSouth: 'JR日豊本線（大分〜鹿児島）',
  // 北陸エリア
  toyamaChihoMainLine: '富山地方鉄道本線',
  echizentetsudoKatsuyamaLine: 'えちぜん鉄道勝山永平寺線',
  fukuiRailwayFukubuLine: '福井鉄道福武線',
  hokurikuTetsudoIshikawaLine: '北陸鉄道石川線',
  jrHokurikuKanazawaToToyama: 'JR北陸本線（金沢〜富山）',
  toyamaLightRail: '富山ライトレール',
  // 北海道追加
  jrMuroranMainLine: 'JR室蘭本線',
  jrNemuroMainLine: 'JR根室本線',
  jrHidakaMainLine: 'JR日高本線',
  jrFuranoLine: 'JR富良野線',
  sapporoShiden: '札幌市電',
  // 四国追加
  kotohiraLine: '高松琴平電気鉄道琴平線',
  jrMugiLine: 'JR牟岐線',
  tosaCuroshioAsaLine: '土佐くろしお鉄道阿佐線',
  tosaCuroshioNahariLine: '土佐くろしお鉄道ごめん・なはり線',
  jrYodoLine: 'JR予土線',
  // 近畿さらに追加
  jrHanwaLine: 'JR阪和線',
  jrNaraLine: 'JR奈良線',
  jrKansaiMainLine: 'JR関西本線（加茂〜亀山）',
  wakayamaDenwKishiLine: '和歌山電鐵貴志川線',
  nankaAirportLine: '南海空港線',
  // 中部私鉄追加
  toyamaTramLoop: '富山市内電車環状線',
  manyoLine: '万葉線',
  toyohashiTramLine: '豊橋鉄道東田本線',
  meitetsuTokonameLine: '名鉄常滑線',
  meitetsuInuyamaLine: '名鉄犬山線',
  kintetsuNagoyaLine: '近鉄名古屋線',
};