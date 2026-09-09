/**
 * 最寄り駅メモのテスト。
 *
 * 人の名前を扱うので保存先は端末の localStorage だけ。
 * 壊れた保存値で画面が出なくなるのがいちばん困るため、
 * 読み込みが必ず配列を返すことを重点的に確かめる。
 *
 * localStorage を使うため jsdom 環境で実行する
 * （デフォルトの node 環境には localStorage が無い）。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  STATION_MEMO_KEY,
  loadMemos,
  saveMemos,
  addMemo,
  removeMemo,
  updateMemo,
  filterMemos,
  matchesQuery,
  routeKeysForStation,
  isKnownStation,
  summarizeSharedRoutes,
} from '../../../src/utils/stationMemo';
import type { StationMemo } from '../../../src/utils/stationMemo';

const memo = (over: Partial<StationMemo> = {}): StationMemo => ({
  id: 'id-1',
  name: '田中',
  stationName: '新宿',
  createdAt: 1,
  ...over,
});

describe('駅名から路線を引く', () => {
  it('新宿は複数の路線が通る', () => {
    const keys = routeKeysForStation('新宿');
    expect(keys.length).toBeGreaterThan(1);
    expect(new Set(keys).size).toBe(keys.length); // 重複しない
  });

  it('データに無い駅名は空', () => {
    expect(routeKeysForStation('存在しない駅')).toEqual([]);
    expect(isKnownStation('存在しない駅')).toBe(false);
    expect(isKnownStation('新宿')).toBe(true);
  });
});

describe('追加・更新・削除', () => {
  it('追加すると id と登録時刻が付く', () => {
    const list = addMemo([], { name: '田中', stationName: '新宿' });
    expect(list).toHaveLength(1);
    expect(list[0].id).toBeTruthy();
    expect(list[0].createdAt).toBeGreaterThan(0);
  });

  it('前後の空白は落とす', () => {
    const list = addMemo([], { name: '  田中  ', stationName: ' 新宿 ', note: '  同期 ' });
    expect(list[0]).toMatchObject({ name: '田中', stationName: '新宿', note: '同期' });
  });

  it('名前か駅名が空なら追加しない', () => {
    expect(addMemo([], { name: '', stationName: '新宿' })).toHaveLength(0);
    expect(addMemo([], { name: '田中', stationName: '   ' })).toHaveLength(0);
  });

  it('元の配列を書き換えない', () => {
    const before: StationMemo[] = [memo()];
    const after = addMemo(before, { name: '佐藤', stationName: '渋谷' });
    expect(before).toHaveLength(1);
    expect(after).toHaveLength(2);
  });

  it('削除は id で消す', () => {
    const list = [memo({ id: 'a' }), memo({ id: 'b' })];
    expect(removeMemo(list, 'a').map(m => m.id)).toEqual(['b']);
  });

  it('更新は指定した項目だけ変える', () => {
    const list = [memo({ id: 'a', note: '同期' })];
    const next = updateMemo(list, 'a', { stationName: '渋谷' });
    expect(next[0]).toMatchObject({ name: '田中', stationName: '渋谷', note: '同期' });
  });

  it('メモを空文字にすると項目ごと消える', () => {
    const list = [memo({ id: 'a', note: '同期' })];
    expect(updateMemo(list, 'a', { note: '  ' })[0].note).toBeUndefined();
  });
});

describe('保存と読み込み', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('保存が無ければ空配列', () => {
    expect(loadMemos()).toEqual([]);
  });

  it('保存したものを読み戻せる', () => {
    const list = addMemo([], { name: '田中', stationName: '新宿' });
    saveMemos(list);
    expect(loadMemos()).toEqual(list);
  });

  it('壊れたJSONでも空配列を返す', () => {
    window.localStorage.setItem(STATION_MEMO_KEY, '{壊れている');
    expect(loadMemos()).toEqual([]);
  });

  it('配列でない保存値でも空配列を返す', () => {
    window.localStorage.setItem(STATION_MEMO_KEY, '{"a":1}');
    expect(loadMemos()).toEqual([]);
  });

  it('形の合わない要素だけを落として残りは読む', () => {
    window.localStorage.setItem(
      STATION_MEMO_KEY,
      JSON.stringify([memo({ id: 'ok' }), { name: '駅が無い' }, null]),
    );
    expect(loadMemos().map(m => m.id)).toEqual(['ok']);
  });
});

describe('検索', () => {
  const list = [
    memo({ id: 'a', name: '田中', stationName: '新宿', note: '同期' }),
    memo({ id: 'b', name: 'Sato', stationName: '渋谷' }),
  ];

  it('空の検索語は全件', () => {
    expect(filterMemos(list, '   ')).toHaveLength(2);
  });

  it('名前・駅名・メモのどれでも当たる', () => {
    expect(filterMemos(list, '田中').map(m => m.id)).toEqual(['a']);
    expect(filterMemos(list, '渋谷').map(m => m.id)).toEqual(['b']);
    expect(filterMemos(list, '同期').map(m => m.id)).toEqual(['a']);
  });

  it('英字は大文字小文字を区別しない', () => {
    expect(filterMemos(list, 'sato').map(m => m.id)).toEqual(['b']);
  });

  it('路線名でも引ける（ラベルは呼び出し側から渡す）', () => {
    const hit = filterMemos(list, '山手線', m => (m.id === 'a' ? ['山手線'] : []));
    expect(hit.map(m => m.id)).toEqual(['a']);
  });

  it('matchesQuery は路線ラベル未指定でも動く', () => {
    expect(matchesQuery(memo(), '新宿')).toBe(true);
    expect(matchesQuery(memo(), '横浜')).toBe(false);
  });
});

describe('共通の路線', () => {
  it('人がいなければ空', () => {
    const s = summarizeSharedRoutes([]);
    expect(s.total).toBe(0);
    expect(s.routes).toEqual([]);
    expect(s.everyone).toEqual([]);
  });

  it('全員が同じ駅なら、その駅の路線が全員ぶんになる', () => {
    const list = [
      memo({ id: 'a', stationName: '新宿' }),
      memo({ id: 'b', stationName: '新宿' }),
    ];
    const s = summarizeSharedRoutes(list);
    expect(s.total).toBe(2);
    expect(s.everyone.length).toBe(routeKeysForStation('新宿').length);
    expect(s.routes.every(r => r.count === 2)).toBe(true);
  });

  it('人数の多い順に並ぶ', () => {
    const list = [
      memo({ id: 'a', stationName: '新宿' }),
      memo({ id: 'b', stationName: '渋谷' }),
    ];
    const counts = summarizeSharedRoutes(list).routes.map(r => r.count);
    expect(counts).toEqual([...counts].sort((x, y) => y - x));
  });

  it('全員に当たる路線だけが everyone に入る', () => {
    const list = [
      memo({ id: 'a', stationName: '新宿' }),
      memo({ id: 'b', stationName: '渋谷' }),
    ];
    const s = summarizeSharedRoutes(list);
    const everyoneSet = new Set(s.everyone);
    s.routes.forEach(r => {
      expect(everyoneSet.has(r.routeKey)).toBe(r.count === 2);
    });
  });

  it('山手線は新宿と渋谷の両方を通るので全員ぶんに入る', () => {
    const list = [
      memo({ id: 'a', stationName: '新宿' }),
      memo({ id: 'b', stationName: '渋谷' }),
    ];
    expect(summarizeSharedRoutes(list).everyone).toContain('yamanote');
  });

  it('データに無い駅の人がいると全員ぶんの路線は無くなる', () => {
    const list = [
      memo({ id: 'a', stationName: '新宿' }),
      memo({ id: 'b', stationName: '存在しない駅' }),
    ];
    expect(summarizeSharedRoutes(list).everyone).toEqual([]);
  });

  it('同じ人を二重に数えない', () => {
    const s = summarizeSharedRoutes([memo({ id: 'a', stationName: '新宿' })]);
    s.routes.forEach(r => {
      expect(r.memoIds).toEqual(['a']);
      expect(r.count).toBe(1);
    });
  });
});
