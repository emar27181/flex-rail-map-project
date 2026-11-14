import { describe, it, expect } from 'vitest';
import {
  buildDemoLegs, buildDestinationDemoNetwork, calculateDemoLastTrain, legsFromRealTimetable, parseTimetableClock, DEMO_LINES,
} from '../../../src/utils/lastTrainDemo';
import type { LineLastTrainTimetable } from '../../../src/data/lastTrainTimetables';

const REAL: LineLastTrainTimetable = {
  routeKey: 'yamanote',
  source: { name: '試験用', url: 'https://example.com', retrievedAt: '2026-11-14' },
  trips: [{ id: '外回り-最終', stops: [
    { station: '渋谷', time: '24:00' }, { station: '原宿', time: '24:03' }, { station: '代々木', time: '24:05' },
  ] }],
};

describe('終電の実データ（時刻表のフォーマット）を差し込める', () => {
  it('時刻は 24:10 のように24以上も読める。書式が違えば null', () => {
    expect(parseTimetableClock('24:10')).toBe(1450);
    expect(parseTimetableClock('7:05')).toBe(425);
    expect(parseTimetableClock('99:00')).toBeNull();
    expect(parseTimetableClock('abc')).toBeNull();
  });

  it('実データは駅間の便に展開され、「実データ」の印が付く（架空の便には付かない）', () => {
    const legs = legsFromRealTimetable(REAL);
    expect(legs).toHaveLength(2);
    expect(legs[0]).toMatchObject({ from: '渋谷', to: '原宿', depart: 1440, arrive: 1443, quality: 'real', tripId: 'real:yamanote:外回り-最終' });
    expect(buildDemoLegs(DEMO_LINES, []).every(leg => leg.quality === undefined)).toBe(true);
  });

  it('実データのある路線は、架空のダイヤを作らず実データだけにする（ほかの路線は架空のまま）', () => {
    const legs = buildDemoLegs(DEMO_LINES, [REAL]);
    expect(legs.filter(l => l.lineId === 'yamanote').every(l => l.quality === 'real')).toBe(true);
    expect(legs.some(l => l.lineId === 'chuo' && l.quality === undefined)).toBe(true);
  });

  it('最遅時刻をつくる便が実データの駅だけ「実データ」とされ、架空の便の駅は印が付かない', () => {
    const legs = [
      ...legsFromRealTimetable(REAL),
      { from: '代々木', to: '新宿', lineId: 'chuo', tripId: 'line:chuo:1', depart: 1300, arrive: 1304 },
    ];
    const result = calculateDemoLastTrain(legs, '代々木');
    expect(result.latestDeparture.get('渋谷')).toBe(1440);
    expect(result.latestIsReal.has('渋谷')).toBe(true);
    expect(result.latestIsReal.has('原宿')).toBe(true);
  });
});

describe('終電時刻は到着駅からたどれる全路線に付く', () => {
  it('上限なし（Infinity）で作ると、上限つきより路線が多く、上限つきの路線をすべて含む', () => {
    const limited = buildDestinationDemoNetwork('新橋', 5);
    const full = buildDestinationDemoNetwork('新橋', Infinity);
    expect(full.lines.length).toBeGreaterThan(limited.lines.length);
    const keys = new Set(full.lines.map(l => l.routeKey));
    for (const l of limited.lines) expect(keys.has(l.routeKey)).toBe(true);
  });

  it('直接つながらない路線の駅にも、終電の最遅時刻が付く', () => {
    const limited = buildDestinationDemoNetwork('新橋', 5);
    const full = buildDestinationDemoNetwork('新橋', Infinity);
    const reach = calculateDemoLastTrain(full.legs, '新橋').latestDeparture;
    const outside = full.lines.filter(l => !limited.lines.some(x => x.routeKey === l.routeKey));
    const covered = outside.filter(l => l.stations.some(st => reach.has(st.name)));
    expect(covered.length).toBeGreaterThan(0);
  });

  it('全路線のネットワークと終電の計算が、時間内（数秒以内）に終わる', () => {
    const t0 = Date.now();
    const full = buildDestinationDemoNetwork('新宿', Infinity);
    calculateDemoLastTrain(full.legs, '新宿');
    expect(Date.now() - t0).toBeLessThan(5000);
  });
});
