import { routes, routeNames } from '../src/data/routes';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// CSV形式でエクスポート
const lines: string[] = [
  '# 座標品質チェック基準:',
  '# 1. 隣接駅間の緯度差・経度差が急激に変化していないか（スパイク検出）',
  '# 2. 路線の進行方向が一貫しているか（南北方向/東西方向）',
  '# 3. timeToNextが距離に比例しているか（1分あたり約0.01度が目安）',
  '# 4. 座標が海上にないか（日本の鉄道なら概ね以下の範囲内）',
  '#    北海道: lat 41.3-45.6, lng 140.0-145.9',
  '#    本州:   lat 31.0-41.5, lng 129.5-142.0',
  '#    四国:   lat 32.7-34.3, lng 132.4-134.8',
  '#    九州:   lat 31.0-34.0, lng 129.4-132.0',
  '#    沖縄:   lat 24.0-27.0, lng 123.0-129.0',
  '#',
  '# スパイク検出方法:',
  '# 隣接駅間のlat差またはlng差が 0.05度以上 → 要確認',
  '# timeToNextが距離の割に極端に小さい（<2分）または大きい（>30分）→ 要確認',
  '',
  'route_key,route_name,idx,station_name,lat,lng,timeToNext,lat_diff,lng_diff,speed_check',
];

for (const [routeKey, stations] of Object.entries(routes)) {
  const routeName = routeNames[routeKey as keyof typeof routeNames] ?? routeKey;
  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    let latDiff = '';
    let lngDiff = '';
    let speedCheck = '';
    if (i > 0) {
      const prev = stations[i - 1];
      const dLat = Math.abs(s.lat - prev.lat);
      const dLng = Math.abs(s.lng - prev.lng);
      latDiff = (s.lat - prev.lat).toFixed(4);
      lngDiff = (s.lng - prev.lng).toFixed(4);
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      const expectedMinutes = dist / 0.009; // 約0.009度/分が平均的
      const prevTTN = prev.timeToNext ?? 0;
      const ratio = prevTTN > 0 ? expectedMinutes / prevTTN : 0;
      if (dLat > 0.05 || dLng > 0.05) {
        speedCheck = '★SPIKE★';
      } else if (prevTTN > 0 && (ratio > 3 || ratio < 0.2)) {
        speedCheck = `速度異常(期待${expectedMinutes.toFixed(1)}分,実際${prevTTN}分)`;
      } else {
        speedCheck = 'OK';
      }
    }
    lines.push(`${routeKey},${routeName},${i},${s.name},${s.lat},${s.lng},${s.timeToNext},${latDiff},${lngDiff},${speedCheck}`);
  }
  lines.push(''); // 路線間の区切り
}

const outputPath = resolve(process.cwd(), 'scripts/all-coordinates.csv');
writeFileSync(outputPath, lines.join('\n'), 'utf-8');
console.log(`✅ エクスポート完了: ${outputPath}`);
console.log(`総路線数: ${Object.keys(routes).length}`);
console.log(`総駅数: ${Object.values(routes).reduce((sum, s) => sum + s.length, 0)}`);

// スパイク一覧を標準出力
console.log('\n=== スパイク検出結果（★SPIKE★）===');
const spikeLines = lines.filter(l => l.includes('★SPIKE★'));
if (spikeLines.length === 0) {
  console.log('スパイクなし');
} else {
  spikeLines.forEach(l => console.log(l));
}

// 速度異常一覧
console.log('\n=== 速度異常検出結果 ===');
const speedLines = lines.filter(l => l.includes('速度異常'));
if (speedLines.length === 0) {
  console.log('速度異常なし');
} else {
  speedLines.forEach(l => console.log(l));
}
