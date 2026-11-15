import { describe, it, expect } from 'vitest';
import {
  deriveRideLog, entriesFromRoute, rideLevelOf, hasLineEntry, hasAlightEntry, parseRideLog, serializeRideLog, isValidEntry, type RideLogEntry,
} from '../../../src/utils/rideLog';

const st = (name: string) => ({ name });
const E = (id: string, routeKey: string, stations: string[]): RideLogEntry => ({ id, routeKey, stations });

describe('乗車ログ（3段階）', () => {
  const state = deriveRideLog([E('a:0', 'yamanote', ['新宿', '代々木', '原宿', '渋谷'])]);

  it('乗った駅・降りた駅は「通って降りた」、途中の駅は「通ったけど降りていない」、記録に無い駅は「全く通っていない」', () => {
    expect(rideLevelOf(state, '新宿')).toBe(2);
    expect(rideLevelOf(state, '渋谷')).toBe(2);
    expect(rideLevelOf(state, '代々木')).toBe(1);
    expect(rideLevelOf(state, '原宿')).toBe(1);
    expect(rideLevelOf(state, '東京')).toBe(0);
  });

  it('乗った路線と乗った区間だけが色付きの対象（路線のほかの区間は乗っていない）', () => {
    expect(state.riddenRoutes.has('yamanote')).toBe(true);
    expect(state.riddenRoutes.has('chuo')).toBe(false);
    expect(state.paths).toEqual([{ id: 'a:0', routeKey: 'yamanote', stations: ['新宿', '代々木', '原宿', '渋谷'] }]);
  });

  it('別の記録で乗り降りした駅は、途中で通っただけの記録より「降りた」を優先する（順序によらない）', () => {
    const a = deriveRideLog([E('a:0', 'yamanote', ['新宿', '代々木', '渋谷']), E('b:0', 'chuo', ['代々木', '千駄ケ谷'])]);
    const b = deriveRideLog([E('b:0', 'chuo', ['代々木', '千駄ケ谷']), E('a:0', 'yamanote', ['新宿', '代々木', '渋谷'])]);
    expect(rideLevelOf(a, '代々木')).toBe(2);
    expect(rideLevelOf(b, '代々木')).toBe(2);
    expect(rideLevelOf(a, '千駄ケ谷')).toBe(2);
  });

  it('路線のタップ（line）は路線の全駅が「通っただけ」。駅のタップ（alight）は「降りた」。どちらも path は line だけ', () => {
    const st2 = deriveRideLog([
      E('l:0', 'chuo', ['東京', '神田', '御茶ノ水']),
    ].map(e => ({ ...e, kind: 'line' as const })).concat([{ id: 'x:0', kind: 'alight' as const, routeKey: 'chuo', stations: ['神田'] }]));
    expect(rideLevelOf(st2, '東京')).toBe(1);
    expect(rideLevelOf(st2, '御茶ノ水')).toBe(1);
    expect(rideLevelOf(st2, '神田')).toBe(2);
    expect(st2.riddenRoutes.has('chuo')).toBe(true);
    expect(st2.paths).toHaveLength(1);
  });

  it('降りた駅だけの記録は、路線を乗った路線にしない', () => {
    const only = deriveRideLog([{ id: 'x:0', kind: 'alight', routeKey: 'chuo', stations: ['神田'] }]);
    expect(rideLevelOf(only, '神田')).toBe(2);
    expect(only.riddenRoutes.size).toBe(0);
    expect(only.paths).toHaveLength(0);
  });

  it('路線のタップ・降りた駅の記録があるか調べられる（もう一度タップで外すため）', () => {
    const entries: RideLogEntry[] = [
      { id: 'a:0', kind: 'line', routeKey: 'yamanote', stations: ['新宿', '渋谷'] },
      { id: 'b:0', kind: 'alight', routeKey: 'yamanote', stations: ['渋谷'] },
    ];
    expect(hasLineEntry(entries, 'yamanote')).toBe(true);
    expect(hasLineEntry(entries, 'chuo')).toBe(false);
    expect(hasAlightEntry(entries, '渋谷')).toBe(true);
    expect(hasAlightEntry(entries, '新宿')).toBe(false);
  });
});

describe('経路検索の結果から記録を作る', () => {
  it('路線ごとの区間を1件ずつ。徒歩の乗り換えと2駅に満たない区間は入れない', () => {
    let n = 0;
    const entries = entriesFromRoute([
      { routeKey: 'chuo', stations: [st('新宿'), st('四ツ谷'), st('御茶ノ水')] },
      { routeKey: 'walking', isWalkingTransfer: true, stations: [st('御茶ノ水'), st('御茶ノ水')] },
      { routeKey: 'marunouchiLine', stations: [st('御茶ノ水')] },
      { routeKey: 'marunouchiLine', stations: [st('御茶ノ水'), st('大手町')] },
    ], () => `r:${n++}`);
    expect(entries.map(e => [e.id, e.routeKey, e.stations.length])).toEqual([['r:0', 'chuo', 3], ['r:2', 'marunouchiLine', 2]]);
    expect(entries.every(isValidEntry)).toBe(true);
  });
});

describe('保存と読み込み', () => {
  it('書き出して読み戻すと同じ。壊れたデータ・古い形式・空は空として扱う', () => {
    const entries = [E('a:0', 'yamanote', ['新宿', '渋谷'])];
    expect(parseRideLog(serializeRideLog(entries))).toEqual(entries);
    expect(parseRideLog(null)).toEqual([]);
    expect(parseRideLog('{broken')).toEqual([]);
    expect(parseRideLog(JSON.stringify({ version: 0, entries }))).toEqual([]);
    expect(parseRideLog(JSON.stringify({ version: 1, entries: [{ id: 'x', routeKey: 'y', stations: ['一駅'] }] }))).toEqual([]);
    // 降りた駅（alight）は1駅でよい。知らない種類は捨てる
    const alight = { id: 'x', kind: 'alight', routeKey: 'y', stations: ['一駅'] };
    expect(parseRideLog(JSON.stringify({ version: 1, entries: [alight, { ...alight, id: 'z', kind: 'weird' }] }))).toEqual([alight]);
  });
});
