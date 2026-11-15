import { describe, it, expect } from 'vitest';
import { rankMeetingStations, meetingEdgeMinutes, meetingBalanceWeight, MEETING_BALANCE_LEVELS } from '../../../src/utils/meetingPoint';
import { RouteFinder, TimeFilter } from '../../../src/utils/routeFinder';
import { routes } from '../../../src/data/routes';
import type { RouteKey } from '../../../src/data/routes';

const m = (o: Record<string, number>) => new Map(Object.entries(o));

describe('rankMeetingStations', () => {
  it('いちばん遅い人の所要時間が短い順に並べる（合計が小さくても偏る駅は後ろ）', () => {
    const r = rankMeetingStations(['A', 'B'], [
      m({ X: 10, Y: 20, Z: 15 }),
      m({ X: 40, Y: 25, Z: 15 }),
    ]);
    // Z: max15 / Y: max25 / X: max40（合計は X=50, Y=45, Z=30）
    expect(r.map(c => c.name)).toEqual(['Z', 'Y', 'X']);
    expect(r[0]).toMatchObject({ times: [15, 15], max: 15, sum: 30 });
  });

  it('最大が同じなら合計が短い順', () => {
    const r = rankMeetingStations(['A', 'B'], [m({ P: 10, Q: 5 }), m({ P: 20, Q: 20 })]);
    expect(r.map(c => c.name)).toEqual(['Q', 'P']);
  });

  it('全員が行ける駅だけを候補にする', () => {
    const r = rankMeetingStations(['A', 'B', 'C'], [
      m({ X: 10, Y: 10 }), m({ X: 10 }), m({ X: 5, Y: 5 }),
    ]);
    expect(r.map(c => c.name)).toEqual(['X']);
  });

  it('出発駅自身は 0 分として候補に入る', () => {
    const r = rankMeetingStations(['A', 'B'], [m({ B: 12 }), m({ A: 12 })]);
    expect(r.map(c => c.name).sort()).toEqual(['A', 'B']);
    expect(r[0].times).toContain(0);
  });

  it('出発駅が2つ未満なら候補を出さない', () => {
    expect(rankMeetingStations(['A'], [m({ A: 0 })])).toEqual([]);
  });
});

describe('実際の路線データでの集合駅', () => {
  const finder = new RouteFinder();
  const tf = new TimeFilter(finder);
  const all = new Set(Object.keys(routes) as RouteKey[]);
  const stationOf = (name: string) => {
    for (const stops of Object.values(routes)) {
      const s = stops.find(st => st.name === name);
      if (s) return s;
    }
    throw new Error(`${name} が無い`);
  };
  const timesFrom = (name: string) =>
    new Map(tf.findStationsWithinTime(stationOf(name), 120, all).map(r => [r.station.name, r.totalTime]));

  it('新宿と東京の集合駅の上位は、2駅の間にある駅で、遅い人の時間が最短になる', () => {
    const r = rankMeetingStations(['新宿', '東京'], [timesFrom('新宿'), timesFrom('東京')]);
    expect(r.length).toBeGreaterThan(3);
    const top = r[0];
    // 2駅の最短所要時間より、いちばん遅い人の時間は短い（途中の駅で会える）
    const direct = timesFrom('新宿').get('東京')!;
    expect(top.max).toBeLessThanOrEqual(Math.ceil(direct));
    expect(top.max).toBeLessThan(direct);
    // 並びは max の昇順
    for (let i = 1; i < r.length; i++) expect(r[i].max).toBeGreaterThanOrEqual(r[i - 1].max);
  });
});

import { summarizeMeetingRoutes } from '../../../src/utils/meetingPoint';

describe('summarizeMeetingRoutes', () => {
  const route = (keys: Array<string | { routeKey: string; isWalkingTransfer: true }>, totalTime: number, transfers: number) => ({
    totalTime, transfers,
    segments: keys.map(k => typeof k === 'string' ? { routeKey: k } : k),
  });

  it('出発駅ごとに、乗る路線を順に並べる（同じ路線の連続と徒歩は除く）', () => {
    const r = summarizeMeetingRoutes(['A', 'B', 'C'], 'X', origin => ({
      A: route(['yamanote', 'yamanote', 'chuo'], 20.4, 1),
      B: route([{ routeKey: 'walking', isWalkingTransfer: true }, 'ginzaLine'], 12, 0),
      C: null,
    } as Record<string, ReturnType<typeof route> | null>)[origin]);
    expect(r).toMatchObject([
      { origin: 'A', lines: ['yamanote', 'chuo'], totalTime: 20, transfers: 1 },
      { origin: 'B', lines: ['ginzaLine'], totalTime: 12, transfers: 0 },
      { origin: 'C', lines: [], totalTime: null, transfers: 0 },
    ]);
  });

  it('集合駅と同じ出発駅は 0 分・路線なし', () => {
    const r = summarizeMeetingRoutes(['X'], 'X', () => { throw new Error('探索しない'); });
    expect(r[0]).toEqual({ origin: 'X', lines: [], totalTime: 0, transfers: 0 });
  });
});

describe('出発駅を対等に扱う補助', () => {
  it('interleaveByRank: 出発駅ごとの経路を順位の順に交互に並べる（最初の出発駅だけが先頭に偏らない）', async () => {
    const { interleaveByRank } = await import('../../../src/utils/meetingPoint');
    expect(interleaveByRank([['a1', 'a2', 'a3'], ['b1'], ['c1', 'c2']])).toEqual(['a1', 'b1', 'c1', 'a2', 'c2', 'a3']);
    expect(interleaveByRank([])).toEqual([]);
  });

  it('meetingClockTimes: 出発基準は全員同じ出発時刻、到着基準は全員同じ到着時刻', async () => {
    const { meetingClockTimes } = await import('../../../src/utils/meetingPoint');
    expect(meetingClockTimes('08:00', 'departure', 25)).toEqual({ depart: '08:00', arrive: '08:25' });
    expect(meetingClockTimes('08:00', 'arrival', 25)).toEqual({ depart: '07:35', arrive: '08:00' });
    expect(meetingClockTimes('23:50', 'departure', 20)).toEqual({ depart: '23:50', arrive: '00:10' });
  });
});

describe('路線の上の区間の時間（出発駅それぞれから数字が増える）', () => {
  // 新宿 -(20)- 代々木上原 -(10)- 登戸 -(20)- 新百合ヶ丘 -(15)- 相模大野 -(25)- 藤沢 のような一本の路線
  const fromShinjuku = new Map([['新宿', 0], ['代々木上原', 20], ['登戸', 30], ['新百合ヶ丘', 50], ['相模大野', 65], ['藤沢', 90]]);
  const fromFujisawa = new Map([['藤沢', 0], ['相模大野', 25], ['新百合ヶ丘', 40], ['登戸', 60], ['代々木上原', 70], ['新宿', 90]]);

  it('それぞれの出発駅の側から数字が増えていく（近い出発駅から見た、遠い側の駅までの時間）', () => {
    const maps = [fromShinjuku, fromFujisawa];
    expect(meetingEdgeMinutes(maps, '新宿', '代々木上原')).toBe(20);
    expect(meetingEdgeMinutes(maps, '代々木上原', '登戸')).toBe(30);
    expect(meetingEdgeMinutes(maps, '登戸', '新百合ヶ丘')).toBe(50);
    expect(meetingEdgeMinutes(maps, '新百合ヶ丘', '相模大野')).toBe(40);
    expect(meetingEdgeMinutes(maps, '相模大野', '藤沢')).toBe(25);
  });

  it('出発駅の並びを入れ替えても同じ（最初の出発駅を優先しない）', () => {
    for (const [a, b] of [['新宿', '代々木上原'], ['登戸', '新百合ヶ丘'], ['相模大野', '藤沢']]) {
      expect(meetingEdgeMinutes([fromShinjuku, fromFujisawa], a, b)).toBe(meetingEdgeMinutes([fromFujisawa, fromShinjuku], a, b));
    }
  });

  it('どの出発駅からも行けない区間は undefined', () => {
    expect(meetingEdgeMinutes([fromShinjuku], '新宿', '存在しない駅')).toBeUndefined();
    expect(meetingEdgeMinutes([], '新宿', '藤沢')).toBeUndefined();
  });
});

describe('偏りの設定（全員が同じくらい ←→ 人の多い側に寄せる）', () => {
  // A, B は駅が近く（Cからは遠い）、C は離れた所にいる。X は A・B の近く、Y は3人の真ん中、
  const maps = [
    m({ X: 2, Y: 20, Z: 40 }),   // A
    m({ X: 4, Y: 20, Z: 40 }),   // B
    m({ X: 60, Y: 30, Z: 50 }),  // C
  ];
  const names = ['A', 'B', 'C'];

  it('段階の重みは 0 〜 1 を等間隔に分ける（5段階）', () => {
    expect(MEETING_BALANCE_LEVELS).toBe(5);
    expect([0, 1, 2, 3, 4].map(meetingBalanceWeight)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    expect(meetingBalanceWeight(-3)).toBe(0);
    expect(meetingBalanceWeight(99)).toBe(1);
  });

  it('0 = 全員が同じくらい: 最大が小さい駅（真ん中の Y）が先頭', () => {
    expect(rankMeetingStations(names, maps, 0)[0].name).toBe('Y');
  });

  it('最大 = 人の多い側に寄せる: 合計が小さい駅（A・B の近くの X）が先頭', () => {
    expect(rankMeetingStations(names, maps, 4)[0].name).toBe('X');
  });

  it('段階を上げていくと、先頭が Y → X に移る（途中で入れ替わる）', () => {
    const heads = [0, 1, 2, 3, 4].map(level => rankMeetingStations(names, maps, level)[0].name);
    expect(heads[0]).toBe('Y');
    expect(heads[4]).toBe('X');
    // 一度 X になったら、段階を上げても Y に戻らない
    const firstX = heads.indexOf('X');
    expect(heads.slice(firstX).every(h => h === 'X')).toBe(true);
  });

  it('出発駅の並びを入れ替えても同じ結果（誰も優先しない）', () => {
    for (const level of [0, 2, 4]) {
      const a = rankMeetingStations(names, maps, level).map(c => c.name);
      const b = rankMeetingStations(['C', 'B', 'A'], [maps[2], maps[1], maps[0]], level).map(c => c.name);
      expect(b).toEqual(a);
    }
  });
});
