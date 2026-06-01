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
  description: string;        // データの説明
  methodology?: string;       // 集計方法: '中央値', '平均値', '推計', '公表値' など
  period?: string;            // 基準時点: '2024年通年', '2025年1月時点' など
  radius?: string;            // 計測範囲: '駅出口から半径500m以内' など（countに使用）
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
  {
    key: 'avgRent1K', label: '家賃(1K)', unit: '万円', category: 'housing', higherIsBetter: false,
    description: '1K（専有面積 20〜30㎡程度）の月額賃料',
    methodology: '中央値（掲載物件の賃料分布の中央）',
    period: '2024〜2025年 SUUMO/HOMES 掲載物件をもとに推計',
  },
  {
    key: 'avgRent1LDK', label: '家賃(1LDK)', unit: '万円', category: 'housing', higherIsBetter: false,
    description: '1LDK（専有面積 30〜50㎡程度）の月額賃料',
    methodology: '中央値（掲載物件の賃料分布の中央）',
    period: '2024〜2025年 SUUMO/HOMES 掲載物件をもとに推計',
  },
  {
    key: 'populationDensity', label: '人口密度', unit: '人/km²', category: 'housing', higherIsBetter: false,
    description: '駅周辺（概ね半径1km圏）の人口密度',
    methodology: '平均値（国勢調査の町丁別人口を面積で除算）',
    period: '令和2年（2020年）国勢調査',
  },
  // 交通
  {
    key: 'dailyPassengers', label: '乗降客数', unit: '人/日', category: 'transport', higherIsBetter: false,
    description: '一日の乗降客数合計（複数社乗り入れ駅は合算）',
    methodology: '公表値（各鉄道事業者の駅別乗降人員調査）',
    period: '2022〜2023年度実績',
  },
  {
    key: 'morningCongestion', label: '朝混雑度', unit: '（0-100）', category: 'transport', higherIsBetter: false,
    description: '朝ラッシュ時の混雑度。高いほど混んでいる',
    methodology: '推計（乗降客数・路線本数・列車混雑率をもとに0〜100で正規化）',
    period: '2023年度データをもとに推計',
  },
  // 飲食
  { key: 'izakayaCount',        label: '居酒屋数',   unit: '軒', category: 'food',         higherIsBetter: true,  description: '居酒屋数', radius: '駅出口から半径500m以内', methodology: '店舗数（概算）', period: '2024年時点' },
  { key: 'restaurantCount',     label: '飲食店数',   unit: '軒', category: 'food',         higherIsBetter: true,  description: '飲食店全般数', radius: '駅出口から半径500m以内', methodology: '店舗数（概算）', period: '2024年時点' },
  { key: 'cafeCount',           label: 'カフェ数',   unit: '軒', category: 'food',         higherIsBetter: true,  description: 'カフェ・喫茶店数', radius: '駅出口から半径500m以内', methodology: '店舗数（概算）', period: '2024年時点' },
  { key: 'convenienceStoreCount', label: 'コンビニ数', unit: '軒', category: 'food',       higherIsBetter: true,  description: 'コンビニエンスストア数', radius: '駅出口から半径500m以内', methodology: '店舗数（概算）', period: '2024年時点' },
  { key: 'ramenCount',          label: 'ラーメン屋数', unit: '軒', category: 'food',       higherIsBetter: true,  description: 'ラーメン専門店数', radius: '駅出口から半径500m以内', methodology: '店舗数（概算）', period: '2024年時点' },
  // 生活利便性
  { key: 'supermarketCount',    label: 'スーパー数', unit: '軒', category: 'convenience',  higherIsBetter: true,  description: 'スーパーマーケット数', radius: '駅出口から半径500m以内', methodology: '店舗数（概算）', period: '2024年時点' },
  { key: 'hospitalCount',       label: '病院・医院数', unit: '軒', category: 'convenience', higherIsBetter: true, description: '病院・クリニック数', radius: '駅出口から半径500m以内', methodology: '施設数（概算）', period: '2024年時点' },
  { key: 'bookstoreCount',      label: '書店数',     unit: '軒', category: 'convenience',  higherIsBetter: true,  description: '書店数', radius: '駅出口から半径500m以内', methodology: '店舗数（概算）', period: '2024年時点' },
  // 治安
  {
    key: 'crimeIndex', label: '犯罪件数', unit: '件/年', category: 'safety', higherIsBetter: false,
    description: '年間犯罪発生件数（低いほど安全）',
    methodology: '公表値（警視庁 町丁別認知件数統計）',
    period: '2023年（令和5年）年間実績',
  },
  {
    key: 'safetyScore', label: '治安スコア', unit: '（0-100）', category: 'safety', higherIsBetter: true,
    description: '犯罪件数・人口密度をもとに算出した総合治安スコア。高いほど安全',
    methodology: '独自スコアリング（犯罪件数を人口で除した犯罪率を0〜100に正規化）',
    period: '2023年データをもとに推計',
  },
  // 環境
  { key: 'parkAreaM2',     label: '公園面積',   unit: 'm²',      category: 'environment', higherIsBetter: true,  description: '公園面積合計', radius: '駅出口から半径500m以内', methodology: '国土数値情報 都市公園データの面積合算', period: '2020年国土数値情報' },
  { key: 'noiseScore',     label: '静かさ',     unit: '（0-100）', category: 'environment', higherIsBetter: true,  description: '騒音の少なさスコア。高いほど静か', methodology: '推計（乗降客数・幹線道路密度・飲食店密度をもとに0〜100で正規化）', period: '2024年データをもとに推計' },
  { key: 'greenRatioPct',  label: '緑地率',     unit: '%',       category: 'environment', higherIsBetter: true,  description: '周辺の緑地・公園の面積割合', methodology: '推計（衛星画像・都市計画図をもとに算出）', period: '2020〜2024年データをもとに推計' },
  // 仕事
  { key: 'officeCount',    label: 'オフィス数', unit: '棟',      category: 'work',        higherIsBetter: true,  description: 'オフィスビル棟数', radius: '駅出口から半径500m以内', methodology: '棟数（概算）', period: '2024年時点' },
  { key: 'coworkingCount', label: 'コワーキング数', unit: '軒',  category: 'work',        higherIsBetter: true,  description: 'コワーキングスペース数', radius: '駅出口から半径500m以内', methodology: '店舗数（概算）', period: '2024年時点' },
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

  // ======== 都心・高級エリア ========
  '銀座': { stationName: '銀座', lat: 35.671656, lng: 139.764520, lineCount: 4, avgRent1K: 14.5, avgRent1LDK: 25.0 },
  '表参道': { stationName: '表参道', lat: 35.665498, lng: 139.712284, lineCount: 3, avgRent1K: 14.0, avgRent1LDK: 24.0 },
  '六本木': { stationName: '六本木', lat: 35.662836, lng: 139.731523, lineCount: 2, avgRent1K: 16.0, avgRent1LDK: 27.0 },
  '麻布十番': { stationName: '麻布十番', lat: 35.656739, lng: 139.738188, lineCount: 2, avgRent1K: 15.5, avgRent1LDK: 26.5 },
  '広尾': { stationName: '広尾', lat: 35.649424, lng: 139.720302, lineCount: 1, avgRent1K: 14.5, avgRent1LDK: 25.0 },
  '白金高輪': { stationName: '白金高輪', lat: 35.640932, lng: 139.728005, lineCount: 2, avgRent1K: 14.0, avgRent1LDK: 24.0 },
  '赤坂見附': { stationName: '赤坂見附', lat: 35.678047, lng: 139.735286, lineCount: 2, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '赤坂': { stationName: '赤坂', lat: 35.674455, lng: 139.735963, lineCount: 1, avgRent1K: 14.5, avgRent1LDK: 25.0 },
  '乃木坂': { stationName: '乃木坂', lat: 35.668209, lng: 139.729472, lineCount: 1, avgRent1K: 14.0, avgRent1LDK: 24.0 },
  '青山一丁目': { stationName: '青山一丁目', lat: 35.671825, lng: 139.722720, lineCount: 2, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '外苑前': { stationName: '外苑前', lat: 35.671965, lng: 139.716949, lineCount: 1, avgRent1K: 14.0, avgRent1LDK: 24.0 },
  '代官山': { stationName: '代官山', lat: 35.648735, lng: 139.703248, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '四ツ谷': { stationName: '四ツ谷', lat: 35.686728, lng: 139.730195, lineCount: 3, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '飯田橋': { stationName: '飯田橋', lat: 35.702324, lng: 139.747610, lineCount: 5, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '市ヶ谷': { stationName: '市ヶ谷', lat: 35.693858, lng: 139.737218, lineCount: 4, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '九段下': { stationName: '九段下', lat: 35.695555, lng: 139.750641, lineCount: 3, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '虎ノ門': { stationName: '虎ノ門', lat: 35.667153, lng: 139.749737, lineCount: 2, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '霞ケ関': { stationName: '霞ケ関', lat: 35.675501, lng: 139.749906, lineCount: 3, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '日比谷': { stationName: '日比谷', lat: 35.673590, lng: 139.758284, lineCount: 3, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '大手町': { stationName: '大手町', lat: 35.686878, lng: 139.762824, lineCount: 5, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '茅場町': { stationName: '茅場町', lat: 35.677832, lng: 139.779498, lineCount: 2, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '門前仲町': { stationName: '門前仲町', lat: 35.671729, lng: 139.797807, lineCount: 2, avgRent1K: 9.0, avgRent1LDK: 15.5 },
  '清澄白河': { stationName: '清澄白河', lat: 35.680629, lng: 139.793977, lineCount: 2, avgRent1K: 9.5, avgRent1LDK: 16.5 },
  '豊洲': { stationName: '豊洲', lat: 35.659066, lng: 139.795347, lineCount: 2, avgRent1K: 9.5, avgRent1LDK: 16.5 },
  '月島': { stationName: '月島', lat: 35.665977, lng: 139.782839, lineCount: 2, avgRent1K: 10.5, avgRent1LDK: 18.0 },
  '勝どき': { stationName: '勝どき', lat: 35.660018, lng: 139.775989, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.5 },
  '築地': { stationName: '築地', lat: 35.666278, lng: 139.773939, lineCount: 1, avgRent1K: 12.0, avgRent1LDK: 20.5 },

  // ======== 中央線沿線 ========
  '御茶ノ水': { stationName: '御茶ノ水', lat: 35.697797, lng: 139.765665, lineCount: 3, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '水道橋': { stationName: '水道橋', lat: 35.701874, lng: 139.753440, lineCount: 2, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '中野': { stationName: '中野', lat: 35.707690, lng: 139.665500, lineCount: 2, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '高円寺': { stationName: '高円寺', lat: 35.705197, lng: 139.649101, lineCount: 1, avgRent1K: 7.8, avgRent1LDK: 13.0 },
  '阿佐ヶ谷': { stationName: '阿佐ヶ谷', lat: 35.705648, lng: 139.636436, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '荻窪': { stationName: '荻窪', lat: 35.703394, lng: 139.620377, lineCount: 2, avgRent1K: 7.8, avgRent1LDK: 13.0 },
  '西荻窪': { stationName: '西荻窪', lat: 35.705072, lng: 139.604996, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '三鷹': { stationName: '三鷹', lat: 35.701616, lng: 139.567985, lineCount: 2, avgRent1K: 7.0, avgRent1LDK: 11.5 },
  '武蔵境': { stationName: '武蔵境', lat: 35.706072, lng: 139.554839, lineCount: 2, avgRent1K: 6.8, avgRent1LDK: 11.5 },
  '国分寺': { stationName: '国分寺', lat: 35.700714, lng: 139.479481, lineCount: 3, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '国立': { stationName: '国立', lat: 35.686272, lng: 139.451067, lineCount: 1, avgRent1K: 6.8, avgRent1LDK: 11.5 },

  // ======== 小田急線 ========
  '代々木上原': { stationName: '代々木上原', lat: 35.662163, lng: 139.682282, lineCount: 2, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '代々木八幡': { stationName: '代々木八幡', lat: 35.669004, lng: 139.694354, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '参宮橋': { stationName: '参宮橋', lat: 35.672437, lng: 139.693611, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '東北沢': { stationName: '東北沢', lat: 35.659500, lng: 139.680244, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '世田谷代田': { stationName: '世田谷代田', lat: 35.655049, lng: 139.670849, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '梅ヶ丘': { stationName: '梅ヶ丘', lat: 35.648813, lng: 139.662113, lineCount: 1, avgRent1K: 9.0, avgRent1LDK: 15.5 },
  '豪徳寺': { stationName: '豪徳寺', lat: 35.645649, lng: 139.654327, lineCount: 1, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '経堂': { stationName: '経堂', lat: 35.644830, lng: 139.639702, lineCount: 1, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '千歳船橋': { stationName: '千歳船橋', lat: 35.641130, lng: 139.628230, lineCount: 1, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '祖師ヶ谷大蔵': { stationName: '祖師ヶ谷大蔵', lat: 35.636085, lng: 139.615579, lineCount: 1, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '成城学園前': { stationName: '成城学園前', lat: 35.629674, lng: 139.602404, lineCount: 1, avgRent1K: 9.5, avgRent1LDK: 16.5 },
  '喜多見': { stationName: '喜多見', lat: 35.620890, lng: 139.593180, lineCount: 1, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '狛江': { stationName: '狛江', lat: 35.630730, lng: 139.577380, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '登戸': { stationName: '登戸', lat: 35.587940, lng: 139.577259, lineCount: 2, avgRent1K: 7.0, avgRent1LDK: 12.0 },
  '向ヶ丘遊園': { stationName: '向ヶ丘遊園', lat: 35.586039, lng: 139.562004, lineCount: 1, avgRent1K: 6.8, avgRent1LDK: 11.5 },
  '新百合ヶ丘': { stationName: '新百合ヶ丘', lat: 35.596478, lng: 139.510132, lineCount: 2, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '相模大野': { stationName: '相模大野', lat: 35.529695, lng: 139.443598, lineCount: 2, avgRent1K: 5.5, avgRent1LDK: 9.5 },
  '海老名': { stationName: '海老名', lat: 35.446474, lng: 139.394150, lineCount: 3, avgRent1K: 5.8, avgRent1LDK: 10.0 },
  '本厚木': { stationName: '本厚木', lat: 35.441876, lng: 139.363232, lineCount: 1, avgRent1K: 5.8, avgRent1LDK: 9.8 },

  // ======== 東急田園都市線 ========
  '池尻大橋': { stationName: '池尻大橋', lat: 35.650221, lng: 139.692737, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '駒沢大学': { stationName: '駒沢大学', lat: 35.631483, lng: 139.684940, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '桜新町': { stationName: '桜新町', lat: 35.618858, lng: 139.676617, lineCount: 1, avgRent1K: 9.5, avgRent1LDK: 16.0 },
  '用賀': { stationName: '用賀', lat: 35.606356, lng: 139.671418, lineCount: 1, avgRent1K: 9.0, avgRent1LDK: 15.5 },
  '溝の口': { stationName: '溝の口', lat: 35.584420, lng: 139.613135, lineCount: 2, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  'たまプラーザ': { stationName: 'たまプラーザ', lat: 35.556387, lng: 139.590820, lineCount: 1, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  'あざみ野': { stationName: 'あざみ野', lat: 35.559792, lng: 139.577295, lineCount: 2, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '青葉台': { stationName: '青葉台', lat: 35.539186, lng: 139.534285, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '長津田': { stationName: '長津田', lat: 35.530899, lng: 139.499977, lineCount: 3, avgRent1K: 7.0, avgRent1LDK: 11.8 },

  // ======== 東急東横線 ========
  '学芸大学': { stationName: '学芸大学', lat: 35.624370, lng: 139.676184, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '都立大学': { stationName: '都立大学', lat: 35.617908, lng: 139.676184, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '田園調布': { stationName: '田園調布', lat: 35.598238, lng: 139.661548, lineCount: 2, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '多摩川': { stationName: '多摩川', lat: 35.583978, lng: 139.659590, lineCount: 2, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '新丸子': { stationName: '新丸子', lat: 35.576641, lng: 139.659590, lineCount: 1, avgRent1K: 9.0, avgRent1LDK: 15.5 },
  '元住吉': { stationName: '元住吉', lat: 35.565843, lng: 139.657049, lineCount: 1, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '日吉': { stationName: '日吉', lat: 35.550823, lng: 139.644219, lineCount: 2, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '綱島': { stationName: '綱島', lat: 35.530997, lng: 139.633082, lineCount: 1, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '大倉山': { stationName: '大倉山', lat: 35.521660, lng: 139.625671, lineCount: 1, avgRent1K: 7.8, avgRent1LDK: 13.0 },
  '菊名': { stationName: '菊名', lat: 35.509638, lng: 139.627138, lineCount: 2, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '白楽': { stationName: '白楽', lat: 35.490760, lng: 139.624413, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.8 },

  // ======== 京王線 ========
  '明大前': { stationName: '明大前', lat: 35.670072, lng: 139.653152, lineCount: 2, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '下高井戸': { stationName: '下高井戸', lat: 35.663823, lng: 139.638428, lineCount: 2, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '千歳烏山': { stationName: '千歳烏山', lat: 35.663962, lng: 139.581424, lineCount: 1, avgRent1K: 7.8, avgRent1LDK: 13.0 },
  '調布': { stationName: '調布', lat: 35.652411, lng: 139.544296, lineCount: 2, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '府中': { stationName: '府中', lat: 35.667156, lng: 139.476346, lineCount: 2, avgRent1K: 6.5, avgRent1LDK: 11.0 },

  // ======== 西武池袋線 ========
  '練馬': { stationName: '練馬', lat: 35.736979, lng: 139.652747, lineCount: 3, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '石神井公園': { stationName: '石神井公園', lat: 35.737608, lng: 139.616846, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '大泉学園': { stationName: '大泉学園', lat: 35.743561, lng: 139.598350, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '所沢': { stationName: '所沢', lat: 35.798607, lng: 139.468219, lineCount: 3, avgRent1K: 6.0, avgRent1LDK: 10.2 },

  // ======== 東武東上線 ========
  '成増': { stationName: '成増', lat: 35.762220, lng: 139.650163, lineCount: 2, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '和光市': { stationName: '和光市', lat: 35.781399, lng: 139.606291, lineCount: 3, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '朝霞台': { stationName: '朝霞台', lat: 35.795333, lng: 139.593745, lineCount: 2, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '志木': { stationName: '志木', lat: 35.832340, lng: 139.577328, lineCount: 1, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '川越': { stationName: '川越', lat: 35.920737, lng: 139.484949, lineCount: 2, avgRent1K: 5.5, avgRent1LDK: 9.3 },

  // ======== 常磐線・北千住エリア ========
  '北千住': { stationName: '北千住', lat: 35.748097, lng: 139.800867, lineCount: 5, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '南千住': { stationName: '南千住', lat: 35.732106, lng: 139.802237, lineCount: 2, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '三河島': { stationName: '三河島', lat: 35.737316, lng: 139.785726, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '松戸': { stationName: '松戸', lat: 35.788037, lng: 139.902515, lineCount: 2, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '柏': { stationName: '柏', lat: 35.868294, lng: 139.975439, lineCount: 2, avgRent1K: 6.0, avgRent1LDK: 10.2 },

  // ======== 埼京線・赤羽エリア ========
  '赤羽': { stationName: '赤羽', lat: 35.777623, lng: 139.721168, lineCount: 4, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '板橋': { stationName: '板橋', lat: 35.755065, lng: 139.709595, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '十条': { stationName: '十条', lat: 35.762484, lng: 139.719786, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '大宮': { stationName: '大宮', lat: 35.906391, lng: 139.623628, lineCount: 6, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '浦和': { stationName: '浦和', lat: 35.859419, lng: 139.661739, lineCount: 1, avgRent1K: 6.8, avgRent1LDK: 11.5 },
  '武蔵浦和': { stationName: '武蔵浦和', lat: 35.832024, lng: 139.640018, lineCount: 2, avgRent1K: 6.5, avgRent1LDK: 11.0 },

  // ======== 浅草・下町エリア ========
  '浅草': { stationName: '浅草', lat: 35.710985, lng: 139.797505, lineCount: 4, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '蔵前': { stationName: '蔵前', lat: 35.702812, lng: 139.793998, lineCount: 2, avgRent1K: 9.0, avgRent1LDK: 15.5 },
  '両国': { stationName: '両国', lat: 35.696052, lng: 139.794233, lineCount: 2, avgRent1K: 9.5, avgRent1LDK: 16.0 },
  '錦糸町': { stationName: '錦糸町', lat: 35.694696, lng: 139.815271, lineCount: 2, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '亀戸': { stationName: '亀戸', lat: 35.697914, lng: 139.826645, lineCount: 2, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '押上': { stationName: '押上', lat: 35.710381, lng: 139.813069, lineCount: 4, avgRent1K: 8.5, avgRent1LDK: 14.5 },

  // ======== 千代田線沿線 ========
  '代々木公園': { stationName: '代々木公園', lat: 35.667939, lng: 139.694536, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '明治神宮前': { stationName: '明治神宮前', lat: 35.669365, lng: 139.703361, lineCount: 2, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '湯島': { stationName: '湯島', lat: 35.707898, lng: 139.770562, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '根津': { stationName: '根津', lat: 35.720297, lng: 139.761176, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '千駄木': { stationName: '千駄木', lat: 35.725335, lng: 139.762062, lineCount: 1, avgRent1K: 9.5, avgRent1LDK: 16.0 },
  '茗荷谷': { stationName: '茗荷谷', lat: 35.720989, lng: 139.726694, lineCount: 1, avgRent1K: 9.5, avgRent1LDK: 16.0 },
  '後楽園': { stationName: '後楽園', lat: 35.707340, lng: 139.751832, lineCount: 2, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '本郷三丁目': { stationName: '本郷三丁目', lat: 35.707757, lng: 139.762144, lineCount: 2, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '新御茶ノ水': { stationName: '新御茶ノ水', lat: 35.697968, lng: 139.765736, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },

  // ======== 京浜東北線（未入力駅） ========
  'さいたま新都心': { stationName: 'さいたま新都心', lat: 35.893595, lng: 139.633900, lineCount: 1, avgRent1K: 6.3, avgRent1LDK: 10.8 },
  '与野':           { stationName: '与野',           lat: 35.884375, lng: 139.638990, lineCount: 1, avgRent1K: 6.0, avgRent1LDK: 10.2 },
  '北浦和':         { stationName: '北浦和',         lat: 35.872200, lng: 139.645750, lineCount: 1, avgRent1K: 6.3, avgRent1LDK: 10.8 },
  '南浦和':         { stationName: '南浦和',         lat: 35.847585, lng: 139.668940, lineCount: 2, avgRent1K: 6.3, avgRent1LDK: 10.8 },
  '蕨':             { stationName: '蕨',             lat: 35.827930, lng: 139.690415, lineCount: 1, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '西川口':         { stationName: '西川口',         lat: 35.815515, lng: 139.704360, lineCount: 1, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '川口':           { stationName: '川口',           lat: 35.801795, lng: 139.717480, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '東十条':         { stationName: '東十条',         lat: 35.763830, lng: 139.726745, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '王子':           { stationName: '王子',           lat: 35.754387, lng: 139.737411, lineCount: 3, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '上中里':         { stationName: '上中里',         lat: 35.746888, lng: 139.746286, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '高輪ゲートウェイ': { stationName: '高輪ゲートウェイ', lat: 35.635379, lng: 139.740644, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '大井町':         { stationName: '大井町',         lat: 35.607070, lng: 139.735013, lineCount: 3, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '大森':           { stationName: '大森',           lat: 35.588850, lng: 139.728107, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '蒲田':           { stationName: '蒲田',           lat: 35.562472, lng: 139.715983, lineCount: 2, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '鶴見':           { stationName: '鶴見',           lat: 35.507940, lng: 139.675790, lineCount: 2, avgRent1K: 6.8, avgRent1LDK: 11.5 },
  '新子安':         { stationName: '新子安',         lat: 35.486827, lng: 139.654090, lineCount: 2, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '東神奈川':       { stationName: '東神奈川',       lat: 35.477875, lng: 139.633165, lineCount: 2, avgRent1K: 6.8, avgRent1LDK: 11.5 },
  '桜木町':         { stationName: '桜木町',         lat: 35.451100, lng: 139.630880, lineCount: 2, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '関内':           { stationName: '関内',           lat: 35.444220, lng: 139.635987, lineCount: 2, avgRent1K: 7.5, avgRent1LDK: 12.8 },
  '石川町':         { stationName: '石川町',         lat: 35.438907, lng: 139.642917, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '山手':           { stationName: '山手',           lat: 35.426800, lng: 139.646470, lineCount: 1, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '根岸':           { stationName: '根岸',           lat: 35.415860, lng: 139.636095, lineCount: 1, avgRent1K: 6.3, avgRent1LDK: 10.8 },
  '磯子':           { stationName: '磯子',           lat: 35.400575, lng: 139.618470, lineCount: 1, avgRent1K: 6.0, avgRent1LDK: 10.2 },
  '新杉田':         { stationName: '新杉田',         lat: 35.386800, lng: 139.619435, lineCount: 2, avgRent1K: 6.0, avgRent1LDK: 10.2 },
  '洋光台':         { stationName: '洋光台',         lat: 35.378810, lng: 139.596937, lineCount: 1, avgRent1K: 6.0, avgRent1LDK: 10.2 },
  '港南台':         { stationName: '港南台',         lat: 35.375147, lng: 139.576177, lineCount: 1, avgRent1K: 6.0, avgRent1LDK: 10.2 },
  '本郷台':         { stationName: '本郷台',         lat: 35.367855, lng: 139.550115, lineCount: 1, avgRent1K: 5.8, avgRent1LDK: 9.8 },

  // ======== 東京近郊 ========
  '千葉': { stationName: '千葉', lat: 35.613576, lng: 140.111545, lineCount: 5, avgRent1K: 5.5, avgRent1LDK: 9.3 },
  '船橋': { stationName: '船橋', lat: 35.695127, lng: 139.983290, lineCount: 3, avgRent1K: 5.8, avgRent1LDK: 9.8 },
  '八王子': { stationName: '八王子', lat: 35.655642, lng: 139.338987, lineCount: 4, avgRent1K: 5.5, avgRent1LDK: 9.3 },
  '相模原': { stationName: '相模原', lat: 35.574003, lng: 139.373428, lineCount: 1, avgRent1K: 5.0, avgRent1LDK: 8.5 },
  '大船': { stationName: '大船', lat: 35.316605, lng: 139.533258, lineCount: 4, avgRent1K: 6.0, avgRent1LDK: 10.2 },
  '鎌倉': { stationName: '鎌倉', lat: 35.319768, lng: 139.550175, lineCount: 2, avgRent1K: 7.0, avgRent1LDK: 12.0 },

  // ======== 銀座線（追加分） ========
  '田原町':     { stationName: '田原町',     lat: 35.712400, lng: 139.791200, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '稲荷町':     { stationName: '稲荷町',     lat: 35.712700, lng: 139.785500, lineCount: 1, avgRent1K: 8.8,  avgRent1LDK: 15.0 },
  '上野広小路': { stationName: '上野広小路', lat: 35.708600, lng: 139.773500, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '末広町':     { stationName: '末広町',     lat: 35.702500, lng: 139.772400, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.5 },
  '三越前':     { stationName: '三越前',     lat: 35.685900, lng: 139.773100, lineCount: 2, avgRent1K: 12.5, avgRent1LDK: 21.5 },
  '日本橋':     { stationName: '日本橋',     lat: 35.682100, lng: 139.773900, lineCount: 3, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '京橋':       { stationName: '京橋',       lat: 35.675200, lng: 139.769700, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '溜池山王':   { stationName: '溜池山王',   lat: 35.672400, lng: 139.741200, lineCount: 2, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '虎ノ門ヒルズ': { stationName: '虎ノ門ヒルズ', lat: 35.667600, lng: 139.748900, lineCount: 1, avgRent1K: 14.0, avgRent1LDK: 24.0 },

  // ======== 丸ノ内線（追加分） ========
  '新大塚':     { stationName: '新大塚',     lat: 35.726000, lng: 139.729900, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '淡路町':     { stationName: '淡路町',     lat: 35.695200, lng: 139.768800, lineCount: 2, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '新宿御苑前': { stationName: '新宿御苑前', lat: 35.689800, lng: 139.709000, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '新宿三丁目': { stationName: '新宿三丁目', lat: 35.689500, lng: 139.703800, lineCount: 3, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '四谷三丁目': { stationName: '四谷三丁目', lat: 35.686500, lng: 139.721300, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '国会議事堂前': { stationName: '国会議事堂前', lat: 35.674400, lng: 139.743700, lineCount: 2, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '西新宿':     { stationName: '西新宿',     lat: 35.692500, lng: 139.699100, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '中野坂上':   { stationName: '中野坂上',   lat: 35.703700, lng: 139.674800, lineCount: 2, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '新中野':     { stationName: '新中野',     lat: 35.702400, lng: 139.661200, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '東高円寺':   { stationName: '東高円寺',   lat: 35.704800, lng: 139.654500, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '新高円寺':   { stationName: '新高円寺',   lat: 35.706500, lng: 139.643700, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '南阿佐ケ谷': { stationName: '南阿佐ケ谷', lat: 35.704500, lng: 139.630500, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },

  // ======== 日比谷線（追加分） ========
  '三ノ輪':     { stationName: '三ノ輪',     lat: 35.732200, lng: 139.795000, lineCount: 2, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '入谷':       { stationName: '入谷',       lat: 35.723600, lng: 139.783800, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '仲御徒町':   { stationName: '仲御徒町',   lat: 35.709500, lng: 139.777500, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '小伝馬町':   { stationName: '小伝馬町',   lat: 35.694600, lng: 139.779900, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '人形町':     { stationName: '人形町',     lat: 35.690500, lng: 139.780900, lineCount: 2, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '八丁堀':     { stationName: '八丁堀',     lat: 35.672700, lng: 139.777900, lineCount: 2, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '東銀座':     { stationName: '東銀座',     lat: 35.669800, lng: 139.768700, lineCount: 2, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '神谷町':     { stationName: '神谷町',     lat: 35.666700, lng: 139.744200, lineCount: 1, avgRent1K: 14.0, avgRent1LDK: 24.0 },

  // ======== 東西線（追加分） ========
  '落合':       { stationName: '落合',       lat: 35.713000, lng: 139.685400, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '早稲田':     { stationName: '早稲田',     lat: 35.710200, lng: 139.720400, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '神楽坂':     { stationName: '神楽坂',     lat: 35.704800, lng: 139.737700, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '竹橋':       { stationName: '竹橋',       lat: 35.692400, lng: 139.758800, lineCount: 1, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '木場':       { stationName: '木場',       lat: 35.672600, lng: 139.808700, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '東陽町':     { stationName: '東陽町',     lat: 35.668500, lng: 139.816400, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '南砂町':     { stationName: '南砂町',     lat: 35.668000, lng: 139.828500, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '西葛西':     { stationName: '西葛西',     lat: 35.657100, lng: 139.875900, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '葛西':       { stationName: '葛西',       lat: 35.661700, lng: 139.881800, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '浦安':       { stationName: '浦安',       lat: 35.668500, lng: 139.899700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 12.0 },
  '南行徳':     { stationName: '南行徳',     lat: 35.676400, lng: 139.911500, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '行徳':       { stationName: '行徳',       lat: 35.681600, lng: 139.921200, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '妙典':       { stationName: '妙典',       lat: 35.681500, lng: 139.932500, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '原木中山':   { stationName: '原木中山',   lat: 35.682800, lng: 139.953100, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '西船橋':     { stationName: '西船橋',     lat: 35.694700, lng: 139.979300, lineCount: 5, avgRent1K: 6.5,  avgRent1LDK: 11.0 },

  // ======== 千代田線（追加分） ========
  '二重橋前':   { stationName: '二重橋前',   lat: 35.680400, lng: 139.759900, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '町屋':       { stationName: '町屋',       lat: 35.742000, lng: 139.779900, lineCount: 3, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '亀有':       { stationName: '亀有',       lat: 35.769000, lng: 139.844600, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '綾瀬':       { stationName: '綾瀬',       lat: 35.759300, lng: 139.827200, lineCount: 2, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '北綾瀬':     { stationName: '北綾瀬',     lat: 35.769400, lng: 139.825700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '金町':       { stationName: '金町',       lat: 35.774200, lng: 139.868800, lineCount: 2, avgRent1K: 6.8,  avgRent1LDK: 11.5 },

  // ======== 有楽町線・副都心線（追加分） ========
  '地下鉄成増': { stationName: '地下鉄成増', lat: 35.762200, lng: 139.651400, lineCount: 2, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '地下鉄赤塚': { stationName: '地下鉄赤塚', lat: 35.771800, lng: 139.637200, lineCount: 2, avgRent1K: 7.2,  avgRent1LDK: 12.0 },
  '平和台':     { stationName: '平和台',     lat: 35.779000, lng: 139.630600, lineCount: 2, avgRent1K: 7.2,  avgRent1LDK: 12.0 },
  '氷川台':     { stationName: '氷川台',     lat: 35.771400, lng: 139.620400, lineCount: 2, avgRent1K: 7.2,  avgRent1LDK: 12.0 },
  '小竹向原':   { stationName: '小竹向原',   lat: 35.751700, lng: 139.658600, lineCount: 2, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '千川':       { stationName: '千川',       lat: 35.744800, lng: 139.662100, lineCount: 2, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '要町':       { stationName: '要町',       lat: 35.739000, lng: 139.663200, lineCount: 2, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '東池袋':     { stationName: '東池袋',     lat: 35.728800, lng: 139.716100, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '護国寺':     { stationName: '護国寺',     lat: 35.720500, lng: 139.734200, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '江戸川橋':   { stationName: '江戸川橋',   lat: 35.710700, lng: 139.740600, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '麹町':       { stationName: '麹町',       lat: 35.686000, lng: 139.734500, lineCount: 1, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '永田町':     { stationName: '永田町',     lat: 35.678900, lng: 139.742900, lineCount: 3, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '桜田門':     { stationName: '桜田門',     lat: 35.676000, lng: 139.753200, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '銀座一丁目': { stationName: '銀座一丁目', lat: 35.671000, lng: 139.766200, lineCount: 1, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '新富町':     { stationName: '新富町',     lat: 35.666800, lng: 139.774800, lineCount: 1, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '辰巳':       { stationName: '辰巳',       lat: 35.651000, lng: 139.802400, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '新木場':     { stationName: '新木場',     lat: 35.647900, lng: 139.815800, lineCount: 3, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '雑司が谷':   { stationName: '雑司が谷',   lat: 35.730000, lng: 139.713200, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '西早稲田':   { stationName: '西早稲田',   lat: 35.712800, lng: 139.718000, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '東新宿':     { stationName: '東新宿',     lat: 35.700100, lng: 139.706000, lineCount: 2, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '北参道':     { stationName: '北参道',     lat: 35.674400, lng: 139.701300, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },

  // ======== 半蔵門線（追加分） ========
  '中央林間':   { stationName: '中央林間',   lat: 35.487600, lng: 139.452400, lineCount: 2, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  'つきみ野':   { stationName: 'つきみ野',   lat: 35.490600, lng: 139.460200, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '南町田グランベリーパーク': { stationName: '南町田グランベリーパーク', lat: 35.500600, lng: 139.473800, lineCount: 1, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  'つくし野':   { stationName: 'つくし野',   lat: 35.510400, lng: 139.485600, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  'すずかけ台': { stationName: 'すずかけ台', lat: 35.516000, lng: 139.492600, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '田奈':       { stationName: '田奈',       lat: 35.528200, lng: 139.511500, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '藤が丘':     { stationName: '藤が丘',     lat: 35.545200, lng: 139.530800, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '市が尾':     { stationName: '市が尾',     lat: 35.551300, lng: 139.548500, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '江田':       { stationName: '江田',       lat: 35.553100, lng: 139.565700, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '半蔵門':     { stationName: '半蔵門',     lat: 35.680500, lng: 139.751900, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '神保町':     { stationName: '神保町',     lat: 35.694600, lng: 139.757400, lineCount: 3, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '水天宮前':   { stationName: '水天宮前',   lat: 35.685000, lng: 139.782900, lineCount: 1, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '住吉':       { stationName: '住吉',       lat: 35.697800, lng: 139.818800, lineCount: 2, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '二子新地':   { stationName: '二子新地',   lat: 35.600100, lng: 139.612800, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '高津':       { stationName: '高津',       lat: 35.589900, lng: 139.613800, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '梶が谷':     { stationName: '梶が谷',     lat: 35.580900, lng: 139.597800, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '宮崎台':     { stationName: '宮崎台',     lat: 35.572700, lng: 139.585600, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '宮前平':     { stationName: '宮前平',     lat: 35.567400, lng: 139.581300, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '鷺沼':       { stationName: '鷺沼',       lat: 35.562000, lng: 139.574600, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },

  // ======== 南北線（追加分） ========
  '白金台':       { stationName: '白金台',       lat: 35.643500, lng: 139.724500, lineCount: 2, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '六本木一丁目': { stationName: '六本木一丁目', lat: 35.662500, lng: 139.735100, lineCount: 1, avgRent1K: 14.5, avgRent1LDK: 25.0 },
  '東大前':       { stationName: '東大前',       lat: 35.720900, lng: 139.762400, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '本駒込':       { stationName: '本駒込',       lat: 35.731100, lng: 139.755300, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '西ケ原':       { stationName: '西ケ原',       lat: 35.742200, lng: 139.743800, lineCount: 2, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '王子神谷':     { stationName: '王子神谷',     lat: 35.763100, lng: 139.731900, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '志茂':         { stationName: '志茂',         lat: 35.773700, lng: 139.723700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '赤羽岩淵':     { stationName: '赤羽岩淵',     lat: 35.783100, lng: 139.719200, lineCount: 2, avgRent1K: 7.5,  avgRent1LDK: 12.5 },

  // ======== 都営浅草線（追加分） ========
  '本所吾妻橋': { stationName: '本所吾妻橋', lat: 35.709200, lng: 139.804800, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '浅草橋':     { stationName: '浅草橋',     lat: 35.697700, lng: 139.786700, lineCount: 2, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '東日本橋':   { stationName: '東日本橋',   lat: 35.692300, lng: 139.785500, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '宝町':       { stationName: '宝町',       lat: 35.676400, lng: 139.771900, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '大門':       { stationName: '大門',       lat: 35.656100, lng: 139.754200, lineCount: 2, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '三田':       { stationName: '三田',       lat: 35.648000, lng: 139.742900, lineCount: 3, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '泉岳寺':     { stationName: '泉岳寺',     lat: 35.639400, lng: 139.738500, lineCount: 2, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '高輪台':     { stationName: '高輪台',     lat: 35.631400, lng: 139.736200, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '戸越':       { stationName: '戸越',       lat: 35.614700, lng: 139.724500, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '中延':       { stationName: '中延',       lat: 35.607500, lng: 139.718700, lineCount: 2, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '馬込':       { stationName: '馬込',       lat: 35.596000, lng: 139.716400, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '西馬込':     { stationName: '西馬込',     lat: 35.590400, lng: 139.710900, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.8 },

  // ======== 都営三田線（追加分） ========
  '芝公園':       { stationName: '芝公園',       lat: 35.655400, lng: 139.748300, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '御成門':       { stationName: '御成門',       lat: 35.659500, lng: 139.751600, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '内幸町':       { stationName: '内幸町',       lat: 35.671200, lng: 139.754300, lineCount: 1, avgRent1K: 13.5, avgRent1LDK: 23.0 },
  '春日':         { stationName: '春日',         lat: 35.707200, lng: 139.751500, lineCount: 2, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '白山':         { stationName: '白山',         lat: 35.716100, lng: 139.748000, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '千石':         { stationName: '千石',         lat: 35.722400, lng: 139.742800, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '西巣鴨':       { stationName: '西巣鴨',       lat: 35.737600, lng: 139.728100, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '新板橋':       { stationName: '新板橋',       lat: 35.747500, lng: 139.715200, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '板橋区役所前': { stationName: '板橋区役所前', lat: 35.752500, lng: 139.707700, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '板橋本町':     { stationName: '板橋本町',     lat: 35.757400, lng: 139.702700, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '本蓮沼':       { stationName: '本蓮沼',       lat: 35.763100, lng: 139.697000, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '志村坂上':     { stationName: '志村坂上',     lat: 35.769400, lng: 139.692700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '志村三丁目':   { stationName: '志村三丁目',   lat: 35.773700, lng: 139.690700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '蓮根':         { stationName: '蓮根',         lat: 35.779200, lng: 139.688400, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '西台':         { stationName: '西台',         lat: 35.784200, lng: 139.688400, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '高島平':       { stationName: '高島平',       lat: 35.787400, lng: 139.691600, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '新高島平':     { stationName: '新高島平',     lat: 35.788700, lng: 139.697000, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '西高島平':     { stationName: '西高島平',     lat: 35.789500, lng: 139.701700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },

  // ======== 都営新宿線（追加分） ========
  '曙橋':   { stationName: '曙橋',   lat: 35.695100, lng: 139.730600, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '小川町': { stationName: '小川町', lat: 35.697600, lng: 139.765200, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '岩本町': { stationName: '岩本町', lat: 35.696300, lng: 139.773900, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '馬喰横山': { stationName: '馬喰横山', lat: 35.692300, lng: 139.782800, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '浜町':   { stationName: '浜町',   lat: 35.688900, lng: 139.787900, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '森下':   { stationName: '森下',   lat: 35.690900, lng: 139.801600, lineCount: 2, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '菊川':   { stationName: '菊川',   lat: 35.693000, lng: 139.807400, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '西大島': { stationName: '西大島', lat: 35.693600, lng: 139.830600, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '大島':   { stationName: '大島',   lat: 35.694900, lng: 139.839400, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '東大島': { stationName: '東大島', lat: 35.692400, lng: 139.850500, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '船堀':   { stationName: '船堀',   lat: 35.697600, lng: 139.869200, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '一之江': { stationName: '一之江', lat: 35.693700, lng: 139.880700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '瑞江':   { stationName: '瑞江',   lat: 35.685500, lng: 139.891800, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '篠崎':   { stationName: '篠崎',   lat: 35.692800, lng: 139.902000, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '本八幡': { stationName: '本八幡', lat: 35.726000, lng: 139.929600, lineCount: 2, avgRent1K: 6.5,  avgRent1LDK: 11.0 },

  // ======== 都営大江戸線（追加分） ========
  '都庁前':     { stationName: '都庁前',     lat: 35.690000, lng: 139.692100, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '新宿西口':   { stationName: '新宿西口',   lat: 35.693400, lng: 139.696800, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '若松河田':   { stationName: '若松河田',   lat: 35.702100, lng: 139.718200, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '牛込柳町':   { stationName: '牛込柳町',   lat: 35.699100, lng: 139.733200, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '牛込神楽坂': { stationName: '牛込神楽坂', lat: 35.701900, lng: 139.741300, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '上野御徒町': { stationName: '上野御徒町', lat: 35.707500, lng: 139.773500, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '新御徒町':   { stationName: '新御徒町',   lat: 35.707200, lng: 139.776100, lineCount: 2, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '国立競技場': { stationName: '国立競技場', lat: 35.668600, lng: 139.715000, lineCount: 1, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '築地市場':   { stationName: '築地市場',   lat: 35.666100, lng: 139.773500, lineCount: 1, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '汐留':       { stationName: '汐留',       lat: 35.658000, lng: 139.757800, lineCount: 2, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '赤羽橋':     { stationName: '赤羽橋',     lat: 35.651100, lng: 139.748900, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '西新宿五丁目': { stationName: '西新宿五丁目', lat: 35.693900, lng: 139.682300, lineCount: 1, avgRent1K: 9.5, avgRent1LDK: 16.0 },
  '落合南長崎': { stationName: '落合南長崎', lat: 35.711100, lng: 139.658200, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '新江古田':   { stationName: '新江古田',   lat: 35.718500, lng: 139.664600, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '豊島園':     { stationName: '豊島園',     lat: 35.734700, lng: 139.648700, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '練馬春日町': { stationName: '練馬春日町', lat: 35.741700, lng: 139.649700, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '光が丘':     { stationName: '光が丘',     lat: 35.751000, lng: 139.627300, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },

  // ======== 京急線（追加分） ========
  '北品川':   { stationName: '北品川',   lat: 35.618400, lng: 139.737300, lineCount: 1, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '新馬場':   { stationName: '新馬場',   lat: 35.609900, lng: 139.737300, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '青物横丁': { stationName: '青物横丁', lat: 35.600000, lng: 139.735000, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '鮫洲':     { stationName: '鮫洲',     lat: 35.595400, lng: 139.733500, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '立会川':   { stationName: '立会川',   lat: 35.591500, lng: 139.732200, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '大森海岸': { stationName: '大森海岸', lat: 35.582700, lng: 139.730100, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '平和島':   { stationName: '平和島',   lat: 35.568800, lng: 139.724700, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '大森町':   { stationName: '大森町',   lat: 35.577500, lng: 139.727100, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '梅屋敷':   { stationName: '梅屋敷',   lat: 35.562200, lng: 139.723100, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '京急蒲田': { stationName: '京急蒲田', lat: 35.554700, lng: 139.718300, lineCount: 3, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '雑色':     { stationName: '雑色',     lat: 35.546800, lng: 139.713000, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '六郷土手': { stationName: '六郷土手', lat: 35.536700, lng: 139.706300, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '京急川崎': { stationName: '京急川崎', lat: 35.532800, lng: 139.702700, lineCount: 3, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '港町':     { stationName: '港町',     lat: 35.525300, lng: 139.699500, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '鶴見市場': { stationName: '鶴見市場', lat: 35.513300, lng: 139.687800, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '京急鶴見': { stationName: '京急鶴見', lat: 35.510800, lng: 139.678800, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '花月園前': { stationName: '花月園前', lat: 35.506600, lng: 139.671400, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '生麦':     { stationName: '生麦',     lat: 35.498400, lng: 139.659800, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '京急新子安': { stationName: '京急新子安', lat: 35.491800, lng: 139.654500, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '子安':     { stationName: '子安',     lat: 35.488300, lng: 139.649800, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '神奈川新町': { stationName: '神奈川新町', lat: 35.481200, lng: 139.637200, lineCount: 2, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '仲木戸':   { stationName: '仲木戸',   lat: 35.476600, lng: 139.633600, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '神奈川':   { stationName: '神奈川',   lat: 35.472100, lng: 139.629200, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },

  // ======== 小田急線（追加分） ========
  '南新宿':       { stationName: '南新宿',       lat: 35.686100, lng: 139.701100, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '和泉多摩川':   { stationName: '和泉多摩川',   lat: 35.619500, lng: 139.566900, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '生田':         { stationName: '生田',         lat: 35.578900, lng: 139.554200, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '読売ランド前': { stationName: '読売ランド前', lat: 35.579700, lng: 139.537500, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '百合ヶ丘':     { stationName: '百合ヶ丘',     lat: 35.586200, lng: 139.525300, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '柿生':         { stationName: '柿生',         lat: 35.594400, lng: 139.516900, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '鶴川':         { stationName: '鶴川',         lat: 35.561200, lng: 139.483500, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '玉川学園前':   { stationName: '玉川学園前',   lat: 35.547500, lng: 139.469200, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '小田急相模原': { stationName: '小田急相模原', lat: 35.521800, lng: 139.434500, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '相武台前':     { stationName: '相武台前',     lat: 35.513900, lng: 139.418400, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '座間':         { stationName: '座間',         lat: 35.495200, lng: 139.406200, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '厚木':         { stationName: '厚木',         lat: 35.445000, lng: 139.373800, lineCount: 2, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '愛甲石田':     { stationName: '愛甲石田',     lat: 35.430700, lng: 139.338200, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '伊勢原':       { stationName: '伊勢原',       lat: 35.402700, lng: 139.312200, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '鶴巻温泉':     { stationName: '鶴巻温泉',     lat: 35.384400, lng: 139.295800, lineCount: 1, avgRent1K: 5.3,  avgRent1LDK: 9.0 },
  '東海大学前':   { stationName: '東海大学前',   lat: 35.377300, lng: 139.282800, lineCount: 1, avgRent1K: 5.3,  avgRent1LDK: 9.0 },
  '秦野':         { stationName: '秦野',         lat: 35.373400, lng: 139.227400, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '渋沢':         { stationName: '渋沢',         lat: 35.366000, lng: 139.177100, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '新松田':       { stationName: '新松田',       lat: 35.338800, lng: 139.140800, lineCount: 2, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '小田原':       { stationName: '小田原',       lat: 35.255800, lng: 139.154500, lineCount: 5, avgRent1K: 6.0,  avgRent1LDK: 10.2 },

  // ======== 東急東横線（追加分） ========
  '祐天寺': { stationName: '祐天寺', lat: 35.634300, lng: 139.698680, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '妙蓮寺': { stationName: '妙蓮寺', lat: 35.503000, lng: 139.626500, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '東白楽': { stationName: '東白楽', lat: 35.496300, lng: 139.627500, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '反町':   { stationName: '反町',   lat: 35.467600, lng: 139.630100, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },

  // ======== 東急目黒線（追加分） ========
  '不動前':   { stationName: '不動前',   lat: 35.625423, lng: 139.713150, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '武蔵小山': { stationName: '武蔵小山', lat: 35.620510, lng: 139.704470, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '西小山':   { stationName: '西小山',   lat: 35.615435, lng: 139.698710, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '洗足':     { stationName: '洗足',     lat: 35.610090, lng: 139.694105, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '奥沢':     { stationName: '奥沢',     lat: 35.603945, lng: 139.672410, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '大岡山':   { stationName: '大岡山',   lat: 35.607070, lng: 139.684857, lineCount: 3, avgRent1K: 10.0, avgRent1LDK: 17.0 },

  // ======== 東急多摩川線（追加分） ========
  '沼部':   { stationName: '沼部',   lat: 35.582490, lng: 139.673170, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '鵜の木': { stationName: '鵜の木', lat: 35.575385, lng: 139.680550, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '下丸子': { stationName: '下丸子', lat: 35.571325, lng: 139.685490, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '武蔵新田': { stationName: '武蔵新田', lat: 35.567755, lng: 139.692435, lineCount: 1, avgRent1K: 8.0, avgRent1LDK: 13.5 },
  '矢口渡': { stationName: '矢口渡', lat: 35.562450, lng: 139.700340, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },

  // ======== 東急大井町線（追加分） ========
  '下神明': { stationName: '下神明', lat: 35.603600, lng: 139.733600, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '戸越公園': { stationName: '戸越公園', lat: 35.604700, lng: 139.723400, lineCount: 1, avgRent1K: 9.5, avgRent1LDK: 16.0 },
  '荏原町': { stationName: '荏原町', lat: 35.604900, lng: 139.707700, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '北千束': { stationName: '北千束', lat: 35.607300, lng: 139.694800, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '緑が丘': { stationName: '緑が丘', lat: 35.607900, lng: 139.668200, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '九品仏': { stationName: '九品仏', lat: 35.605500, lng: 139.659400, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '尾山台': { stationName: '尾山台', lat: 35.602300, lng: 139.652000, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '等々力': { stationName: '等々力', lat: 35.596600, lng: 139.645000, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '上野毛': { stationName: '上野毛', lat: 35.600100, lng: 139.641200, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },

  // ======== 東急池上線（追加分） ========
  '大崎広小路': { stationName: '大崎広小路', lat: 35.622305, lng: 139.722355, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '戸越銀座':   { stationName: '戸越銀座',   lat: 35.616010, lng: 139.715000, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '荏原中延':   { stationName: '荏原中延',   lat: 35.609900, lng: 139.712030, lineCount: 2, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '旗の台':     { stationName: '旗の台',     lat: 35.604930, lng: 139.702210, lineCount: 2, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '長原':       { stationName: '長原',       lat: 35.602230, lng: 139.697970, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '洗足池':     { stationName: '洗足池',     lat: 35.599675, lng: 139.690925, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '石川台':     { stationName: '石川台',     lat: 35.596860, lng: 139.685090, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '雪が谷大塚': { stationName: '雪が谷大塚', lat: 35.591965, lng: 139.681125, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '御嶽山':     { stationName: '御嶽山',     lat: 35.585153, lng: 139.682420, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '久が原':     { stationName: '久が原',     lat: 35.579455, lng: 139.685670, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '千鳥町':     { stationName: '千鳥町',     lat: 35.573000, lng: 139.691420, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '池上':       { stationName: '池上',       lat: 35.571945, lng: 139.702843, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '蓮沼':       { stationName: '蓮沼',       lat: 35.563960, lng: 139.708600, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },

  // ======== 東急世田谷線（追加分） ========
  '西太子堂':   { stationName: '西太子堂',   lat: 35.640700, lng: 139.668400, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '若林':       { stationName: '若林',       lat: 35.636600, lng: 139.661700, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '松陰神社前': { stationName: '松陰神社前', lat: 35.640800, lng: 139.650500, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '世田谷':     { stationName: '世田谷',     lat: 35.642200, lng: 139.644000, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '上町':       { stationName: '上町',       lat: 35.644500, lng: 139.647800, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '宮の坂':     { stationName: '宮の坂',     lat: 35.650700, lng: 139.645300, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '山下':       { stationName: '山下',       lat: 35.647900, lng: 139.640000, lineCount: 2, avgRent1K: 9.0,  avgRent1LDK: 15.5 },

  // ======== 京王線（追加分） ========
  '笹塚':     { stationName: '笹塚',     lat: 35.671700, lng: 139.663800, lineCount: 2, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '代田橋':   { stationName: '代田橋',   lat: 35.665700, lng: 139.662700, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '桜上水':   { stationName: '桜上水',   lat: 35.667200, lng: 139.620800, lineCount: 2, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '上北沢':   { stationName: '上北沢',   lat: 35.668300, lng: 139.609200, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '八幡山':   { stationName: '八幡山',   lat: 35.667200, lng: 139.598800, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '芦花公園': { stationName: '芦花公園', lat: 35.665700, lng: 139.592100, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '仙川':     { stationName: '仙川',     lat: 35.659800, lng: 139.571400, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  'つつじヶ丘': { stationName: 'つつじヶ丘', lat: 35.659400, lng: 139.556400, lineCount: 1, avgRent1K: 7.8, avgRent1LDK: 13.0 },
  '柴崎':     { stationName: '柴崎',     lat: 35.654600, lng: 139.547900, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '国領':     { stationName: '国領',     lat: 35.649000, lng: 139.541300, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '布田':     { stationName: '布田',     lat: 35.650000, lng: 139.534500, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '西調布':   { stationName: '西調布',   lat: 35.650900, lng: 139.530000, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '飛田給':   { stationName: '飛田給',   lat: 35.648300, lng: 139.523700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '武蔵野台': { stationName: '武蔵野台', lat: 35.646900, lng: 139.512700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '多磨霊園': { stationName: '多磨霊園', lat: 35.645900, lng: 139.508000, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '東府中':   { stationName: '東府中',   lat: 35.645100, lng: 139.495600, lineCount: 2, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '分倍河原': { stationName: '分倍河原', lat: 35.640500, lng: 139.462600, lineCount: 2, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '中河原':   { stationName: '中河原',   lat: 35.641500, lng: 139.455100, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '聖蹟桜ヶ丘': { stationName: '聖蹟桜ヶ丘', lat: 35.633700, lng: 139.431200, lineCount: 1, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '百草園':   { stationName: '百草園',   lat: 35.633700, lng: 139.420200, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '高幡不動': { stationName: '高幡不動', lat: 35.637800, lng: 139.402800, lineCount: 2, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '南平':     { stationName: '南平',     lat: 35.640800, lng: 139.391800, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '平山城址公園': { stationName: '平山城址公園', lat: 35.644900, lng: 139.378500, lineCount: 1, avgRent1K: 5.8, avgRent1LDK: 9.8 },
  '長沼':     { stationName: '長沼',     lat: 35.648900, lng: 139.367800, lineCount: 1, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '北野':     { stationName: '北野',     lat: 35.638700, lng: 139.357200, lineCount: 2, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '京王八王子': { stationName: '京王八王子', lat: 35.659700, lng: 139.339100, lineCount: 1, avgRent1K: 5.5, avgRent1LDK: 9.3 },

  // ======== 京王井の頭線（追加分） ========
  '神泉':     { stationName: '神泉',     lat: 35.657180, lng: 139.693252, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '駒場東大前': { stationName: '駒場東大前', lat: 35.658670, lng: 139.684075, lineCount: 1, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '池ノ上':   { stationName: '池ノ上',   lat: 35.660402, lng: 139.673440, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '新代田':   { stationName: '新代田',   lat: 35.662495, lng: 139.661390, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '東松原':   { stationName: '東松原',   lat: 35.662636, lng: 139.655758, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '永福町':   { stationName: '永福町',   lat: 35.676290, lng: 139.642733, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '西永福':   { stationName: '西永福',   lat: 35.678875, lng: 139.635155, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '浜田山':   { stationName: '浜田山',   lat: 35.681603, lng: 139.627528, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '高井戸':   { stationName: '高井戸',   lat: 35.683260, lng: 139.615230, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '富士見ヶ丘': { stationName: '富士見ヶ丘', lat: 35.684805, lng: 139.607233, lineCount: 1, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '久我山':   { stationName: '久我山',   lat: 35.688140, lng: 139.599325, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '三鷹台':   { stationName: '三鷹台',   lat: 35.692046, lng: 139.589298, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '井の頭公園': { stationName: '井の頭公園', lat: 35.697304, lng: 139.583112, lineCount: 1, avgRent1K: 8.0, avgRent1LDK: 13.5 },

  // ======== 西武新宿線（追加分） ========
  '西武新宿':   { stationName: '西武新宿',   lat: 35.695150, lng: 139.701100, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '下落合':     { stationName: '下落合',     lat: 35.720800, lng: 139.689900, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '中井':       { stationName: '中井',       lat: 35.710300, lng: 139.668800, lineCount: 2, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '新井薬師前': { stationName: '新井薬師前', lat: 35.718700, lng: 139.661100, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '沼袋':       { stationName: '沼袋',       lat: 35.715000, lng: 139.652800, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '野方':       { stationName: '野方',       lat: 35.718200, lng: 139.641000, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '都立家政':   { stationName: '都立家政',   lat: 35.720500, lng: 139.634900, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '鷺ノ宮':     { stationName: '鷺ノ宮',     lat: 35.731100, lng: 139.636200, lineCount: 2, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '下井草':     { stationName: '下井草',     lat: 35.725600, lng: 139.625000, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '井荻':       { stationName: '井荻',       lat: 35.720200, lng: 139.614900, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '上井草':     { stationName: '上井草',     lat: 35.724600, lng: 139.606700, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '上石神井':   { stationName: '上石神井',   lat: 35.738000, lng: 139.608100, lineCount: 2, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '武蔵関':     { stationName: '武蔵関',     lat: 35.742300, lng: 139.600200, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '東伏見':     { stationName: '東伏見',     lat: 35.742800, lng: 139.593700, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '西武柳沢':   { stationName: '西武柳沢',   lat: 35.742600, lng: 139.586200, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '田無':       { stationName: '田無',       lat: 35.743800, lng: 139.546600, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '花小金井':   { stationName: '花小金井',   lat: 35.739100, lng: 139.519500, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '小平':       { stationName: '小平',       lat: 35.732500, lng: 139.493700, lineCount: 3, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '久米川':     { stationName: '久米川',     lat: 35.741400, lng: 139.488400, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '東村山':     { stationName: '東村山',     lat: 35.752000, lng: 139.487800, lineCount: 4, avgRent1K: 6.5,  avgRent1LDK: 11.0 },

  // ======== 西武池袋線（追加分） ========
  '椎名町':     { stationName: '椎名町',     lat: 35.726200, lng: 139.694900, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '東長崎':     { stationName: '東長崎',     lat: 35.722600, lng: 139.685100, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '江古田':     { stationName: '江古田',     lat: 35.724200, lng: 139.672500, lineCount: 2, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '桜台':       { stationName: '桜台',       lat: 35.726500, lng: 139.663500, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '中村橋':     { stationName: '中村橋',     lat: 35.733500, lng: 139.647300, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '富士見台':   { stationName: '富士見台',   lat: 35.737800, lng: 139.635700, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '練馬高野台': { stationName: '練馬高野台', lat: 35.739700, lng: 139.626900, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '保谷':       { stationName: '保谷',       lat: 35.749100, lng: 139.568700, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  'ひばりヶ丘': { stationName: 'ひばりヶ丘', lat: 35.764200, lng: 139.548500, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '東久留米':   { stationName: '東久留米',   lat: 35.762500, lng: 139.527400, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '清瀬':       { stationName: '清瀬',       lat: 35.770700, lng: 139.513700, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '秋津':       { stationName: '秋津',       lat: 35.782900, lng: 139.497800, lineCount: 2, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '入間市':     { stationName: '入間市',     lat: 35.836400, lng: 139.404300, lineCount: 2, avgRent1K: 5.8,  avgRent1LDK: 9.8 },

  // ======== 東武東上線（追加分） ========
  '下板橋':   { stationName: '下板橋',   lat: 35.738500, lng: 139.712500, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '大山':     { stationName: '大山',     lat: 35.746800, lng: 139.708100, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '中板橋':   { stationName: '中板橋',   lat: 35.751800, lng: 139.703800, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '常盤台':   { stationName: '常盤台',   lat: 35.756200, lng: 139.699600, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '上板橋':   { stationName: '上板橋',   lat: 35.757300, lng: 139.694600, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '東武練馬': { stationName: '東武練馬', lat: 35.755300, lng: 139.683400, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '下赤塚':   { stationName: '下赤塚',   lat: 35.762900, lng: 139.660700, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '朝霞':     { stationName: '朝霞',     lat: 35.791700, lng: 139.589700, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '柳瀬川':   { stationName: '柳瀬川',   lat: 35.831300, lng: 139.577900, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  'みずほ台': { stationName: 'みずほ台', lat: 35.836600, lng: 139.572400, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '鶴瀬':     { stationName: '鶴瀬',     lat: 35.843800, lng: 139.558900, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  'ふじみ野': { stationName: 'ふじみ野', lat: 35.860100, lng: 139.533500, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '上福岡':   { stationName: '上福岡',   lat: 35.871100, lng: 139.528600, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '新河岸':   { stationName: '新河岸',   lat: 35.893200, lng: 139.500400, lineCount: 1, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '川越市':   { stationName: '川越市',   lat: 35.920700, lng: 139.476700, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },

  // ======== 常磐線（追加分） ========
  '北松戸': { stationName: '北松戸', lat: 35.797100, lng: 139.899800, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '馬橋':   { stationName: '馬橋',   lat: 35.806800, lng: 139.911300, lineCount: 2, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '新松戸': { stationName: '新松戸', lat: 35.807800, lng: 139.921500, lineCount: 3, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '北小金': { stationName: '北小金', lat: 35.830100, lng: 139.917500, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '南柏':   { stationName: '南柏',   lat: 35.852100, lng: 139.942100, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '北柏':   { stationName: '北柏',   lat: 35.883700, lng: 139.979200, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '我孫子': { stationName: '我孫子', lat: 35.869400, lng: 140.019600, lineCount: 2, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '天王台': { stationName: '天王台', lat: 35.871400, lng: 140.040100, lineCount: 1, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '取手':   { stationName: '取手',   lat: 35.912900, lng: 140.054900, lineCount: 3, avgRent1K: 5.5,  avgRent1LDK: 9.3 },

  // ======== 中央線（追加分） ========
  '東小金井':   { stationName: '東小金井',   lat: 35.695500, lng: 139.531300, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '武蔵小金井': { stationName: '武蔵小金井', lat: 35.700800, lng: 139.507000, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '西国分寺':   { stationName: '西国分寺',   lat: 35.697400, lng: 139.464700, lineCount: 2, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '日野':       { stationName: '日野',       lat: 35.680400, lng: 139.394000, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '豊田':       { stationName: '豊田',       lat: 35.673600, lng: 139.374300, lineCount: 1, avgRent1K: 5.8,  avgRent1LDK: 9.8 },

  // ======== 中央線・山手線内（追加分） ========
  '信濃町':   { stationName: '信濃町',   lat: 35.681700, lng: 139.717200, lineCount: 1, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '千駄ケ谷': { stationName: '千駄ケ谷', lat: 35.680400, lng: 139.710600, lineCount: 1, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '大久保':   { stationName: '大久保',   lat: 35.700600, lng: 139.706300, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '東中野':   { stationName: '東中野',   lat: 35.710600, lng: 139.678200, lineCount: 2, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '阿佐ケ谷': { stationName: '阿佐ケ谷', lat: 35.705648, lng: 139.636436, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '西八王子': { stationName: '西八王子', lat: 35.649400, lng: 139.321900, lineCount: 1, avgRent1K: 5.3,  avgRent1LDK: 9.0 },
  '高尾':     { stationName: '高尾',     lat: 35.642600, lng: 139.276500, lineCount: 2, avgRent1K: 5.5,  avgRent1LDK: 9.3 },

  // ======== りんかい線（追加分） ========
  '品川シーサイド': { stationName: '品川シーサイド', lat: 35.609790, lng: 139.749795, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '天王洲アイル':   { stationName: '天王洲アイル',   lat: 35.622870, lng: 139.750905, lineCount: 2, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '東京テレポート': { stationName: '東京テレポート', lat: 35.627085, lng: 139.778060, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '国際展示場':     { stationName: '国際展示場',     lat: 35.634410, lng: 139.791695, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '東雲':           { stationName: '東雲',           lat: 35.640820, lng: 139.804160, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },

  // ======== ゆりかもめ（追加分） ========
  '竹芝':           { stationName: '竹芝',           lat: 35.654065, lng: 139.762015, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '日の出':         { stationName: '日の出',         lat: 35.649260, lng: 139.759160, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  '芝浦ふ頭':       { stationName: '芝浦ふ頭',       lat: 35.642220, lng: 139.757870, lineCount: 1, avgRent1K: 13.0, avgRent1LDK: 22.0 },
  'お台場海浜公園': { stationName: 'お台場海浜公園', lat: 35.629805, lng: 139.778530, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  '台場':           { stationName: '台場',           lat: 35.625870, lng: 139.771375, lineCount: 1, avgRent1K: 11.5, avgRent1LDK: 19.5 },
  'テレコムセンター': { stationName: 'テレコムセンター', lat: 35.617725, lng: 139.779665, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '青海':           { stationName: '青海',           lat: 35.624800, lng: 139.781315, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '東京国際クルーズターミナル': { stationName: '東京国際クルーズターミナル', lat: 35.621357, lng: 139.784200, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '有明':           { stationName: '有明',           lat: 35.634550, lng: 139.793340, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '有明テニスの森': { stationName: '有明テニスの森', lat: 35.639980, lng: 139.788895, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '市場前':         { stationName: '市場前',         lat: 35.647800, lng: 139.793600, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },
  '新豊洲':         { stationName: '新豊洲',         lat: 35.651500, lng: 139.796800, lineCount: 1, avgRent1K: 10.5, avgRent1LDK: 17.8 },

  // ======== 東京モノレール（追加分） ========
  'モノレール浜松町': { stationName: 'モノレール浜松町', lat: 35.655745, lng: 139.756670, lineCount: 1, avgRent1K: 12.5, avgRent1LDK: 21.0 },
  '大井競馬場前':     { stationName: '大井競馬場前',     lat: 35.595030, lng: 139.747200, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '流通センター':     { stationName: '流通センター',     lat: 35.581445, lng: 139.749185, lineCount: 1, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '昭和島':           { stationName: '昭和島',           lat: 35.570670, lng: 139.749927, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '整備場':           { stationName: '整備場',           lat: 35.555100, lng: 139.753360, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '天空橋':           { stationName: '天空橋',           lat: 35.548153, lng: 139.754620, lineCount: 2, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '羽田空港第3ターミナル':   { stationName: '羽田空港第3ターミナル',   lat: 35.543913, lng: 139.768584, lineCount: 2, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '羽田空港第1・第2ターミナル': { stationName: '羽田空港第1・第2ターミナル', lat: 35.549800, lng: 139.786025, lineCount: 2, avgRent1K: 8.0, avgRent1LDK: 13.5 },

  // ======== 京急羽田・三浦方面（追加分） ========
  '糀谷':     { stationName: '糀谷',     lat: 35.554450, lng: 139.729590, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '大鳥居':   { stationName: '大鳥居',   lat: 35.552320, lng: 139.740225, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '穴守稲荷': { stationName: '穴守稲荷', lat: 35.550333, lng: 139.746717, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },

  // ======== 鶴見線（追加分） ========
  '国道':     { stationName: '国道',     lat: 35.505140, lng: 139.686750, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '鶴見小野': { stationName: '鶴見小野', lat: 35.497080, lng: 139.694110, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '弁天橋':   { stationName: '弁天橋',   lat: 35.490660, lng: 139.697130, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '浜川崎':   { stationName: '浜川崎',   lat: 35.509928, lng: 139.713861, lineCount: 3, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '昭和':     { stationName: '昭和',     lat: 35.506469, lng: 139.724051, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '扇町':     { stationName: '扇町',     lat: 35.473790, lng: 139.741940, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '安善':     { stationName: '安善',     lat: 35.483370, lng: 139.714660, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '武蔵白石': { stationName: '武蔵白石', lat: 35.483080, lng: 139.726520, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '海芝浦':   { stationName: '海芝浦',   lat: 35.485904, lng: 139.700285, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },

  // ======== 南武線支線（追加分） ========
  '尻手':   { stationName: '尻手',   lat: 35.558170, lng: 139.672770, lineCount: 3, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '矢向':   { stationName: '矢向',   lat: 35.540480, lng: 139.675340, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '鹿島田': { stationName: '鹿島田', lat: 35.530300, lng: 139.672860, lineCount: 2, avgRent1K: 7.5,  avgRent1LDK: 12.5 },

  // ======== 横浜市営地下鉄ブルーライン（追加分） ========
  '湘南台':         { stationName: '湘南台',         lat: 35.396545, lng: 139.466470, lineCount: 3, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '下飯田':         { stationName: '下飯田',         lat: 35.403375, lng: 139.482885, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '立場':           { stationName: '立場',           lat: 35.414380, lng: 139.500700, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '中田':           { stationName: '中田',           lat: 35.411155, lng: 139.511220, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '踊場':           { stationName: '踊場',           lat: 35.405550, lng: 139.518577, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '戸塚':           { stationName: '戸塚',           lat: 35.401090, lng: 139.534890, lineCount: 3, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '舞岡':           { stationName: '舞岡',           lat: 35.402535, lng: 139.551265, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '港南中央':       { stationName: '港南中央',       lat: 35.401230, lng: 139.591215, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '上永谷':         { stationName: '上永谷',         lat: 35.401370, lng: 139.572790, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '上大岡':         { stationName: '上大岡',         lat: 35.409345, lng: 139.596610, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '弘明寺':         { stationName: '弘明寺',         lat: 35.422980, lng: 139.601998, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '蒔田':           { stationName: '蒔田',           lat: 35.430310, lng: 139.610530, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '吉野町':         { stationName: '吉野町',         lat: 35.435390, lng: 139.618567, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '阪東橋':         { stationName: '阪東橋',         lat: 35.437540, lng: 139.624970, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '伊勢佐木長者町': { stationName: '伊勢佐木長者町', lat: 35.440945, lng: 139.632660, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '高島町':         { stationName: '高島町',         lat: 35.458695, lng: 139.623650, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '三ツ沢下町':     { stationName: '三ツ沢下町',     lat: 35.476485, lng: 139.615215, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '三ツ沢上町':     { stationName: '三ツ沢上町',     lat: 35.476420, lng: 139.605530, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '片倉町':         { stationName: '片倉町',         lat: 35.490000, lng: 139.606430, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '岸根公園':       { stationName: '岸根公園',       lat: 35.495510, lng: 139.616545, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '新横浜':         { stationName: '新横浜',         lat: 35.506765, lng: 139.617425, lineCount: 4, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '北新横浜':       { stationName: '北新横浜',       lat: 35.519215, lng: 139.612850, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '新羽':           { stationName: '新羽',           lat: 35.527260, lng: 139.612053, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '仲町台':         { stationName: '仲町台',         lat: 35.535315, lng: 139.589515, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  'センター南':     { stationName: 'センター南',     lat: 35.545215, lng: 139.574515, lineCount: 2, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  'センター北':     { stationName: 'センター北',     lat: 35.553005, lng: 139.578340, lineCount: 2, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '中川':           { stationName: '中川',           lat: 35.563085, lng: 139.569680, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },

  // ======== 横浜市営地下鉄グリーンライン（追加分） ========
  '中山':           { stationName: '中山',           lat: 35.514680, lng: 139.539388, lineCount: 3, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '川和町':         { stationName: '川和町',         lat: 35.528445, lng: 139.548975, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '都筑ふれあいの丘': { stationName: '都筑ふれあいの丘', lat: 35.536556, lng: 139.561301, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '北山田':         { stationName: '北山田',         lat: 35.561090, lng: 139.592747, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '東山田':         { stationName: '東山田',         lat: 35.554210, lng: 139.606040, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '高田':           { stationName: '高田',           lat: 35.549550, lng: 139.620590, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '日吉本町':       { stationName: '日吉本町',       lat: 35.549913, lng: 139.633334, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },

  // ======== みなとみらい線（追加分） ========
  'みなとみらい': { stationName: 'みなとみらい', lat: 35.460960, lng: 139.638340, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '馬車道':       { stationName: '馬車道',       lat: 35.451670, lng: 139.641290, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '日本大通り':   { stationName: '日本大通り',   lat: 35.444600, lng: 139.641910, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '元町・中華街': { stationName: '元町・中華街', lat: 35.443070, lng: 139.649390, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },

  // ======== 相鉄線（追加分） ========
  '平沼橋':     { stationName: '平沼橋',     lat: 35.459845, lng: 139.616465, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '西横浜':     { stationName: '西横浜',     lat: 35.453595, lng: 139.608970, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '天王町':     { stationName: '天王町',     lat: 35.454010, lng: 139.602530, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '星川':       { stationName: '星川',       lat: 35.458235, lng: 139.595195, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '和田町':     { stationName: '和田町',     lat: 35.463710, lng: 139.586380, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '上星川':     { stationName: '上星川',     lat: 35.467370, lng: 139.580454, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '西谷':       { stationName: '西谷',       lat: 35.478065, lng: 139.565521, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '鶴ヶ峰':     { stationName: '鶴ヶ峰',     lat: 35.475090, lng: 139.549985, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '二俣川':     { stationName: '二俣川',     lat: 35.463390, lng: 139.532370, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '希望ヶ丘':   { stationName: '希望ヶ丘',   lat: 35.460540, lng: 139.513475, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '三ツ境':     { stationName: '三ツ境',     lat: 35.467785, lng: 139.502570, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '瀬谷':       { stationName: '瀬谷',       lat: 35.470400, lng: 139.482590, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '大和':       { stationName: '大和',       lat: 35.469900, lng: 139.461400, lineCount: 3, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '相模大塚':   { stationName: '相模大塚',   lat: 35.470540, lng: 139.441155, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  'さがみ野':   { stationName: 'さがみ野',   lat: 35.471510, lng: 139.428696, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  'かしわ台':   { stationName: 'かしわ台',   lat: 35.466845, lng: 139.415885, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '南万騎が原': { stationName: '南万騎が原', lat: 35.452545, lng: 139.526347, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '緑園都市':   { stationName: '緑園都市',   lat: 35.439305, lng: 139.521777, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '弥生台':     { stationName: '弥生台',     lat: 35.429930, lng: 139.506635, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  'いずみ野':   { stationName: 'いずみ野',   lat: 35.429495, lng: 139.495120, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  'いずみ中央': { stationName: 'いずみ中央', lat: 35.415100, lng: 139.487185, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  'ゆめが丘':   { stationName: 'ゆめが丘',   lat: 35.405645, lng: 139.482360, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },

  // ======== 総武線・千葉方面（追加分） ========
  '平井':     { stationName: '平井',     lat: 35.700900, lng: 139.834700, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '新小岩':   { stationName: '新小岩',   lat: 35.714800, lng: 139.856400, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '小岩':     { stationName: '小岩',     lat: 35.728700, lng: 139.874100, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '市川':     { stationName: '市川',     lat: 35.722800, lng: 139.929200, lineCount: 2, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '津田沼':   { stationName: '津田沼',   lat: 35.679600, lng: 139.941000, lineCount: 3, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '幕張本郷': { stationName: '幕張本郷', lat: 35.657300, lng: 140.049200, lineCount: 2, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '幕張':     { stationName: '幕張',     lat: 35.650400, lng: 140.037300, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '新検見川': { stationName: '新検見川', lat: 35.647500, lng: 140.019800, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '海浜幕張': { stationName: '海浜幕張', lat: 35.641800, lng: 140.041200, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '南船橋':   { stationName: '南船橋',   lat: 35.680200, lng: 139.977700, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '稲毛':     { stationName: '稲毛',     lat: 35.657100, lng: 140.046400, lineCount: 2, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '四街道':   { stationName: '四街道',   lat: 35.669000, lng: 140.169300, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },

  // ======== 東武伊勢崎線（追加分） ========
  'とうきょうスカイツリー': { stationName: 'とうきょうスカイツリー', lat: 35.710430, lng: 139.809332, lineCount: 1, avgRent1K: 9.5,  avgRent1LDK: 16.0 },
  '曳舟':   { stationName: '曳舟',   lat: 35.718510, lng: 139.816673, lineCount: 2, avgRent1K: 9.0,  avgRent1LDK: 15.5 },
  '東向島': { stationName: '東向島', lat: 35.724355, lng: 139.819335, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '鐘ヶ淵': { stationName: '鐘ヶ淵', lat: 35.733760, lng: 139.820370, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '堀切':   { stationName: '堀切',   lat: 35.743345, lng: 139.817380, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '牛田':   { stationName: '牛田',   lat: 35.744545, lng: 139.811770, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '小菅':   { stationName: '小菅',   lat: 35.758685, lng: 139.812650, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '五反野': { stationName: '五反野', lat: 35.765905, lng: 139.809630, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '梅島':   { stationName: '梅島',   lat: 35.772345, lng: 139.798075, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '西新井': { stationName: '西新井', lat: 35.777280, lng: 139.790365, lineCount: 2, avgRent1K: 7.5,  avgRent1LDK: 12.8 },
  '竹ノ塚': { stationName: '竹ノ塚', lat: 35.794370, lng: 139.790720, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },

  // ======== 日暮里・舎人ライナー（追加分） ========
  '赤土小学校前': { stationName: '赤土小学校前', lat: 35.743060, lng: 139.769130, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '熊野前':       { stationName: '熊野前',       lat: 35.749212, lng: 139.769204, lineCount: 2, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '足立小台':     { stationName: '足立小台',     lat: 35.754635, lng: 139.770205, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '扇大橋':       { stationName: '扇大橋',       lat: 35.764135, lng: 139.770850, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '高野':         { stationName: '高野',         lat: 35.768255, lng: 139.770720, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '江北':         { stationName: '江北',         lat: 35.773785, lng: 139.770345, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '西新井大師西': { stationName: '西新井大師西', lat: 35.781160, lng: 139.770140, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '谷在家':       { stationName: '谷在家',       lat: 35.788680, lng: 139.770100, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '舎人公園':     { stationName: '舎人公園',     lat: 35.796665, lng: 139.770120, lineCount: 1, avgRent1K: 7.3,  avgRent1LDK: 12.3 },
  '舎人':         { stationName: '舎人',         lat: 35.805700, lng: 139.770108, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '見沼代親水公園': { stationName: '見沼代親水公園', lat: 35.814544, lng: 139.770719, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },

  // ======== つくばエクスプレス（追加分） ========
  '青井':           { stationName: '青井',           lat: 35.772000, lng: 139.820245, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '六町':           { stationName: '六町',           lat: 35.784780, lng: 139.821805, lineCount: 1, avgRent1K: 7.8,  avgRent1LDK: 13.0 },
  '八潮':           { stationName: '八潮',           lat: 35.807765, lng: 139.844735, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '三郷中央':       { stationName: '三郷中央',       lat: 35.824485, lng: 139.878370, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '流山セントラルパーク': { stationName: '流山セントラルパーク', lat: 35.854590, lng: 139.915180, lineCount: 1, avgRent1K: 7.0, avgRent1LDK: 11.8 },
  '流山おおたかの森': { stationName: '流山おおたかの森', lat: 35.872085, lng: 139.925760, lineCount: 2, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '柏の葉キャンパス': { stationName: '柏の葉キャンパス', lat: 35.893315, lng: 139.952525, lineCount: 1, avgRent1K: 7.5, avgRent1LDK: 12.5 },
  '柏たなか':       { stationName: '柏たなか',       lat: 35.910860, lng: 139.957515, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '守谷':           { stationName: '守谷',           lat: 35.950015, lng: 139.992010, lineCount: 2, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  'みらい平':       { stationName: 'みらい平',       lat: 35.994405, lng: 140.038345, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  'みどりの':       { stationName: 'みどりの',       lat: 36.029920, lng: 140.056205, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '万博記念公園':   { stationName: '万博記念公園',   lat: 36.058400, lng: 140.059375, lineCount: 1, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '研究学園':       { stationName: '研究学園',       lat: 36.082165, lng: 140.082280, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  'つくば':         { stationName: 'つくば',         lat: 36.082425, lng: 140.110545, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },

  // ======== 京成線（追加分） ========
  '京成上野':   { stationName: '京成上野',   lat: 35.711310, lng: 139.773510, lineCount: 1, avgRent1K: 10.0, avgRent1LDK: 17.0 },
  '新三河島':   { stationName: '新三河島',   lat: 35.737342, lng: 139.774168, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '千住大橋':   { stationName: '千住大橋',   lat: 35.742410, lng: 139.797050, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '京成関屋':   { stationName: '京成関屋',   lat: 35.743965, lng: 139.811850, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '堀切菖蒲園': { stationName: '堀切菖蒲園', lat: 35.747650, lng: 139.827540, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  'お花茶屋':   { stationName: 'お花茶屋',   lat: 35.747615, lng: 139.839885, lineCount: 1, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '青砥':       { stationName: '青砥',       lat: 35.745870, lng: 139.856270, lineCount: 2, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '京成高砂':   { stationName: '京成高砂',   lat: 35.750870, lng: 139.866590, lineCount: 3, avgRent1K: 7.5,  avgRent1LDK: 12.5 },
  '京成小岩':   { stationName: '京成小岩',   lat: 35.742215, lng: 139.883615, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '江戸川':     { stationName: '江戸川',     lat: 35.737835, lng: 139.895872, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '国府台':     { stationName: '国府台',     lat: 35.736310, lng: 139.903540, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '市川真間':   { stationName: '市川真間',   lat: 35.731268, lng: 139.911780, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '菅野':       { stationName: '菅野',       lat: 35.728275, lng: 139.919395, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '京成八幡':   { stationName: '京成八幡',   lat: 35.723860, lng: 139.928170, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '鬼越':       { stationName: '鬼越',       lat: 35.719765, lng: 139.937865, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '京成中山':   { stationName: '京成中山',   lat: 35.716950, lng: 139.944380, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '東中山':     { stationName: '東中山',     lat: 35.714420, lng: 139.952635, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '京成西船':   { stationName: '京成西船',   lat: 35.711690, lng: 139.958845, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '海神':       { stationName: '海神',       lat: 35.705925, lng: 139.971785, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '京成船橋':   { stationName: '京成船橋',   lat: 35.699963, lng: 139.984937, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '京成津田沼': { stationName: '京成津田沼', lat: 35.683640, lng: 140.024845, lineCount: 2, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '八千代台':   { stationName: '八千代台',   lat: 35.701355, lng: 140.090770, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  'ユーカリが丘': { stationName: 'ユーカリが丘', lat: 35.722310, lng: 140.156983, lineCount: 2, avgRent1K: 5.8, avgRent1LDK: 9.8 },
  '京成佐倉':   { stationName: '京成佐倉',   lat: 35.725205, lng: 140.229865, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '京成成田':   { stationName: '京成成田',   lat: 35.776270, lng: 140.315465, lineCount: 2, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '成田空港':   { stationName: '成田空港',   lat: 35.765725, lng: 140.386305, lineCount: 2, avgRent1K: 6.5,  avgRent1LDK: 11.0 },

  // ======== 武蔵野線（追加分） ========
  '府中本町':     { stationName: '府中本町',     lat: 35.665847, lng: 139.477263, lineCount: 3, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '北府中':       { stationName: '北府中',       lat: 35.680855, lng: 139.471795, lineCount: 1, avgRent1K: 6.8,  avgRent1LDK: 11.5 },
  '新小平':       { stationName: '新小平',       lat: 35.730943, lng: 139.470507, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '北朝霞':       { stationName: '北朝霞',       lat: 35.815470, lng: 139.587230, lineCount: 1, avgRent1K: 7.0,  avgRent1LDK: 11.8 },
  '西浦和':       { stationName: '西浦和',       lat: 35.844185, lng: 139.627765, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '東浦和':       { stationName: '東浦和',       lat: 35.864057, lng: 139.704537, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '東川口':       { stationName: '東川口',       lat: 35.876620, lng: 139.743670, lineCount: 2, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '南越谷':       { stationName: '南越谷',       lat: 35.876047, lng: 139.791363, lineCount: 2, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '越谷レイクタウン': { stationName: '越谷レイクタウン', lat: 35.876115, lng: 139.822530, lineCount: 1, avgRent1K: 6.5, avgRent1LDK: 11.0 },
  '吉川美南':     { stationName: '吉川美南',     lat: 35.868087, lng: 139.858121, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '新三郷':       { stationName: '新三郷',       lat: 35.858390, lng: 139.869535, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '三郷':         { stationName: '三郷',         lat: 35.844835, lng: 139.886835, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '新八柱':       { stationName: '新八柱',       lat: 35.791290, lng: 139.938555, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '東松戸':       { stationName: '東松戸',       lat: 35.770760, lng: 139.943770, lineCount: 2, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '市川大野':     { stationName: '市川大野',     lat: 35.755405, lng: 139.951280, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '船橋法典':     { stationName: '船橋法典',     lat: 35.730520, lng: 139.966684, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '市川塩浜':     { stationName: '市川塩浜',     lat: 35.666232, lng: 139.923525, lineCount: 2, avgRent1K: 7.5,  avgRent1LDK: 12.5 },

  // ======== 京葉線（追加分） ========
  '越中島':   { stationName: '越中島',   lat: 35.668000, lng: 139.792495, lineCount: 1, avgRent1K: 12.0, avgRent1LDK: 20.5 },
  '潮見':     { stationName: '潮見',     lat: 35.658865, lng: 139.817170, lineCount: 1, avgRent1K: 11.0, avgRent1LDK: 18.5 },
  '葛西臨海公園': { stationName: '葛西臨海公園', lat: 35.644170, lng: 139.861485, lineCount: 1, avgRent1K: 8.5, avgRent1LDK: 14.5 },
  '舞浜':     { stationName: '舞浜',     lat: 35.636160, lng: 139.883720, lineCount: 1, avgRent1K: 8.5,  avgRent1LDK: 14.5 },
  '新浦安':   { stationName: '新浦安',   lat: 35.649520, lng: 139.912530, lineCount: 1, avgRent1K: 8.0,  avgRent1LDK: 13.5 },
  '二俣新町': { stationName: '二俣新町', lat: 35.691320, lng: 139.959555, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '新習志野': { stationName: '新習志野', lat: 35.667428, lng: 140.013014, lineCount: 1, avgRent1K: 6.5,  avgRent1LDK: 11.0 },
  '検見川浜': { stationName: '検見川浜', lat: 35.637184, lng: 140.059106, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '稲毛海岸': { stationName: '稲毛海岸', lat: 35.629510, lng: 140.073960, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '千葉みなと': { stationName: '千葉みなと', lat: 35.606710, lng: 140.102795, lineCount: 1, avgRent1K: 6.0, avgRent1LDK: 10.2 },
  '蘇我':     { stationName: '蘇我',     lat: 35.582323, lng: 140.130653, lineCount: 3, avgRent1K: 5.8,  avgRent1LDK: 9.8 },

  // ======== 武蔵野線・埼玉方面 ========
  '東船橋':   { stationName: '東船橋',   lat: 35.699807, lng: 140.004242, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  '西千葉':   { stationName: '西千葉',   lat: 35.622627, lng: 140.103327, lineCount: 1, avgRent1K: 6.0,  avgRent1LDK: 10.2 },
  '東千葉':   { stationName: '東千葉',   lat: 35.616977, lng: 140.122193, lineCount: 1, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '都賀':     { stationName: '都賀',     lat: 35.635495, lng: 140.148745, lineCount: 2, avgRent1K: 5.8,  avgRent1LDK: 9.8 },
  '物井':     { stationName: '物井',     lat: 35.685725, lng: 140.200315, lineCount: 1, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '佐倉':     { stationName: '佐倉',     lat: 35.709740, lng: 140.226755, lineCount: 2, avgRent1K: 5.5,  avgRent1LDK: 9.3 },
  '八柱':     { stationName: '八柱',     lat: 35.802470, lng: 139.951270, lineCount: 2, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
  'みのり台': { stationName: 'みのり台', lat: 35.797490, lng: 139.939260, lineCount: 1, avgRent1K: 6.3,  avgRent1LDK: 10.8 },
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
  rangeOverride?: { min: number; max: number },
): string {
  const stats = stationStatsData[stationName];
  if (!stats) return HEATMAP_NO_DATA_COLOR;
  const val = stats[paramKey] as number | undefined;
  if (val === undefined) return HEATMAP_NO_DATA_COLOR;

  const meta = STAT_PARAMS.find(p => p.key === paramKey);
  const { min, max } = rangeOverride ?? getParamRange(paramKey);
  const normalized = max > min ? (val - min) / (max - min) : 0.5;
  // higherIsBetter=false → 値が高いほど赤（危険）なので反転しない。高=赤がデフォルト。
  // higherIsBetter=true  → 値が高いほど良い → 高いほど赤 のままでOK（赤=多い/高い を示す）
  // ただし safetyScore など「高いほど良い」でも赤=危険に見えるため反転してもよい。
  // ここでは「赤=値が高い」と統一し、UI側で説明を補う。
  return heatValueToColor(normalized);
}
