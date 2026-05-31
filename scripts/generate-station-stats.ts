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

const FIELD_COMMENTS = [
  '# 列説明:',
  '# station_name      : 駅名',
  '# lat / lng         : 緯度・経度（routes.tsから自動生成）',
  '# line_count        : 乗り入れ路線数（自動生成）',
  '# avg_rent_1k       : 1K平均家賃（万円/月）',
  '# avg_rent_1ldk     : 1LDK平均家賃（万円/月）',
  '# population_density: 人口密度（人/km²）',
  '# daily_passengers  : 一日乗降客数（人/日）',
  '# morning_congestion: 朝ラッシュ混雑度（0-100）',
  '# izakaya_count     : 居酒屋数（半径500m以内）',
  '# restaurant_count  : 飲食店数（半径500m以内）',
  '# cafe_count        : カフェ数（半径500m以内）',
  '# convenience_store_count: コンビニ数（半径500m以内）',
  '# ramen_count       : ラーメン屋数（半径500m以内）',
  '# supermarket_count : スーパー数（半径500m以内）',
  '# hospital_count    : 病院・クリニック数（半径500m以内）',
  '# bookstore_count   : 書店数（半径500m以内）',
  '# crime_index       : 犯罪件数（件/年）',
  '# safety_score      : 治安スコア（0-100、高いほど安全）',
  '# park_area_m2      : 公園面積（m²、半径500m以内）',
  '# noise_score       : 静かさスコア（0-100、高いほど静か）',
  '# green_ratio_pct   : 緑地率（%）',
  '# office_count      : オフィスビル数（半径500m以内）',
  '# coworking_count   : コワーキングスペース数（半径500m以内）',
  '#',
  '# 空欄のセルはデータ未入力。手動 or 外部API（国土数値情報等）で補完してください。',
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
