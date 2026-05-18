import type { Station } from './yamanote';

// 泉北高速鉄道: 中百舌鳥〜和泉中央
export const sembokuKosokuLine: Station[] = [
  { name: "中百舌鳥",   lat: 34.551860, lng: 135.496180, timeToNext: 4 },
  { name: "深井",      lat: 34.536790, lng: 135.516690, timeToNext: 4 },
  { name: "泉ヶ丘",    lat: 34.509920, lng: 135.529310, timeToNext: 4 },
  { name: "栂・美木多",  lat: 34.493690, lng: 135.540840, timeToNext: 4 },
  { name: "光明池",    lat: 34.483020, lng: 135.551640, timeToNext: 4 },
  { name: "和泉中央",   lat: 34.485000, lng: 135.571090, timeToNext: 0 },
];

// 能勢電鉄妙見線: 川西能勢口〜妙見口
export const nosedenMyokenLine: Station[] = [
  { name: "川西能勢口",  lat: 34.837840, lng: 135.415110, timeToNext: 3 },
  { name: "絹延橋",    lat: 34.843630, lng: 135.403800, timeToNext: 3 },
  { name: "滝山",      lat: 34.851530, lng: 135.398340, timeToNext: 3 },
  { name: "鼓滝",      lat: 34.858220, lng: 135.400550, timeToNext: 3 },
  { name: "多田",      lat: 34.865500, lng: 135.407440, timeToNext: 4 },
  { name: "平野",      lat: 34.877320, lng: 135.412700, timeToNext: 4 },
  { name: "一の鳥居",   lat: 34.886200, lng: 135.418790, timeToNext: 4 },
  { name: "畦野",      lat: 34.897410, lng: 135.419930, timeToNext: 4 },
  { name: "山下",      lat: 34.909430, lng: 135.421710, timeToNext: 4 },
  { name: "笹部",      lat: 34.921740, lng: 135.416470, timeToNext: 4 },
  { name: "一畑口",    lat: 34.934990, lng: 135.408570, timeToNext: 4 },
  { name: "光風台",    lat: 34.944820, lng: 135.404030, timeToNext: 4 },
  { name: "ときわ台",   lat: 34.954230, lng: 135.398310, timeToNext: 4 },
  { name: "妙見口",    lat: 34.969690, lng: 135.397520, timeToNext: 0 },
];

// 京阪石山坂本線: 坂本比叡山口〜石山寺
export const keihanIshiyamasakamoto: Station[] = [
  { name: "坂本比叡山口", lat: 35.064490, lng: 135.847980, timeToNext: 3 },
  { name: "松ノ馬場",   lat: 35.060040, lng: 135.853430, timeToNext: 3 },
  { name: "穴太",      lat: 35.053030, lng: 135.859250, timeToNext: 3 },
  { name: "唐崎",      lat: 35.045810, lng: 135.869430, timeToNext: 3 },
  { name: "皇子山",    lat: 35.021570, lng: 135.886200, timeToNext: 3 },
  { name: "大津市役所前", lat: 35.005840, lng: 135.862390, timeToNext: 3 },
  { name: "島ノ関",    lat: 34.999220, lng: 135.858240, timeToNext: 3 },
  { name: "浜大津",    lat: 34.999420, lng: 135.856750, timeToNext: 3 },
  { name: "三井寺",    lat: 35.001050, lng: 135.851160, timeToNext: 3 },
  { name: "琵琶湖浜大津", lat: 35.002620, lng: 135.851330, timeToNext: 3 },
  { name: "近江神宮前",  lat: 35.020770, lng: 135.827340, timeToNext: 3 },
  { name: "南草津",    lat: 35.001080, lng: 135.835220, timeToNext: 3 },
  { name: "瓦ヶ浜",    lat: 34.984020, lng: 135.858500, timeToNext: 3 },
  { name: "粟津",      lat: 34.974360, lng: 135.875990, timeToNext: 3 },
  { name: "石山寺",    lat: 34.964060, lng: 135.904080, timeToNext: 0 },
];

// 大阪モノレール（大阪高速鉄道）本線・彩都線
export const osakaMono: Station[] = [
  { name: "大阪空港",   lat: 34.784340, lng: 135.437940, timeToNext: 3 },
  { name: "蛍池",      lat: 34.800800, lng: 135.414600, timeToNext: 3 },
  { name: "柴原阪大前",  lat: 34.817890, lng: 135.437740, timeToNext: 3 },
  { name: "少路",      lat: 34.822200, lng: 135.459290, timeToNext: 3 },
  { name: "千里中央",   lat: 34.804890, lng: 135.497290, timeToNext: 3 },
  { name: "山田",      lat: 34.796790, lng: 135.519920, timeToNext: 3 },
  { name: "万博記念公園", lat: 34.807420, lng: 135.536120, timeToNext: 3 },
  { name: "宇野辺",    lat: 34.815340, lng: 135.554180, timeToNext: 3 },
  { name: "南茨木",    lat: 34.806410, lng: 135.562060, timeToNext: 3 },
  { name: "沢良宜",    lat: 34.808230, lng: 135.574350, timeToNext: 3 },
  { name: "摂津",      lat: 34.785520, lng: 135.579570, timeToNext: 3 },
  { name: "南摂津",    lat: 34.775960, lng: 135.585680, timeToNext: 3 },
  { name: "大日",      lat: 34.762850, lng: 135.563060, timeToNext: 3 },
  { name: "門真市",    lat: 34.735890, lng: 135.570620, timeToNext: 0 },
];

// 阪神なんば線: 尼崎〜大阪難波
export const hanshinNamba: Station[] = [
  { name: "尼崎",      lat: 34.726010, lng: 135.410610, timeToNext: 3 },
  { name: "出来島",    lat: 34.714870, lng: 135.411980, timeToNext: 3 },
  { name: "福",        lat: 34.700600, lng: 135.425560, timeToNext: 3 },
  { name: "伝法",      lat: 34.690810, lng: 135.450390, timeToNext: 3 },
  { name: "千鳥橋",    lat: 34.682280, lng: 135.455300, timeToNext: 3 },
  { name: "西九条",    lat: 34.675840, lng: 135.474710, timeToNext: 3 },
  { name: "ドーム前",   lat: 34.662700, lng: 135.479350, timeToNext: 3 },
  { name: "桜川",      lat: 34.659840, lng: 135.496680, timeToNext: 3 },
  { name: "大阪難波",   lat: 34.659750, lng: 135.502730, timeToNext: 0 },
];

// 阪急神戸線: 大阪梅田〜神戸三宮
export const hankyuKobeLine2: Station[] = [
  { name: "大阪梅田",   lat: 34.705820, lng: 135.497110, timeToNext: 3 },
  { name: "中津",      lat: 34.710290, lng: 135.499290, timeToNext: 3 },
  { name: "十三",      lat: 34.722650, lng: 135.471360, timeToNext: 5 },
  { name: "神崎川",    lat: 34.722680, lng: 135.457980, timeToNext: 3 },
  { name: "園田",      lat: 34.726800, lng: 135.437620, timeToNext: 3 },
  { name: "塚口",      lat: 34.738540, lng: 135.403740, timeToNext: 3 },
  { name: "武庫之荘",   lat: 34.741440, lng: 135.386040, timeToNext: 3 },
  { name: "西宮北口",   lat: 34.739480, lng: 135.345340, timeToNext: 4 },
  { name: "夙川",      lat: 34.742850, lng: 135.336330, timeToNext: 3 },
  { name: "芦屋川",    lat: 34.730620, lng: 135.302510, timeToNext: 3 },
  { name: "岡本",      lat: 34.726530, lng: 135.258450, timeToNext: 3 },
  { name: "御影",      lat: 34.704870, lng: 135.231570, timeToNext: 3 },
  { name: "六甲",      lat: 34.716750, lng: 135.217910, timeToNext: 3 },
  { name: "王子公園",   lat: 34.715750, lng: 135.215270, timeToNext: 3 },
  { name: "春日野道",   lat: 34.707180, lng: 135.209970, timeToNext: 3 },
  { name: "神戸三宮",   lat: 34.694840, lng: 135.195680, timeToNext: 0 },
];
