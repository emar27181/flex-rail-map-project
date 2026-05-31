/**
 * 駅別統計データの型定義とサンプルデータ
 *
 * --- データの用途 ---
 * 駅ごとの生活・環境パラメータを保持し、以下の機能で利用する:
 *   1. ヒートマップ表示  : 任意パラメータを地図上に色分け可視化
 *   2. カスタム評価スコア: ユーザーが重み付き式を定義して駅を比較
 *
 * --- データソース方針 ---
 * data/station-stats.csv を正規データとして管理し、
 * scripts/import-station-stats.ts でこのファイルに変換する。
 * 現時点は主要駅のサンプルデータのみ入力済み。
 *
 * --- 各フィールドの計測基準 ---
 * ・count系     : 駅出口から半径500m以内の施設数（目安）
 * ・score系     : 0〜100 の正規化値（高いほど良い方向）
 * ・rent系      : 万円/月 の平均値
 * ・population  : 人/km²
 * ・passengers  : 乗降客数/日（JR・メトロ等の公表値を合算）
 */

export type StationStats = {
  stationName: string;
  lat: number;
  lng: number;
  lineCount: number;           // 乗り入れ路線数

  // --- 住居・生活コスト ---
  avgRent1K?: number;          // 1K 平均家賃（万円/月）
  avgRent1LDK?: number;        // 1LDK 平均家賃（万円/月）
  populationDensity?: number;  // 人口密度（人/km²）

  // --- 交通 ---
  dailyPassengers?: number;    // 一日乗降客数（人/日）
  morningCongestion?: number;  // 朝ラッシュ混雑度（0-100、高いほど混む）

  // --- 飲食・娯楽（半径500m以内） ---
  izakayaCount?: number;
  restaurantCount?: number;
  cafeCount?: number;
  convenienceStoreCount?: number;
  ramenCount?: number;

  // --- 生活利便性（半径500m以内） ---
  supermarketCount?: number;
  hospitalCount?: number;      // 病院・クリニック
  bookstoreCount?: number;

  // --- 治安 ---
  crimeIndex?: number;         // 犯罪件数（件/年）
  safetyScore?: number;        // 治安スコア（0-100、高いほど安全）

  // --- 環境 ---
  parkAreaM2?: number;         // 公園面積（m²、半径500m以内）
  noiseScore?: number;         // 静かさスコア（0-100、高いほど静か）
  greenRatioPct?: number;      // 緑地率（%）

  // --- 仕事・ワーク ---
  officeCount?: number;        // オフィスビル数（半径500m以内）
  coworkingCount?: number;     // コワーキングスペース数
};

/**
 * データソース情報（参照元・参照日・更新日の記録）
 */
export type DataSource = {
  title: string;       // データ名称・出典名
  url?: string;        // 参照URL（任意）
  retrievedAt: string; // 参照日 YYYY-MM-DD
  updatedAt?: string;  // データ自体の更新日（公表元）
  note?: string;       // 補足
};

/** 各パラメータがどのデータソースを参照しているか */
export const PARAM_DATA_SOURCES: Partial<Record<keyof StationStats, DataSource>> = {
  avgRent1K: {
    title: 'SUUMO・ HOME\'S 賃料相場（概算）',
    url: 'https://suumo.jp/chintai/',
    retrievedAt: '2026-05-31',
    note: '各駅周辺1K物件の掲載賃料をもとにした概算値。実際の相場と異なる場合があります。',
  },
  avgRent1LDK: {
    title: 'SUUMO・HOME\'S 賃料相場（概算）',
    url: 'https://suumo.jp/chintai/',
    retrievedAt: '2026-05-31',
    note: '各駅周辺1LDK物件の掲載賃料をもとにした概算値。',
  },
  dailyPassengers: {
    title: '各鉄道事業者 駅別乗降人員データ（2022-2023年度実績）',
    url: 'https://www.mlit.go.jp/tetudo/tetudo_tk2_000020.html',
    retrievedAt: '2026-05-31',
    updatedAt: '2023-03-31',
    note: 'JR東日本・東京メトロ・各私鉄の公表値を駅単位で合算した概算。',
  },
  crimeIndex: {
    title: '警視庁 区市町村の町丁別、罪種別及び手口別認知件数（概算）',
    url: 'https://www.keishicho.metro.tokyo.lg.jp/about_mpd/toukei_sishou/toukei/hanzaitoukei.html',
    retrievedAt: '2026-05-31',
    updatedAt: '2024-12-31',
    note: '駅周辺の犯罪認知件数の概算。実際の値は公式発表を参照してください。',
  },
  safetyScore: {
    title: '警視庁犯罪統計・独自スコアリング（概算）',
    retrievedAt: '2026-05-31',
    note: '犯罪件数・人口密度などから独自に算出した治安スコア（0-100）。参考値です。',
  },
  populationDensity: {
    title: '総務省 令和2年国勢調査 人口等基本集計',
    url: 'https://www.stat.go.jp/data/kokusei/2020/',
    retrievedAt: '2026-05-31',
    updatedAt: '2020-10-01',
    note: '駅周辺町丁の人口密度の概算値。',
  },
  parkAreaM2: {
    title: '国土数値情報 都市公園データ',
    url: 'https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P13.html',
    retrievedAt: '2026-05-31',
    note: '駅出口から半径500m以内の都市公園・緑地面積の概算合計。',
  },
};

/** 全データの共通注意書き */
export const DATA_DISCLAIMER =
  '掲載データは概算・推定値です。最新の正確な情報は各参照元の公式サイトをご確認ください。';

/**
 * パラメータのメタ情報（UI表示・ヒートマップ設定用）
 */
export type StatParamMeta = {
  key: keyof StationStats;
  label: string;              // UI表示名
  unit: string;               // 単位
  category: StatCategory;
  higherIsBetter: boolean;    // trueなら高い値ほど良い（ヒートマップ色に影響）
  description: string;
};

export type StatCategory =
  | 'housing'       // 住居・生活コスト
  | 'transport'     // 交通
  | 'food'          // 飲食・娯楽
  | 'convenience'   // 生活利便性
  | 'safety'        // 治安
  | 'environment'   // 環境
  | 'work';         // 仕事

export const STAT_PARAMS: StatParamMeta[] = [
  // 住居
  { key: 'avgRent1K',           label: '家賃(1K)',       unit: '万円',    category: 'housing',      higherIsBetter: false, description: '1K の平均月額家賃' },
  { key: 'avgRent1LDK',         label: '家賃(1LDK)',     unit: '万円',    category: 'housing',      higherIsBetter: false, description: '1LDK の平均月額家賃' },
  { key: 'populationDensity',   label: '人口密度',       unit: '人/km²',  category: 'housing',      higherIsBetter: false, description: '駅周辺の人口密度' },
  // 交通
  { key: 'dailyPassengers',     label: '乗降客数',       unit: '人/日',   category: 'transport',    higherIsBetter: false, description: '一日の乗降客数（繁華街度の目安）' },
  { key: 'morningCongestion',   label: '朝混雑度',       unit: '',        category: 'transport',    higherIsBetter: false, description: '朝ラッシュ時の混雑度（0-100）' },
  // 飲食
  { key: 'izakayaCount',        label: '居酒屋数',       unit: '軒',      category: 'food',         higherIsBetter: true,  description: '半径500m以内の居酒屋数' },
  { key: 'restaurantCount',     label: '飲食店数',       unit: '軒',      category: 'food',         higherIsBetter: true,  description: '半径500m以内の飲食店数' },
  { key: 'cafeCount',           label: 'カフェ数',       unit: '軒',      category: 'food',         higherIsBetter: true,  description: '半径500m以内のカフェ数' },
  { key: 'convenienceStoreCount', label: 'コンビニ数',   unit: '軒',      category: 'food',         higherIsBetter: true,  description: '半径500m以内のコンビニ数' },
  { key: 'ramenCount',          label: 'ラーメン屋数',   unit: '軒',      category: 'food',         higherIsBetter: true,  description: '半径500m以内のラーメン屋数' },
  // 生活利便性
  { key: 'supermarketCount',    label: 'スーパー数',     unit: '軒',      category: 'convenience',  higherIsBetter: true,  description: '半径500m以内のスーパー数' },
  { key: 'hospitalCount',       label: '病院・医院数',   unit: '軒',      category: 'convenience',  higherIsBetter: true,  description: '半径500m以内の病院・クリニック数' },
  { key: 'bookstoreCount',      label: '書店数',         unit: '軒',      category: 'convenience',  higherIsBetter: true,  description: '半径500m以内の書店数' },
  // 治安
  { key: 'crimeIndex',          label: '犯罪件数',       unit: '件/年',   category: 'safety',       higherIsBetter: false, description: '年間犯罪発生件数（低いほど安全）' },
  { key: 'safetyScore',         label: '治安スコア',     unit: '',        category: 'safety',       higherIsBetter: true,  description: '治安の総合スコア（0-100）' },
  // 環境
  { key: 'parkAreaM2',          label: '公園面積',       unit: 'm²',      category: 'environment',  higherIsBetter: true,  description: '半径500m以内の公園面積合計' },
  { key: 'noiseScore',          label: '静かさ',         unit: '',        category: 'environment',  higherIsBetter: true,  description: '騒音の少なさスコア（0-100）' },
  { key: 'greenRatioPct',       label: '緑地率',         unit: '%',       category: 'environment',  higherIsBetter: true,  description: '周辺の緑地割合' },
  // 仕事
  { key: 'officeCount',         label: 'オフィス数',     unit: '棟',      category: 'work',         higherIsBetter: true,  description: '半径500m以内のオフィスビル数' },
  { key: 'coworkingCount',      label: 'コワーキング数', unit: '軒',      category: 'work',         higherIsBetter: true,  description: '半径500m以内のコワーキングスペース数' },
];

/**
 * カスタム評価式の定義（ユーザーが自由に設定）
 * 例: "住みやすさ" = 治安スコア×0.4 + 静かさ×0.3 - 家賃(1K)×0.3
 */
export type CustomScoreFormula = {
  id: string;
  name: string;
  description: string;
  weights: Partial<Record<keyof StationStats, number>>; // パラメータキー → 重み
};

export const SAMPLE_FORMULAS: CustomScoreFormula[] = [
  {
    id: 'livability',
    name: '住みやすさ',
    description: '治安・静かさ重視、家賃は低い方がいい',
    weights: {
      safetyScore:            0.35,
      noiseScore:             0.25,
      avgRent1K:              -0.25, // 負の重み = 低いほど高評価
      supermarketCount:       0.10,
      parkAreaM2:             0.05,
    },
  },
  {
    id: 'party',
    name: '飲み好き',
    description: '居酒屋・飲食店の充実度重視',
    weights: {
      izakayaCount:           0.40,
      restaurantCount:        0.30,
      cafeCount:              0.15,
      convenienceStoreCount:  0.15,
    },
  },
  {
    id: 'worklife',
    name: '仕事・在宅バランス',
    description: 'オフィス近接性とコワーキング充実度',
    weights: {
      officeCount:            0.30,
      coworkingCount:         0.25,
      cafeCount:              0.20,
      morningCongestion:      -0.15, // 混雑は嫌
      avgRent1LDK:            -0.10,
    },
  },
];

// ----------------------------------------------------------------
// 駅統計データ（概算値。出典: 各種公開データ・現地知識をもとに推定）
// 全駅テンプレートは data/station-stats.csv を参照。
// ----------------------------------------------------------------
export const stationStatsData: Record<string, StationStats> = {

  // ======== 山手線（31駅）========
  '東京': {
    stationName: '東京', lat: 35.680965, lng: 139.766685, lineCount: 13,
    avgRent1K: 13.0, avgRent1LDK: 22.0, populationDensity: 8000,
    dailyPassengers: 450000, morningCongestion: 95,
    izakayaCount: 100, restaurantCount: 400, cafeCount: 60, convenienceStoreCount: 25, ramenCount: 20,
    supermarketCount: 2, hospitalCount: 15, bookstoreCount: 8,
    crimeIndex: 500, safetyScore: 62,
    parkAreaM2: 50000, noiseScore: 35, greenRatioPct: 12,
    officeCount: 500, coworkingCount: 25,
  },
  '有楽町': {
    stationName: '有楽町', lat: 35.675270, lng: 139.763780, lineCount: 3,
    avgRent1K: 14.0, avgRent1LDK: 25.0, populationDensity: 6000,
    dailyPassengers: 40000, morningCongestion: 70,
    izakayaCount: 80, restaurantCount: 200, cafeCount: 30, convenienceStoreCount: 10, ramenCount: 10,
    supermarketCount: 2, hospitalCount: 10, bookstoreCount: 3,
    crimeIndex: 400, safetyScore: 65,
    parkAreaM2: 30000, noiseScore: 38, greenRatioPct: 10,
    officeCount: 300, coworkingCount: 15,
  },
  '新橋': {
    stationName: '新橋', lat: 35.666040, lng: 139.758415, lineCount: 4,
    avgRent1K: 12.0, avgRent1LDK: 20.0, populationDensity: 7000,
    dailyPassengers: 90000, morningCongestion: 80,
    izakayaCount: 200, restaurantCount: 500, cafeCount: 50, convenienceStoreCount: 15, ramenCount: 25,
    supermarketCount: 3, hospitalCount: 20, bookstoreCount: 4,
    crimeIndex: 800, safetyScore: 55,
    parkAreaM2: 5000, noiseScore: 28, greenRatioPct: 4,
    officeCount: 250, coworkingCount: 10,
  },
  '浜松町': {
    stationName: '浜松町', lat: 35.655391, lng: 139.757135, lineCount: 3,
    avgRent1K: 12.0, avgRent1LDK: 20.5, populationDensity: 6000,
    dailyPassengers: 80000, morningCongestion: 78,
    izakayaCount: 60, restaurantCount: 180, cafeCount: 25, convenienceStoreCount: 10, ramenCount: 10,
    supermarketCount: 2, hospitalCount: 10, bookstoreCount: 2,
    crimeIndex: 350, safetyScore: 62,
    parkAreaM2: 20000, noiseScore: 40, greenRatioPct: 12,
    officeCount: 200, coworkingCount: 12,
  },
  '田町': {
    stationName: '田町', lat: 35.645736, lng: 139.747575, lineCount: 2,
    avgRent1K: 11.5, avgRent1LDK: 19.5, populationDensity: 8000,
    dailyPassengers: 70000, morningCongestion: 75,
    izakayaCount: 70, restaurantCount: 200, cafeCount: 35, convenienceStoreCount: 10, ramenCount: 10,
    supermarketCount: 3, hospitalCount: 12, bookstoreCount: 3,
    crimeIndex: 300, safetyScore: 65,
    parkAreaM2: 5000, noiseScore: 45, greenRatioPct: 8,
    officeCount: 180, coworkingCount: 12,
  },
  '品川': {
    stationName: '品川', lat: 35.628471, lng: 139.738632, lineCount: 5,
    avgRent1K: 11.0, avgRent1LDK: 19.0, populationDensity: 9000,
    dailyPassengers: 250000, morningCongestion: 88,
    izakayaCount: 100, restaurantCount: 300, cafeCount: 50, convenienceStoreCount: 18, ramenCount: 15,
    supermarketCount: 4, hospitalCount: 20, bookstoreCount: 5,
    crimeIndex: 600, safetyScore: 60,
    parkAreaM2: 20000, noiseScore: 35, greenRatioPct: 8,
    officeCount: 300, coworkingCount: 18,
  },
  '大崎': {
    stationName: '大崎', lat: 35.619772, lng: 139.728489, lineCount: 4,
    avgRent1K: 9.5, avgRent1LDK: 16.0, populationDensity: 10000,
    dailyPassengers: 90000, morningCongestion: 75,
    izakayaCount: 40, restaurantCount: 120, cafeCount: 20, convenienceStoreCount: 8, ramenCount: 8,
    supermarketCount: 3, hospitalCount: 12, bookstoreCount: 2,
    crimeIndex: 350, safetyScore: 62,
    parkAreaM2: 5000, noiseScore: 45, greenRatioPct: 8,
    officeCount: 150, coworkingCount: 8,
  },
  '五反田': {
    stationName: '五反田', lat: 35.625974, lng: 139.723676, lineCount: 3,
    avgRent1K: 9.5, avgRent1LDK: 15.0, populationDensity: 15000,
    dailyPassengers: 50000, morningCongestion: 70,
    izakayaCount: 80, restaurantCount: 200, cafeCount: 25, convenienceStoreCount: 8, ramenCount: 12,
    supermarketCount: 4, hospitalCount: 15, bookstoreCount: 2,
    crimeIndex: 500, safetyScore: 55,
    parkAreaM2: 3000, noiseScore: 42, greenRatioPct: 6,
    officeCount: 100, coworkingCount: 6,
  },
  '目黒': {
    stationName: '目黒', lat: 35.633998, lng: 139.715828, lineCount: 4,
    avgRent1K: 11.0, avgRent1LDK: 18.5, populationDensity: 14000,
    dailyPassengers: 80000, morningCongestion: 72,
    izakayaCount: 70, restaurantCount: 250, cafeCount: 40, convenienceStoreCount: 8, ramenCount: 12,
    supermarketCount: 5, hospitalCount: 18, bookstoreCount: 3,
    crimeIndex: 400, safetyScore: 62,
    parkAreaM2: 10000, noiseScore: 50, greenRatioPct: 12,
    officeCount: 80, coworkingCount: 7,
  },
  '恵比寿': {
    stationName: '恵比寿', lat: 35.646685, lng: 139.710065, lineCount: 2,
    avgRent1K: 12.5, avgRent1LDK: 21.0, populationDensity: 12000,
    dailyPassengers: 90000, morningCongestion: 72,
    izakayaCount: 60, restaurantCount: 300, cafeCount: 70, convenienceStoreCount: 8, ramenCount: 10,
    supermarketCount: 4, hospitalCount: 18, bookstoreCount: 3,
    crimeIndex: 300, safetyScore: 72,
    parkAreaM2: 50000, noiseScore: 52, greenRatioPct: 14,
    officeCount: 100, coworkingCount: 10,
  },
  '渋谷': {
    stationName: '渋谷', lat: 35.658034, lng: 139.701636, lineCount: 8,
    avgRent1K: 10.5, avgRent1LDK: 18.0, populationDensity: 18000,
    dailyPassengers: 220000, morningCongestion: 90,
    izakayaCount: 150, restaurantCount: 500, cafeCount: 80, convenienceStoreCount: 12, ramenCount: 30,
    supermarketCount: 5, hospitalCount: 20, bookstoreCount: 3,
    crimeIndex: 1200, safetyScore: 45,
    parkAreaM2: 15000, noiseScore: 30, greenRatioPct: 8,
    officeCount: 200, coworkingCount: 15,
  },
  '原宿': {
    stationName: '原宿', lat: 35.670168, lng: 139.702687, lineCount: 2,
    avgRent1K: 12.0, avgRent1LDK: 20.0, populationDensity: 10000,
    dailyPassengers: 50000, morningCongestion: 60,
    izakayaCount: 30, restaurantCount: 200, cafeCount: 60, convenienceStoreCount: 6, ramenCount: 8,
    supermarketCount: 2, hospitalCount: 12, bookstoreCount: 2,
    crimeIndex: 350, safetyScore: 65,
    parkAreaM2: 700000, noiseScore: 55, greenRatioPct: 35,
    officeCount: 40, coworkingCount: 5,
  },
  '代々木': {
    stationName: '代々木', lat: 35.683061, lng: 139.702218, lineCount: 3,
    avgRent1K: 9.8, avgRent1LDK: 16.5, populationDensity: 12000,
    dailyPassengers: 30000, morningCongestion: 55,
    izakayaCount: 40, restaurantCount: 100, cafeCount: 20, convenienceStoreCount: 5, ramenCount: 8,
    supermarketCount: 3, hospitalCount: 10, bookstoreCount: 2,
    crimeIndex: 400, safetyScore: 58,
    parkAreaM2: 540000, noiseScore: 55, greenRatioPct: 40,
    officeCount: 30, coworkingCount: 4,
  },
  '新宿': {
    stationName: '新宿', lat: 35.689607, lng: 139.700560, lineCount: 9,
    avgRent1K: 9.8, avgRent1LDK: 17.5, populationDensity: 20000,
    dailyPassengers: 350000, morningCongestion: 95,
    izakayaCount: 300, restaurantCount: 800, cafeCount: 100, convenienceStoreCount: 20, ramenCount: 50,
    supermarketCount: 8, hospitalCount: 30, bookstoreCount: 5,
    crimeIndex: 2000, safetyScore: 35,
    parkAreaM2: 5000, noiseScore: 20, greenRatioPct: 3,
    officeCount: 350, coworkingCount: 20,
  },
  '新大久保': {
    stationName: '新大久保', lat: 35.701306, lng: 139.700044, lineCount: 1,
    avgRent1K: 8.5, avgRent1LDK: 14.5, populationDensity: 22000,
    dailyPassengers: 35000, morningCongestion: 50,
    izakayaCount: 30, restaurantCount: 250, cafeCount: 30, convenienceStoreCount: 8, ramenCount: 10,
    supermarketCount: 5, hospitalCount: 15, bookstoreCount: 2,
    crimeIndex: 700, safetyScore: 50,
    parkAreaM2: 2000, noiseScore: 35, greenRatioPct: 3,
    officeCount: 20, coworkingCount: 3,
  },
  '高田馬場': {
    stationName: '高田馬場', lat: 35.712285, lng: 139.703782, lineCount: 3,
    avgRent1K: 7.5, avgRent1LDK: 12.5, populationDensity: 20000,
    dailyPassengers: 60000, morningCongestion: 70,
    izakayaCount: 100, restaurantCount: 300, cafeCount: 40, convenienceStoreCount: 12, ramenCount: 25,
    supermarketCount: 6, hospitalCount: 20, bookstoreCount: 5,
    crimeIndex: 600, safetyScore: 52,
    parkAreaM2: 3000, noiseScore: 38, greenRatioPct: 5,
    officeCount: 30, coworkingCount: 6,
  },
  '目白': {
    stationName: '目白', lat: 35.720845, lng: 139.706578, lineCount: 1,
    avgRent1K: 9.0, avgRent1LDK: 15.5, populationDensity: 12000,
    dailyPassengers: 20000, morningCongestion: 45,
    izakayaCount: 20, restaurantCount: 60, cafeCount: 15, convenienceStoreCount: 4, ramenCount: 5,
    supermarketCount: 3, hospitalCount: 12, bookstoreCount: 2,
    crimeIndex: 150, safetyScore: 75,
    parkAreaM2: 8000, noiseScore: 65, greenRatioPct: 18,
    officeCount: 15, coworkingCount: 2,
  },
  '池袋': {
    stationName: '池袋', lat: 35.729503, lng: 139.710940, lineCount: 8,
    avgRent1K: 8.2, avgRent1LDK: 14.5, populationDensity: 22000,
    dailyPassengers: 270000, morningCongestion: 88,
    izakayaCount: 200, restaurantCount: 600, cafeCount: 70, convenienceStoreCount: 18, ramenCount: 40,
    supermarketCount: 10, hospitalCount: 35, bookstoreCount: 6,
    crimeIndex: 1500, safetyScore: 40,
    parkAreaM2: 8000, noiseScore: 25, greenRatioPct: 4,
    officeCount: 180, coworkingCount: 12,
  },
  '大塚': {
    stationName: '大塚', lat: 35.731773, lng: 139.728579, lineCount: 3,
    avgRent1K: 7.8, avgRent1LDK: 13.5, populationDensity: 18000,
    dailyPassengers: 35000, morningCongestion: 60,
    izakayaCount: 80, restaurantCount: 180, cafeCount: 20, convenienceStoreCount: 8, ramenCount: 15,
    supermarketCount: 5, hospitalCount: 15, bookstoreCount: 2,
    crimeIndex: 500, safetyScore: 52,
    parkAreaM2: 3000, noiseScore: 40, greenRatioPct: 5,
    officeCount: 30, coworkingCount: 3,
  },
  '巣鴨': {
    stationName: '巣鴨', lat: 35.733724, lng: 139.739584, lineCount: 2,
    avgRent1K: 7.0, avgRent1LDK: 11.5, populationDensity: 16000,
    dailyPassengers: 35000, morningCongestion: 55,
    izakayaCount: 40, restaurantCount: 120, cafeCount: 10, convenienceStoreCount: 6, ramenCount: 10,
    supermarketCount: 5, hospitalCount: 18, bookstoreCount: 2,
    crimeIndex: 200, safetyScore: 68,
    parkAreaM2: 5000, noiseScore: 58, greenRatioPct: 10,
    officeCount: 15, coworkingCount: 1,
  },
  '駒込': {
    stationName: '駒込', lat: 35.736009, lng: 139.746824, lineCount: 2,
    avgRent1K: 7.2, avgRent1LDK: 12.0, populationDensity: 14000,
    dailyPassengers: 20000, morningCongestion: 45,
    izakayaCount: 30, restaurantCount: 80, cafeCount: 10, convenienceStoreCount: 5, ramenCount: 8,
    supermarketCount: 4, hospitalCount: 12, bookstoreCount: 1,
    crimeIndex: 180, safetyScore: 70,
    parkAreaM2: 100000, noiseScore: 65, greenRatioPct: 22,
    officeCount: 10, coworkingCount: 1,
  },
  '田端': {
    stationName: '田端', lat: 35.737408, lng: 139.761229, lineCount: 2,
    avgRent1K: 6.8, avgRent1LDK: 11.0, populationDensity: 13000,
    dailyPassengers: 18000, morningCongestion: 40,
    izakayaCount: 20, restaurantCount: 60, cafeCount: 8, convenienceStoreCount: 4, ramenCount: 6,
    supermarketCount: 3, hospitalCount: 10, bookstoreCount: 1,
    crimeIndex: 150, safetyScore: 70,
    parkAreaM2: 4000, noiseScore: 62, greenRatioPct: 16,
    officeCount: 8, coworkingCount: 1,
  },
  '西日暮里': {
    stationName: '西日暮里', lat: 35.732170, lng: 139.766707, lineCount: 4,
    avgRent1K: 6.5, avgRent1LDK: 10.5, populationDensity: 14000,
    dailyPassengers: 25000, morningCongestion: 50,
    izakayaCount: 20, restaurantCount: 60, cafeCount: 8, convenienceStoreCount: 4, ramenCount: 6,
    supermarketCount: 3, hospitalCount: 10, bookstoreCount: 1,
    crimeIndex: 200, safetyScore: 65,
    parkAreaM2: 3000, noiseScore: 58, greenRatioPct: 8,
    officeCount: 10, coworkingCount: 1,
  },
  '日暮里': {
    stationName: '日暮里', lat: 35.727788, lng: 139.771007, lineCount: 6,
    avgRent1K: 6.8, avgRent1LDK: 11.0, populationDensity: 15000,
    dailyPassengers: 40000, morningCongestion: 60,
    izakayaCount: 30, restaurantCount: 80, cafeCount: 8, convenienceStoreCount: 5, ramenCount: 8,
    supermarketCount: 3, hospitalCount: 12, bookstoreCount: 2,
    crimeIndex: 250, safetyScore: 62,
    parkAreaM2: 2000, noiseScore: 52, greenRatioPct: 6,
    officeCount: 15, coworkingCount: 2,
  },
  '鶯谷': {
    stationName: '鶯谷', lat: 35.721456, lng: 139.778060, lineCount: 2,
    avgRent1K: 6.5, avgRent1LDK: 10.5, populationDensity: 15000,
    dailyPassengers: 10000, morningCongestion: 35,
    izakayaCount: 25, restaurantCount: 70, cafeCount: 5, convenienceStoreCount: 4, ramenCount: 6,
    supermarketCount: 2, hospitalCount: 8, bookstoreCount: 1,
    crimeIndex: 350, safetyScore: 50,
    parkAreaM2: 2000, noiseScore: 48, greenRatioPct: 8,
    officeCount: 5, coworkingCount: 0,
  },
  '上野': {
    stationName: '上野', lat: 35.713850, lng: 139.777043, lineCount: 10,
    avgRent1K: 7.8, avgRent1LDK: 13.5, populationDensity: 15000,
    dailyPassengers: 180000, morningCongestion: 75,
    izakayaCount: 120, restaurantCount: 350, cafeCount: 30, convenienceStoreCount: 10, ramenCount: 20,
    supermarketCount: 6, hospitalCount: 22, bookstoreCount: 3,
    crimeIndex: 900, safetyScore: 52,
    parkAreaM2: 530000, noiseScore: 42, greenRatioPct: 18,
    officeCount: 80, coworkingCount: 6,
  },
  '御徒町': {
    stationName: '御徒町', lat: 35.707290, lng: 139.774648, lineCount: 2,
    avgRent1K: 7.5, avgRent1LDK: 12.5, populationDensity: 18000,
    dailyPassengers: 50000, morningCongestion: 65,
    izakayaCount: 100, restaurantCount: 350, cafeCount: 20, convenienceStoreCount: 10, ramenCount: 15,
    supermarketCount: 4, hospitalCount: 15, bookstoreCount: 2,
    crimeIndex: 700, safetyScore: 48,
    parkAreaM2: 3000, noiseScore: 35, greenRatioPct: 5,
    officeCount: 30, coworkingCount: 2,
  },
  '秋葉原': {
    stationName: '秋葉原', lat: 35.698919, lng: 139.774053, lineCount: 4,
    avgRent1K: 9.0, avgRent1LDK: 15.0, populationDensity: 10000,
    dailyPassengers: 130000, morningCongestion: 72,
    izakayaCount: 50, restaurantCount: 200, cafeCount: 40, convenienceStoreCount: 12, ramenCount: 15,
    supermarketCount: 2, hospitalCount: 10, bookstoreCount: 8,
    crimeIndex: 600, safetyScore: 52,
    parkAreaM2: 2000, noiseScore: 35, greenRatioPct: 3,
    officeCount: 120, coworkingCount: 12,
  },
  '神田': {
    stationName: '神田', lat: 35.691696, lng: 139.770883, lineCount: 4,
    avgRent1K: 11.0, avgRent1LDK: 18.0, populationDensity: 5000,
    dailyPassengers: 40000, morningCongestion: 70,
    izakayaCount: 80, restaurantCount: 250, cafeCount: 30, convenienceStoreCount: 10, ramenCount: 15,
    supermarketCount: 2, hospitalCount: 12, bookstoreCount: 5,
    crimeIndex: 400, safetyScore: 60,
    parkAreaM2: 3000, noiseScore: 40, greenRatioPct: 5,
    officeCount: 200, coworkingCount: 12,
  },

  // ======== 主要ターミナル・人気駅 ========
  '吉祥寺': {
    stationName: '吉祥寺', lat: 35.703013, lng: 139.579849, lineCount: 2,
    avgRent1K: 7.5, avgRent1LDK: 13.0, populationDensity: 12000,
    dailyPassengers: 60000, morningCongestion: 65,
    izakayaCount: 80, restaurantCount: 250, cafeCount: 40, convenienceStoreCount: 8, ramenCount: 15,
    supermarketCount: 6, hospitalCount: 18, bookstoreCount: 4,
    crimeIndex: 400, safetyScore: 68,
    parkAreaM2: 880000, noiseScore: 55, greenRatioPct: 25,
    officeCount: 30, coworkingCount: 5,
  },
  '中目黒': {
    stationName: '中目黒', lat: 35.644190, lng: 139.698442, lineCount: 2,
    avgRent1K: 12.0, avgRent1LDK: 21.0, populationDensity: 11000,
    dailyPassengers: 65000, morningCongestion: 68,
    izakayaCount: 60, restaurantCount: 280, cafeCount: 80, convenienceStoreCount: 6, ramenCount: 8,
    supermarketCount: 4, hospitalCount: 15, bookstoreCount: 2,
    crimeIndex: 280, safetyScore: 72,
    parkAreaM2: 8000, noiseScore: 58, greenRatioPct: 15,
    officeCount: 50, coworkingCount: 6,
  },
  '自由が丘': {
    stationName: '自由が丘', lat: 35.607896, lng: 139.668592, lineCount: 2,
    avgRent1K: 9.0, avgRent1LDK: 16.5, populationDensity: 10000,
    dailyPassengers: 45000, morningCongestion: 50,
    izakayaCount: 40, restaurantCount: 200, cafeCount: 60, convenienceStoreCount: 5, ramenCount: 5,
    supermarketCount: 4, hospitalCount: 12, bookstoreCount: 2,
    crimeIndex: 180, safetyScore: 78,
    parkAreaM2: 20000, noiseScore: 70, greenRatioPct: 20,
    officeCount: 15, coworkingCount: 3,
  },
  '三軒茶屋': {
    stationName: '三軒茶屋', lat: 35.643875, lng: 139.668786, lineCount: 2,
    avgRent1K: 9.5, avgRent1LDK: 16.0, populationDensity: 15000,
    dailyPassengers: 55000, morningCongestion: 65,
    izakayaCount: 120, restaurantCount: 350, cafeCount: 45, convenienceStoreCount: 8, ramenCount: 20,
    supermarketCount: 6, hospitalCount: 18, bookstoreCount: 3,
    crimeIndex: 450, safetyScore: 58,
    parkAreaM2: 5000, noiseScore: 45, greenRatioPct: 8,
    officeCount: 30, coworkingCount: 5,
  },
  '下北沢': {
    stationName: '下北沢', lat: 35.661506, lng: 139.668198, lineCount: 2,
    avgRent1K: 9.0, avgRent1LDK: 15.0, populationDensity: 16000,
    dailyPassengers: 50000, morningCongestion: 60,
    izakayaCount: 80, restaurantCount: 250, cafeCount: 50, convenienceStoreCount: 6, ramenCount: 15,
    supermarketCount: 4, hospitalCount: 12, bookstoreCount: 5,
    crimeIndex: 350, safetyScore: 62,
    parkAreaM2: 3000, noiseScore: 48, greenRatioPct: 8,
    officeCount: 15, coworkingCount: 4,
  },
  '二子玉川': {
    stationName: '二子玉川', lat: 35.609895, lng: 139.627152, lineCount: 2,
    avgRent1K: 10.5, avgRent1LDK: 18.5, populationDensity: 9000,
    dailyPassengers: 70000, morningCongestion: 68,
    izakayaCount: 40, restaurantCount: 200, cafeCount: 50, convenienceStoreCount: 6, ramenCount: 8,
    supermarketCount: 5, hospitalCount: 15, bookstoreCount: 3,
    crimeIndex: 180, safetyScore: 78,
    parkAreaM2: 200000, noiseScore: 65, greenRatioPct: 30,
    officeCount: 30, coworkingCount: 5,
  },
  '武蔵小杉': {
    stationName: '武蔵小杉', lat: 35.575736, lng: 139.655043, lineCount: 5,
    avgRent1K: 9.0, avgRent1LDK: 15.5, populationDensity: 18000,
    dailyPassengers: 100000, morningCongestion: 82,
    izakayaCount: 60, restaurantCount: 200, cafeCount: 40, convenienceStoreCount: 10, ramenCount: 15,
    supermarketCount: 8, hospitalCount: 20, bookstoreCount: 3,
    crimeIndex: 400, safetyScore: 60,
    parkAreaM2: 10000, noiseScore: 48, greenRatioPct: 10,
    officeCount: 60, coworkingCount: 6,
  },
  '横浜': {
    stationName: '横浜', lat: 35.443710, lng: 139.638031, lineCount: 7,
    avgRent1K: 7.0, avgRent1LDK: 12.5, populationDensity: 14000,
    dailyPassengers: 200000, morningCongestion: 82,
    izakayaCount: 180, restaurantCount: 550, cafeCount: 75, convenienceStoreCount: 16, ramenCount: 35,
    supermarketCount: 9, hospitalCount: 28, bookstoreCount: 5,
    crimeIndex: 1000, safetyScore: 50,
    parkAreaM2: 10000, noiseScore: 35, greenRatioPct: 6,
    officeCount: 150, coworkingCount: 10,
  },
  '川崎': {
    stationName: '川崎', lat: 35.534700, lng: 139.702884, lineCount: 3,
    avgRent1K: 7.0, avgRent1LDK: 12.0, populationDensity: 16000,
    dailyPassengers: 130000, morningCongestion: 80,
    izakayaCount: 150, restaurantCount: 450, cafeCount: 50, convenienceStoreCount: 15, ramenCount: 30,
    supermarketCount: 10, hospitalCount: 30, bookstoreCount: 5,
    crimeIndex: 900, safetyScore: 48,
    parkAreaM2: 5000, noiseScore: 30, greenRatioPct: 5,
    officeCount: 150, coworkingCount: 8,
  },
  '立川': {
    stationName: '立川', lat: 35.697863, lng: 139.413114, lineCount: 4,
    avgRent1K: 6.5, avgRent1LDK: 11.0, populationDensity: 10000,
    dailyPassengers: 90000, morningCongestion: 72,
    izakayaCount: 80, restaurantCount: 250, cafeCount: 35, convenienceStoreCount: 12, ramenCount: 20,
    supermarketCount: 8, hospitalCount: 20, bookstoreCount: 4,
    crimeIndex: 500, safetyScore: 55,
    parkAreaM2: 30000, noiseScore: 45, greenRatioPct: 12,
    officeCount: 80, coworkingCount: 6,
  },
  '町田': {
    stationName: '町田', lat: 35.544240, lng: 139.444435, lineCount: 2,
    avgRent1K: 5.8, avgRent1LDK: 9.5, populationDensity: 10000,
    dailyPassengers: 120000, morningCongestion: 75,
    izakayaCount: 100, restaurantCount: 350, cafeCount: 40, convenienceStoreCount: 15, ramenCount: 25,
    supermarketCount: 12, hospitalCount: 30, bookstoreCount: 5,
    crimeIndex: 700, safetyScore: 50,
    parkAreaM2: 8000, noiseScore: 40, greenRatioPct: 10,
    officeCount: 50, coworkingCount: 4,
  },
  '藤沢': {
    stationName: '藤沢', lat: 35.339490, lng: 139.490066, lineCount: 3,
    avgRent1K: 5.5, avgRent1LDK: 9.0, populationDensity: 8000,
    dailyPassengers: 80000, morningCongestion: 65,
    izakayaCount: 70, restaurantCount: 200, cafeCount: 25, convenienceStoreCount: 10, ramenCount: 15,
    supermarketCount: 8, hospitalCount: 20, bookstoreCount: 3,
    crimeIndex: 450, safetyScore: 55,
    parkAreaM2: 10000, noiseScore: 50, greenRatioPct: 12,
    officeCount: 30, coworkingCount: 3,
  },
  '荒川': {
    stationName: '荒川', lat: 35.736800, lng: 139.785200, lineCount: 1,
    avgRent1K: 5.5, avgRent1LDK: 9.0, populationDensity: 13000,
    dailyPassengers: 8000, morningCongestion: 25,
    izakayaCount: 15, restaurantCount: 50, cafeCount: 5, convenienceStoreCount: 3, ramenCount: 5,
    supermarketCount: 3, hospitalCount: 8, bookstoreCount: 1,
    crimeIndex: 200, safetyScore: 65,
    parkAreaM2: 12000, noiseScore: 68, greenRatioPct: 15,
    officeCount: 5, coworkingCount: 0,
  },
};

export function getStationStats(name: string): StationStats | undefined {
  return stationStatsData[name];
}

/** 指定パラメータの全駅中の最小・最大値を返す（ヒートマップ正規化用） */
export function getParamRange(key: keyof StationStats): { min: number; max: number } {
  const values = Object.values(stationStatsData)
    .map(s => s[key] as number | undefined)
    .filter((v): v is number => v !== undefined);
  if (values.length === 0) return { min: 0, max: 1 };
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** カスタム式でスコアを計算（0〜100に正規化して返す） */
export function calcCustomScore(
  stats: StationStats,
  formula: CustomScoreFormula,
): number {
  let raw = 0;
  let totalAbsWeight = 0;
  for (const [key, weight] of Object.entries(formula.weights)) {
    const val = stats[key as keyof StationStats] as number | undefined;
    if (val === undefined || weight === undefined) continue;
    const { min, max } = getParamRange(key as keyof StationStats);
    const normalized = max > min ? (val - min) / (max - min) : 0.5;
    raw += normalized * weight;
    totalAbsWeight += Math.abs(weight);
  }
  if (totalAbsWeight === 0) return 50;
  // -1〜1 → 0〜100
  return Math.round(((raw / totalAbsWeight) + 1) / 2 * 100);
}

// ----------------------------------------------------------------
// 駅カラーリング用ユーティリティ
// ----------------------------------------------------------------

/** データなし駅のデフォルトグレー */
export const HEATMAP_NO_DATA_COLOR = '#aaaaaa';

/** グラデーション定義（青→水色→黄→橙→赤）— ここだけ変えれば全体に反映 */
export const GRADIENT_STOPS: Array<[number, [number, number, number]]> = [
  [0.00, [49,  54,  149]],  // #313695 (dark blue)
  [0.25, [116, 173, 209]],  // #74add1
  [0.50, [254, 224, 144]],  // #fee090
  [0.75, [244, 109,  67]],  // #f46d43
  [1.00, [165,   0,  38]],  // #a50026 (dark red)
];

/** GRADIENT_STOPS から CSS linear-gradient 文字列を生成 */
export function buildGradientCss(direction = 'to right'): string {
  const stops = GRADIENT_STOPS
    .map(([t, [r, g, b]]) => `rgb(${r},${g},${b}) ${Math.round(t * 100)}%`)
    .join(', ');
  return `linear-gradient(${direction}, ${stops})`;
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

/** 0〜1 の正規化値を16進カラーに変換 */
export function heatValueToColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const [t0, c0] = GRADIENT_STOPS[i];
    const [t1, c1] = GRADIENT_STOPS[i + 1];
    if (clamped <= t1) {
      const frac = (clamped - t0) / (t1 - t0);
      const r = lerp(c0[0], c1[0], frac);
      const g = lerp(c0[1], c1[1], frac);
      const b = lerp(c0[2], c1[2], frac);
      return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    }
  }
  return '#a50026';
}

/**
 * 駅名とパラメータキーからヒートカラーを返す。
 * データなし → HEATMAP_NO_DATA_COLOR
 */
export function getStationHeatColor(
  stationName: string,
  paramKey: keyof StationStats,
): string {
  const stats = stationStatsData[stationName];
  if (!stats) return HEATMAP_NO_DATA_COLOR;
  const val = stats[paramKey] as number | undefined;
  if (val === undefined) return HEATMAP_NO_DATA_COLOR;

  const meta = STAT_PARAMS.find(p => p.key === paramKey);
  const { min, max } = getParamRange(paramKey);
  const normalized = max > min ? (val - min) / (max - min) : 0.5;
  // higherIsBetter=false → 値が高いほど赤（危険）なので反転しない。高=赤がデフォルト。
  // higherIsBetter=true  → 値が高いほど良い → 高いほど赤 のままでOK（赤=多い/高い を示す）
  // ただし safetyScore など「高いほど良い」でも赤=危険に見えるため反転してもよい。
  // ここでは「赤=値が高い」と統一し、UI側で説明を補う。
  return heatValueToColor(normalized);
}
