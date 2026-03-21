/**
 * 経路推薦の網羅的テスト
 * npx tsx tests/route-recommendations.ts で実行
 */
import { RouteFinder } from '../src/utils/routeFinder';
import { routes } from '../src/data/routes';

const finder = new RouteFinder();

function findStation(name: string) {
  for (const stations of Object.values(routes)) {
    const s = stations.find(st => st.name === name);
    if (s) return s;
  }
  return null;
}

const testCases = [
  // 直接路線
  { from: '東京', to: '新宿', minResults: 1, maxTransfers: 1, desc: '直接（山手線・中央線）' },
  { from: '渋谷', to: '池袋', minResults: 1, maxTransfers: 1, desc: '直接（山手線・副都心線）' },
  // 乗換1回
  { from: '横浜', to: '新宿', minResults: 1, maxTransfers: 2, desc: '乗換1〜2回' },
  { from: '秋葉原', to: '横浜', minResults: 1, maxTransfers: 2, desc: '乗換1〜2回' },
  { from: '品川', to: '吉祥寺', minResults: 1, maxTransfers: 2, desc: '乗換1〜2回' },
  { from: '新宿', to: '藤沢', minResults: 1, maxTransfers: 2, desc: '小田急含む複数経路' },
  { from: '北千住', to: '渋谷', minResults: 1, maxTransfers: 2, desc: '乗換1〜2回' },
  // 乗換2回（transfers>=2バグの検証）
  { from: '新大久保', to: '新横浜', minResults: 1, maxTransfers: 3, desc: '乗換2回（山手→東横→横浜線）' },
  { from: '池袋', to: '横浜', minResults: 1, maxTransfers: 2, desc: '乗換1〜2回' },
  // 徒歩乗換（出発駅walking transfer）
  { from: '浜松町', to: '羽田空港第1・第2ターミナル', minResults: 1, maxTransfers: 2, desc: '東京モノレール（徒歩乗換）' },
  // 広域路線
  { from: '新宿', to: 'つくば', minResults: 1, maxTransfers: 2, desc: 'TX経由' },
  // 新幹線NGテスト
  { from: '東京', to: '品川', minResults: 1, maxTransfers: 1, noShinkansen: true, desc: '山手線で十分（新幹線NG）' },
  { from: '東京', to: '新横浜', minResults: 1, maxTransfers: 2, noShinkansen: true, desc: '新幹線なしで推薦（新幹線NG）' },
];

let passed = 0;
let failed = 0;

for (const tc of testCases) {
  const dep = findStation(tc.from);
  const arr = findStation(tc.to);

  if (!dep) { console.log(`❓ 出発駅不明: ${tc.from}`); failed++; continue; }
  if (!arr) { console.log(`❓ 到着駅不明: ${tc.to}`); failed++; continue; }

  const results = finder.findRoutes(dep, arr, 10);

  if (results.length < tc.minResults) {
    console.log(`❌ NO ROUTES: ${tc.from} → ${tc.to}  [${tc.desc}]`);
    failed++;
    continue;
  }

  const best = results[0];
  const routeStr = best.segments.map(s => s.routeName).join(' → ');
  let warn = '';

  if (tc.noShinkansen) {
    const hasShin = best.segments.some((s: any) => s.routeKey === 'tokaidoShinkansen');
    if (hasShin) warn = ' ⚠️ 新幹線推薦';
  }

  if (best.transfers > tc.maxTransfers) {
    console.log(`⚠️  過剰乗換: ${tc.from} → ${tc.to}: ${best.totalTime}分 ${best.transfers}回乗換 [${routeStr}] (最大${tc.maxTransfers}回期待) [${tc.desc}]`);
    failed++;
    continue;
  }

  console.log(`✅ ${tc.from} → ${tc.to}: ${best.totalTime}分 ${best.transfers}回乗換 [${routeStr}]${warn}`);
  if (results.length > 1) {
    console.log(`   (他 ${results.length-1} 件: ${results.slice(1,3).map(r => r.segments.map(s=>s.routeName).join('→')).join(' / ')})`);
  }
  passed++;
}

console.log(`\n結果: ${passed}✅ / ${failed}❌  (${passed+failed}件中)`);
process.exit(failed > 0 ? 1 : 0);
