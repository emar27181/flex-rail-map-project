// 駅名翻訳辞書
export const stationTranslations: { [key: string]: string } = {
  // 山手線
  "東京": "Tokyo",
  "神田": "Kanda",
  "秋葉原": "Akihabara",
  "御徒町": "Okachimachi",
  "上野": "Ueno",
  "鶯谷": "Uguisudani",
  "日暮里": "Nippori",
  "西日暮里": "Nishi-Nippori",
  "田端": "Tabata",
  "駒込": "Komagome",
  "巣鴨": "Sugamo",
  "大塚": "Otsuka",
  "池袋": "Ikebukuro",
  "目白": "Mejiro",
  "高田馬場": "Takadanobaba",
  "新大久保": "Shin-Okubo",
  "新宿": "Shinjuku",
  "代々木": "Yoyogi",
  "原宿": "Harajuku",
  "渋谷": "Shibuya",
  "恵比寿": "Ebisu",
  "目黒": "Meguro",
  "五反田": "Gotanda",
  "大崎": "Osaki",
  "品川": "Shinagawa",
  "高輪ゲートウェイ": "Takanawa Gateway",
  "田町": "Tamachi",
  "浜松町": "Hamamatsucho",
  "新橋": "Shimbashi",
  "有楽町": "Yurakucho",

  // 主要駅
  "横浜": "Yokohama",
  "新横浜": "Shin-Yokohama",
  "川崎": "Kawasaki",
  "大宮": "Omiya",
  "立川": "Tachikawa",
  "八王子": "Hachioji",
  "町田": "Machida",
  "津田沼": "Tsudanuma",
  "千葉": "Chiba",
  "船橋": "Funabashi",
  "柏": "Kashiwa",
  "松戸": "Matsudo",
  "北千住": "Kita-Senju",
  "錦糸町": "Kinshicho",
  "銀座": "Ginza",
  "表参道": "Omotesando",
  "六本木": "Roppongi",
  "赤坂見附": "Akasaka-mitsuke",
  "四ツ谷": "Yotsuya",
  "市ヶ谷": "Ichigaya",
  "飯田橋": "Iidabashi",
  "水道橋": "Suidobashi",
  "御茶ノ水": "Ochanomizu",
  "大手町": "Otemachi",
  "日本橋": "Nihombashi",
  "京橋": "Kyobashi",

  // 地下鉄駅
  "赤坂": "Akasaka",
  "青山一丁目": "Aoyama-itchome",
  "浅草": "Asakusa",
  "押上": "Oshiage",
  "王子": "Oji",
  "後楽園": "Korakuen",
  "東新宿": "Higashi-Shinjuku",
  "九段下": "Kudanshita",
  "本郷三丁目": "Hongo-sanchome",
  "湯島": "Yushima",
  "上野広小路": "Ueno-hirokoji",
  "仲御徒町": "Naka-okachimachi",
  "新御茶ノ水": "Shin-ochanomizu",
  "淡路町": "Awaji-cho",
  "小川町": "Ogawa-cho",
  "神保町": "Jimbocho",
  "二重橋前": "Nijubashi-mae",
  "霞ヶ関": "Kasumigaseki",
  "国会議事堂前": "Kokkai-gijidomae",
  "永田町": "Nagatacho",
  "溜池山王": "Tameike-sanno",
  "虎ノ門": "Toranomon",
  "人形町": "Ningyocho",
  "茅場町": "Kayabacho",
  "八丁堀": "Hatchobori",
  "新富町": "Shintomicho",
  "門前仲町": "Monzen-nakacho",
  "木場": "Kiba",
  "東陽町": "Toyocho",
  "南砂町": "Minami-sunamachi",
  "西葛西": "Nishi-kasai",
  "葛西": "Kasai",
  "浦安": "Urayasu",
  "南行徳": "Minami-gyotoku",
  "行徳": "Gyotoku",
  "妙典": "Myoden",
  "原木中山": "Baraki-nakayama",
  "築地": "Tsukiji",
  "東銀座": "Higashi-ginza",
  "築地市場": "Tsukiji-shijo",
  "勝どき": "Kachidoki",
  "月島": "Tsukishima",
  "豊洲": "Toyosu",
  "新木場": "Shin-kiba",

  // 私鉄・その他の駅
  "西船橋": "Nishi-Funabashi",
  "中野": "Nakano",
  "高円寺": "Koenji",
  "阿佐ヶ谷": "Asagaya",
  "荻窪": "Ogikubo",
  "西荻窪": "Nishi-Ogikubo",
  "吉祥寺": "Kichijoji",
  "三鷹": "Mitaka",
  "武蔵境": "Musashi-sakai",
  "東小金井": "Higashi-koganei",
  "武蔵小金井": "Musashi-koganei",
  "国分寺": "Kokubunji",
  "西国分寺": "Nishi-kokubunji",
  "国立": "Kunitachi",
  "日野": "Hino",
  "豊田": "Toyota",
  "八王子": "Hachioji",
  "高尾": "Takao",
  "大森": "Omori",
  "蒲田": "Kamata",
  "鶴見": "Tsurumi",
  "新子安": "Shin-koyasu",
  "東神奈川": "Higashi-kanagawa",
  "保土ケ谷": "Hodogaya",
  "東戸塚": "Higashi-totsuka",
  "戸塚": "Totsuka",
  "大船": "Ofuna",
  "藤沢": "Fujisawa",
  "辻堂": "Tsujido",
  "茅ケ崎": "Chigasaki",
  "平塚": "Hiratsuka",
  "大磯": "Oiso",
  "二宮": "Ninomiya",
  "国府津": "Kozu",
  "鴨宮": "Kamonomiya",
  "小田原": "Odawara",

  // その他主要駅（必要に応じて追加）
  "成田空港": "Narita Airport",
  "羽田空港": "Haneda Airport",
  "お台場海浜公園": "Odaiba-kaihin-koen",
  "国際展示場": "Kokusai-tenjijo",
  "テレコムセンター": "Telecom Center",
  "青海": "Aomi",
  "東京ビッグサイト": "Tokyo Big Sight",
  "有明": "Ariake",
  "新豊洲": "Shin-toyosu",
  "市場前": "Shijo-mae",
  "ゆりかもめ": "Yurikamome",

  // ユーザー指摘の優先駅名
  "新宿三丁目": "Shinjuku-sanchome",
  "三軒茶屋": "Sangenjaya",
  "平和台": "Heidai",

  // 高頻度使用駅（4路線以上）
  "あざみ野": "Azamino",
  "中央林間": "Chuo-rinkan",
  "赤羽": "Akabane",

  // 主要乗換駅（3路線）
  "さいたま新都心": "Saitama-shintoshin",
  "二子玉川": "Futako-tamagawa",
  "南千住": "Minami-senju",
  "和光市": "Wakoshi",
  "日比谷": "Hibiya",
  "神奈川": "Kanagawa",
  "鷺沼": "Saginuma",

  // 重要乗換駅（2路線）
  "三田": "Mita",
  "三越前": "Mitsukoshi-mae",
  "中井": "Nakai",
  "中目黒": "Naka-meguro",
  "中野坂上": "Nakano-sakaue",
  "代々木上原": "Yoyogi-uehara",
  "住吉": "Sumiyoshi",
  "分倍河原": "Bubaigawara",
  "千川": "Senkawa",
  "南林間": "Minami-rinkan",
  "南流山": "Minami-nagareyama",
  "南浦和": "Minami-urawa",
  "地下鉄成増": "Chikatetsu-narimasu",
  "地下鉄赤塚": "Chikatetsu-akatsuka",
  "大和": "Yamato",
  "大門": "Daimon",
  "天王洲アイル": "Tennozu Isle",
  "宮前平": "Miyamaedaira",
  "宮崎台": "Miyazakidai",
  "小竹向原": "Kotake-mukaihara",
  "川口": "Kawaguchi",
  "府中本町": "Fuchu-homcho",
  "所沢": "Tokorozawa",
  "新宿西口": "Shinjuku-nishiguchi",
  "新御徒町": "Shin-okachimachi",
  "明治神宮前": "Meiji-jingumae",
  "春日": "Kasuga",
  "本八幡": "Motoyawata",
  "桜新町": "Sakura-shinmachi",
  "桜木町": "Sakuragicho",
  "梶が谷": "Kajigaya",
  "森下": "Morishita",
  "武蔵小杉": "Musashi-kosugi",
  "氷川台": "Hikawadai",
  "汐留": "Shiodome",
  "江田": "Eda",
  "浦和": "Urawa",
  "清澄白河": "Kiyosumi-shirakawa",
  "湘南台": "Shonandai",
  "溝の口": "Mizonokuchi",
  "片倉": "Katakura",
  "用賀": "Yoga",
  "町屋": "Machiya",
  "登戸": "Noborito",
  "白金台": "Shirokanedai",
  "白金高輪": "Shirokane-takanawa",
  "相模大野": "Sagami-ono",
  "練馬": "Nerima",
  "菊名": "Kikuna",
  "蔵前": "Kuramae",
  "蕨": "Warabi",
  "藤が丘": "Fujigaoka",
  "西川口": "Nishi-kawaguchi",
  "要町": "Kanamecho",
  "長津田": "Nagatsuta",
  "関内": "Kannai",
  "青葉台": "Aobadai",
  "駒沢大学": "Komazawa-daigaku",
  "鶴間": "Tsuruma",
  "麻布十番": "Azabu-juban",

  // その他重要駅名
  "九品仏": "Kuhombutsu",
  "代官山": "Daikanyama",
  "恵比寿": "Ebisu",
  "中延": "Nakanoshin",
  "学芸大学": "Gakugei-daigaku",
  "祐天寺": "Yutenji",
  "都立大学": "Toritsu-daigaku",
  "自由が丘": "Jiyugaoka",
  "田園調布": "Den-en-chofu",
  "多摩川": "Tamagawa",
  "武蔵新田": "Musashi-nitta",
  "下丸子": "Shimomaruko",
  "沼部": "Numabe",
  "鵜の木": "Unoki",
  "久が原": "Kugahara",
  "池上": "Ikegami",
  "旗の台": "Hatanodai",
  "荏原中延": "Ebara-nakanoshin",
  "戸越": "Togoshi",
  "中延": "Nakanoshin",
  "西大井": "Nishi-oi",
  "大井町": "Oi-machi",
  "立会川": "Tachiaikawa",
  "大森海岸": "Omori-kaigan",
  "平和島": "Heiwajima",
  "流通センター": "Ryutsu Center",
  "昭和島": "Showajima",
  "整備場": "Seibi-jo",
  "天空橋": "Tenkubashi",
  "羽田空港国内線ターミナル": "Haneda Airport Terminal 1",
  "羽田空港国際線ターミナル": "Haneda Airport Terminal 3",
  "新木場": "Shin-kiba",
  "大崎": "Osaki",
  "五反田": "Gotanda",
  "目黒": "Meguro",
  "不動前": "Fudomae",
  "武蔵小山": "Musashi-koyama",
  "西小山": "Nishi-koyama",
  "荏原町": "Ebara-machi",
  "旗の台": "Hatanodai",
  "荏原中延": "Ebara-nakanoshin",
  "戸越銀座": "Togoshi-ginza",
  "青物横丁": "Aomono-yokocho",
  "鮫洲": "Samezu",
  "立会川": "Tachiaikawa",
  "大森": "Omori",
  "梅屋敷": "Umeyashiki",
  "京急蒲田": "Keikyu-kamata",
  "糀谷": "Kojiya",
  "大鳥居": "Otorii",
  "穴守稲荷": "Anamori-inari",
  "天空橋": "Tenkubashi",
  "羽田空港第1・第2ターミナル": "Haneda Airport Terminal 1&2",
  "羽田空港第3ターミナル": "Haneda Airport Terminal 3",
  "京急川崎": "Keikyu-kawasaki",
  "港町": "Minatomachi",
  "鶴見市場": "Tsurumi-ichiba",
  "京急鶴見": "Keikyu-tsurumi",
  "花月園前": "Kagetsu-en-mae",
  "生麦": "Namamugi",
  "京急新子安": "Keikyu-shin-koyasu",
  "子安": "Koyasu",
  "神奈川新町": "Kanagawa-shinmachi",
  "仲木戸": "Nakakido",
  "神奈川": "Kanagawa",
  "横浜": "Yokohama",
  "戸部": "Tobe",
  "平沼橋": "Hiranuma-bashi",
  "西横浜": "Nishi-yokohama",
  "天王町": "Tennocho",
  "星川": "Hoshikawa",
  "和田町": "Wadamachi",
  "上星川": "Kami-hoshikawa",
  "西谷": "Nishiya",
  "鶴ヶ峰": "Tsurugamine",
  "二俣川": "Futamatagawa",
  "希望ヶ丘": "Kibogaoka",
  "三ツ境": "Mitsukyo",
  "瀬谷": "Seya",
  "大和": "Yamato",
  "相模大塚": "Sagami-otsuka",
  "さがみ野": "Sagamino",
  "かしわ台": "Kashiwadai",
  "海老名": "Ebina",
  "厚木": "Atsugi",
  "本厚木": "Hon-atsugi",
  "愛甲石田": "Aikoisihida",
  "伊勢原": "Isehara",
  "鶴巻温泉": "Tsurumaki-onsen",
  "東海大学前": "Tokai-daigaku-mae",
  "秦野": "Hadano",
  "渋沢": "Shibusawa",
  "新松田": "Shin-matsuda",
  "開成": "Kaisei",
  "栢山": "Kayama",
  "富水": "Tomizu",
  "螢田": "Hotaruda",
  "足柄": "Ashigara",
  "小田原": "Odawara",

  // JR各線と地下鉄の主要駅
  "亀有": "Kameari",
  "金町": "Kanamachi",
  "新小岩": "Shin-koiwa",
  "小岩": "Koiwa",
  "市川": "Ichikawa",
  "本八幡": "Motoyawata",
  "下総中山": "Shimosa-nakayama",
  "西船橋": "Nishi-funabashi",
  "船橋法典": "Funabashi-hoten",
  "南船橋": "Minami-funabashi",
  "新習志野": "Shin-narashino",
  "海浜幕張": "Kaihin-makuhari",
  "検見川浜": "Kemigawa-hama",
  "稲毛海岸": "Inage-kaigan",
  "千葉みなと": "Chiba-minato",
  "蘇我": "Soga",
  "浜野": "Hamano",
  "八幡宿": "Yawata-shuku",
  "五井": "Goi",
  "姉ケ崎": "Anegasaki",
  "長浦": "Nagaura",
  "袖ケ浦": "Sodegaura",
  "巌根": "Iwane",
  "木更津": "Kisarazu",
  "君津": "Kimitsu",
  "青堀": "Aohori",
  "大貫": "Onuki",
  "佐貫町": "Sanuki-machi",
  "上総湊": "Kazusa-minato",
  "竹岡": "Takeoka",
  "浜金谷": "Hamakanaya",
  "保田": "Hota",
  "安房勝山": "Awa-katsuyama",
  "岩井": "Iwai",
  "富浦": "Tomiura",
  "那古船形": "Nagofunakata",
  "館山": "Tateyama",
  "九重": "Kokonoe",
  "千倉": "Chikura",
  "千歳": "Chitose",
  "南三原": "Minami-mihara",
  "和田浦": "Wadaura",
  "江見": "Emi",
  "太海": "Futomi",
  "安房天津": "Awa-amatsu",
  "安房小湊": "Awa-kominato",
  "勝浦": "Katsuura",
  "鵜原": "Uhara",
  "上総興津": "Kazusa-okitsu",
  "行川アイランド": "Namegawa Island",
  "安房小湊": "Awa-kominato",

  // 西武線の主要駅
  "西武新宿": "Seibu-shinjuku",
  "高田馬場": "Takadanobaba",
  "下落合": "Shimo-ochiai",
  "中井": "Nakai",
  "新井薬師前": "Araiyakushi-mae",
  "沼袋": "Numabukuro",
  "野方": "Nogata",
  "都立家政": "Toritsu-kasei",
  "鷺ノ宮": "Saginomiya",
  "下井草": "Shimo-igusa",
  "井荻": "Iogi",
  "上井草": "Kami-igusa",
  "上石神井": "Kami-shakujii",
  "武蔵関": "Musashi-seki",
  "東伏見": "Higashi-fushimi",
  "西武柳沢": "Seibu-yagisawa",
  "田無": "Tanashi",
  "花小金井": "Hana-koganei",
  "小平": "Kodaira",
  "久米川": "Kumegawa",
  "東村山": "Higashi-murayama",
  "所沢": "Tokorozawa",
  "航空公園": "Koku-koen",
  "新所沢": "Shin-tokorozawa",
  "入曽": "Iriso",
  "狭山市": "Sayama-shi",
  "新狭山": "Shin-sayama",
  "南大塚": "Minami-otsuka",
  "本川越": "Hon-kawagoe",

  // 京王線の主要駅
  "新宿": "Shinjuku",
  "南新宿": "Minami-shinjuku",
  "参宮橋": "Sangubashi",
  "代々木八幡": "Yoyogi-hachiman",
  "代々木上原": "Yoyogi-uehara",
  "東北沢": "Higashi-kitazawa",
  "下北沢": "Shimo-kitazawa",
  "世田谷代田": "Setagaya-daita",
  "梅ヶ丘": "Umegaoka",
  "豪徳寺": "Gotokuji",
  "経堂": "Kyodo",
  "千歳船橋": "Chitose-funabashi",
  "祖師ヶ谷大蔵": "Soshigaya-okura",
  "成城学園前": "Seijo-gakuen-mae",
  "喜多見": "Kitami",
  "狛江": "Komae",
  "和泉多摩川": "Izumi-tamagawa",
  "登戸": "Noborito",
  "向ヶ丘遊園": "Mukogaoka-yuen",
  "生田": "Ikuta",
  "読売ランド前": "Yomiuri-land-mae",
  "百合ヶ丘": "Yurigaoka",
  "新百合ヶ丘": "Shin-yurigaoka",
  "柿生": "Kakio",
  "鶴川": "Tsurukawa",
  "玉川学園前": "Tamagawa-gakuen-mae",
  "町田": "Machida",
  "相模大野": "Sagami-ono",
  "小田急相模原": "Odakyu-sagamihara",
  "相武台前": "Sobudai-mae",
  "座間": "Zama",
  "海老名": "Ebina"
};

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
  "つくばエクスプレス": "Tsukuba Express"
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
    japanese: "駅名を入力",
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
    japanese: "表示中の路線",
    english: "Displayed Routes"
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

  // Footer text
  copyrightText: {
    japanese: "© 2025 Flex Rail Map Project",
    english: "© 2025 Flex Rail Map Project"
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
  }
};

// 翻訳ヘルパー関数
export const translateStation = (stationName: string, language: 'japanese' | 'english'): string => {
  if (language === 'japanese') return stationName;
  return stationTranslations[stationName] || stationName;
};

export const translateRoute = (routeName: string, language: 'japanese' | 'english'): string => {
  if (language === 'japanese') return routeName;
  return routeTranslations[routeName] || routeName;
};

export const translateUI = (key: string, language: 'japanese' | 'english', params?: { [key: string]: string | number }): string => {
  const translation = uiTranslations[key];
  if (!translation) return key;

  let text = translation[language];

  // パラメータ置換
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }

  return text;
};