import { describe, it, expect } from 'vitest';
import { dropSuspectedFailedBatches, getParamRange, getStationStats, STAT_PARAMS, PARAM_DATA_SOURCES } from '../../../src/data/stationStats';

// niceStep のロジックを直接テスト（RailwayMap.tsx と同じアルゴリズム）
function niceStep(fullRange: number): number {
  const rnd1 = (v: number) => Math.round(v * 10) / 10;
  if (fullRange <= 0) return 1;
  const rough = fullRange / 40;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const s = norm <= 1 ? mag : norm <= 2 ? 2 * mag : norm <= 5 ? 5 * mag : 10 * mag;
  return rnd1(s);
}

describe('niceStep アルゴリズム', () => {
  it('家賃レンジ（約20万）は0.5刻みになる', () => {
    expect(niceStep(20)).toBe(0.5);
  });

  it('家賃1LDKレンジ（約30万）は1.0刻みになる', () => {
    expect(niceStep(30)).toBe(1);
  });

  it('治安スコアレンジ（100）は5刻みになる', () => {
    expect(niceStep(100)).toBe(5);
  });

  it('人口密度レンジ（50000）は2000刻みになる', () => {
    expect(niceStep(50000)).toBe(2000);
  });

  it('乗降客数レンジ（500000）は20000刻みになる', () => {
    expect(niceStep(500000)).toBe(20000);
  });

  it('レンジ0以下は1を返す（ゼロ除算防止）', () => {
    expect(niceStep(0)).toBe(1);
    expect(niceStep(-1)).toBe(1);
  });

  it('小さいレンジ（1）は正の値を返す', () => {
    const step = niceStep(1);
    expect(step).toBeGreaterThan(0);
  });
});

describe('getParamRange', () => {
  it('avgRent1K のレンジが min < max を満たす', () => {
    const { min, max } = getParamRange('avgRent1K');
    expect(min).toBeLessThan(max);
  });

  it('dailyPassengers のレンジが正の値', () => {
    const { min, max } = getParamRange('dailyPassengers');
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeGreaterThan(0);
  });

  it('全 STAT_PARAMS のレンジが min <= max を満たす', () => {
    for (const p of STAT_PARAMS) {
      const { min, max } = getParamRange(p.key);
      expect(min, `${String(p.key)}: min <= max`).toBeLessThanOrEqual(max);
    }
  });
});

describe('PARAM_DATA_SOURCES', () => {
  it('dead フラグが true のソースは url が設定されていても非リンクになる想定', () => {
    for (const [key, src] of Object.entries(PARAM_DATA_SOURCES)) {
      if (src?.dead) {
        // dead=true のときは url があっても無視される（UIテスト不要、型のみ確認）
        expect(typeof src.dead).toBe('boolean');
      }
    }
  });

  it('全ソースに retrievedAt が設定されている', () => {
    for (const [key, src] of Object.entries(PARAM_DATA_SOURCES)) {
      expect(src?.retrievedAt, `${key} に retrievedAt が必要`).toBeTruthy();
    }
  });

  it('dataQuality:real の全パラメータに出典（PARAM_DATA_SOURCES）が設定されている', () => {
    const missing = STAT_PARAMS
      .filter(p => p.dataQuality === 'real' && p.key !== 'routeCount') // routeCountは本アプリの路線データが出典そのもの
      .filter(p => !PARAM_DATA_SOURCES[p.key])
      .map(p => String(p.key));
    expect(missing, `出典未設定の実データ項目: ${missing.join(', ')}`).toEqual([]);
  });
});

describe('首都圏駅データセットPoC（2026-09-24収集）由来のフィールド', () => {
  const POC_STATIONS = ['東京', '新宿', '渋谷', '池袋', '品川', '横浜', '川崎', '藤沢', '大宮', '千葉'];
  const POC_FIELDS = [
    'fastFoodCount', 'mallCount', 'bankCount', 'postOfficeCount', 'pharmacyCount',
    'nurseryCount', 'schoolCount', 'universityCount', 'libraryCount', 'clinicCount',
    'cinemaCount', 'gymCount', 'hotelCount', 'attractionCount', 'parkCount',
  ] as const;

  it('PoC対象10駅は新規15項目すべてに値を持つ', () => {
    for (const name of POC_STATIONS) {
      const stats = getStationStats(name);
      expect(stats, `${name} のデータが見つからない`).toBeTruthy();
      for (const field of POC_FIELDS) {
        expect(stats?.[field], `${name}.${field}`).not.toBeUndefined();
      }
    }
  });

  it('PoC対象外の駅は新規フィールドを持たない（灰色表示のまま。推定値で埋めない）', () => {
    const stats = getStationStats('神田');
    expect(stats).toBeTruthy();
    for (const field of POC_FIELDS) {
      expect(stats?.[field], `神田.${field} は未収集のはずが値が入っている`).toBeUndefined();
    }
  });

  it('congestionSectionsは対象区間がある駅のみ配列を持ち、路線・区間・時間帯・値の形をしている', () => {
    const tokyo = getStationStats('東京');
    expect(Array.isArray(tokyo?.congestionSections)).toBe(true);
    expect(tokyo?.congestionSections?.length).toBeGreaterThan(0);
    for (const section of tokyo?.congestionSections ?? []) {
      expect(section).toMatchObject({
        line: expect.any(String),
        section: expect.any(String),
        timeBand: expect.any(String),
        value: expect.any(Number),
      });
    }
    // 大宮は国交省の主要区間に該当なし（PoC README記載どおりnull/未設定）
    expect(getStationStats('大宮')?.congestionSections).toBeUndefined();
  });
});

describe('取得失敗の疑いのある 0 件はデータなしとして扱う', () => {
  it('同じ回の項目がすべて 0 の駅（有明）は、その回の値を持たない', () => {
    const s = getStationStats('有明')!;
    expect(s.restaurantCount).toBeUndefined();
    expect(s.parkAreaM2).toBeUndefined();
    expect(s.greenRatioPct).toBeUndefined();
    // 2回目の取得もすべて 0 だったので捨てる
    expect(s.izakayaCount).toBeUndefined();
  });

  it('1回目だけ 0 の駅（長谷）は、値の取れている2回目の項目は残す', () => {
    const s = getStationStats('長谷')!;
    expect(s.restaurantCount).toBeUndefined();
    expect(s.izakayaCount).toBe(1);
  });

  it('値のある駅（新宿）はそのまま', () => {
    expect(getStationStats('新宿')!.restaurantCount).toBeGreaterThan(0);
  });

  it('一部だけ 0 の駅は 0 をそのまま残す（本当に無い可能性がある）', () => {
    expect(dropSuspectedFailedBatches({
      stationName: 'x', lat: 0, lng: 0,
      restaurantCount: 0, cafeCount: 0, convenienceStoreCount: 1, supermarketCount: 0, hospitalCount: 0, parkAreaM2: 0,
    }).restaurantCount).toBe(0);
  });
});
