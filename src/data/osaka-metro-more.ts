import type { Station } from './yamanote';

// 大阪メトロ 長堀鶴見緑地線: 大正〜門真南
export const osakaChangbori: Station[] = [
  { name: "大正",     lat: 34.663050, lng: 135.480840, timeToNext: 2 },
  { name: "ドーム前千代崎", lat: 34.666230, lng: 135.479170, timeToNext: 2 },
  { name: "西長堀",   lat: 34.671820, lng: 135.491710, timeToNext: 2 },
  { name: "西大橋",   lat: 34.672030, lng: 135.499270, timeToNext: 2 },
  { name: "心斎橋",   lat: 34.673100, lng: 135.502210, timeToNext: 2 },
  { name: "長堀橋",   lat: 34.674070, lng: 135.507090, timeToNext: 2 },
  { name: "松屋町",   lat: 34.674110, lng: 135.517350, timeToNext: 2 },
  { name: "谷町六丁目", lat: 34.672880, lng: 135.516020, timeToNext: 2 },
  { name: "玉造",     lat: 34.673400, lng: 135.527850, timeToNext: 2 },
  { name: "森ノ宮",   lat: 34.681210, lng: 135.529840, timeToNext: 2 },
  { name: "大阪ビジネスパーク", lat: 34.686280, lng: 135.535270, timeToNext: 2 },
  { name: "京橋",     lat: 34.697660, lng: 135.531570, timeToNext: 2 },
  { name: "蒲生四丁目", lat: 34.696290, lng: 135.546390, timeToNext: 2 },
  { name: "今福鶴見",  lat: 34.703050, lng: 135.559430, timeToNext: 2 },
  { name: "横堤",     lat: 34.700810, lng: 135.574270, timeToNext: 2 },
  { name: "鶴見緑地",  lat: 34.695080, lng: 135.585180, timeToNext: 2 },
  { name: "門真南",   lat: 34.741220, lng: 135.583360, timeToNext: 0 },
];

// 大阪メトロ 今里筋線: 井高野〜今里
export const osakaImazatosuji: Station[] = [
  { name: "井高野",   lat: 34.759980, lng: 135.505270, timeToNext: 2 },
  { name: "瑞光四丁目", lat: 34.754550, lng: 135.515700, timeToNext: 2 },
  { name: "だいどう豊里", lat: 34.748310, lng: 135.524810, timeToNext: 2 },
  { name: "太子橋今市", lat: 34.746440, lng: 135.549240, timeToNext: 2 },
  { name: "清水",     lat: 34.744640, lng: 135.555740, timeToNext: 2 },
  { name: "新森古市",  lat: 34.734600, lng: 135.547690, timeToNext: 2 },
  { name: "関目成育",  lat: 34.726950, lng: 135.543070, timeToNext: 2 },
  { name: "蒲生四丁目", lat: 34.696290, lng: 135.546390, timeToNext: 2 },
  { name: "緑橋",     lat: 34.683560, lng: 135.543320, timeToNext: 2 },
  { name: "今里",     lat: 34.665960, lng: 135.546210, timeToNext: 0 },
];

// 阪急宝塚線: 大阪梅田〜宝塚
export const hankyuTakarazukaLine: Station[] = [
  { name: "大阪梅田",  lat: 34.705820, lng: 135.497110, timeToNext: 2 },
  { name: "中津",     lat: 34.710290, lng: 135.499290, timeToNext: 2 },
  { name: "十三",     lat: 34.722650, lng: 135.471360, timeToNext: 4 },
  { name: "三国",     lat: 34.743890, lng: 135.451010, timeToNext: 2 },
  { name: "庄内",     lat: 34.749960, lng: 135.443210, timeToNext: 2 },
  { name: "服部天神",  lat: 34.762040, lng: 135.430020, timeToNext: 2 },
  { name: "曽根",     lat: 34.774990, lng: 135.417980, timeToNext: 2 },
  { name: "岡町",     lat: 34.782850, lng: 135.409080, timeToNext: 2 },
  { name: "豊中",     lat: 34.785410, lng: 135.395350, timeToNext: 3 },
  { name: "蛍池",     lat: 34.803840, lng: 135.415540, timeToNext: 3 },
  { name: "石橋阪大前", lat: 34.820290, lng: 135.429420, timeToNext: 3 },
  { name: "池田",     lat: 34.823960, lng: 135.435120, timeToNext: 4 },
  { name: "川西能勢口", lat: 34.837840, lng: 135.415110, timeToNext: 3 },
  { name: "雲雀丘花屋敷", lat: 34.850340, lng: 135.396670, timeToNext: 3 },
  { name: "山本",     lat: 34.849030, lng: 135.381800, timeToNext: 3 },
  { name: "中山観音",  lat: 34.834040, lng: 135.369420, timeToNext: 3 },
  { name: "売布神社",  lat: 34.825930, lng: 135.362410, timeToNext: 3 },
  { name: "清荒神",   lat: 34.818000, lng: 135.356380, timeToNext: 3 },
  { name: "宝塚",     lat: 34.805040, lng: 135.357800, timeToNext: 0 },
];

// 神戸市営地下鉄 西神・山手線: 新神戸〜西神中央
export const kobeSeishinYamate: Station[] = [
  { name: "新神戸",   lat: 34.700100, lng: 135.194880, timeToNext: 2 },
  { name: "三宮・花時計前", lat: 34.693390, lng: 135.193660, timeToNext: 2 },
  { name: "県庁前",   lat: 34.690060, lng: 135.190880, timeToNext: 2 },
  { name: "大倉山",   lat: 34.682670, lng: 135.173320, timeToNext: 2 },
  { name: "湊川公園",  lat: 34.682880, lng: 135.167270, timeToNext: 2 },
  { name: "上沢",     lat: 34.683890, lng: 135.156700, timeToNext: 2 },
  { name: "長田",     lat: 34.671940, lng: 135.148270, timeToNext: 2 },
  { name: "新長田",   lat: 34.666930, lng: 135.149870, timeToNext: 2 },
  { name: "板宿",     lat: 34.661330, lng: 135.139410, timeToNext: 2 },
  { name: "妙法寺",   lat: 34.653210, lng: 135.126100, timeToNext: 3 },
  { name: "名谷",     lat: 34.648490, lng: 135.098870, timeToNext: 3 },
  { name: "垂水",     lat: 34.624930, lng: 135.068890, timeToNext: 4 },
  { name: "学園都市",  lat: 34.685280, lng: 135.070750, timeToNext: 3 },
  { name: "伊川谷",   lat: 34.706840, lng: 135.059370, timeToNext: 3 },
  { name: "西神南",   lat: 34.721450, lng: 135.045190, timeToNext: 3 },
  { name: "西神中央",  lat: 34.740600, lng: 135.017780, timeToNext: 0 },
];

// 神戸市営地下鉄 海岸線: 三宮・花時計前〜新長田
export const kobeKaigan: Station[] = [
  { name: "三宮・花時計前", lat: 34.693390, lng: 135.193660, timeToNext: 2 },
  { name: "旧居留地・大丸前", lat: 34.688860, lng: 135.189890, timeToNext: 2 },
  { name: "みなと元町",  lat: 34.685260, lng: 135.181330, timeToNext: 2 },
  { name: "ハーバーランド", lat: 34.679120, lng: 135.177240, timeToNext: 2 },
  { name: "中央市場前",  lat: 34.672340, lng: 135.176620, timeToNext: 2 },
  { name: "和田岬",    lat: 34.657370, lng: 135.163720, timeToNext: 2 },
  { name: "苅藻",     lat: 34.659600, lng: 135.156250, timeToNext: 2 },
  { name: "駒ヶ林",   lat: 34.661920, lng: 135.152560, timeToNext: 2 },
  { name: "新長田",   lat: 34.666930, lng: 135.149870, timeToNext: 0 },
];

// 近鉄橿原線: 近鉄京都〜橿原神宮前
export const kintetsuKasharaLine: Station[] = [
  { name: "大和西大寺", lat: 34.694880, lng: 135.784990, timeToNext: 3 },
  { name: "尼ヶ辻",   lat: 34.696640, lng: 135.795480, timeToNext: 3 },
  { name: "西ノ京",   lat: 34.689240, lng: 135.793190, timeToNext: 3 },
  { name: "九条",     lat: 34.679960, lng: 135.791400, timeToNext: 3 },
  { name: "近鉄郡山",  lat: 34.657320, lng: 135.791040, timeToNext: 4 },
  { name: "筒井",     lat: 34.639310, lng: 135.790800, timeToNext: 3 },
  { name: "大和小泉",  lat: 34.648290, lng: 135.741880, timeToNext: 4 },
  { name: "結崎",     lat: 34.623050, lng: 135.754150, timeToNext: 3 },
  { name: "石見",     lat: 34.610100, lng: 135.758380, timeToNext: 3 },
  { name: "田原本",   lat: 34.596100, lng: 135.773900, timeToNext: 3 },
  { name: "笠縫",     lat: 34.581520, lng: 135.784990, timeToNext: 3 },
  { name: "箸尾",     lat: 34.566000, lng: 135.792720, timeToNext: 3 },
  { name: "新ノ口",   lat: 34.542260, lng: 135.792790, timeToNext: 3 },
  { name: "近鉄新庄",  lat: 34.529470, lng: 135.789560, timeToNext: 3 },
  { name: "大和八木",  lat: 34.516900, lng: 135.849790, timeToNext: 4 },
  { name: "八木西口",  lat: 34.517690, lng: 135.848270, timeToNext: 3 },
  { name: "畝傍御陵前", lat: 34.505260, lng: 135.816050, timeToNext: 3 },
  { name: "橿原神宮前", lat: 34.490380, lng: 135.799460, timeToNext: 0 },
];
