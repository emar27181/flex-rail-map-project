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
  dead?: boolean;      // URLが無効・リンク切れの場合 true（値は表示するがリンク不可）
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
// 駅統計データは station-stats-data.json から自動ロード
// 元データ: data/station-stats_v2.csv（首都圏1541駅）
// ----------------------------------------------------------------
import rawStatsData from './station-stats-data.json';
export const stationStatsData: Record<string, StationStats> = rawStatsData as Record<string, StationStats>;

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
