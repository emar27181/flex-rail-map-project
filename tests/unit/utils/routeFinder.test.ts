import { describe, it, expect, beforeAll } from 'vitest';
import { RouteFinder, RouteResult, findRoutesViaWaypoints } from '../../../src/utils/routeFinder';
import { routes } from '../../../src/data/routes';

describe('RouteFinder', () => {
  let routeFinder: RouteFinder;

  beforeAll(() => {
    routeFinder = new RouteFinder();
  });

  describe('基本機能', () => {
    it('同一駅を指定した場合は空の結果を返す', () => {
      const shinjuku = routes.yamanote.find(s => s.name === '新宿');
      expect(shinjuku).toBeDefined();

      const results = routeFinder.findRoutes(shinjuku!, shinjuku!, 5);
      expect(results).toHaveLength(0);
    });

    it('存在しない駅を指定した場合は空の結果を返す', () => {
      const fakeStation = { name: '存在しない駅', lat: 0, lng: 0 };
      const shinjuku = routes.yamanote.find(s => s.name === '新宿');

      const results = routeFinder.findRoutes(fakeStation, shinjuku!, 5);
      expect(results).toHaveLength(0);
    });

    it('maxResultsで指定した数以下の結果を返す', () => {
      const shibuya = routes.yamanote.find(s => s.name === '渋谷');
      const tokyo = routes.yamanote.find(s => s.name === '東京');

      const results = routeFinder.findRoutes(shibuya!, tokyo!, 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });

  describe('直接経路（同一路線）', () => {
    it('山手線：渋谷→新宿で直接経路を検出', () => {
      const shibuya = routes.yamanote.find(s => s.name === '渋谷');
      const shinjuku = routes.yamanote.find(s => s.name === '新宿');

      expect(shibuya).toBeDefined();
      expect(shinjuku).toBeDefined();

      const results = routeFinder.findRoutes(shibuya!, shinjuku!, 5);

      // 直接経路（乗り換え0回）が含まれること
      const directRoute = results.find(r => r.transfers === 0);
      expect(directRoute).toBeDefined();
      expect(directRoute!.segments).toHaveLength(1);
    });

    it('中央線：新宿→東京で直接経路を検出', () => {
      const shinjuku = routes.chuo.find(s => s.name === '新宿');
      const tokyo = routes.chuo.find(s => s.name === '東京');

      expect(shinjuku).toBeDefined();
      expect(tokyo).toBeDefined();

      const results = routeFinder.findRoutes(shinjuku!, tokyo!, 5);

      const directRoute = results.find(r => r.transfers === 0);
      expect(directRoute).toBeDefined();
    });
  });

  describe('乗り換え経路', () => {
    it('渋谷→上野で乗り換え経路を検出', () => {
      const shibuya = routes.yamanote.find(s => s.name === '渋谷');
      const ueno = routes.yamanote.find(s => s.name === '上野');

      expect(shibuya).toBeDefined();
      expect(ueno).toBeDefined();

      const results = routeFinder.findRoutes(shibuya!, ueno!, 5);

      expect(results.length).toBeGreaterThan(0);
      // 山手線の直接経路があるはず
      const directRoute = results.find(r => r.transfers === 0);
      expect(directRoute).toBeDefined();
    });
  });

  describe('小田急線経路検索（藤沢→新宿）', () => {
    it('藤沢駅が小田急江ノ島線に存在する', () => {
      const fujisawa = routes.odakyuEnoshimaLine.find(s => s.name === '藤沢');
      expect(fujisawa).toBeDefined();
      expect(fujisawa!.name).toBe('藤沢');
    });

    it('新宿駅が小田急線に存在する', () => {
      const shinjuku = routes.odakyuLine.find(s => s.name === '新宿');
      expect(shinjuku).toBeDefined();
      expect(shinjuku!.name).toBe('新宿');
    });

    it('相模大野駅が両路線に存在し、座標が一致する', () => {
      const sagamiOnoEnoshima = routes.odakyuEnoshimaLine.find(s => s.name === '相模大野');
      const sagamiOnoOdakyu = routes.odakyuLine.find(s => s.name === '相模大野');

      expect(sagamiOnoEnoshima).toBeDefined();
      expect(sagamiOnoOdakyu).toBeDefined();

      // 座標が一致することで乗り換えが検出されるはず
      expect(sagamiOnoEnoshima!.lat).toBe(sagamiOnoOdakyu!.lat);
      expect(sagamiOnoEnoshima!.lng).toBe(sagamiOnoOdakyu!.lng);
    });

    it('藤沢→新宿で小田急線経由のルートが推薦される', () => {
      const fujisawa = routes.odakyuEnoshimaLine.find(s => s.name === '藤沢');
      const shinjuku = routes.odakyuLine.find(s => s.name === '新宿');

      expect(fujisawa).toBeDefined();
      expect(shinjuku).toBeDefined();

      const results = routeFinder.findRoutes(fujisawa!, shinjuku!, 10);

      expect(results.length).toBeGreaterThan(0);

      // 小田急線を含む経路が存在することを確認
      const odakyuRoute = results.find(r =>
        r.segments.some(seg =>
          seg.routeKey === 'odakyuLine' || seg.routeKey === 'odakyuEnoshimaLine'
        )
      );

      expect(odakyuRoute).toBeDefined();
    });

    it('藤沢→新宿で乗り換え1回のルートが存在する（小田急線経由）', () => {
      const fujisawa = routes.odakyuEnoshimaLine.find(s => s.name === '藤沢');
      const shinjuku = routes.odakyuLine.find(s => s.name === '新宿');

      const results = routeFinder.findRoutes(fujisawa!, shinjuku!, 10);

      // 乗り換え1回のルートが存在するはず（藤沢→相模大野→新宿）
      const oneTransferRoute = results.find(r => r.transfers === 1);

      // このテストは現状の問題点を検出するためのもの
      // 期待：乗り換え1回のルートが存在する
      expect(oneTransferRoute).toBeDefined();
    });

    it('藤沢→新宿の小田急線経由ルートが上位3件以内に入る（各駅停車ベースの所要時間で埋もれない）', () => {
      // 過去の不具合: odakyu-line/odakyu-enoshima-lineのtimeToNextが各駅停車ベースの
      // 生値だったため、駅数の多い小田急線の所要時間がJR幹線より大幅に長く算出され、
      // 実際には表示件数内でも順位が低すぎて事実上見えなくなっていた。
      const fujisawa = routes.odakyuEnoshimaLine.find(s => s.name === '藤沢');
      const shinjuku = routes.odakyuLine.find(s => s.name === '新宿');

      const results = routeFinder.findRoutes(fujisawa!, shinjuku!, 10);

      const odakyuRank = results.findIndex(r =>
        r.segments.some(seg =>
          seg.routeKey === 'odakyuLine' || seg.routeKey === 'odakyuEnoshimaLine'
        )
      );

      expect(odakyuRank).toBeGreaterThanOrEqual(0);
      expect(odakyuRank).toBeLessThan(3);
    });
  });

  describe('重複ルート除去', () => {
    it('横浜→新宿で重複ルートが除去される', () => {
      const yokohama = routes.jrTokaidoMainLine.find(s => s.name === '横浜');
      const shinjuku = routes.yamanote.find(s => s.name === '新宿');

      expect(yokohama).toBeDefined();
      expect(shinjuku).toBeDefined();

      const results = routeFinder.findRoutes(yokohama!, shinjuku!, 10);

      // 各ルートがユニークであることを確認
      const routeSignatures = results.map(r => {
        return r.segments.map(seg => `${seg.routeKey}:${seg.startIndex}-${seg.endIndex}`).join('|');
      });

      const uniqueSignatures = new Set(routeSignatures);
      expect(uniqueSignatures.size).toBe(routeSignatures.length);
    });
  });

  describe('経路の妥当性', () => {
    it('結果が時間でソートされている', () => {
      const shibuya = routes.yamanote.find(s => s.name === '渋谷');
      const tokyo = routes.yamanote.find(s => s.name === '東京');

      const results = routeFinder.findRoutes(shibuya!, tokyo!, 5);

      // 乗り換え回数が同じ場合、時間順にソートされている
      const sameTransferResults = results.filter(r => r.transfers === results[0].transfers);
      for (let i = 1; i < sameTransferResults.length; i++) {
        expect(sameTransferResults[i].totalTime).toBeGreaterThanOrEqual(sameTransferResults[i - 1].totalTime);
      }
    });

    it('全ての経路でセグメントの合計時間がtotalTimeと一致', () => {
      const shibuya = routes.yamanote.find(s => s.name === '渋谷');
      const ueno = routes.yamanote.find(s => s.name === '上野');

      const results = routeFinder.findRoutes(shibuya!, ueno!, 5);

      results.forEach(result => {
        const segmentTimeSum = result.segments.reduce((sum, seg) => sum + seg.time, 0);
        // 乗り換え時間も考慮（転送ペナルティ）
        // totalTimeはセグメント時間+乗り換え時間を含む
        expect(result.totalTime).toBeGreaterThanOrEqual(segmentTimeSum);
      });
    });

    it('経路が連続している（セグメント間の接続確認）', () => {
      const shibuya = routes.yamanote.find(s => s.name === '渋谷');
      const ueno = routes.yamanote.find(s => s.name === '上野');

      const results = routeFinder.findRoutes(shibuya!, ueno!, 5);

      results.forEach(result => {
        for (let i = 1; i < result.segments.length; i++) {
          const prevSegment = result.segments[i - 1];
          const currentSegment = result.segments[i];

          // 前のセグメントの最後の駅と現在のセグメントの最初の駅が接続している
          const prevLastStation = prevSegment.stations[prevSegment.stations.length - 1];
          const currentFirstStation = currentSegment.stations[0];

          // 同じ駅名または徒歩圏内の駅であることを確認
          // （駅名が一致するか、座標が近い）
          const isSameStation = prevLastStation.name === currentFirstStation.name;
          const isCloseEnough = Math.abs(prevLastStation.lat - currentFirstStation.lat) < 0.01 &&
                               Math.abs(prevLastStation.lng - currentFirstStation.lng) < 0.01;

          expect(isSameStation || isCloseEnough).toBe(true);
        }
      });
    });
  });

  describe('生田→川崎経路（東急線/南武線）', () => {
    it('生田駅が小田急線に存在する', () => {
      const ikuta = routes.odakyuLine.find(s => s.name === '生田');
      expect(ikuta).toBeDefined();
    });

    it('川崎駅がJR路線に存在する', () => {
      const kawasaki = routes.jrTokaidoMainLine.find(s => s.name === '川崎') ||
                       routes.keihinTohoku.find(s => s.name === '川崎');
      expect(kawasaki).toBeDefined();
    });
  });
});

describe('データ整合性', () => {
  it('全ての路線に少なくとも2つの駅がある', () => {
    Object.entries(routes).forEach(([routeKey, stations]) => {
      expect(stations.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('全ての駅に名前、緯度、経度がある', () => {
    Object.entries(routes).forEach(([routeKey, stations]) => {
      stations.forEach(station => {
        expect(station.name).toBeDefined();
        expect(station.name.length).toBeGreaterThan(0);
        expect(station.lat).toBeDefined();
        expect(station.lng).toBeDefined();
        expect(typeof station.lat).toBe('number');
        expect(typeof station.lng).toBe('number');
      });
    });
  });

  it('乗り換え駅の座標が路線間で一致している', () => {
    // 主要な乗り換え駅をチェック
    const transferStations = ['新宿', '渋谷', '池袋', '東京', '品川', '上野', '横浜'];

    transferStations.forEach(stationName => {
      const stationsWithName: Array<{ routeKey: string; lat: number; lng: number }> = [];

      Object.entries(routes).forEach(([routeKey, stations]) => {
        const found = stations.find(s => s.name === stationName);
        if (found) {
          stationsWithName.push({ routeKey, lat: found.lat, lng: found.lng });
        }
      });

      // 同じ駅名の座標は近い位置にあるべき（0.01度以内 ≈ 約1km）
      if (stationsWithName.length > 1) {
        const first = stationsWithName[0];
        stationsWithName.forEach(s => {
          const latDiff = Math.abs(s.lat - first.lat);
          const lngDiff = Math.abs(s.lng - first.lng);
          expect(latDiff).toBeLessThan(0.01);
          expect(lngDiff).toBeLessThan(0.01);
        });
      }
    });
  });
});

describe('findRoutesViaWaypoints（経由駅指定の経路検索）', () => {
  let routeFinder: RouteFinder;

  beforeAll(() => {
    routeFinder = new RouteFinder();
  });

  const stationByName = (name: string) => {
    const s = routes.yamanote.find(st => st.name === name);
    if (!s) throw new Error(`駅が見つからない: ${name}`);
    return s;
  };

  it('経由駅1つ: 各区間の最有力ルートをつなげた1本の経路を返す', () => {
    const shibuya = stationByName('渋谷');
    const shinjuku = stationByName('新宿');
    const ikebukuro = stationByName('池袋');

    const leg1 = routeFinder.findRoutes(shibuya, shinjuku, 1)[0];
    const leg2 = routeFinder.findRoutes(shinjuku, ikebukuro, 1)[0];
    expect(leg1).toBeDefined();
    expect(leg2).toBeDefined();

    const via = findRoutesViaWaypoints(routeFinder, shibuya, [shinjuku], ikebukuro);
    expect(via).not.toBeNull();
    // 区間ごとのセグメントがすべて連結されていること
    expect(via!.segments.length).toBe(leg1.segments.length + leg2.segments.length);
    // 所要時間は区間の合計
    expect(via!.totalTime).toBeCloseTo(leg1.totalTime + leg2.totalTime, 5);
    // 乗換回数は区間ごとの乗換 + 経由駅をまたぐ分(+1)
    expect(via!.transfers).toBe(leg1.transfers + leg2.transfers + 1);
  });

  it('経由駅が無いときは単一区間の検索結果とほぼ同じになる（+1の乗換は付かない）', () => {
    const shibuya = stationByName('渋谷');
    const shinjuku = stationByName('新宿');

    const direct = routeFinder.findRoutes(shibuya, shinjuku, 1)[0];
    const via = findRoutesViaWaypoints(routeFinder, shibuya, [], shinjuku);

    expect(via).not.toBeNull();
    expect(via!.totalTime).toBeCloseTo(direct.totalTime, 5);
    expect(via!.transfers).toBe(direct.transfers);
  });

  it('経由駅を複数指定しても順番どおりに連結する', () => {
    const shibuya = stationByName('渋谷');
    const shinjuku = stationByName('新宿');
    const ikebukuro = stationByName('池袋');
    const ueno = stationByName('上野');

    const via = findRoutesViaWaypoints(routeFinder, shibuya, [shinjuku, ikebukuro], ueno);
    expect(via).not.toBeNull();

    // 連結後の駅並びが 渋谷 → ... → 新宿 → ... → 池袋 → ... → 上野 の順になっていること
    const allStationNames = via!.segments.flatMap(seg => seg.stations.map(s => s.name));
    const idxShibuya = allStationNames.indexOf('渋谷');
    const idxShinjuku = allStationNames.indexOf('新宿');
    const idxIkebukuro = allStationNames.indexOf('池袋');
    const idxUeno = allStationNames.lastIndexOf('上野');
    expect(idxShibuya).toBeGreaterThanOrEqual(0);
    expect(idxShinjuku).toBeGreaterThan(idxShibuya);
    expect(idxIkebukuro).toBeGreaterThan(idxShinjuku);
    expect(idxUeno).toBeGreaterThan(idxIkebukuro);
    // 経由駅2つ + 各区間の乗換ぶん
    expect(via!.transfers).toBeGreaterThanOrEqual(2);
  });

  it('存在しない経由駅を指定すると null を返す', () => {
    const shibuya = stationByName('渋谷');
    const shinjuku = stationByName('新宿');
    const fakeStation = { name: '存在しない駅', lat: 0, lng: 0 };

    const via = findRoutesViaWaypoints(routeFinder, shibuya, [fakeStation], shinjuku);
    expect(via).toBeNull();
  });
});
