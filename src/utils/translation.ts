import { COPYRIGHT_TEXT, SITE_NAME } from '../config/seo';
// 駅名翻訳辞書
import { stationTranslations } from './stationTranslationsEn';
export { stationTranslations };

// 路線名翻訳辞書
export const routeTranslations: { [key: string]: string } = {
  "山手線": "Yamanote Line",
  "中央線": "Chuo Line",
  "京浜東北線": "Keihin-Tohoku Line",
  "東海道線": "Tokaido Line",
  "総武線": "Sobu Line",
  "常磐線": "Joban Line",
  "埼京線": "Saikyo Line",
  "高崎線": "Takasaki Line",
  "東海道本線": "Tokaido Main Line",
  "武蔵野線": "Musashino Line",
  "横浜線": "Yokohama Line",
  "南武線": "Nambu Line",
  "根岸線": "Negishi Line",

  // 東京メトロ
  "銀座線": "Ginza Line",
  "丸ノ内線": "Marunouchi Line",
  "日比谷線": "Hibiya Line",
  "東西線": "Tozai Line",
  "千代田線": "Chiyoda Line",
  "有楽町線": "Yurakucho Line",
  "半蔵門線": "Hanzomon Line",
  "南北線": "Namboku Line",
  "副都心線": "Fukutoshin Line",

  // 都営地下鉄
  "浅草線": "Asakusa Line",
  "三田線": "Mita Line",
  "新宿線": "Shinjuku Line",
  "都営新宿線": "Toei Shinjuku Line",
  "大江戸線": "Oedo Line",
  "都営大江戸線": "Toei Oedo Line",

  // 私鉄
  "小田急線": "Odakyu Line",
  "小田急小田原線": "Odakyu Odawara Line",
  "小田急江ノ島線": "Odakyu Enoshima Line",
  "京王線": "Keio Line",
  "東急東横線": "Tokyu Toyoko Line",
  "東急田園都市線": "Tokyu Den-en-toshi Line",
  "西武池袋線": "Seibu Ikebukuro Line",
  "西武新宿線": "Seibu Shinjuku Line",
  "東武東上線": "Tobu Tojo Line",
  "京急線": "Keikyu Line",
  "京成本線": "Keisei Main Line",

  // その他
  "横浜市営地下鉄ブルーライン": "Yokohama Municipal Subway Blue Line",
  "東京モノレール": "Tokyo Monorail",
  "りんかい線": "Rinkai Line",
  "ゆりかもめ": "Yurikamome",
  "つくばエクスプレス": "Tsukuba Express",

  // 伊豆・箱根エリア
  "JR伊東線": "JR Ito Line",
  "伊豆急行線": "Izukyu Line",
  "箱根登山鉄道": "Hakone Tozan Railway",
  "伊豆箱根鉄道駿豆線": "Izu Hakone Sunzu Line",

  // 京急支線
  "京急久里浜線": "Keikyu Kurihama Line",
  "京急空港線": "Keikyu Airport Line",
  "京急本線": "Keikyu Main Line",

  // 京成支線
  "京成押上線": "Keisei Oshiage Line",
  "北総鉄道": "Hokuso Line",

  // 埼玉エリア
  "埼玉高速鉄道": "Saitama Railway",
  "ニューシャトル": "New Shuttle",

  // JR追加
  "JR宇都宮線": "JR Utsunomiya Line",
  "JR根岸線": "JR Negishi Line",

  // 東武追加
  "東武日光線": "Tobu Nikko Line",

  // 湘南モノレール
  "湘南モノレール": "Shonan Monorail",

  // 相鉄・JR直通線
  "相鉄・JR直通線": "Sotetsu-JR Direct Line",

  // 都営（正式名称）
  "都営浅草線": "Toei Asakusa Line",
  "都営三田線": "Toei Mita Line",

  // JR（JRプレフィックス付き正式名称）
  "JR武蔵野線": "JR Musashino Line",
  "JR横浜線": "JR Yokohama Line",
  "JR南武線": "JR Nambu Line",

  // 相鉄
  "相鉄本線": "Sotetsu Main Line",
  "相鉄いずみ野線": "Sotetsu Izumino Line",

  // JR追加路線
  "JR総武線（千葉方面）": "JR Sobu Line (toward Chiba)",
  "JR京葉線": "JR Keiyo Line",
  "JR内房線": "JR Uchibo Line",
  "JR外房線": "JR Sotobo Line",
  "JR成田線": "JR Narita Line",
  "JR青梅線": "JR Ome Line",
  "JR五日市線": "JR Itsukaichi Line",
  "JR八高線": "JR Hachiko Line",

  // 東急追加路線
  "東急目黒線": "Tokyu Meguro Line",
  "東急多摩川線": "Tokyu Tamagawa Line",
  "東急池上線": "Tokyu Ikegami Line",
  "東急世田谷線": "Tokyu Setagaya Line",
  "東急大井町線": "Tokyu Oimachi Line",

  // 横浜市営地下鉄
  "横浜市営地下鉄グリーンライン": "Yokohama Municipal Subway Green Line",

  // 私鉄追加
  "江ノ島電鉄": "Enoshima Electric Railway",
  "新京成電鉄": "Shinkeisei Railway",
  "東葉高速鉄道": "Toyo Rapid Railway",
  "多摩モノレール": "Tama Monorail",
  "都電荒川線": "Toden Arakawa Line",
  "日暮里・舎人ライナー": "Nippori-Toneri Liner",
  "京王井の頭線": "Keio Inokashira Line",
  "京王相模原線": "Keio Sagamihara Line",
  "小田急多摩線": "Odakyu Tama Line",
  "東武伊勢崎線（スカイツリーライン）": "Tobu Isesaki Line (Skytree Line)",
  "東武大師線": "Tobu Daishi Line",
  "東武亀戸線": "Tobu Kameido Line",

  // 新幹線・その他
  "東海道新幹線": "Tokaido Shinkansen",
  "横須賀線": "Yokosuka Line",

  // 関西エリア（データとして存在する場合）
  "大阪環状線": "Osaka Loop Line",
  "御堂筋線": "Midosuji Line",
  "JR京都線": "JR Kyoto Line",
  "JR神戸線": "JR Kobe Line",

  // ── 路線名の多言語対応（新幹線・地下鉄・大手私鉄・路面電車）──
  "湘南新宿ライン": "Shonan-Shinjuku Line",
  "湘南新宿ライン（宇都宮線・横須賀線）": "Shonan-Shinjuku Line (Utsunomiya–Yokosuka)",
  "湘南新宿ライン（高崎線・東海道線）": "Shonan-Shinjuku Line (Takasaki–Tokaido)",
  "上野東京ライン（東海道線）": "Ueno-Tokyo Line (Tokaido)",
  "上野東京ライン（宇都宮線）": "Ueno-Tokyo Line (Utsunomiya)",
  "上野東京ライン（高崎線）": "Ueno-Tokyo Line (Takasaki)",
  "東武アーバンパークライン": "Tobu Urban Park Line",
  "JR相模線": "JR Sagami Line",
  "JR鶴見線": "JR Tsurumi Line",
  "JR鶴見線（海芝浦支線）": "JR Tsurumi Line (Umi-Shibaura Branch)",
  "西武多摩川線": "Seibu Tamagawa Line",
  "JR南武支線": "JR Nambu Branch Line",
  "東北新幹線": "Tohoku Shinkansen",
  "山陽新幹線": "Sanyo Shinkansen",
  "九州新幹線": "Kyushu Shinkansen",
  "北陸新幹線": "Hokuriku Shinkansen",
  "上越新幹線": "Joetsu Shinkansen",
  "JR山形新幹線": "JR Yamagata Shinkansen",
  "JR秋田新幹線": "JR Akita Shinkansen",
  "名古屋市営地下鉄東山線": "Nagoya Subway Higashiyama Line",
  "名古屋市営地下鉄名城線": "Nagoya Subway Meijo Line",
  "名古屋市営地下鉄鶴舞線": "Nagoya Subway Tsurumai Line",
  "名古屋市営地下鉄桜通線": "Nagoya Subway Sakura-dori Line",
  "名古屋市営地下鉄名港線": "Nagoya Subway Meiko Line",
  "名古屋市営地下鉄上飯田線": "Nagoya Subway Kami-Iida Line",
  "名鉄名古屋本線": "Meitetsu Nagoya Main Line",
  "名鉄常滑線": "Meitetsu Tokoname Line",
  "名鉄犬山線": "Meitetsu Inuyama Line",
  "名鉄蒲郡線": "Meitetsu Gamagori Line",
  "名鉄河和線": "Meitetsu Kowa Line",
  "名鉄知多新線": "Meitetsu Chita New Line",
  "名鉄三河線（海線）": "Meitetsu Mikawa Line (Coastal)",
  "名鉄三河線（山線）": "Meitetsu Mikawa Line (Inland)",
  "名鉄豊田線": "Meitetsu Toyota Line",
  "名鉄瀬戸線": "Meitetsu Seto Line",
  "名鉄尾西線": "Meitetsu Bisai Line",
  "JR東海道本線（名古屋〜米原）": "JR Tokaido Main Line (Nagoya - Maibara)",
  "JR東海道本線（静岡〜浜松）": "JR Tokaido Main Line (Shizuoka - Hamamatsu)",
  "JR東海道本線（浜松〜豊橋）": "JR Tokaido Main Line (Hamamatsu - Toyohashi)",
  "JR東海道本線（名古屋〜大垣）": "JR Tokaido Main Line (Nagoya - Ogaki)",
  "JR東海道本線（名古屋〜豊橋）": "JR Tokaido Main Line (Nagoya - Toyohashi)",
  "大阪メトロ谷町線": "Osaka Metro Tanimachi Line",
  "大阪メトロ四つ橋線": "Osaka Metro Yotsubashi Line",
  "大阪メトロ中央線": "Osaka Metro Chuo Line",
  "大阪メトロ堺筋線": "Osaka Metro Sakaisuji Line",
  "大阪メトロ長堀鶴見緑地線": "Osaka Metro Nagahori Tsurumi-ryokuchi Line",
  "大阪メトロ今里筋線": "Osaka Metro Imazatosuji Line",
  "大阪メトロ御堂筋線": "Osaka Metro Midosuji Line",
  "阪急京都線": "Hankyu Kyoto Line",
  "阪急神戸線": "Hankyu Kobe Line",
  "阪急宝塚線": "Hankyu Takarazuka Line",
  "阪急千里線": "Hankyu Senri Line",
  "阪急嵐山線": "Hankyu Arashiyama Line",
  "阪急甲陽線": "Hankyu Koyo Line",
  "阪急今津線": "Hankyu Imazu Line",
  "阪急伊丹線": "Hankyu Itami Line",
  "阪急箕面線": "Hankyu Minoo Line",
  "阪神本線": "Hanshin Main Line",
  "阪神なんば線": "Hanshin Namba Line",
  "阪神武庫川線": "Hanshin Mukogawa Line",
  "近鉄大阪線": "Kintetsu Osaka Line",
  "近鉄奈良線": "Kintetsu Nara Line",
  "近鉄京都線": "Kintetsu Kyoto Line",
  "近鉄南大阪線": "Kintetsu Minami-Osaka Line",
  "近鉄橿原線": "Kintetsu Kashihara Line",
  "近鉄名古屋線": "Kintetsu Nagoya Line",
  "近鉄志摩線": "Kintetsu Shima Line",
  "近鉄山田線": "Kintetsu Yamada Line",
  "近鉄吉野線": "Kintetsu Yoshino Line",
  "近鉄鳥羽線": "Kintetsu Toba Line",
  "近鉄湯の山線": "Kintetsu Yunoyama Line",
  "近鉄鈴鹿線": "Kintetsu Suzuka Line",
  "近鉄けいはんな線": "Kintetsu Keihanna Line",
  "近鉄天理線": "Kintetsu Tenri Line",
  "近鉄道明寺線": "Kintetsu Domyoji Line",
  "近鉄長野線": "Kintetsu Nagano Line",
  "近鉄生駒線": "Kintetsu Ikoma Line",
  "近鉄田原本線": "Kintetsu Tawaramoto Line",
  "近鉄信貴線": "Kintetsu Shigi Line",
  "京阪本線": "Keihan Main Line",
  "京阪石山坂本線": "Keihan Ishiyama-Sakamoto Line",
  "京阪宇治線": "Keihan Uji Line",
  "京阪中之島線": "Keihan Nakanoshima Line",
  "京阪交野線": "Keihan Katano Line",
  "京阪鴨東線": "Keihan Oto Line",
  "南海本線": "Nankai Main Line",
  "南海高野線": "Nankai Koya Line",
  "南海空港線": "Nankai Airport Line",
  "南海加太線": "Nankai Kada Line",
  "南海汐見橋線": "Nankai Shiomibashi Line",
  "南海多奈川線": "Nankai Tanagawa Line",
  "福岡市地下鉄空港線": "Fukuoka Subway Airport Line",
  "福岡市地下鉄箱崎線": "Fukuoka Subway Hakozaki Line",
  "福岡市地下鉄七隈線": "Fukuoka Subway Nanakuma Line",
  "西鉄天神大牟田線": "Nishitetsu Tenjin-Omuta Line",
  "西鉄貝塚線": "Nishitetsu Kaizuka Line",
  "西鉄甘木線": "Nishitetsu Amagi Line",
  "西鉄太宰府線": "Nishitetsu Dazaifu Line",
  "札幌市営地下鉄南北線": "Sapporo Subway Namboku Line",
  "札幌市営地下鉄東西線": "Sapporo Subway Tozai Line",
  "札幌市営地下鉄東豊線": "Sapporo Subway Toho Line",
  "札幌市電": "Sapporo Streetcar",
  "仙台市地下鉄南北線": "Sendai Subway Namboku Line",
  "仙台市地下鉄東西線": "Sendai Subway Tozai Line",
  "京都市営地下鉄烏丸線": "Kyoto Subway Karasuma Line",
  "京都市営地下鉄東西線": "Kyoto Subway Tozai Line",
  "神戸市営地下鉄西神・山手線": "Kobe Subway Seishin-Yamate Line",
  "神戸市営地下鉄海岸線": "Kobe Subway Kaigan Line",
  "長崎市電": "Nagasaki Streetcar",
  "熊本市電": "Kumamoto Streetcar",
  "鹿児島市電": "Kagoshima Streetcar",
  "函館市電": "Hakodate Streetcar",
  "岡山電気軌道": "Okayama Electric Tramway",
  "広島電鉄": "Hiroshima Electric Railway",
  "広島電鉄宮島線": "Hiroshima Electric Railway Miyajima Line",
  "豊橋鉄道東田本線": "Toyohashi Railroad Azumada Line",
  "豊橋鉄道渥美線": "Toyohashi Railroad Atsumi Line",

  // ── JR在来線 ──
  "JR東北本線": "JR Tohoku Main Line",
  "JR山陽本線": "JR Sanyo Main Line",
  "JR山陰本線": "JR Sanin Main Line",
  "JR山陰本線（西部）": "JR Sanin Main Line (West)",
  "JR山陰本線（京都〜鳥取）": "JR Sanin Main Line (Kyoto - Tottori)",
  "JR長崎本線": "JR Nagasaki Main Line",
  "JR豊肥本線": "JR Hohi Main Line",
  "JR日豊本線（小倉〜大分）": "JR Nippo Main Line (Kokura - Oita)",
  "JR日豊本線（大分〜鹿児島）": "JR Nippo Main Line (Oita - Kagoshima)",
  "JR鹿児島本線（福岡〜熊本）": "JR Kagoshima Main Line (Fukuoka - Kumamoto)",
  "JR鹿児島本線（熊本〜鹿児島中央）": "JR Kagoshima Main Line (Kumamoto - Kagoshima-Chuo)",
  "JR函館本線（札幌〜旭川）": "JR Hakodate Main Line (Sapporo - Asahikawa)",
  "JR函館本線（函館〜小樽）": "JR Hakodate Main Line (Hakodate - Otaru)",
  "JR函館本線（小樽〜長万部）": "JR Hakodate Main Line (Otaru - Oshamambe)",
  "JR函館本線（旭川〜岩見沢）": "JR Hakodate Main Line (Asahikawa - Iwamizawa)",
  "JR宗谷本線": "JR Soya Main Line",
  "JR宗谷本線（旭川〜名寄）": "JR Soya Main Line (Asahikawa - Nayoro)",
  "JR石北本線": "JR Sekihoku Main Line",
  "JR室蘭本線": "JR Muroran Main Line",
  "JR根室本線": "JR Nemuro Main Line",
  "JR根室本線（滝川〜新得）": "JR Nemuro Main Line (Takikawa - Shintoku)",
  "JR日高本線": "JR Hidaka Main Line",
  "JR富良野線": "JR Furano Line",
  "JR釧網本線": "JR Senmo Main Line",
  "JR花咲線": "JR Hanasaki Line",
  "JR千歳線": "JR Chitose Line",
  "JR石勝線": "JR Sekisho Line",
  "JR留萌本線": "JR Rumoi Main Line",
  "JR海峡線（青函トンネル）": "JR Kaikyo Line (Seikan Tunnel)",
  "JR中央本線（名古屋〜塩尻）": "JR Chuo Main Line (Nagoya - Shiojiri)",
  "JR奥羽本線（秋田〜青森）": "JR Ou Main Line (Akita - Aomori)",
  "JR奥羽本線（福島〜新庄）": "JR Ou Main Line (Fukushima - Shinjo)",
  "JR奥羽本線（新庄〜秋田）": "JR Ou Main Line (Shinjo - Akita)",
  "JR常磐線（いわき〜仙台）": "JR Joban Line (Iwaki - Sendai)",
  "JR常磐線（上野〜いわき）": "JR Joban Line (Ueno - Iwaki)",
  "JR常磐線（水戸付近）": "JR Joban Line (Mito Area)",
  "JR信越本線": "JR Shinetsu Main Line",
  "JR信越本線（新潟〜柏崎）": "JR Shinetsu Main Line (Niigata - Kashiwazaki)",
  "JR信越本線（長岡〜直江津）": "JR Shinetsu Main Line (Nagaoka - Naoetsu)",
  "JR羽越本線": "JR Uetsu Main Line",
  "JR北陸本線（金沢〜富山）": "JR Hokuriku Main Line (Kanazawa - Toyama)",
  "JR北陸本線（米原〜敦賀）": "JR Hokuriku Main Line (Maibara - Tsuruga)",
  "JR紀勢本線（亀山〜新宮）": "JR Kisei Main Line (Kameyama - Shingu)",
  "JR紀勢本線（新宮〜和歌山）": "JR Kisei Main Line (Shingu - Wakayama)",
  "JR関西本線（加茂〜亀山）": "JR Kansai Main Line (Kamo - Kameyama)",
  "JR関西本線（名古屋〜亀山）": "JR Kansai Main Line (Nagoya - Kameyama)",
  "JR久大本線": "JR Kyudai Main Line",
  "JR高山本線": "JR Takayama Main Line",
  "JR総武本線（千葉〜銚子）": "JR Sobu Main Line (Chiba - Choshi)",
  "JR筑豊本線（福北ゆたか線）": "JR Chikuho Main Line (Fukuhoku Yutaka Line)",
  "JR仙石線": "JR Senseki Line",
  "JR仙山線": "JR Senzan Line",
  "JR左沢線": "JR Aterazawa Line",
  "JR上越線": "JR Joetsu Line",
  "JR磐越西線": "JR Banetsu West Line",
  "JR磐越東線": "JR Banetsu East Line",
  "JR水戸線": "JR Mito Line",
  "JR日光線": "JR Nikko Line",
  "JR烏山線": "JR Karasuyama Line",
  "JR久留里線": "JR Kururi Line",
  "JR両毛線": "JR Ryomo Line",
  "JR北上線": "JR Kitakami Line",
  "JR釜石線": "JR Kamaishi Line",
  "JR津軽線": "JR Tsugaru Line",
  "JR五能線": "JR Gono Line",
  "JR陸羽東線": "JR Rikuu East Line",
  "JR陸羽西線": "JR Rikuu West Line",
  "JR花輪線": "JR Hanawa Line",
  "JR大湊線": "JR Ominato Line",
  "JR八戸線": "JR Hachinohe Line",
  "JR只見線": "JR Tadami Line",
  "JR米坂線": "JR Yonesaka Line",
  "JR気仙沼線": "JR Kesennuma Line",
  "JR大船渡線": "JR Ofunato Line",
  "JR山田線": "JR Yamada Line",
  "JR石巻線": "JR Ishinomaki Line",
  "JR越後線": "JR Echigo Line",
  "JR飯山線": "JR Iiyama Line",
  "JR大糸線": "JR Oito Line",
  "JR飯田線": "JR Iida Line",
  "JR御殿場線": "JR Gotemba Line",
  "JR身延線": "JR Minobu Line",
  "JR武豊線": "JR Taketoyo Line",
  "JR参宮線": "JR Sangu Line",
  "JR城端線": "JR Johana Line",
  "JR氷見線": "JR Himi Line",
  "JR越美北線（九頭竜線）": "JR Etsumi-Hoku Line (Kuzuryu Line)",
  "JR小浜線": "JR Obama Line",
  "JR湖西線": "JR Kosei Line",
  "JR湖西線（北部）": "JR Kosei Line (North)",
  "JR草津線": "JR Kusatsu Line",
  "JR琵琶湖線": "JR Biwako Line",
  "JR大阪環状線": "JR Osaka Loop Line",
  "JR阪和線": "JR Hanwa Line",
  "JR奈良線": "JR Nara Line",
  "JR和歌山線": "JR Wakayama Line",
  "JR大和路線": "JR Yamatoji Line",
  "JR学研都市線": "JR Gakkentoshi Line",
  "JR東西線（大阪）": "JR Tozai Line (Osaka)",
  "JR大阪東線": "JR Osaka Higashi Line",
  "JR桜井線（万葉まほろば線）": "JR Sakurai Line (Manyo Mahoroba Line)",
  "JR和田岬線": "JR Wadamisaki Line",
  "JR福知山線": "JR Fukuchiyama Line",
  "JR舞鶴線": "JR Maizuru Line",
  "JR播但線": "JR Bantan Line",
  "JR加古川線": "JR Kakogawa Line",
  "JR姫新線": "JR Kishin Line",
  "JR伯備線": "JR Hakubi Line",
  "JR津山線": "JR Tsuyama Line",
  "JR因美線": "JR Inbi Line",
  "JR境線": "JR Sakai Line",
  "JR木次線": "JR Kisuki Line",
  "JR福塩線": "JR Fukuen Line",
  "JR芸備線": "JR Geibi Line",
  "JR可部線": "JR Kabe Line",
  "JR呉線": "JR Kure Line",
  "JR宇野線（瀬戸大橋線）": "JR Uno Line (Seto-Ohashi Line)",
  "JR山口線": "JR Yamaguchi Line",
  "JR岩徳線": "JR Gantoku Line",
  "JR予讃線": "JR Yosan Line",
  "JR土讃線": "JR Dosan Line",
  "JR土讃線（高知付近）": "JR Dosan Line (Kochi Area)",
  "JR高徳線": "JR Kotoku Line",
  "JR徳島線": "JR Tokushima Line",
  "JR徳島線（西部）": "JR Tokushima Line (West)",
  "JR牟岐線": "JR Mugi Line",
  "JR牟岐線（阿南〜海部）": "JR Mugi Line (Anan - Kaifu)",
  "JR予土線": "JR Yodo Line",
  "JR筑肥線": "JR Chikuhi Line",
  "JR大村線": "JR Omura Line",
  "JR唐津線": "JR Karatsu Line",
  "JR佐世保線": "JR Sasebo Line",
  "JR日田彦山線": "JR Hitahikosan Line",
  "JR後藤寺線": "JR Gotoji Line",
  "JR若松線": "JR Wakamatsu Line",
  "JR香椎線": "JR Kashii Line",
  "JR原田線": "JR Haruda Line",
  "JR肥薩線": "JR Hisatsu Line",
  "JR吉都線": "JR Kitto Line",
  "JR日南線": "JR Nichinan Line",
  "JR指宿枕崎線": "JR Ibusuki-Makurazaki Line",
  "JR宮崎空港線": "JR Miyazaki Airport Line",
  "JR水郡線（水戸〜常陸大宮）": "JR Suigun Line (Mito - Hitachi-Omiya)",
  "JR学園都市線": "JR Gakuentoshi Line",

  // ── 第三セクター・地方私鉄・新交通システム ──
  "静岡鉄道": "Shizuoka Railway",
  "遠州鉄道": "Enshu Railway",
  "愛知環状鉄道": "Aichi Loop Line",
  "伊予鉄道市内電車": "Iyotetsu City Line",
  "熊本電気鉄道": "Kumamoto Electric Railway",
  "関東鉄道常総線": "Kanto Railway Joso Line",
  "関東鉄道竜ヶ崎線": "Kanto Railway Ryugasaki Line",
  "秩父鉄道": "Chichibu Railway",
  "島原鉄道": "Shimabara Railway",
  "沖縄都市モノレール（ゆいレール）": "Okinawa Monorail (Yui Rail)",
  "富山地方鉄道本線": "Toyama Chiho Railroad Main Line",
  "富山ライトレール": "Toyama Light Rail",
  "富山市内電車環状線": "Toyama City Tram Loop Line",
  "万葉線": "Manyosen Line",
  "えちぜん鉄道勝山永平寺線": "Echizen Railway Katsuyama-Eiheiji Line",
  "えちぜん鉄道三国芦原線": "Echizen Railway Mikuni-Awara Line",
  "福井鉄道福武線": "Fukui Railway Fukubu Line",
  "北陸鉄道石川線": "Hokuriku Railroad Ishikawa Line",
  "北陸鉄道浅野川線": "Hokuriku Railroad Asanogawa Line",
  "ハピラインふくい": "Hapi-Line Fukui",
  "高松琴平電気鉄道琴平線": "Takamatsu-Kotohira Railway Kotohira Line",
  "高松琴平電鉄長尾線": "Takamatsu-Kotohira Railway Nagao Line",
  "高松琴平電鉄志度線": "Takamatsu-Kotohira Railway Shido Line",
  "土佐くろしお鉄道阿佐線": "Tosa Kuroshio Railway Asa Line",
  "土佐くろしお鉄道ごめん・なはり線": "Tosa Kuroshio Railway Gomen-Nahari Line",
  "土佐くろしお鉄道宿毛線": "Tosa Kuroshio Railway Sukumo Line",
  "和歌山電鐵貴志川線": "Wakayama Electric Railway Kishigawa Line",
  "青い森鉄道": "Aoimori Railway",
  "IGRいわて銀河鉄道": "IGR Iwate Galaxy Railway",
  "三陸鉄道リアス線": "Sanriku Railway Rias Line",
  "弘南鉄道弘南線": "Konan Railway Konan Line",
  "弘南鉄道大鰐線": "Konan Railway Owani Line",
  "流鉄流山線": "Ryutetsu Nagareyama Line",
  "銚子電気鉄道": "Choshi Electric Railway",
  "みなとみらい線": "Minatomirai Line",
  "泉北高速鉄道": "Semboku Rapid Railway",
  "能勢電鉄妙見線": "Nose Electric Railway Myoken Line",
  "能勢電鉄日生線": "Nose Electric Railway Nissei Line",
  "大阪モノレール": "Osaka Monorail",
  "大阪モノレール彩都線": "Osaka Monorail Saito Line",
  "松浦鉄道西九州線": "Matsuura Railway Nishi-Kyushu Line",
  "肥薩おれんじ鉄道": "Hisatsu Orange Railway",
  "道南いさりび鉄道": "South Hokkaido Railway",
  "阿武隈急行": "Abukuma Express",
  "山形鉄道フラワー長井線": "Yamagata Railway Flower Nagai Line",
  "秋田内陸縦貫鉄道": "Akita Nairiku Jukan Railway",
  "由利高原鉄道": "Yuri Kogen Railway",
  "津軽鉄道": "Tsugaru Railway",
  "ひたちなか海浜鉄道": "Hitachinaka Seaside Railway",
  "水間鉄道": "Mizuma Railway",
  "神戸電鉄有馬線": "Kobe Electric Railway Arima Line",
  "神戸電鉄粟生線": "Kobe Electric Railway Ao Line",
  "神戸電鉄三田線": "Kobe Electric Railway Sanda Line",
  "叡山電鉄叡山本線": "Eizan Railway Eizan Main Line",
  "叡山電鉄鞍馬線": "Eizan Railway Kurama Line",
  "嵐電（嵐山本線）": "Randen (Arashiyama Main Line)",
  "嵐電北野線": "Randen Kitano Line",
  "三岐鉄道北勢線": "Sangi Railway Hokusei Line",
  "三岐鉄道本線": "Sangi Railway Main Line",
  "養老鉄道": "Yoro Railway",
  "長野電鉄長野線": "Nagano Electric Railway Nagano Line",
  "上田電鉄別所線": "Ueda Electric Railway Bessho Line",
  "松本電気鉄道上高地線": "Matsumoto Electric Railway Kamikochi Line",
  "富士急行線": "Fujikyuko Line",
  "北大阪急行電鉄": "Kita-Osaka Kyuko Railway",
  "平成筑豊鉄道伊田線": "Heisei Chikuho Railway Ita Line",
  "平成筑豊鉄道田川線": "Heisei Chikuho Railway Tagawa Line",
  "甘木鉄道": "Amagi Railway",
  "東武越生線": "Tobu Ogose Line",
  "東武佐野線": "Tobu Sano Line",
  "東武桐生線": "Tobu Kiryu Line",
  "東武宇都宮線": "Tobu Utsunomiya Line",
  "東武鬼怒川線": "Tobu Kinugawa Line",
  "西武秩父線": "Seibu Chichibu Line",
  "上毛電気鉄道": "Jomo Electric Railway",
  "わたらせ渓谷鐵道": "Watarase Keikoku Railway",
  "真岡鐵道": "Moka Railway",
  "仙台空港鉄道": "Sendai Airport Railway",
  "えちごトキめき鉄道日本海ひすいライン": "Echigo Tokimeki Railway Nihonkai Hisui Line",
  "えちごトキめき鉄道妙高はねうまライン": "Echigo Tokimeki Railway Myoko Haneuma Line",
  "あいの風とやま鉄道": "Ainokaze Toyama Railway",
  "IRいしかわ鉄道": "IR Ishikawa Railway",
  "黒部峡谷鉄道": "Kurobe Gorge Railway",
  "北越急行ほくほく線": "Hokuetsu Express Hokuhoku Line",
  "しなの鉄道北しなの線": "Shinano Railway Kita-Shinano Line",
  "しなの鉄道本線": "Shinano Railway Main Line",
  "リニモ（愛知高速交通東部丘陵線）": "Linimo (Aichi Rapid Transit Tobu Kyuryo Line)",
  "一畑電車北松江線": "Ichibata Electric Railway Kita-Matsue Line",
  "一畑電車大社線": "Ichibata Electric Railway Taisha Line",
  "水島臨海鉄道": "Mizushima Rinkai Railway",
  "井原鉄道": "Ibara Railway",
  "南阿蘇鉄道": "Minami-Aso Railway",
  "鹿島臨海鉄道": "Kashima Rinkai Railway",
  "上信電鉄": "Joshin Electric Railway",
  "小湊鉄道": "Kominato Railway",
  "いすみ鉄道": "Isumi Railway",
  "大井川鐡道大井川本線": "Oigawa Railway Oigawa Main Line",
  "岳南電車": "Gakunan Railway",
  "伊豆箱根鉄道大雄山線": "Izuhakone Railway Daiyuzan Line",
  "会津鉄道会津線": "Aizu Railway Aizu Line",
  "野岩鉄道会津鬼怒川線": "Yagan Railway Aizu-Kinugawa Line",
  "のと鉄道七尾線": "Noto Railway Nanao Line",
  "天竜浜名湖鉄道": "Tenryu Hamanako Railroad",
  "京都丹後鉄道宮福線": "Kyoto Tango Railway Miyafuku Line",
  "京都丹後鉄道宮豊線": "Kyoto Tango Railway Miyatoyo Line",
  "京都丹後鉄道宮舞線": "Kyoto Tango Railway Miyamai Line",
  "近江鉄道本線": "Ohmi Railway Main Line",
  "近江鉄道多賀線": "Ohmi Railway Taga Line",
  "近江鉄道八日市線": "Ohmi Railway Yokaichi Line",
  "信楽高原鐵道": "Shigaraki Kohgen Railway",
  "智頭急行智頭線": "Chizu Express Chizu Line",
  "伊賀鉄道伊賀線": "Iga Railway Iga Line",
  "若桜鉄道若桜線": "Wakasa Railway Wakasa Line",
  "錦川鉄道錦川清流線": "Nishikigawa Railway Seiryu Line",
  "いよ鉄道高浜線": "Iyotetsu Takahama Line",
  "いよ鉄道横河原線": "Iyotetsu Yokogawara Line",
  "いよ鉄道郡中線": "Iyotetsu Gunchu Line",
  "とさでん交通後免・安芸線": "Tosaden Kotsu Gomen-Aki Line",
  "とさでん交通伊野線": "Tosaden Kotsu Ino Line",
  "阿佐海岸鉄道阿佐東線": "Asa Kaigan Railway Asato Line",
  "神戸新交通ポートライナー": "Kobe New Transit Port Liner",
  "神戸新交通六甲ライナー": "Kobe New Transit Rokko Liner",
  "広島高速交通アストラムライン": "Hiroshima Rapid Transit Astram Line",
  "あおなみ線": "Aonami Line",
  "福島交通飯坂線": "Fukushima Transportation Iizaka Line",
  "京急逗子線": "Keikyu Zushi Line",
  "東急こどもの国線": "Tokyu Kodomonokuni Line",
  "樽見鉄道": "Tarumi Railway",
  "長良川鉄道": "Nagaragawa Railway",
  "明知鉄道": "Akechi Railway",
  "伊勢鉄道（伊勢線）": "Ise Railway (Ise Line)",
};

// UI翻訳辞書
export const uiTranslations: { [key: string]: { japanese: string; english: string } } = {
  // 駅選択
  stationSelection: {
    japanese: "出発駅・到着駅を選択",
    english: "Select Departure & Arrival Stations"
  },
  departureStation: {
    japanese: "出発駅",
    english: "Departure"
  },
  arrivalStation: {
    japanese: "到着駅",
    english: "Arrival"
  },
  stationPlaceholder: {
    japanese: "駅名入力",
    english: "Enter station name"
  },
  swapStations: {
    japanese: "⇄ 入替",
    english: "⇄ Swap"
  },
  majorStationsHint: {
    japanese: "主要駅: 東京、新宿、渋谷、池袋、横浜、新横浜",
    english: "Major stations: Tokyo, Shinjuku, Shibuya, Ikebukuro, Yokohama, Shin-Yokohama"
  },
  noStationFound: {
    japanese: "該当する駅が見つかりません",
    english: "No matching stations found"
  },

  // 経路推薦
  recommendedRoutes: {
    japanese: "推薦ルート",
    english: "Recommended Routes"
  },
  showAllRoutes: {
    japanese: "全ルート表示",
    english: "Show All Routes"
  },
  displayOnMap: {
    japanese: "地図で表示",
    english: "Show on Map"
  },
  displayingOnMap: {
    japanese: "地図に表示中",
    english: "Displaying on Map"
  },
  noTransfer: {
    japanese: "乗換なし",
    english: "Direct"
  },
  oneTransfer: {
    japanese: "乗換1回",
    english: "1 Transfer"
  },
  transfers: {
    japanese: "乗換{count}回",
    english: "{count} Transfers"
  },
  minutes: {
    japanese: "{minutes}分",
    english: "{minutes} min"
  },
  hours: {
    japanese: "{hours}時間{minutes}分",
    english: "{hours}h {minutes}m"
  },
  hoursOnly: {
    japanese: "{hours}時間",
    english: "{hours}h"
  },
  walkingTransfer: {
    japanese: "徒歩乗換",
    english: "Walking Transfer"
  },
  transfer: {
    japanese: "乗換",
    english: "Transfer"
  },
  via: {
    japanese: "経由",
    english: "via"
  },

  // 凡例
  routeToggle: {
    japanese: "路線表示切替",
    english: "Route Display Toggle"
  },
  routeDisplayToggle: {
    japanese: "表示路線切り替え",
    english: "Route Display Toggle"
  },
  clearSelection: {
    japanese: "選択を解除",
    english: "Clear"
  },
  decrease: {
    japanese: "小さくする",
    english: "Decrease"
  },
  play: {
    japanese: "再生",
    english: "Play"
  },
  pause: {
    japanese: "一時停止",
    english: "Pause"
  },
  increase: {
    japanese: "大きくする",
    english: "Increase"
  },
  collapseList: {
    japanese: "折りたたむ",
    english: "Collapse"
  },
  showMoreRoutes: {
    japanese: "他 {count} 路線を表示",
    english: "Show {count} more routes"
  },
  routeViewBoard: {
    japanese: "ボード",
    english: "Board"
  },
  routeViewClassic: {
    japanese: "一覧",
    english: "List"
  },
  routeSearchPlaceholder: {
    japanese: "路線名を検索",
    english: "Search route name"
  },
  routeGroupOnRoute: {
    japanese: "経路上の路線",
    english: "On your route"
  },
  routeGroupAtStation: {
    japanese: "選択した駅を通る路線",
    english: "Through selected stations"
  },
  routeGroupVisible: {
    japanese: "表示中",
    english: "Shown"
  },
  routeGroupHidden: {
    japanese: "非表示",
    english: "Hidden"
  },
  routeShowMore: {
    japanese: "さらに{count}件",
    english: "{count} more"
  },
  routeNoMatch: {
    japanese: "一致する路線がありません",
    english: "No matching routes"
  },
  routeVisibleSummary: {
    japanese: "{shown} / {total} 路線を表示中",
    english: "{shown} of {total} routes shown"
  },
  // ── 複数駅の共通路線（旧: 最寄り駅メモ） ──────────────────
  // 複数の駅を登録して、それぞれの路線と共通して乗れる路線を地図に出す（以前の名前は「最寄り駅メモ」）
  memoTitle: {
    japanese: "複数駅の共通路線",
    english: "Lines shared by stations"
  },
  memoDescription: {
    japanese: "誰の最寄り駅がどこかを控えておくと、全員が乗れる路線が分かります。この端末にだけ保存されます。",
    english: "Note who lives near which station to see the lines everyone can use. Saved on this device only."
  },
  memoPersonPlaceholder: {
    japanese: "名前",
    english: "Name"
  },
  memoStationPlaceholder: {
    japanese: "最寄り駅",
    english: "Nearest station"
  },
  memoNotePlaceholder: {
    japanese: "ひとこと（任意）",
    english: "Note (optional)"
  },
  memoAdd: {
    japanese: "追加",
    english: "Add"
  },
  memoRemove: {
    japanese: "削除",
    english: "Remove"
  },
  memoSearchPlaceholder: {
    japanese: "名前・駅・路線で絞り込む",
    english: "Filter by name, station or line"
  },
  memoEmpty: {
    japanese: "まだ誰も登録されていません",
    english: "No one saved yet"
  },
  memoNoMatch: {
    japanese: "一致する人がいません",
    english: "No one matches"
  },
  memoUnknownStation: {
    japanese: "路線データに無い駅名です",
    english: "Not a station in the data"
  },
  memoCount: {
    japanese: "{count}人",
    english: "{count} people"
  },
  memoSharedRoutes: {
    japanese: "共通の路線",
    english: "Shared lines"
  },
  memoEveryone: {
    japanese: "全員",
    english: "Everyone"
  },
  memoSharedCount: {
    japanese: "{count} / {total}人",
    english: "{count} of {total}"
  },
  memoNoShared: {
    japanese: "全員が使える路線はありません",
    english: "No line reaches everyone"
  },
  memoShowEveryone: {
    japanese: "全員の路線を地図に表示",
    english: "Show everyone's lines"
  },
  memoShowShared: {
    japanese: "この一覧の路線を地図に表示",
    english: "Show these lines on the map"
  },
  memoUseAsDeparture: {
    japanese: "出発に設定",
    english: "Set as departure"
  },
  showOnlyTransferStations: {
    japanese: "乗換駅のみ表示",
    english: "Show Transfer Stations Only"
  },
  showOnlyExpressStations: {
    japanese: "急行駅のみ表示",
    english: "Show Express Stations Only"
  },
  showTravelTimes: {
    japanese: "所要時間を表示",
    english: "Show Travel Times"
  },
  showStationNames: {
    japanese: "駅名を表示",
    english: "Show Station Names"
  },
  mapDisplayMode: {
    japanese: "地図表示モード",
    english: "Map Display Mode"
  },
  realisticView: {
    japanese: "現実の路線図",
    english: "Realistic View"
  },
  schematicView: {
    japanese: "路線図風表示(準備中)",
    english: "Schematic View (Preparing)"
  },

  // 時間フィルター
  timeFilter: {
    japanese: "時間フィルター",
    english: "Time Filter"
  },
  accessibleStations: {
    japanese: "出発駅から{minutes}分以内の駅のみ表示",
    english: "Show stations within {minutes} min from departure"
  },

  // RouteRecommendations
  routeNumber: {
    japanese: "ルート {number}",
    english: "Route {number}"
  },
  selectedStatus: {
    japanese: "(選択中)",
    english: "(Selected)"
  },
  displayOnMapActive: {
    japanese: "地図に表示中",
    english: "Displaying on Map"
  },
  displayOnMapButton: {
    japanese: "地図で表示",
    english: "Show on Map"
  },
  routeDetails: {
    japanese: "路線詳細",
    english: "Route Details"
  },
  transferInfo: {
    japanese: "乗換案内",
    english: "Transfer Information"
  },
  walkingTransferShort: {
    japanese: "徒歩乗換",
    english: "Walking"
  },
  transferShort: {
    japanese: "乗換",
    english: "Transfer"
  },
  // 経路の区間の境目で、乗り換えずに同じ列車のまま次の路線へ入る（直通運転）
  throughShort: {
    japanese: "直通",
    english: "Through"
  },
  direction: {
    japanese: "{destination}行き",
    english: "to {destination}"
  },
  directionArea: {
    japanese: "{destination}方面",
    english: "towards {destination}"
  },
  viaStations: {
    japanese: "経由",
    english: "via"
  },
  addWaypoint: {
    japanese: "経由駅を追加",
    english: "Add via station"
  },
  otherStations: {
    japanese: "他{count}駅",
    english: "{count} more stations"
  },
  noRoutesFound: {
    japanese: "ルートが見つかりませんでした",
    english: "No routes found"
  },
  routeCount: {
    japanese: "{count}件",
    english: "{count} routes"
  },

  // RailwayMap additional UI
  setDepartureStation: {
    japanese: "出発駅に設定",
    english: "Set as Departure"
  },
  setArrivalStation: {
    japanese: "到着駅に設定",
    english: "Set as Arrival"
  },
  routeRecommendationCount: {
    japanese: "経路推薦数:",
    english: "Route Count:"
  },
  routeSwitchNote: {
    japanese: "※路線表示・乗換駅切り替えは右上の凡例から",
    english: "※Use legend in top-right to toggle routes and transfer stations"
  },
  baseStation: {
    japanese: "基準駅:",
    english: "Base Station:"
  },
  pleaseSetDeparture: {
    japanese: "出発駅を設定してください",
    english: "Please set departure station"
  },
  stationsCount: {
    japanese: "({count}駅)",
    english: "({count} stations)"
  },
  currentStationSettings: {
    japanese: "現在の駅設定",
    english: "Current Station Settings"
  },
  departureStationLabel: {
    japanese: "出発駅:",
    english: "Departure:"
  },
  arrivalStationLabel: {
    japanese: "到着駅:",
    english: "Arrival:"
  },
  minutesShort: {
    japanese: "{time}分",
    english: "{time}min"
  },
  transfersCount: {
    japanese: "乗換{count}回",
    english: "{count} transfers"
  },

  // Legend and route display
  displayedRoutes: {
    japanese: "表示路線の切替",
    english: "Route Display Toggle"
  },
  allShow: {
    japanese: "全表示",
    english: "Show All"
  },
  allHide: {
    japanese: "全非表示",
    english: "Hide All"
  },
  legendDeparture: {
    japanese: "S{station}",
    english: "S{station}"
  },
  legendArrival: {
    japanese: "G{station}",
    english: "G{station}"
  },
  routeSelection: {
    japanese: "推薦ルート選択",
    english: "Route Selection"
  },
  showAllRoutesLabel: {
    japanese: "全ルート表示",
    english: "Show All Routes"
  },
  uiVersionBetaLabel: {
    japanese: "新デザインを試す (β)",
    english: "Try new design (Beta)"
  },
  uiVersionBackLabel: {
    japanese: "以前のデザインに戻す",
    english: "Back to classic design"
  },
  multiDepartureTitle: {
    japanese: "複数の出発駅から検索",
    english: "Multiple Departures"
  },
  addDepartureButton: {
    japanese: "出発駅を追加",
    english: "Add departure station"
  },
  removeDepartureLabel: {
    japanese: "この出発駅を削除",
    english: "Remove this departure"
  },
  focusThisDeparture: {
    japanese: "この駅を出発駅にする",
    english: "Use as main departure"
  },

  // Footer text
  copyrightText: {
    japanese: COPYRIGHT_TEXT,
    english: COPYRIGHT_TEXT
  },
  dataSourceText: {
    japanese: "駅データは独自作成またはオープンデータを利用しています。",
    english: "Station data is original or uses open data sources."
  },
  disclaimerText: {
    japanese: "本サービスは非公式であり、各鉄道事業者とは関係ありません。",
    english: "This service is unofficial and not affiliated with any railway companies."
  },
  accuracyText: {
    japanese: "提供する情報は目安です。正確な運行情報は公式サイトをご確認ください。",
    english: "Information provided is for reference only. Please check official websites for accurate service information."
  },
  madeWithText: {
    japanese: "Made with Claude Code",
    english: "Made with Claude Code"
  },

  // その他
  departure: {
    japanese: "出発",
    english: "From"
  },
  arrival: {
    japanese: "到着",
    english: "To"
  },
  route: {
    japanese: "ルート",
    english: "Route"
  },
  selected: {
    japanese: "選択中",
    english: "Selected"
  },
  clickToToggleVisibility: {
    japanese: "クリックで表示・非表示を切替",
    english: "Click to toggle visibility"
  },
  recommendedRoute: {
    japanese: "推薦ルート",
    english: "Recommended Route"
  },
  showFurigana: {
    japanese: "ふりがなを表示",
    english: "Show Furigana"
  },

  // StationSelector
  currentLocationFrom: {
    japanese: "現在地から",
    english: "Near Me"
  },
  swapStationsTitle: {
    japanese: "出発駅と到着駅を入れ替え",
    english: "Swap departure and arrival"
  },
  departureTime: {
    japanese: "出発時刻",
    english: "Departure Time"
  },
  currentTime: {
    japanese: "現在時刻",
    english: "Now"
  },

  // Timetable tooltip
  baseTime: {
    japanese: "出発時刻",
    english: "Departure Time"
  },
  arrivalTimeLabel: {
    japanese: "到着時刻",
    english: "Arrival Time"
  },
  timeBasisDeparture: {
    japanese: "出発",
    english: "Depart"
  },
  timeBasisArrival: {
    japanese: "到着",
    english: "Arrive"
  },
  show: {
    japanese: "表示",
    english: "Show"
  },
  hide: {
    japanese: "非表示",
    english: "Hide"
  },
  lastUpdated: {
    japanese: "最終更新",
    english: "Last updated"
  },
  alwaysShowMajorStations: {
    japanese: "主要駅を常に表示",
    english: "Always show major stations"
  },
  arrivalAlert: {
    japanese: "降車駅アラーム",
    english: "Arrival alert"
  },
  arrivalAlertTiming: {
    japanese: "知らせる:",
    english: "Notify:"
  },
  arrivalAlertMinutesOption: {
    japanese: "約{count}分前",
    english: "~{count} min before"
  },
  arrivalAlertNote: {
    japanese: "時刻表ではなく現在地と実際の速度から残り時間を出します。遅延していても目安になります。",
    english: "Uses your GPS position and actual speed, not the timetable, so it still works during delays."
  },
  minRouteCount: {
    japanese: "対象:",
    english: "Threshold:"
  },
  routeCountOption: {
    japanese: "{count}路線以上",
    english: "{count}+ lines"
  },
  dataSource: {
    japanese: "出典",
    english: "Source"
  },
  afterSuffix: {
    japanese: "以降",
    english: "onwards"
  },
  firstTrainReached: {
    japanese: "始発",
    english: "First train"
  },
  showPerRouteStationTimes: {
    japanese: "時刻を路線ごとに表示",
    english: "Show times per line"
  },
  visibleRoutesLegendTitle: {
    japanese: "表示中の路線",
    english: "Lines shown"
  },
  moreRoutesCount: {
    japanese: "…ほか{count}路線",
    english: "…and {count} more"
  },
  // 凡例の見出し（短く。狭い幅で見切れても件数が先に読めるように）
  visibleRoutesLegendCount: {
    japanese: "{count}路線",
    english: "{count} lines"
  },
  reverseDirection: {
    japanese: "方向を切り替え",
    english: "Switch direction"
  },
  reverseDirectionReference: {
    japanese: "逆方向（参考）",
    english: "Opposite direction (reference)"
  },
  offRouteReference: {
    japanese: "ルート外参考",
    english: "Off-route ref"
  },
  noData: {
    japanese: "データなし",
    english: "No data"
  },
  showAllTimetable: {
    japanese: "時刻表をすべて表示",
    english: "Show full timetable"
  },
  onboardRouteNoData: {
    japanese: "乗車路線ですが\n時刻データなし",
    english: "On-route,\nno timetable"
  },
  noTimetableData: {
    japanese: "時刻データなし",
    english: "No timetable"
  },
  approximateNote: {
    japanese: "概算値・参考用　左の路線名をクリックで切替",
    english: "Approximate. Click route name to switch"
  },
  timetableEstimatedWarning: {
    japanese: "推定データです。正確な時刻は各鉄道会社の公式時刻表をご参照ください。",
    english: "Estimated data. Please refer to the operator's official timetable for exact times."
  },
  heatmapDataLabel: {
    japanese: "ヒートマップデータ",
    english: "Heatmap data"
  },
  showTrainStatusPanel: {
    japanese: "乗車中の路線を表示",
    english: "Show current train info"
  },
  locationDenied: {
    japanese: "位置情報が許可されていません",
    english: "Location permission denied"
  },
  locationUnavailable: {
    japanese: "現在地を取得できません",
    english: "Location unavailable"
  },
  retryLocation: {
    japanese: "再取得",
    english: "Retry"
  },
  useLocationFeatures: {
    japanese: "現在地から出発駅を自動設定",
    english: "Auto-set departure from location"
  },
  moreItemsCount: {
    japanese: "+{count}件",
    english: "+{count} more"
  },
  towardSuffix: {
    japanese: "方面",
    english: "dir."
  },

  // 地図ページの読み込み画面の段階の文言（constants/appLoading.ts）
  appLoadingStart: {
    japanese: "読み込んでいます…",
    english: "Loading…"
  },
  appLoadingRoutes: {
    japanese: "路線図を準備しています…",
    english: "Preparing the route map…"
  },
  appLoadingMap: {
    japanese: "地図を表示しています…",
    english: "Drawing the map…"
  },

  // Map loading
  loadingMap: {
    japanese: "マップを読み込み中...",
    english: "Loading map..."
  },

  // Time filter
  maxTime: {
    japanese: "最大時間:",
    english: "Max Time:"
  },

  // Buttons
  timetableModeOff: {
    japanese: "時刻表モードをOFF",
    english: "Timetable Mode OFF"
  },
  timetableModeOn: {
    japanese: "時刻表モードをON",
    english: "Timetable Mode ON"
  },
  serviceBrandUenoTokyoLine: {
    japanese: "上野東京ライン",
    english: "Ueno-Tokyo Line"
  },
  serviceBrandShonanShinjukuLine: {
    japanese: "湘南新宿ライン",
    english: "Shonan-Shinjuku Line"
  },
  serviceBrandYokosukaSobuRapid: {
    japanese: "横須賀・総武快速線",
    english: "Yokosuka / Sobu Rapid Line"
  },
  serviceTerminiLabel: {
    japanese: "主な始発・行先",
    english: "Main terminals"
  },
  resetNorth: {
    japanese: "北を上にする",
    english: "Reset to north"
  },
  exitFullscreen: {
    japanese: "縮小表示",
    english: "Exit Fullscreen"
  },
  enterFullscreen: {
    japanese: "拡大表示",
    english: "Fullscreen"
  },
  refreshLocationNow: {
    japanese: "現在地を今すぐ更新",
    english: "Refresh location"
  },
  stopTracking: {
    japanese: "現在地追跡をOFF",
    english: "Stop tracking"
  },
  showMyLocation: {
    japanese: "現在地を表示",
    english: "Show my location"
  },

  // Hover tooltip
  fromWhere: {
    japanese: "どこから",
    english: "From where"
  },

  // Route popup
  firstTrain: {
    japanese: "始発",
    english: "First"
  },
  lastStation: {
    japanese: "終点",
    english: "Last"
  },

  // Mobile tab bar
  displaySettings: {
    japanese: "表示設定",
    english: "Settings"
  },

  // TimetablePanel
  selectStationsPrompt: {
    japanese: "出発駅・到着駅を選択して経路を検索してください",
    english: "Select departure and arrival stations to search routes"
  },
  departsLabel: {
    japanese: "発",
    english: "Dep."
  },
  arrivesLabel: {
    japanese: "着",
    english: "Arr."
  },
  approxMinutes: {
    japanese: "約{time}分",
    english: "approx. {time}min"
  },
  close: {
    japanese: "閉じる",
    english: "Close"
  },
  timetableButton: {
    japanese: "時刻表",
    english: "Timetable"
  },
  showStationTimeLabelsButton: {
    japanese: "時刻を表示",
    english: "Show Times"
  },
  departsAfterLabel: {
    japanese: "{station} {time}以降の発車（{route}）",
    english: "Deps. from {station} after {time} ({route})"
  },
  noTimetableDataFound: {
    japanese: "時刻データが見つかりません",
    english: "No timetable data found"
  },
  timetableUpdatedAt: {
    japanese: "更新日: {date}",
    english: "Updated: {date}"
  },
  timetableDisclaimerNote: {
    japanese: "正確な時刻は公式をご確認ください",
    english: "Please check official timetables for accuracy"
  },
  towardDirection: {
    japanese: "（{direction}方面）",
    english: " ({direction} dir.)"
  },

  // ThemeToggle
  darkMode: {
    japanese: "ダークモード",
    english: "Dark Mode"
  },
  lightMode: {
    japanese: "ライトモード",
    english: "Light Mode"
  },
  switchToDarkMode: {
    japanese: "ダークモードに切り替え",
    english: "Switch to dark mode"
  },
  switchToLightMode: {
    japanese: "ライトモードに切り替え",
    english: "Switch to light mode"
  },

  // ErrorBoundary
  mapErrorTitle: {
    japanese: "地図の読み込みでエラーが発生しました",
    english: "Error loading map"
  },
  mapErrorMessage: {
    japanese: "ページを再読み込みしてください。",
    english: "Please reload the page."
  },
  errorDetails: {
    japanese: "詳細",
    english: "Details"
  },
  reloadButton: {
    japanese: "再読み込み",
    english: "Reload"
  },

  // SchematicMap
  schematicMapHint: {
    japanese: "クリック: 出発駅設定 | Shift+クリック: 到着駅設定",
    english: "Click: Set Departure | Shift+Click: Set Arrival"
  },

  // Station stats tooltip
  noDataForStation: {
    japanese: "この駅のデータは未入力です",
    english: "No data for this station"
  },

  // LegendRouteList
  showStationCodes: {
    japanese: "駅コードを表示",
    english: "Show station codes"
  },
  stationHeatmap: {
    japanese: "駅統計ヒートマップ",
    english: "Station heatmap"
  },
  showOutsideSegmentRoutes: {
    japanese: "区間外の路線を表示",
    english: "Show outside-segment routes"
  },
  showMapTiles: {
    japanese: "地図タイルを表示",
    english: "Show map tiles"
  },
  showFullRouteStations: {
    japanese: "中間駅以外も表示",
    english: "Show full route stations"
  },
  showRouteRecommendationsPanel: {
    japanese: "推薦ルート選択を表示",
    english: "Show route suggestions"
  },
  showRouteLines: {
    japanese: "路線の線を表示",
    english: "Show route lines"
  },
  stationTooltipLabel: {
    japanese: "駅ツールチップを表示",
    english: "Station tooltip"
  },
  bubbleMap: {
    japanese: "バブルマップ(実装中)",
    english: "Bubble map (WIP)"
  },
  bubbleCircle: {
    japanese: "● 円",
    english: "● Circle"
  },
  bubbleSquare: {
    japanese: "■ 四角",
    english: "■ Square"
  },
  trainDemoLabel: {
    japanese: "列車デモ",
    english: "Train Demo"
  },
  sortLabel: {
    japanese: "並び順:",
    english: "Sort:"
  },
  sortAlpha: {
    japanese: "あいうえお",
    english: "A-Z"
  },
  sortColor: {
    japanese: "色",
    english: "Color"
  },
  sortNearby: {
    japanese: "近い順",
    english: "Nearby"
  },
  sortDefault: {
    japanese: "登録順",
    english: "Default"
  },
  hideThisRoute: {
    japanese: "この路線を非表示にする",
    english: "Hide this route"
  },
  showThisRoute: {
    japanese: "この路線を表示する",
    english: "Show this route"
  },
  stationSettings: {
    japanese: "駅設定",
    english: "Station"
  },
  detailSettings: {
    japanese: "表示切替",
    english: "Display Toggles"
  },
  minutesSuffix: {
    japanese: "分",
    english: "min"
  },
  geolocationNotSupported: {
    japanese: "位置情報はこのブラウザではサポートされていません。",
    english: "Geolocation is not supported by this browser."
  },
  aboutSiteTitle: {
    japanese: "このサイトについて",
    english: "About this site"
  },
  menuTitle: {
    japanese: "メニュー",
    english: "Menu"
  },
  openMenuLabel: {
    japanese: "メニューを開く",
    english: "Open menu"
  },
  appTitle: {
    japanese: SITE_NAME,
    english: SITE_NAME
  },
  appTagline: {
    japanese: "必要な路線だけを表示するシンプルな路線図",
    english: "Show only the lines you need"
  },
  aboutLink: {
    japanese: "このサイトについて",
    english: "About"
  },
  faqLink: {
    japanese: "よくある質問",
    english: "FAQ"
  },
  privacyLink: {
    japanese: "プライバシーポリシー",
    english: "Privacy Policy"
  },
  termsLink: {
    japanese: "利用規約",
    english: "Terms of Service"
  },
  contactLink: {
    japanese: "お問い合わせ",
    english: "Contact"
  },
  approxNote: {
    japanese: "（概算値・参考用）",
    english: " (approx.)"
  },
  cookieUsage: {
    japanese: "Cookieの使用について",
    english: "Cookie Usage"
  },
  cookieBannerIntro: {
    japanese: "このサイトでは、サービス向上および広告配信のため、利用状況に基づくCookieを使用しています。詳細は",
    english: "This site uses cookies for ads and analytics based on usage data to improve our services. For details, see our"
  },
  cookieBannerIntroSuffix: {
    japanese: "をご覧ください。",
    english: "."
  },
  cookieAcceptAll: {
    japanese: "すべて同意",
    english: "Accept All"
  },
  cookieManageSettings: {
    japanese: "設定管理",
    english: "Manage Settings"
  },
  cookieEssentialOnly: {
    japanese: "必要なもののみ",
    english: "Essential Only"
  },
  cookieSettingsTitle: {
    japanese: "Cookie設定",
    english: "Cookie Settings"
  },
  cookieNecessaryTitle: {
    japanese: "必要なCookie",
    english: "Necessary Cookies"
  },
  cookieNecessaryDesc: {
    japanese: "サイトの基本機能に必要なCookieです（テーマ設定、言語設定など）",
    english: "Essential cookies for basic site functionality (theme settings, language preferences, etc.)"
  },
  cookieAnalyticsTitle: {
    japanese: "分析Cookie",
    english: "Analytics Cookies"
  },
  cookieAnalyticsDesc: {
    japanese: "Google Analyticsによるサイト利用状況の分析に使用されます",
    english: "Used by Google Analytics to analyze site usage patterns"
  },
  cookieAdvertisingTitle: {
    japanese: "広告Cookie",
    english: "Advertising Cookies"
  },
  cookieAdvertisingDesc: {
    japanese: "Google AdSenseによる適切な広告配信に使用されます",
    english: "Used by Google AdSense for appropriate ad delivery"
  },
  cookieCancel: {
    japanese: "キャンセル",
    english: "Cancel"
  },
  cookieSaveSettings: {
    japanese: "設定を保存",
    english: "Save Settings"
  },
  allRoutesOn: {
    japanese: "全路線: 表示",
    english: "All routes: ON"
  },
  allRoutesOff: {
    japanese: "全路線: 非表示",
    english: "All routes: OFF"
  },
  travelTimeOverlay: {
    japanese: "所要時間を駅に表示",
    english: "Show travel time on stations"
  },
  calculating: {
    japanese: "計算中...",
    english: "Calculating..."
  },
  reachable: {
    japanese: "駅に到達可能",
    english: "stations reachable"
  },
  // ── ヒートマップ凡例・LegendRouteList グループ名 ──
  heatmapShowOtherInfo: {
    japanese: "表示内容の切替",
    english: "Change display"
  },
  heatmapRangeFilter: {
    japanese: "範囲内のみ表示",
    english: "Show in-range only"
  },
  heatmapGradientLow: {
    japanese: "低",
    english: "Low"
  },
  heatmapGradientHigh: {
    japanese: "高",
    english: "High"
  },
  heatmapDisplayParam: {
    japanese: "表示パラメータ",
    english: "Parameter"
  },
  heatmapMethodology: {
    japanese: "集計方法",
    english: "Method"
  },
  heatmapPeriod: {
    japanese: "基準時点",
    english: "Reference date"
  },
  heatmapRadius: {
    japanese: "範囲",
    english: "Radius"
  },
  heatmapHigherIsBetter: {
    japanese: "高いほど 赤",
    english: "Higher = red"
  },
  heatmapLowerIsBetter: {
    japanese: "低いほど 赤（値が高いほど課題あり）",
    english: "Lower = red (higher = more issues)"
  },
  heatmapSource: {
    japanese: "参照元",
    english: "Source"
  },
  heatmapRetrievedAt: {
    japanese: "参照日",
    english: "Retrieved"
  },
  heatmapUpdatedAt: {
    japanese: "データ更新",
    english: "Data updated"
  },
  noDataLabel: {
    japanese: "データなし",
    english: "No data"
  },
  travelTimeLabelMode: {
    japanese: "時間表示",
    english: "Time display"
  },
  travelTimeLabelInterval: {
    japanese: "間隔",
    english: "Interval"
  },
  travelTimeLabelCumulative: {
    japanese: "累積",
    english: "Cumulative"
  },
  // ── 設定グループ名 ──
  settingsGroupLabel: {
    japanese: "駅ラベル",
    english: "Station Labels"
  },
  settingsGroupViz: {
    japanese: "データ可視化",
    english: "Visualization"
  },
  settingsGroupFilter: {
    japanese: "駅フィルター",
    english: "Station Filter"
  },
  // 表示設定の中の節。アイコンの大きさ・線の太さ（px）など画面の見た目を変えるので「UI設定」
  settingsGroupMap: {
    japanese: "UI設定",
    english: "UI Settings"
  },
  settingsLabelSize: {
    japanese: "ラベルサイズ",
    english: "Label size"
  },
  settingsIconSize: {
    japanese: "アイコンサイズ",
    english: "Icon size"
  },
  settingsGroupDetail: {
    japanese: "詳細設定",
    english: "Detailed Settings"
  },
  travelTimeStyleTitle: {
    japanese: "所要時間",
    english: "Travel Time"
  },
  stationIconStyleTitle: {
    japanese: "駅アイコン",
    english: "Station Icons"
  },
  styleTextColor: {
    japanese: "文字色",
    english: "Text Color"
  },
  styleBgColor: {
    japanese: "背景色",
    english: "Background Color"
  },
  styleBorderColor: {
    japanese: "枠線色",
    english: "Border Color"
  },
  styleReset: {
    japanese: "既定に戻す",
    english: "Reset to default"
  },
  colorPresetDefault: {
    japanese: "路線色",
    english: "Route Color"
  },
  colorPresetBlack: {
    japanese: "黒",
    english: "Black"
  },
  colorPresetWhite: {
    japanese: "白",
    english: "White"
  },
  // ── 設定保存・読込 ──
  configSaveLoad: {
    japanese: "設定の保存・読込",
    english: "Save / Load Settings"
  },
  configExportDesc: {
    japanese: "エクスポート（現在の表示設定）",
    english: "Export (current display settings)"
  },
  configExportSave: {
    japanese: "JSON保存",
    english: "Save JSON"
  },
  configExportCopy: {
    japanese: "テキストコピー",
    english: "Copy Text"
  },
  configExportCopied: {
    japanese: "コピー済み",
    english: "Copied"
  },
  configImportDesc: {
    japanese: "インポート（設定を読み込む）",
    english: "Import (load settings)"
  },
  configImportFile: {
    japanese: "JSONファイルを開く",
    english: "Open JSON file"
  },
  configImportPaste: {
    japanese: "JSONテキストをここに貼り付け...",
    english: "Paste JSON text here..."
  },
  configImportApply: {
    japanese: "テキストから適用",
    english: "Apply from text"
  },
  configImportDone: {
    japanese: "適用済み",
    english: "Applied"
  },
  configImportErrorJson: {
    japanese: "JSONの形式が正しくありません",
    english: "Invalid JSON format"
  },
  configImportErrorFile: {
    japanese: "ファイルの読み込みに失敗しました",
    english: "Failed to read file"
  },
  configImportErrorApply: {
    japanese: "設定の適用に失敗しました",
    english: "Failed to apply settings"
  },
  transferHighlight: {
    japanese: "乗換駅強調表示",
    english: "Highlight Transfer Stations"
  },
  routeLineWidth: {
    japanese: "路線の太さ",
    english: "Line Width"
  },
  bubbleMaxRadius: {
    japanese: "最大半径",
    english: "Max Radius"
  },
  schematicMapLabel: {
    japanese: "路線図表示（実装中）",
    english: "Diagram View (WIP)"
  },
  layerOrderHint: {
    japanese: "↑ 最前面 / 背面 ↓",
    english: "↑ Front / Back ↓"
  },
  dragToSort: {
    japanese: "⠿ でドラッグ",
    english: "⠿ drag"
  },
  catHousing: {
    japanese: "住居",
    english: "Housing"
  },
  catTransport: {
    japanese: "交通",
    english: "Transport"
  },
  catFood: {
    japanese: "飲食",
    english: "Food"
  },
  catConvenience: {
    japanese: "利便性",
    english: "Convenience"
  },
  catSafety: {
    japanese: "治安",
    english: "Safety"
  },
  catEnvironment: {
    japanese: "環境",
    english: "Environment"
  },
  catWork: {
    japanese: "仕事",
    english: "Work"
  },

  // 現在地からの路線検出パネル (TrainStatusPanel)
  detectingRoute: {
    japanese: "路線を検出中",
    english: "Detecting route..."
  },
  manualSetRoute: {
    japanese: "手動設定",
    english: "Manual"
  },
  selectRouteTitle: {
    japanese: "路線を選択",
    english: "Select route"
  },
  searchRoutePlaceholder: {
    japanese: "路線名を検索...",
    english: "Search route name..."
  },
  manualBadge: {
    japanese: "手動",
    english: "Manual"
  },
  currentStationLabel: {
    japanese: "現在の駅",
    english: "Current station"
  },
  stoppedLabel: {
    japanese: "停車中",
    english: "Stopped"
  },
  nextStationLabel: {
    japanese: "次の駅",
    english: "Next station"
  },
  flipDirectionTitle: {
    japanese: "方向を逆転",
    english: "Reverse direction"
  },
  flipDirection: {
    japanese: "方向反転",
    english: "Flip"
  },
  changeRoute: {
    japanese: "路線変更",
    english: "Change route"
  },
  resetToAutoDetect: {
    japanese: "自動検出に戻す",
    english: "Back to auto-detect"
  },
  boundForStation: {
    japanese: "{station}方面",
    english: "Bound for {station}"
  },
  approxMinutesLabel: {
    japanese: "約 {minutes} 分",
    english: "approx. {minutes} min"
  }
};

export type Language = 'japanese' | 'english' | 'chinese' | 'korean';

// 中国語（簡体字）UI翻訳
export const uiChinese: Record<string, string> = {
  clearSelection: "清除选择",
  decrease: "缩小",
  play: "播放",
  pause: "暂停",
  increase: "放大",
  collapseList: "折叠",
  showMoreRoutes: "显示其他 {count} 条线路",
  routeViewBoard: "面板",
  routeViewClassic: "列表",
  routeSearchPlaceholder: "搜索线路名称",
  routeGroupOnRoute: "路线上的线路",
  routeGroupAtStation: "经过所选车站的线路",
  routeGroupVisible: "显示中",
  routeGroupHidden: "已隐藏",
  routeShowMore: "再显示{count}条",
  routeNoMatch: "没有符合的线路",
  routeVisibleSummary: "已显示 {shown} / {total} 条线路",
  memoTitle: "多个车站的共同线路",
  memoDescription: "记下每个人最近的车站，就能看出大家都能乘坐的线路。仅保存在本设备。",
  memoPersonPlaceholder: "姓名",
  memoStationPlaceholder: "最近车站",
  memoNotePlaceholder: "备注（可选）",
  memoAdd: "添加",
  memoRemove: "删除",
  memoSearchPlaceholder: "按姓名、车站或线路筛选",
  memoEmpty: "还没有登记任何人",
  memoNoMatch: "没有符合的人",
  memoUnknownStation: "线路数据中没有这个车站",
  memoCount: "{count}人",
  memoSharedRoutes: "共同线路",
  memoEveryone: "全员",
  memoSharedCount: "{count} / {total}人",
  memoNoShared: "没有全员都能使用的线路",
  memoShowEveryone: "在地图上显示全员的线路",
  memoShowShared: "在地图上显示这些线路",
  memoUseAsDeparture: "设为出发地",
  stationSelection: "选择出发站和到达站",
  departureStation: "出发站",
  arrivalStation: "到达站",
  stationPlaceholder: "输入站名",
  swapStations: "⇄ 交换",
  majorStationsHint: "主要车站: 东京、新宿、涩谷、池袋、横滨、新横滨",
  noStationFound: "未找到匹配的车站",
  recommendedRoutes: "推荐路线",
  showAllRoutes: "显示全部路线",
  displayOnMap: "在地图上显示",
  displayingOnMap: "地图显示中",
  noTransfer: "直达",
  oneTransfer: "换乘1次",
  transfers: "换乘{count}次",
  minutes: "{minutes}分钟",
  hours: "{hours}小时{minutes}分钟",
  hoursOnly: "{hours}小时",
  walkingTransfer: "步行换乘",
  transfer: "换乘",
  via: "经由",
  routeToggle: "路线显示切换",
  routeDisplayToggle: "路线显示切换",
  showOnlyTransferStations: "仅显示换乘站",
  showOnlyExpressStations: "仅显示特快站",
  showTravelTimes: "显示所需时间",
  showStationNames: "显示站名",
  mapDisplayMode: "地图显示模式",
  realisticView: "实际路线图",
  schematicView: "路线图风格（准备中）",
  timeFilter: "时间过滤",
  accessibleStations: "仅显示从出发站{minutes}分钟内的站",
  routeNumber: "路线 {number}",
  selectedStatus: "（选择中）",
  displayOnMapActive: "地图显示中",
  displayOnMapButton: "在地图上显示",
  routeDetails: "路线详情",
  transferInfo: "换乘信息",
  walkingTransferShort: "步行",
  transferShort: "换乘",
  throughShort: "直通",
  direction: "前往{destination}",
  directionArea: "前往{destination}方向",
  viaStations: "经由",
  addWaypoint: "添加途经站",
  otherStations: "其他{count}站",
  noRoutesFound: "未找到路线",
  routeCount: "{count}条路线",
  setDepartureStation: "设为出发站",
  setArrivalStation: "设为到达站",
  routeRecommendationCount: "推荐路线数:",
  routeSwitchNote: "※请从右上角图例切换路线和换乘站显示",
  baseStation: "基准站:",
  pleaseSetDeparture: "请设置出发站",
  stationsCount: "（{count}站）",
  currentStationSettings: "当前站设置",
  departureStationLabel: "出发站:",
  arrivalStationLabel: "到达站:",
  minutesShort: "{time}分钟",
  transfersCount: "换乘{count}次",
  displayedRoutes: "显示路线切换",
  allShow: "全部显示",
  allHide: "全部隐藏",
  legendDeparture: "S{station}",
  legendArrival: "G{station}",
  routeSelection: "推荐路线选择",
  showAllRoutesLabel: "显示全部路线",
  uiVersionBetaLabel: "试用新设计 (Beta)",
  uiVersionBackLabel: "返回旧版设计",
  multiDepartureTitle: "多个出发站",
  addDepartureButton: "添加出发站",
  removeDepartureLabel: "删除此出发站",
  focusThisDeparture: "设为主出发站",
  copyrightText: COPYRIGHT_TEXT,
  dataSourceText: "站点数据为原创或使用开放数据。",
  disclaimerText: "本服务为非官方服务，与各铁路公司无关。",
  accuracyText: "提供的信息仅供参考。请查看官方网站获取准确的运行信息。",
  madeWithText: "Made with Claude Code",
  departure: "出发",
  arrival: "到达",
  route: "路线",
  selected: "已选择",
  clickToToggleVisibility: "点击切换显示/隐藏",
  recommendedRoute: "推荐路线",
  showFurigana: "显示假名注音",
  currentLocationFrom: "附近",
  swapStationsTitle: "交换出发站和到达站",
  departureTime: "出发时间",
  currentTime: "当前时间",
  baseTime: "出发时间",
  arrivalTimeLabel: "到达时间",
  timeBasisDeparture: "出发",
  timeBasisArrival: "到达",
  show: "显示",
  hide: "隐藏",
  lastUpdated: "最后更新",
  alwaysShowMajorStations: "始终显示主要车站",
  arrivalAlert: "到站提醒",
  arrivalAlertTiming: "提醒时机:",
  arrivalAlertMinutesOption: "约{count}分钟前",
  arrivalAlertNote: "根据当前位置和实际速度计算剩余时间，不使用时刻表，因此延误时也可参考。",
  minRouteCount: "对象:",
  routeCountOption: "{count}条线路以上",
  dataSource: "来源",
  afterSuffix: "以后",
  firstTrainReached: "首班车",
  showPerRouteStationTimes: "按线路显示时刻",
  visibleRoutesLegendTitle: "显示中的线路",
  moreRoutesCount: "…另外{count}条线路",
  visibleRoutesLegendCount: "{count}条线路",
  reverseDirection: "切换方向",
  reverseDirectionReference: "反方向（参考）",
  offRouteReference: "路线外参考",
  noData: "无数据",
  showAllTimetable: "显示完整时刻表",
  onboardRouteNoData: "乘坐路线，\n无时刻数据",
  noTimetableData: "无时刻数据",
  approximateNote: "概算值·参考用　点击左侧路线名切换",
  timetableEstimatedWarning: "此为推算数据。准确时刻请参阅各铁路公司的官方时刻表。",
  resetNorth: "将北方朝上",
  serviceBrandUenoTokyoLine: "上野东京线",
  serviceBrandShonanShinjukuLine: "湘南新宿线",
  serviceBrandYokosukaSobuRapid: "横须贺・总武快速线",
  serviceTerminiLabel: "主要始发・终点",
  heatmapDataLabel: "热力图数据",
  showTrainStatusPanel: "显示乘车路线",
  locationDenied: "未允许获取位置信息",
  locationUnavailable: "无法获取当前位置",
  retryLocation: "重试",
  useLocationFeatures: "根据当前位置自动设置出发站",
  moreItemsCount: "+{count}项",
  towardSuffix: "方向",
  loadingMap: "地图加载中...",
  appLoadingStart: "正在加载…",
  appLoadingRoutes: "正在准备线路图…",
  appLoadingMap: "正在显示地图…",
  maxTime: "最大时间:",
  timetableModeOff: "关闭时刻表模式",
  timetableModeOn: "开启时刻表模式",
  exitFullscreen: "缩小显示",
  enterFullscreen: "全屏显示",
  refreshLocationNow: "立即更新位置",
  stopTracking: "关闭位置追踪",
  showMyLocation: "显示我的位置",
  fromWhere: "从哪里",
  firstTrain: "始发",
  lastStation: "终点",
  displaySettings: "显示设置",
  selectStationsPrompt: "请选择出发站和到达站搜索路线",
  departsLabel: "发",
  arrivesLabel: "到",
  approxMinutes: "约{time}分钟",
  close: "关闭",
  timetableButton: "时刻表",
  showStationTimeLabelsButton: "显示时刻",
  departsAfterLabel: "{station} {time}以后出发（{route}）",
  noTimetableDataFound: "未找到时刻数据",
  timetableUpdatedAt: "更新日: {date}",
  timetableDisclaimerNote: "请查看官方时刻表确认准确时间",
  towardDirection: "（前往{direction}方向）",
  darkMode: "深色模式",
  lightMode: "浅色模式",
  switchToDarkMode: "切换至深色模式",
  switchToLightMode: "切换至浅色模式",
  mapErrorTitle: "地图加载出错",
  mapErrorMessage: "请重新加载页面。",
  errorDetails: "详情",
  reloadButton: "重新加载",
  schematicMapHint: "点击: 设置出发站 | Shift+点击: 设置到达站",
  noDataForStation: "该站暂无数据",
  showStationCodes: "显示站编码",
  stationHeatmap: "车站统计热力图",
  showOutsideSegmentRoutes: "显示区间外路线",
  showMapTiles: "显示地图图块",
  showFullRouteStations: "显示所有途经站",
  showRouteRecommendationsPanel: "显示推荐路线选择",
  showRouteLines: "显示路线",
  stationTooltipLabel: "显示站点提示",
  bubbleMap: "气泡地图",
  bubbleCircle: "● 圆形",
  bubbleSquare: "■ 方形",
  trainDemoLabel: "列车演示",
  sortLabel: "排序:",
  sortAlpha: "A-Z",
  sortColor: "颜色",
  sortNearby: "近距离",
  sortDefault: "默认",
  hideThisRoute: "隐藏该路线",
  showThisRoute: "显示该路线",
  stationSettings: "站点设置",
  detailSettings: "显示切换",
  minutesSuffix: "分钟",
  geolocationNotSupported: "此浏览器不支持定位功能。",
  aboutSiteTitle: "关于本站",
  menuTitle: "菜单",
  openMenuLabel: "打开菜单",
  appTitle: "弹性路线图",
  appTagline: "只显示所需路线的简洁路线图",
  aboutLink: "关于本站",
  faqLink: "常见问题",
  privacyLink: "隐私政策",
  termsLink: "使用条款",
  contactLink: "联系我们",
  approxNote: "（概算值·参考用）",
  cookieUsage: "Cookie 使用说明",
  cookieBannerIntro: "本网站为提升服务并投放广告，会使用基于使用情况的Cookie。详情请查看",
  cookieBannerIntroSuffix: "。",
  cookieAcceptAll: "全部同意",
  cookieManageSettings: "管理设置",
  cookieEssentialOnly: "仅必要项",
  cookieSettingsTitle: "Cookie 设置",
  cookieNecessaryTitle: "必要 Cookie",
  cookieNecessaryDesc: "网站基本功能所需的Cookie（主题设置、语言设置等）",
  cookieAnalyticsTitle: "分析 Cookie",
  cookieAnalyticsDesc: "用于Google Analytics分析网站使用情况",
  cookieAdvertisingTitle: "广告 Cookie",
  cookieAdvertisingDesc: "用于Google AdSense投放合适的广告",
  cookieCancel: "取消",
  cookieSaveSettings: "保存设置",
  allRoutesOn: "全路线: 显示",
  allRoutesOff: "全路线: 隐藏",
  travelTimeOverlay: "在站点显示所需时间",
  calculating: "计算中...",
  reachable: "个站可到达",
  // 新規追加キー
  heatmapShowOtherInfo: "切换显示内容",
  heatmapRangeFilter: "仅显示范围内",
  heatmapGradientLow: "低",
  heatmapGradientHigh: "高",
  heatmapDisplayParam: "显示参数",
  heatmapMethodology: "统计方式",
  heatmapPeriod: "基准时点",
  heatmapRadius: "范围",
  heatmapHigherIsBetter: "越高越红",
  heatmapLowerIsBetter: "越低越红（值越高问题越多）",
  heatmapSource: "参考来源",
  heatmapRetrievedAt: "参考日期",
  heatmapUpdatedAt: "数据更新",
  noDataLabel: "无数据",
  travelTimeLabelMode: "时间显示",
  travelTimeLabelInterval: "区间",
  travelTimeLabelCumulative: "累计",
  settingsGroupLabel: "站点标签",
  settingsGroupViz: "数据可视化",
  settingsGroupFilter: "站点筛选",
  settingsGroupMap: "界面设置",
  settingsLabelSize: "标签大小",
  settingsIconSize: "图标大小",
  settingsGroupDetail: "详细设置",
  travelTimeStyleTitle: "所需时间",
  stationIconStyleTitle: "车站图标",
  styleTextColor: "文字颜色",
  styleBgColor: "背景颜色",
  styleBorderColor: "边框颜色",
  styleReset: "恢复默认",
  colorPresetDefault: "线路颜色",
  colorPresetBlack: "黑色",
  colorPresetWhite: "白色",
  configSaveLoad: "保存·读取设置",
  configExportDesc: "导出（当前显示设置）",
  configExportSave: "保存JSON",
  configExportCopy: "复制文本",
  configExportCopied: "已复制",
  configImportDesc: "导入（读取设置）",
  configImportFile: "打开JSON文件",
  configImportPaste: "在此粘贴JSON文本…",
  configImportApply: "从文本应用",
  configImportDone: "已应用",
  configImportErrorJson: "JSON格式不正确",
  configImportErrorFile: "文件读取失败",
  configImportErrorApply: "设置应用失败",
  transferHighlight: "换乘站高亮显示",
  routeLineWidth: "路线宽度",
  bubbleMaxRadius: "最大半径",
  schematicMapLabel: "路线图显示（开发中）",
  layerOrderHint: "↑ 最前面 / 背面 ↓",
  dragToSort: "⠿ 拖动排序",
  catHousing: "住居",
  catTransport: "交通",
  catFood: "饮食",
  catConvenience: "便利性",
  catSafety: "治安",
  catEnvironment: "环境",
  catWork: "工作",

  // 现在地からの路线検出パネル
  detectingRoute: "正在检测路线",
  manualSetRoute: "手动设置",
  selectRouteTitle: "选择路线",
  searchRoutePlaceholder: "搜索路线名...",
  manualBadge: "手动",
  currentStationLabel: "当前车站",
  stoppedLabel: "停车中",
  nextStationLabel: "下一站",
  flipDirectionTitle: "反转方向",
  flipDirection: "反转方向",
  changeRoute: "更改路线",
  resetToAutoDetect: "恢复自动检测",
  boundForStation: "开往{station}方向",
  approxMinutesLabel: "约 {minutes} 分钟",
};

// 韓国語UI翻訳
export const uiKorean: Record<string, string> = {
  clearSelection: "선택 해제",
  decrease: "작게",
  play: "재생",
  pause: "일시정지",
  increase: "크게",
  collapseList: "접기",
  showMoreRoutes: "다른 {count}개 노선 표시",
  routeViewBoard: "보드",
  routeViewClassic: "목록",
  routeSearchPlaceholder: "노선 이름으로 검색",
  routeGroupOnRoute: "경로상의 노선",
  routeGroupAtStation: "선택한 역을 지나는 노선",
  routeGroupVisible: "표시 중",
  routeGroupHidden: "숨김",
  routeShowMore: "{count}개 더 보기",
  routeNoMatch: "일치하는 노선이 없습니다",
  routeVisibleSummary: "{total}개 중 {shown}개 노선 표시 중",
  memoTitle: "여러 역의 공통 노선",
  memoDescription: "누구의 가까운 역이 어디인지 적어 두면 모두가 탈 수 있는 노선을 알 수 있습니다. 이 기기에만 저장됩니다.",
  memoPersonPlaceholder: "이름",
  memoStationPlaceholder: "가까운 역",
  memoNotePlaceholder: "메모 (선택)",
  memoAdd: "추가",
  memoRemove: "삭제",
  memoSearchPlaceholder: "이름·역·노선으로 검색",
  memoEmpty: "아직 등록된 사람이 없습니다",
  memoNoMatch: "일치하는 사람이 없습니다",
  memoUnknownStation: "노선 데이터에 없는 역 이름입니다",
  memoCount: "{count}명",
  memoSharedRoutes: "공통 노선",
  memoEveryone: "전원",
  memoSharedCount: "{total}명 중 {count}명",
  memoNoShared: "전원이 이용할 수 있는 노선이 없습니다",
  memoShowEveryone: "전원의 노선을 지도에 표시",
  memoShowShared: "이 노선들을 지도에 표시",
  memoUseAsDeparture: "출발지로 설정",
  stationSelection: "출발역·도착역 선택",
  departureStation: "출발역",
  arrivalStation: "도착역",
  stationPlaceholder: "역명 입력",
  swapStations: "⇄ 교환",
  majorStationsHint: "주요 역: 도쿄, 신주쿠, 시부야, 이케부쿠로, 요코하마, 신요코하마",
  noStationFound: "해당하는 역이 없습니다",
  recommendedRoutes: "추천 경로",
  showAllRoutes: "전체 경로 표시",
  displayOnMap: "지도에 표시",
  displayingOnMap: "지도 표시 중",
  noTransfer: "직통",
  oneTransfer: "환승 1회",
  transfers: "환승 {count}회",
  minutes: "{minutes}분",
  hours: "{hours}시간 {minutes}분",
  hoursOnly: "{hours}시간",
  walkingTransfer: "도보 환승",
  transfer: "환승",
  via: "경유",
  routeToggle: "노선 표시 전환",
  routeDisplayToggle: "노선 표시 전환",
  showOnlyTransferStations: "환승역만 표시",
  showOnlyExpressStations: "급행역만 표시",
  showTravelTimes: "소요 시간 표시",
  showStationNames: "역명 표시",
  mapDisplayMode: "지도 표시 모드",
  realisticView: "실제 노선도",
  schematicView: "노선도 스타일 (준비 중)",
  timeFilter: "시간 필터",
  accessibleStations: "출발역에서 {minutes}분 이내 역만 표시",
  routeNumber: "경로 {number}",
  selectedStatus: "(선택 중)",
  displayOnMapActive: "지도 표시 중",
  displayOnMapButton: "지도에 표시",
  routeDetails: "노선 상세",
  transferInfo: "환승 안내",
  walkingTransferShort: "도보",
  transferShort: "환승",
  throughShort: "직통",
  direction: "{destination}행",
  directionArea: "{destination} 방면",
  viaStations: "경유",
  addWaypoint: "경유역 추가",
  otherStations: "외 {count}역",
  noRoutesFound: "경로를 찾을 수 없습니다",
  routeCount: "{count}개 경로",
  setDepartureStation: "출발역으로 설정",
  setArrivalStation: "도착역으로 설정",
  routeRecommendationCount: "추천 경로 수:",
  routeSwitchNote: "※오른쪽 위 범례에서 노선 및 환승역 표시 전환",
  baseStation: "기준역:",
  pleaseSetDeparture: "출발역을 설정해 주세요",
  stationsCount: "({count}역)",
  currentStationSettings: "현재 역 설정",
  departureStationLabel: "출발역:",
  arrivalStationLabel: "도착역:",
  minutesShort: "{time}분",
  transfersCount: "환승 {count}회",
  displayedRoutes: "표시 노선 전환",
  allShow: "전체 표시",
  allHide: "전체 숨기기",
  legendDeparture: "S{station}",
  legendArrival: "G{station}",
  routeSelection: "추천 경로 선택",
  showAllRoutesLabel: "전체 경로 표시",
  uiVersionBetaLabel: "새 디자인 체험 (베타)",
  uiVersionBackLabel: "이전 디자인으로 돌아가기",
  multiDepartureTitle: "여러 출발역",
  addDepartureButton: "출발역 추가",
  removeDepartureLabel: "이 출발역 삭제",
  focusThisDeparture: "메인 출발역으로 설정",
  copyrightText: COPYRIGHT_TEXT,
  dataSourceText: "역 데이터는 독자적으로 제작하거나 오픈 데이터를 이용합니다.",
  disclaimerText: "본 서비스는 비공식이며 각 철도 회사와 관계없습니다.",
  accuracyText: "제공하는 정보는 참고용입니다. 정확한 운행 정보는 공식 사이트를 확인하세요.",
  madeWithText: "Made with Claude Code",
  departure: "출발",
  arrival: "도착",
  route: "경로",
  selected: "선택됨",
  clickToToggleVisibility: "클릭으로 표시/숨기기 전환",
  recommendedRoute: "추천 경로",
  showFurigana: "후리가나 표시",
  currentLocationFrom: "현재 위치에서",
  swapStationsTitle: "출발역·도착역 교환",
  departureTime: "출발 시간",
  currentTime: "현재 시간",
  baseTime: "출발 시간",
  arrivalTimeLabel: "도착 시간",
  timeBasisDeparture: "출발",
  timeBasisArrival: "도착",
  show: "표시",
  hide: "숨기기",
  lastUpdated: "최종 갱신",
  alwaysShowMajorStations: "주요 역 항상 표시",
  arrivalAlert: "하차역 알림",
  arrivalAlertTiming: "알림 시점:",
  arrivalAlertMinutesOption: "약 {count}분 전",
  arrivalAlertNote: "시각표가 아니라 현재 위치와 실제 속도로 남은 시간을 계산하므로 지연 시에도 참고할 수 있습니다.",
  minRouteCount: "대상:",
  routeCountOption: "{count}개 노선 이상",
  dataSource: "출처",
  afterSuffix: "이후",
  firstTrainReached: "첫차",
  showPerRouteStationTimes: "노선별 시각 표시",
  visibleRoutesLegendTitle: "표시 중인 노선",
  moreRoutesCount: "…외 {count}개 노선",
  visibleRoutesLegendCount: "{count}개 노선",
  reverseDirection: "방향 전환",
  reverseDirectionReference: "반대 방향(참고)",
  offRouteReference: "경로 외 참고",
  noData: "데이터 없음",
  showAllTimetable: "전체 시간표 표시",
  onboardRouteNoData: "탑승 노선,\n시간표 데이터 없음",
  noTimetableData: "시간표 없음",
  approximateNote: "개산값·참고용　왼쪽 노선명 클릭으로 전환",
  timetableEstimatedWarning: "추정 데이터입니다. 정확한 시각은 각 철도회사의 공식 시각표를 참고해 주세요.",
  resetNorth: "북쪽을 위로",
  serviceBrandUenoTokyoLine: "우에노도쿄 라인",
  serviceBrandShonanShinjukuLine: "쇼난신주쿠 라인",
  serviceBrandYokosukaSobuRapid: "요코스카・소부 쾌속선",
  serviceTerminiLabel: "주요 시발・행선지",
  heatmapDataLabel: "히트맵 데이터",
  showTrainStatusPanel: "탑승 노선 표시",
  locationDenied: "위치 정보가 허용되지 않았습니다",
  locationUnavailable: "현재 위치를 가져올 수 없습니다",
  retryLocation: "다시 시도",
  useLocationFeatures: "현재 위치로 출발역 자동 설정",
  moreItemsCount: "+{count}건",
  towardSuffix: "방면",
  loadingMap: "지도 로딩 중...",
  appLoadingStart: "불러오는 중…",
  appLoadingRoutes: "노선도를 준비하는 중…",
  appLoadingMap: "지도를 표시하는 중…",
  maxTime: "최대 시간:",
  timetableModeOff: "시간표 모드 끄기",
  timetableModeOn: "시간표 모드 켜기",
  exitFullscreen: "화면 축소",
  enterFullscreen: "전체 화면",
  refreshLocationNow: "위치 즉시 업데이트",
  stopTracking: "위치 추적 끄기",
  showMyLocation: "내 위치 표시",
  fromWhere: "어디서",
  firstTrain: "첫차",
  lastStation: "종점",
  displaySettings: "표시 설정",
  selectStationsPrompt: "출발역·도착역을 선택해 경로를 검색하세요",
  departsLabel: "발",
  arrivesLabel: "착",
  approxMinutes: "약 {time}분",
  close: "닫기",
  timetableButton: "시간표",
  showStationTimeLabelsButton: "시간 표시",
  departsAfterLabel: "{station} {time} 이후 출발（{route}）",
  noTimetableDataFound: "시간표 데이터를 찾을 수 없습니다",
  timetableUpdatedAt: "업데이트: {date}",
  timetableDisclaimerNote: "정확한 시간은 공식 시간표를 확인하세요",
  towardDirection: "（{direction} 방면）",
  darkMode: "다크 모드",
  lightMode: "라이트 모드",
  switchToDarkMode: "다크 모드로 전환",
  switchToLightMode: "라이트 모드로 전환",
  mapErrorTitle: "지도 로딩 오류",
  mapErrorMessage: "페이지를 다시 로드해 주세요.",
  errorDetails: "상세",
  reloadButton: "다시 로드",
  schematicMapHint: "클릭: 출발역 설정 | Shift+클릭: 도착역 설정",
  noDataForStation: "이 역의 데이터가 없습니다",
  showStationCodes: "역 코드 표시",
  stationHeatmap: "역 통계 히트맵",
  showOutsideSegmentRoutes: "구간 외 노선 표시",
  showMapTiles: "지도 타일 표시",
  showFullRouteStations: "전체 경유역 표시",
  showRouteRecommendationsPanel: "추천 경로 선택 표시",
  showRouteLines: "노선 표시",
  stationTooltipLabel: "역 툴팁 표시",
  bubbleMap: "버블 맵",
  bubbleCircle: "● 원형",
  bubbleSquare: "■ 사각형",
  trainDemoLabel: "열차 데모",
  sortLabel: "정렬:",
  sortAlpha: "가나다",
  sortColor: "색상",
  sortNearby: "가까운 순",
  sortDefault: "기본",
  hideThisRoute: "이 노선 숨기기",
  showThisRoute: "이 노선 표시",
  stationSettings: "역 설정",
  detailSettings: "표시 전환",
  minutesSuffix: "분",
  geolocationNotSupported: "이 브라우저는 위치 정보를 지원하지 않습니다.",
  aboutSiteTitle: "사이트 소개",
  menuTitle: "메뉴",
  openMenuLabel: "메뉴 열기",
  appTitle: "플렉스 노선도",
  appTagline: "필요한 노선만 표시하는 심플한 노선도",
  aboutLink: "사이트 소개",
  faqLink: "자주 묻는 질문",
  privacyLink: "개인정보처리방침",
  termsLink: "이용약관",
  contactLink: "문의하기",
  approxNote: "（개산값·참고용）",
  cookieUsage: "쿠키 사용 안내",
  cookieBannerIntro: "이 사이트는 서비스 개선 및 광고 게재를 위해 이용 현황 기반 쿠키를 사용합니다. 자세한 내용은",
  cookieBannerIntroSuffix: "를 확인해 주세요.",
  cookieAcceptAll: "모두 동의",
  cookieManageSettings: "설정 관리",
  cookieEssentialOnly: "필수만 허용",
  cookieSettingsTitle: "쿠키 설정",
  cookieNecessaryTitle: "필수 쿠키",
  cookieNecessaryDesc: "사이트 기본 기능에 필요한 쿠키입니다 (테마 설정, 언어 설정 등)",
  cookieAnalyticsTitle: "분석 쿠키",
  cookieAnalyticsDesc: "Google Analytics의 사이트 이용 현황 분석에 사용됩니다",
  cookieAdvertisingTitle: "광고 쿠키",
  cookieAdvertisingDesc: "Google AdSense의 적절한 광고 게재에 사용됩니다",
  cookieCancel: "취소",
  cookieSaveSettings: "설정 저장",
  allRoutesOn: "전체 노선: 표시",
  allRoutesOff: "전체 노선: 숨기기",
  travelTimeOverlay: "역에 소요 시간 표시",
  calculating: "계산 중...",
  reachable: "개 역 도달 가능",
  // 新規追加キー
  heatmapShowOtherInfo: "표시 내용 변경",
  heatmapRangeFilter: "범위 내만 표시",
  heatmapGradientLow: "낮음",
  heatmapGradientHigh: "높음",
  heatmapDisplayParam: "표시 파라미터",
  heatmapMethodology: "집계 방법",
  heatmapPeriod: "기준 시점",
  heatmapRadius: "범위",
  heatmapHigherIsBetter: "높을수록 빨간색",
  heatmapLowerIsBetter: "낮을수록 빨간색（값이 클수록 문제 많음）",
  heatmapSource: "참고 출처",
  heatmapRetrievedAt: "참고 날짜",
  heatmapUpdatedAt: "데이터 업데이트",
  noDataLabel: "데이터 없음",
  travelTimeLabelMode: "시간 표시",
  travelTimeLabelInterval: "구간",
  travelTimeLabelCumulative: "누적",
  settingsGroupLabel: "역 레이블",
  settingsGroupViz: "데이터 시각화",
  settingsGroupFilter: "역 필터",
  settingsGroupMap: "UI 설정",
  settingsLabelSize: "레이블 크기",
  settingsIconSize: "아이콘 크기",
  settingsGroupDetail: "상세 설정",
  travelTimeStyleTitle: "소요 시간",
  stationIconStyleTitle: "역 아이콘",
  styleTextColor: "글자 색",
  styleBgColor: "배경색",
  styleBorderColor: "테두리 색",
  styleReset: "기본값으로",
  colorPresetDefault: "노선 색",
  colorPresetBlack: "검정",
  colorPresetWhite: "흰색",
  configSaveLoad: "설정 저장·불러오기",
  configExportDesc: "내보내기（현재 표시 설정）",
  configExportSave: "JSON 저장",
  configExportCopy: "텍스트 복사",
  configExportCopied: "복사됨",
  configImportDesc: "가져오기（설정 불러오기）",
  configImportFile: "JSON 파일 열기",
  configImportPaste: "여기에 JSON 텍스트 붙여넣기…",
  configImportApply: "텍스트에서 적용",
  configImportDone: "적용됨",
  configImportErrorJson: "JSON 형식이 올바르지 않습니다",
  configImportErrorFile: "파일 읽기 실패",
  configImportErrorApply: "설정 적용 실패",
  transferHighlight: "환승역 강조 표시",
  routeLineWidth: "노선 두께",
  bubbleMaxRadius: "최대 반경",
  schematicMapLabel: "노선도 표시（개발 중）",
  layerOrderHint: "↑ 최전면 / 배면 ↓",
  dragToSort: "⠿ 드래그",
  catHousing: "주거",
  catTransport: "교통",
  catFood: "음식",
  catConvenience: "편의성",
  catSafety: "치안",
  catEnvironment: "환경",
  catWork: "직업",

  // 현재 위치 기반 노선 감지 패널
  detectingRoute: "노선 감지 중",
  manualSetRoute: "수동 설정",
  selectRouteTitle: "노선 선택",
  searchRoutePlaceholder: "노선 이름 검색...",
  manualBadge: "수동",
  currentStationLabel: "현재 역",
  stoppedLabel: "정차 중",
  nextStationLabel: "다음 역",
  flipDirectionTitle: "방향 전환",
  flipDirection: "방향 전환",
  changeRoute: "노선 변경",
  resetToAutoDetect: "자동 감지로 복귀",
  boundForStation: "{station} 방면",
  approxMinutesLabel: "약 {minutes}분",
};

// 翻訳ヘルパー関数
import { stationTranslationsChinese, stationTranslationsKorean } from './stationTranslationsCJK';

export const translateStation = (stationName: string, language: Language): string => {
  if (language === 'japanese') return stationName;
  if (language === 'chinese') return stationTranslationsChinese[stationName] || stationName;
  if (language === 'korean') return stationTranslationsKorean[stationName] || stationTranslations[stationName] || stationName;
  return stationTranslations[stationName] || stationName;
};

export const translateRoute = (routeName: string, language: Language): string => {
  if (language === 'japanese') return routeName;
  if (language === 'chinese' || language === 'korean') return routeTranslations[routeName] || routeName;
  return routeTranslations[routeName] || routeName;
};

export const translateUI = (key: string, language: Language, params?: { [key: string]: string | number }): string => {
  let text: string;
  if (language === 'chinese') {
    text = uiChinese[key] ?? uiTranslations[key]?.english ?? key;
  } else if (language === 'korean') {
    text = uiKorean[key] ?? uiTranslations[key]?.english ?? key;
  } else {
    const translation = uiTranslations[key];
    if (!translation) return key;
    text = translation[language];
  }

  // パラメータ置換
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }

  return text;
};

/** 駅統計パラメータラベルの翻訳マップ */
const statParamLabelMap: Record<string, { english: string; chinese: string; korean: string }> = {
  '路線数':       { english: 'Line count',           chinese: '线路数量',       korean: '노선 수' },
  '家賃(1K)':     { english: 'Rent (1K)',          chinese: '租金(1K)',       korean: '월세(1K)' },
  '家賃(1LDK)':   { english: 'Rent (1LDK)',         chinese: '租金(1LDK)',     korean: '월세(1LDK)' },
  '人口密度':     { english: 'Pop. density',         chinese: '人口密度',       korean: '인구밀도' },
  '乗降客数':     { english: 'Daily passengers',     chinese: '日均客流量',     korean: '일일 이용객' },
  '朝混雑度':     { english: 'Morning congestion',   chinese: '早高峰拥挤度',   korean: '아침 혼잡도' },
  '居酒屋数':     { english: 'Izakaya count',        chinese: '居酒屋数量',     korean: '이자카야 수' },
  '飲食店数':     { english: 'Restaurant count',     chinese: '餐饮店数量',     korean: '음식점 수' },
  'カフェ数':     { english: 'Cafe count',           chinese: '咖啡馆数量',     korean: '카페 수' },
  'コンビニ数':   { english: 'Conv. store count',    chinese: '便利店数量',     korean: '편의점 수' },
  'ラーメン屋数': { english: 'Ramen shop count',     chinese: '拉面店数量',     korean: '라멘 가게 수' },
  '居酒屋・バー数': { english: 'Bar/izakaya count',   chinese: '居酒屋·酒吧数量', korean: '이자카야·바 수' },
  'スーパー数':   { english: 'Supermarket count',    chinese: '超市数量',       korean: '슈퍼마켓 수' },
  '病院・医院数': { english: 'Hospital count',       chinese: '医院数量',       korean: '병원 수' },
  '書店数':       { english: 'Bookstore count',      chinese: '书店数量',       korean: '서점 수' },
  '犯罪件数':     { english: 'Crime count',          chinese: '犯罪件数',       korean: '범죄 건수' },
  '治安スコア':   { english: 'Safety score',         chinese: '治安评分',       korean: '치안 점수' },
  '公園面積':     { english: 'Park area',            chinese: '公园面积',       korean: '공원 면적' },
  '静かさ':       { english: 'Quietness',            chinese: '安静度',         korean: '조용함' },
  '緑地率':       { english: 'Green ratio',          chinese: '绿地率',         korean: '녹지율' },
  'オフィス数':   { english: 'Office count',         chinese: '办公楼数量',     korean: '오피스 수' },
  'コワーキング数': { english: 'Coworking count',    chinese: '共享办公数量',   korean: '코워킹 수' },
  'ファストフード数': { english: 'Fast food count',  chinese: '快餐店数量',     korean: '패스트푸드 수' },
  '商業施設数':   { english: 'Mall count',           chinese: '商业设施数量',   korean: '상업시설 수' },
  '銀行数':       { english: 'Bank count',           chinese: '银行数量',       korean: '은행 수' },
  '郵便局数':     { english: 'Post office count',    chinese: '邮局数量',       korean: '우체국 수' },
  '薬局数':       { english: 'Pharmacy count',       chinese: '药店数量',       korean: '약국 수' },
  '診療所数':     { english: 'Clinic count',         chinese: '诊所数量',       korean: '진료소 수' },
  '保育所・幼稚園数': { english: 'Nursery/kindergarten count', chinese: '幼儿园数量', korean: '보육원・유치원 수' },
  '小中高等学校数': { english: 'School count',       chinese: '中小学数量',     korean: '초중고 학교 수' },
  '大学・短大数': { english: 'University count',     chinese: '大学数量',       korean: '대학 수' },
  '図書館数':     { english: 'Library count',        chinese: '图书馆数量',     korean: '도서관 수' },
  '映画館数':     { english: 'Cinema count',         chinese: '电影院数量',     korean: '영화관 수' },
  'フィットネス施設数': { english: 'Gym count',      chinese: '健身设施数量',   korean: '피트니스 시설 수' },
  '宿泊施設数':   { english: 'Hotel count',          chinese: '住宿设施数量',   korean: '숙박시설 수' },
  '観光資源数':   { english: 'Attraction count',     chinese: '旅游资源数量',   korean: '관광 명소 수' },
  '公園数':       { english: 'Park count',           chinese: '公园数量',       korean: '공원 수' },
};

/** 駅統計パラメータのラベルを翻訳 */
/**
 * 駅統計の単位を翻訳する ("軒" → "" など)。
 * 「軒」「棟」はラベル側に count / 数 が含まれるため、日本語以外では単位を出さない。
 */
const statUnitMap: { [ja: string]: { english: string; chinese: string; korean: string } } = {
  '路線': { english: 'lines', chinese: '条', korean: '개' },
  '軒': { english: '', chinese: '家', korean: '곳' },
  '棟': { english: '', chinese: '栋', korean: '동' },
  '校': { english: '', chinese: '所', korean: '개교' },
  '件': { english: '', chinese: '个', korean: '건' },
  '件/年': { english: '/yr', chinese: '件/年', korean: '건/년' },
  '万円': { english: '10k JPY', chinese: '万日元', korean: '만엔' },
  '人/日': { english: '/day', chinese: '人/日', korean: '명/일' },
  '人/km²': { english: '/km²', chinese: '人/km²', korean: '명/km²' },
};

export const translateStatUnit = (unit: string, language: Language): string => {
  if (language === 'japanese') return unit;
  const t = statUnitMap[unit];
  if (!t) return unit; // m², %, (0-100) など言語非依存のものはそのまま
  if (language === 'chinese') return t.chinese;
  if (language === 'korean') return t.korean;
  return t.english;
};

export const translateStatParamLabel = (label: string, language: Language): string => {
  if (language === 'japanese') return label;
  const t = statParamLabelMap[label];
  if (!t) return label;
  if (language === 'english') return t.english;
  if (language === 'chinese') return t.chinese;
  if (language === 'korean')  return t.korean;
  return label;
};

/** 列車種別を翻訳 ("急行" → "Express" など) */
export const translateTrainType = (type: string, language: Language): string => {
  if (language === 'japanese') return type;
  return translateStation(type, language);
};

/** "X番線" 形式の番線文字列を翻訳 */
export const translatePlatform = (platform: string, language: Language): string => {
  if (language === 'japanese') return platform;
  const match = platform.match(/^(\d+)番線$/);
  if (!match) return platform;
  const n = match[1];
  if (language === 'chinese') return `${n}号站台`;
  if (language === 'korean') return `${n}번 승강장`;
  return `Track ${n}`;
};

/**
 * "品川・渋谷方面" や "小田原行き" のような行き先・方面文字列を翻訳。
 * "方面" / "行き" を除いて "・" 区切りの各部分を translateStation に通す。
 */
export const translateDestination = (dest: string, language: Language): string => {
  if (language === 'japanese') return dest;
  const hasMoment = dest.endsWith('方面');
  const hasIki = dest.endsWith('行き');
  const core = hasMoment ? dest.slice(0, -2) : hasIki ? dest.slice(0, -2) : dest;
  const parts = core.split('・').map(p => translateStation(p.trim(), language));
  const joined = parts.join(' · ');
  if (hasMoment) {
    if (language === 'chinese') return `${joined}方向`;
    if (language === 'korean') return `${joined} 방면`;
    return `toward ${joined}`;
  }
  if (hasIki) {
    if (language === 'chinese') return `开往${joined}`;
    if (language === 'korean') return `${joined}행`;
    return `for ${joined}`;
  }
  return joined;
};