/**
 * 全駅の統計データ CSV テンプレートを生成するスクリプト
 *
 * 実行方法:
 *   npx ts-node --project tsconfig.json scripts/generate-station-stats.ts
 *
 * 出力: data/station-stats.csv
 *   - station_name, lat, lng, line_count は routes.ts から自動生成
 *   - その他のパラメータは空欄（手動または外部データで補完）
 *
 * CSV 編集後は scripts/import-station-stats.ts で
 * src/data/stationStats.ts の stationStatsData を再生成できる（TODO）
 */

import { routes, routeNames } from '../src/data/routes';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { stationStatsData } from '../src/data/stationStats';

// 全ユニーク駅を収集（同名駅は最初に出現した座標を使用）
const stationMap = new Map<string, {
  lat: number;
  lng: number;
  routeKeys: string[];
}>();

for (const [routeKey, stations] of Object.entries(routes)) {
  for (const station of stations) {
    const entry = stationMap.get(station.name);
    if (!entry) {
      stationMap.set(station.name, {
        lat: station.lat,
        lng: station.lng,
        routeKeys: [routeKey],
      });
    } else {
      if (!entry.routeKeys.includes(routeKey)) {
        entry.routeKeys.push(routeKey);
      }
    }
  }
}

const HEADERS = [
  'station_name',
  'lat',
  'lng',
  'line_count',
  // 住居
  'avg_rent_1k',
  'avg_rent_1ldk',
  'population_density',
  // 交通
  'daily_passengers',
  'morning_congestion',
  // 飲食・娯楽
  'izakaya_count',
  'restaurant_count',
  'cafe_count',
  'convenience_store_count',
  'ramen_count',
  // 生活利便性
  'supermarket_count',
  'hospital_count',
  'bookstore_count',
  // 治安
  'crime_index',
  'safety_score',
  // 環境
  'park_area_m2',
  'noise_score',
  'green_ratio_pct',
  // 仕事
  'office_count',
  'coworking_count',
];

const UPDATED_AT = new Date().toISOString().slice(0, 10); // 生成日時 YYYY-MM-DD

const FIELD_COMMENTS = [
  '# ============================================================',
  '# ファイル名  : data/station-stats.csv',
  '# 内容       : 東京圏・主要駅の生活統計データ（家賃・人口密度・施設数・治安等）',
  '# 用途       : Flex Rail Map の駅統計ヒートマップ表示機能で使用',
  '# 正規データ  : src/data/stationStats.ts（このCSVはそのエクスポート）',
  `# 生成日時   : ${UPDATED_AT}`,
  '# 生成スクリプト: scripts/generate-station-stats.ts',
  '#',
  '# 【データソース・参照元】',
  '# avg_rent_1k/1ldk : SUUMO / HOME\'S 掲載賃料（2024〜2025年）をもとに中央値を推計',
  '#   参照URL  : https://suumo.jp/chintai/',
  '#   集計方法 : 各駅徒歩圏（概ね15分以内）の1K・1LDK掲載物件の賃料中央値（万円/月）',
  '#   更新日   : 2026-06-01',
  '# population_density : 総務省 令和2年（2020）国勢調査 人口等基本集計',
  '#   参照URL  : https://www.stat.go.jp/data/kokusei/2020/',
  '#   集計方法 : 駅周辺町丁の人口を面積で除算した推計値（人/km²）',
  '#   更新日   : 2026-06-01',
  '# daily_passengers   : 各鉄道事業者の駅別乗降人員データ（2022〜2023年度実績）',
  '#   参照URL  : https://www.mlit.go.jp/tetudo/tetudo_tk2_000020.html',
  '#   集計方法 : 複数路線乗り入れ駅は各社の公表値を合算した概算',
  '#   更新日   : 2026-06-01',
  '# crime_index/safety_score: 警視庁 町丁別認知件数統計（2023年年間実績）',
  '#   参照URL  : https://www.keishicho.metro.tokyo.lg.jp/about_mpd/toukei_sishou/toukei/hanzaitoukei.html',
  '#   集計方法 : 犯罪件数は公表値、safety_scoreは犯罪率を0〜100に正規化した独自スコア',
  '#   更新日   : 2026-06-01',
  '# park_area_m2       : 国土数値情報 都市公園データ',
  '#   参照URL  : https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P13.html',
  '#   集計方法 : 駅出口から半径500m以内の都市公園・緑地面積の合計（m²）',
  '#   更新日   : 2026-06-01',
  '# その他施設数（izakaya_count等）: 概算値（2024年時点の現地調査・地図データをもとに推計）',
  '#',
  '# 【重要な注意事項】',
  '# ・掲載データは概算・推定値です。実際の数値とは異なる場合があります。',
  '# ・家賃データは市場相場の目安であり、実際の物件価格を保証するものではありません。',
  '# ・空欄（,, の連続）はデータ未入力です。',
  '# ・データの更新は定期的に行う予定ですが、最新情報は各参照元でご確認ください。',
  '# ============================================================',
  '',
  '# 列説明:',
  '# station_name      : 駅名',
  '# lat / lng         : 緯度・経度（routes.tsから自動生成）',
  '# line_count        : 乗り入れ路線数（自動生成）',
  '# avg_rent_1k       : 1K月額賃料中央値（万円）  ※ 集計方法: 中央値 / 参照: SUUMO,HOMES / 更新: 2026-06-01',
  '# avg_rent_1ldk     : 1LDK月額賃料中央値（万円）※ 集計方法: 中央値 / 参照: SUUMO,HOMES / 更新: 2026-06-01',
  '# population_density: 人口密度（人/km²）         ※ 集計方法: 平均値 / 参照: 令和2年国勢調査 / 更新: 2026-06-01',
  '# daily_passengers  : 一日乗降客数（人/日）       ※ 集計方法: 公表値合算 / 参照: 各鉄道事業者 / 更新: 2026-06-01',
  '# morning_congestion: 朝ラッシュ混雑度（0-100）  ※ 集計方法: 推計 / 参照: 各社混雑率データ / 更新: 2026-06-01',
  '# izakaya_count     : 居酒屋数（半径500m）        ※ 集計方法: 概算（店舗数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# restaurant_count  : 飲食店数（半径500m）        ※ 集計方法: 概算（店舗数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# cafe_count        : カフェ数（半径500m）        ※ 集計方法: 概算（店舗数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# convenience_store_count: コンビニ数（半径500m） ※ 集計方法: 概算（店舗数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# ramen_count       : ラーメン屋数（半径500m）    ※ 集計方法: 概算（店舗数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# supermarket_count : スーパー数（半径500m）      ※ 集計方法: 概算（店舗数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# hospital_count    : 病院・クリニック数（半径500m）※ 集計方法: 概算（施設数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# bookstore_count   : 書店数（半径500m）          ※ 集計方法: 概算（店舗数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# crime_index       : 犯罪認知件数（件/年）        ※ 集計方法: 公表値 / 参照: 警視庁犯罪統計 / 更新: 2026-06-01',
  '# safety_score      : 治安スコア（0-100、高=安全）※ 集計方法: 犯罪率を正規化 / 参照: 警視庁 / 更新: 2026-06-01',
  '# park_area_m2      : 公園面積（m²、半径500m）    ※ 集計方法: 面積合算 / 参照: 国土数値情報 / 更新: 2026-06-01',
  '# noise_score       : 静かさスコア（0-100、高=静か）※ 集計方法: 推計 / 参照: 複合指標 / 更新: 2026-06-01',
  '# green_ratio_pct   : 緑地率（%）                 ※ 集計方法: 推計 / 参照: 衛星画像・都市計画図 / 更新: 2026-06-01',
  '# office_count      : オフィスビル数（半径500m）  ※ 集計方法: 概算（棟数）/ 参照: 地図データ / 更新: 2026-06-01',
  '# coworking_count   : コワーキング数（半径500m）  ※ 集計方法: 概算（店舗数）/ 参照: 地図データ / 更新: 2026-06-01',
  '#',
  '# 空欄（,,）はデータ未入力。手動 or 外部API（国土数値情報等）で補完してください。',
  '',
];

function stationToRow(name: string, lat: number, lng: number, lineCount: number): string {
  const existing = stationStatsData[name];
  const cols: (string | number)[] = [
    name,
    lat.toFixed(6),
    lng.toFixed(6),
    lineCount,
    existing?.avgRent1K          ?? '',
    existing?.avgRent1LDK        ?? '',
    existing?.populationDensity  ?? '',
    existing?.dailyPassengers    ?? '',
    existing?.morningCongestion  ?? '',
    existing?.izakayaCount       ?? '',
    existing?.restaurantCount    ?? '',
    existing?.cafeCount          ?? '',
    existing?.convenienceStoreCount ?? '',
    existing?.ramenCount         ?? '',
    existing?.supermarketCount   ?? '',
    existing?.hospitalCount      ?? '',
    existing?.bookstoreCount     ?? '',
    existing?.crimeIndex         ?? '',
    existing?.safetyScore        ?? '',
    existing?.parkAreaM2         ?? '',
    existing?.noiseScore         ?? '',
    existing?.greenRatioPct      ?? '',
    existing?.officeCount        ?? '',
    existing?.coworkingCount     ?? '',
  ];
  // カンマを含む駅名はダブルクォートで囲む
  return cols.map(c => String(c).includes(',') ? `"${c}"` : String(c)).join(',');
}

const lines: string[] = [
  ...FIELD_COMMENTS,
  HEADERS.join(','),
];

for (const [name, data] of stationMap) {
  lines.push(stationToRow(name, data.lat, data.lng, data.routeKeys.length));
}

const outputDir = resolve(process.cwd(), 'data');
mkdirSync(outputDir, { recursive: true });
const outputPath = resolve(outputDir, 'station-stats.csv');
writeFileSync(outputPath, lines.join('\n'), 'utf-8');

console.log(`✅ CSV 生成完了: ${outputPath}`);
console.log(`   総駅数: ${stationMap.size}`);
console.log(`   データ入力済み駅: ${Object.keys(stationStatsData).length}`);
console.log(`   未入力駅: ${stationMap.size - Object.keys(stationStatsData).length}`);
console.log('');
console.log('📝 次のステップ:');
console.log('   1. data/station-stats.csv をスプレッドシートで開いてデータを補完');
console.log('   2. scripts/import-station-stats.ts（未実装）でTSに再インポート');
