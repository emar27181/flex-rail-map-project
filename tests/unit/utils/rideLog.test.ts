import { describe, it, expect } from 'vitest';
import {
  deriveRideLog, entriesFromRoute, rideLevelOf, countByLevel, isLevelShown, parseRideLog, serializeRideLog, isValidEntry, type RideLogEntry,
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

  it('段階ごとの駅の数。全駅数から記録の駅を引いたものが「全く通っていない」', () => {
    expect(countByLevel(state, 100)).toEqual({ 0: 96, 1: 2, 2: 2 });
    expect(countByLevel(deriveRideLog([]), 50)).toEqual({ 0: 50, 1: 0, 2: 0 });
  });

  it('絞り込みは選んだ段階だけを見せる', () => {
    const f = new Set<0 | 1 | 2>([1, 2]);
    expect(isLevelShown(f, 0)).toBe(false);
    expect(isLevelShown(f, 2)).toBe(true);
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
  });
});
