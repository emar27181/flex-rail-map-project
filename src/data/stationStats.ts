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

  // --- 実データ（Overpass API / OpenStreetMap、半径500m以内） ---
  restaurantCount?: number;
  cafeCount?: number;
  convenienceStoreCount?: number;
  supermarketCount?: number;
  hospitalCount?: number;
  parkAreaM2?: number;

  // --- 実データ（警視庁 R5年 町丁別認知件数、東京都内のみ） ---
  crimeIndex?: number;

  // --- 推定データ（過去セッションで収集・一部目算、精度±20%程度） ---
  avgRent1K?: number;
  avgRent1LDK?: number;
  populationDensity?: number;
  dailyPassengers?: number;
  morningCongestion?: number;
  izakayaCount?: number;
  ramenCount?: number;
  bookstoreCount?: number;
  safetyScore?: number;
  noiseScore?: number;
  greenRatioPct?: number;
  officeCount?: number;
  coworkingCount?: number;
};

/**
 * データソース情報（参照元・参照日・更新日の記録）
 */
export type DataSource = {
  title: string;       // データ名称・出典名
  url?: string;        // 参照URL（任意）
  dead?: boolean;      // URLが無効・リンク切れの場合 true（値は表示するがリンク不可）
  retrievedAt: string; // 参照日 YYYY-MM-DD
  updatedAt?: string;  // データ自体の更新日（公表元）
  note?: string;       // 補足
};

/** 各パラメータがどのデータソースを参照しているか */
export const PARAM_DATA_SOURCES: Partial<Record<keyof StationStats, DataSource>> = {
  restaurantCount: {
    title: 'OpenStreetMap / Overpass API',
    url: 'https://overpass-api.de/',
    retrievedAt: '2026-06-10',
    note: '駅出口から半径500m以内。amenity=restaurant + amenity=fast_food。',
  },
  cafeCount: {
    title: 'OpenStreetMap / Overpass API',
    url: 'https://overpass-api.de/',
    retrievedAt: '2026-06-10',
    note: '駅出口から半径500m以内。amenity=cafe。',
  },
  convenienceStoreCount: {
    title: 'OpenStreetMap / Overpass API',
    url: 'https://overpass-api.de/',
    retrievedAt: '2026-06-10',
    note: '駅出口から半径500m以内。shop=convenience。',
  },
  supermarketCount: {
    title: 'OpenStreetMap / Overpass API',
    url: 'https://overpass-api.de/',
    retrievedAt: '2026-06-10',
    note: '駅出口から半径500m以内。shop=supermarket。',
  },
  hospitalCount: {
    title: 'OpenStreetMap / Overpass API',
    url: 'https://overpass-api.de/',
    retrievedAt: '2026-06-10',
    note: '駅出口から半径500m以内。amenity=hospital + clinic + doctors。',
  },
  parkAreaM2: {
    title: 'OpenStreetMap / Overpass API',
    url: 'https://overpass-api.de/',
    retrievedAt: '2026-06-10',
    note: '駅出口から半径500m以内。leisure=park の面積合計（Shoelace法）。',
  },
  avgRent1K: {
    title: '未収集',
    retrievedAt: '2026-06-11',
    note: '実データ収集予定。収集済みになるまで全駅灰色表示。',
  },
  avgRent1LDK: {
    title: '未収集',
    retrievedAt: '2026-06-11',
    note: '実データ収集予定。収集済みになるまで全駅灰色表示。',
  },
  crimeIndex: {
    title: '警視庁 区市町村の町丁別認知件数 令和5年',
    retrievedAt: '2026-06-11',
    note: '東京都内438駅のみ収集。Nominatim逆ジオコーディング + 町丁名マッチング。都外駅はデータなし（灰色表示）。',
  },
};

/** 全データの共通注意書き */
export const DATA_DISCLAIMER =
  '掲載データは概算・推定値です。最新の正確な情報は各参照元の公式サイトをご確認ください。';

/** パラメータごとの収集方法・補完ロジック解説 */
export type ParamMethodology = {
  collectionMethod?: string;
  interpolationLogic: string;
};

export const PARAM_METHODOLOGY: Partial<Record<keyof StationStats, ParamMethodology>> = {
  restaurantCount: {
    collectionMethod: 'Overpass API（OpenStreetMap）で駅出口から半径500m以内を検索。',
    interpolationLogic: 'amenity=restaurant + amenity=fast_food のノード・ウェイ数を合算。',
  },
  cafeCount: {
    collectionMethod: 'Overpass API（OpenStreetMap）で駅出口から半径500m以内を検索。',
    interpolationLogic: 'amenity=cafe のノード・ウェイ数。',
  },
  convenienceStoreCount: {
    collectionMethod: 'Overpass API（OpenStreetMap）で駅出口から半径500m以内を検索。',
    interpolationLogic: 'shop=convenience のノード・ウェイ数。',
  },
  supermarketCount: {
    collectionMethod: 'Overpass API（OpenStreetMap）で駅出口から半径500m以内を検索。',
    interpolationLogic: 'shop=supermarket のノード・ウェイ数。',
  },
  hospitalCount: {
    collectionMethod: 'Overpass API（OpenStreetMap）で駅出口から半径500m以内を検索。',
    interpolationLogic: 'amenity=hospital + amenity=clinic + amenity=doctors のノード・ウェイ数。',
  },
  parkAreaM2: {
    collectionMethod: 'Overpass API（OpenStreetMap）で駅出口から半径500m以内を検索。',
    interpolationLogic: 'leisure=park のウェイ・リレーションの面積をShoelace法で合算（m²）。',
  },
};

/**
 * パラメータのメタ情報（UI表示・ヒートマップ設定用）
 */
export type StatParamMeta = {
  key: keyof StationStats;
  label: string;
  unit: string;
  category: StatCategory;
  higherIsBetter: boolean;
  description: string;
  dataQuality: 'real' | 'estimated'; // 'real'=実測・公開データ, 'estimated'=推定・目算
  methodology?: string;
  period?: string;
  radius?: string;
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
  // 飲食（実データ）
  { key: 'restaurantCount',     label: '飲食店数',    unit: '軒',     category: 'food',        higherIsBetter: true,  dataQuality: 'real',      description: '飲食店全般数（restaurant + fast_food）', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
  { key: 'cafeCount',           label: 'カフェ数',    unit: '軒',     category: 'food',        higherIsBetter: true,  dataQuality: 'real',      description: 'カフェ・喫茶店数', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
  { key: 'convenienceStoreCount', label: 'コンビニ数', unit: '軒',    category: 'food',        higherIsBetter: true,  dataQuality: 'real',      description: 'コンビニエンスストア数', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
  // 生活利便性（実データ）
  { key: 'supermarketCount',    label: 'スーパー数',  unit: '軒',     category: 'convenience', higherIsBetter: true,  dataQuality: 'real',      description: 'スーパーマーケット数', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
  { key: 'hospitalCount',       label: '病院・医院数', unit: '軒',    category: 'convenience', higherIsBetter: true,  dataQuality: 'real',      description: '病院・クリニック・診療所数', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
  // 環境（実データ）
  { key: 'parkAreaM2',          label: '公園面積',    unit: 'm²',     category: 'environment', higherIsBetter: true,  dataQuality: 'real',      description: '公園・緑地の面積合計', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API（Shoelace法）', period: '2026年6月収集' },
  // 治安（実データ、都内のみ）
  { key: 'crimeIndex',          label: '犯罪件数',    unit: '件/年',  category: 'safety',      higherIsBetter: false, dataQuality: 'real',      description: '年間犯罪認知件数（低いほど安全）。都外駅はデータなし', methodology: '警視庁 区市町村の町丁別認知件数 R5年', period: '令和5年（2023年）' },
  // 住居（推定データ）
  { key: 'avgRent1K',           label: '家賃(1K)',    unit: '万円',   category: 'housing',     higherIsBetter: false, dataQuality: 'estimated', description: '1K（20〜30㎡）の月額賃料（推定値）', methodology: 'SUUMO等を参考にした目算・推計', period: '2025年頃推計' },
  { key: 'avgRent1LDK',         label: '家賃(1LDK)', unit: '万円',   category: 'housing',     higherIsBetter: false, dataQuality: 'estimated', description: '1LDK（30〜50㎡）の月額賃料（推定値）', methodology: 'SUUMO等を参考にした目算・推計', period: '2025年頃推計' },
  // 交通（推定データ）
  { key: 'dailyPassengers',     label: '乗降客数',    unit: '人/日',  category: 'transport',   higherIsBetter: false, dataQuality: 'estimated', description: '一日乗降客数（推定値）', methodology: '路線規模・都心距離から推計', period: '2025年頃推計' },
  { key: 'morningCongestion',   label: '朝混雑度',    unit: '(0-100)', category: 'transport',  higherIsBetter: false, dataQuality: 'estimated', description: '朝ラッシュ時の混雑度（推定値、高いほど混雑）', methodology: '乗降客数・路線規模から推計', period: '2025年頃推計' },
  // 飲食・娯楽（実データ、Overpass API）
  { key: 'izakayaCount',        label: '居酒屋・バー数', unit: '軒',  category: 'food',        higherIsBetter: true,  dataQuality: 'real',      description: '居酒屋・バー・パブ数（amenity=bar/pub）', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
  { key: 'ramenCount',          label: 'ラーメン屋数', unit: '軒',    category: 'food',        higherIsBetter: true,  dataQuality: 'real',      description: 'ラーメン専門店数（cuisine=ramen）', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
  // 生活利便性（実データ、Overpass API）
  { key: 'bookstoreCount',      label: '書店数',      unit: '軒',     category: 'convenience', higherIsBetter: true,  dataQuality: 'real',      description: '書店数（shop=books）', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
  // 環境（推定データ）
  { key: 'noiseScore',          label: '静かさ',      unit: '(0-100)', category: 'environment', higherIsBetter: true, dataQuality: 'estimated', description: '騒音の少なさ（推定値、高いほど静か）', methodology: '乗降客数・飲食店密度から推計', period: '2025年頃推計' },
  { key: 'greenRatioPct',       label: '緑地率',      unit: '%',      category: 'environment', higherIsBetter: true,  dataQuality: 'real',      description: '駅500m圏内の公園面積÷円面積（parkAreaM2から算出）', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap parkAreaM2から算出（÷785,398m²）', period: '2026年6月収集' },
  // 住居（推定データ）
  { key: 'populationDensity',   label: '人口密度',    unit: '人/km²', category: 'housing',     higherIsBetter: false, dataQuality: 'estimated', description: '駅周辺の人口密度（推定値）', methodology: '国勢調査ベース推計', period: '2025年頃推計' },
  // 仕事（推定データ / 実データ混在）
  { key: 'officeCount',         label: 'オフィス数',  unit: '棟',     category: 'work',        higherIsBetter: true,  dataQuality: 'estimated', description: 'オフィスビル棟数（推定値）', radius: '駅出口から半径500m以内', methodology: '都心ビジネス街分布から推計', period: '2025年頃推計' },
  { key: 'coworkingCount',      label: 'コワーキング数', unit: '軒',  category: 'work',        higherIsBetter: true,  dataQuality: 'real',      description: 'コワーキングスペース数（amenity=coworking_space + office=coworking）', radius: '駅出口から半径500m以内', methodology: 'OpenStreetMap / Overpass API', period: '2026年6月収集' },
];


// ----------------------------------------------------------------
// 駅統計データは station-stats-data.json から自動ロード
// 元データ: data/station-stats_v2.csv（首都圏1541駅）
// ----------------------------------------------------------------
import rawStatsData from './station-stats-data.json';
const { _meta: _ignored, ...stationStatsRaw } = rawStatsData as Record<string, unknown>;
export const stationStatsData: Record<string, StationStats> = stationStatsRaw as Record<string, StationStats>;

// 以下は後方互換のための旧データ（JSON で上書きされる）

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
 * showEstimatedData=false のとき、推定パラメータ（dataQuality='estimated'）は常にデータなし色を返す
 */
export function getStationHeatColor(
  stationName: string,
  paramKey: keyof StationStats,
  rangeOverride?: { min: number; max: number },
  showEstimatedData?: boolean,
): string {
  if (showEstimatedData === false) {
    const meta = STAT_PARAMS.find(p => p.key === paramKey);
    if (meta?.dataQuality === 'estimated') return HEATMAP_NO_DATA_COLOR;
  }
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
