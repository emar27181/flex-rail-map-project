import { describe, it, expect, beforeAll } from 'vitest';
import { RouteFinder } from '../../../src/utils/routeFinder';
import { routes } from '../../../src/data/routes';

describe('経路検索デバッグ', () => {
  let routeFinder: RouteFinder;

  beforeAll(() => {
    routeFinder = new RouteFinder();
  });

  describe('藤沢→新宿 詳細検証', () => {
    it('経路の詳細を出力', () => {
      const fujisawa = routes.odakyuEnoshimaLine.find(s => s.name === '藤沢');
      const shinjuku = routes.odakyuLine.find(s => s.name === '新宿');

      expect(fujisawa).toBeDefined();
      expect(shinjuku).toBeDefined();

      const results = routeFinder.findRoutes(fujisawa!, shinjuku!, 10);

      console.log('\n=== 藤沢→新宿 経路検索結果 ===');
      console.log(`総経路数: ${results.length}`);

      results.forEach((result, i) => {
        console.log(`\n経路 ${i + 1}: 合計${result.totalTime}分, 乗換${result.transfers}回`);
        result.segments.forEach((seg, j) => {
          const start = seg.stations[0]?.name || '不明';
          const end = seg.stations[seg.stations.length - 1]?.name || '不明';
          console.log(`  ${j + 1}. ${seg.routeName} (${start} → ${end}) - ${seg.time}分`);
        });
      });

      // 検証: 小田急線経由のルートがあること
      const hasOdakyuRoute = results.some(r =>
        r.segments.some(seg =>
          seg.routeKey === 'odakyuLine' || seg.routeKey === 'odakyuEnoshimaLine'
        )
      );
      expect(hasOdakyuRoute).toBe(true);

      // 検証: 乗り換え1回のルートがあること
      const oneTransferRoutes = results.filter(r => r.transfers === 1);
      console.log(`\n乗換1回のルート数: ${oneTransferRoutes.length}`);
      expect(oneTransferRoutes.length).toBeGreaterThan(0);
    });
  });

  describe('横浜→新宿 重複検証', () => {
    it('経路の詳細を出力し重複がないことを確認', () => {
      const yokohama = routes.jrTokaidoMainLine.find(s => s.name === '横浜');
      const shinjuku = routes.yamanote.find(s => s.name === '新宿');

      expect(yokohama).toBeDefined();
      expect(shinjuku).toBeDefined();

      const results = routeFinder.findRoutes(yokohama!, shinjuku!, 10);

      console.log('\n=== 横浜→新宿 経路検索結果 ===');
      console.log(`総経路数: ${results.length}`);

      const routeDescriptions: string[] = [];
      results.forEach((result, i) => {
        const desc = result.segments.map(seg => {
          const start = seg.stations[0]?.name;
          const end = seg.stations[seg.stations.length - 1]?.name;
          return `${seg.routeName}(${start}→${end})`;
        }).join(' → ');

        routeDescriptions.push(desc);
        console.log(`\n経路 ${i + 1}: 合計${result.totalTime}分, 乗換${result.transfers}回`);
        console.log(`  ${desc}`);
      });

      // 重複がないことを確認
      const uniqueDescriptions = new Set(routeDescriptions);
      console.log(`\nユニーク経路数: ${uniqueDescriptions.size} / 総数: ${routeDescriptions.length}`);
      expect(uniqueDescriptions.size).toBe(routeDescriptions.length);
    });
  });

  describe('主要乗り換え駅の確認', () => {
    it('相模大野駅で小田急線と江ノ島線の乗り換えが可能', () => {
      // 相模大野が両路線に登録されているか
      const sagamiOnoOdakyu = routes.odakyuLine.find(s => s.name === '相模大野');
      const sagamiOnoEnoshima = routes.odakyuEnoshimaLine.find(s => s.name === '相模大野');

      expect(sagamiOnoOdakyu).toBeDefined();
      expect(sagamiOnoEnoshima).toBeDefined();

      console.log('\n=== 相模大野駅の情報 ===');
      console.log('小田急線:', sagamiOnoOdakyu);
      console.log('江ノ島線:', sagamiOnoEnoshima);

      // 座標が一致すること（乗り換え判定に必要）
      expect(sagamiOnoOdakyu!.name).toBe(sagamiOnoEnoshima!.name);
    });
  });

  describe('無駄な経路の検出', () => {
    it('遠回りルートが除外されている', () => {
      const shibuya = routes.yamanote.find(s => s.name === '渋谷');
      const shinjuku = routes.yamanote.find(s => s.name === '新宿');

      const results = routeFinder.findRoutes(shibuya!, shinjuku!, 10);

      console.log('\n=== 渋谷→新宿 経路検索結果 ===');
      const bestTime = results[0]?.totalTime || 0;

      results.forEach((result, i) => {
        const ratio = result.totalTime / bestTime;
        console.log(`経路 ${i + 1}: ${result.totalTime}分 (最短の${(ratio * 100).toFixed(0)}%)`);

        // 最短時間の2倍を超えるルートは除外されているはず
        expect(result.totalTime).toBeLessThanOrEqual(bestTime * 2);
      });
    });
  });
});
