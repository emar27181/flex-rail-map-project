import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getStationNumber } from '../../../src/data/stationNumbers';
import { routes, type RouteKey } from '../../../src/data/routes';

// 期待値は本番データから生成せず、公式資料の照合スナップショットを使う。
const audit = JSON.parse(readFileSync(join(process.cwd(), 'data/station-number-audit-2026-10-16/verified.json'), 'utf8')) as {
  checkedAt: string;
  sources: { id: string; publisher: string; title: string; url: string; checkedAt: string }[];
  verified: { routeKey: RouteKey; stationName: string; code: string; sourceIds: string[] }[];
  removed: { routeKey: RouteKey; stationName: string; sourceIds: string[]; reason: string }[];
  deferred: { routeKeys: RouteKey[]; reason: string }[];
};

describe('公式資料に基づく駅番号監査（2026-10-16）', () => {
  it.each(audit.verified)('$routeKey / $stationName = $code', record => {
    expect(getStationNumber(record.routeKey, record.stationName)).toBe(record.code);
  });
  it.each(audit.removed)('誤った合成・他社駅の番号を復活させない: $routeKey / $stationName', record => {
    expect(getStationNumber(record.routeKey, record.stationName)).toBeUndefined();
    expect(record.reason).not.toBe('');
  });
  it('全ての照合・除去記録に公式URLと参照日があり、駅の照合記録は重複しない', () => {
    const allowedHosts = ['www.jreast.co.jp', 'www.kotsu.metro.tokyo.jp', 'www.tokyometro.jp', 'www.odakyu.jp',
      'www.keikyu.co.jp', 'www.keio.co.jp', 'www.twr.co.jp', 'www.yurikamome.co.jp', 'www.city.yokohama.lg.jp',
      'www.tobu.co.jp', 'www.tokyo-monorail.co.jp', 'www.s-rail.co.jp'];
    const sources = new Map(audit.sources.map(source => [source.id, source]));
    expect(sources.size).toBe(audit.sources.length);
    for (const source of audit.sources) {
      expect(allowedHosts).toContain(new URL(source.url).hostname);
      expect(new URL(source.url).protocol).toBe('https:');
      expect(source.checkedAt).toBe(audit.checkedAt);
      expect(source.publisher.length).toBeGreaterThan(0);
      expect(source.title.length).toBeGreaterThan(0);
    }
    const keys = new Set<string>();
    for (const record of [...audit.verified, ...audit.removed]) {
      expect(record.routeKey in routes).toBe(true);
      expect(record.sourceIds.length).toBeGreaterThan(0);
      for (const id of record.sourceIds) expect(sources.has(id)).toBe(true);
      const key = `${record.routeKey}/${record.stationName}`;
      expect(keys.has(key)).toBe(false);
      keys.add(key);
    }
    expect(audit.checkedAt).toBe('2026-10-16');
    expect(audit.deferred.length).toBeGreaterThan(0); // 未照合の既存番号を全件確認済みと偽らない
  });
});
