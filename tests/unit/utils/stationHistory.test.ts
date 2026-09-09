/**
 * 駅選択履歴と候補構成のテスト
 *
 * 未入力時の候補は「よく使う駅（履歴）→ 近くの駅 → 大きい駅」の順で
 * 先頭5件を埋める仕様。到着駅では近くの駅を出さない（nearbyCount=0）。
 * ここが崩れると、位置情報の有無やデータの欠けによって候補が
 * 5件に満たなくなったり、同じ駅が重複して並んだりする。
 *
 * localStorage を使うため jsdom 環境で実行する
 * （デフォルトの node 環境には localStorage が無い）。
 */
// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import {
  STATION_HISTORY_STORAGE_KEY,
  loadStationHistory,
  recordStationSelection,
  getFrequentStationNames,
  buildSuggestions,
} from '../../../src/utils/stationHistory';

type TestStation = { name: string };

const s = (name: string): TestStation => ({ name });

describe('stationHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('recordStationSelection / loadStationHistory', () => {
    it('初回選択で回数1のエントリが作られる', () => {
      recordStationSelection('新宿');
      const history = loadStationHistory();
      expect(history).toHaveLength(1);
      expect(history[0]!.name).toBe('新宿');
      expect(history[0]!.count).toBe(1);
    });

    it('同じ駅を選ぶたびに回数が増える', () => {
      recordStationSelection('新宿');
      recordStationSelection('新宿');
      recordStationSelection('新宿');
      const entry = loadStationHistory().find(e => e.name === '新宿');
      expect(entry?.count).toBe(3);
    });

    it('回数の多い順に並ぶ', () => {
      recordStationSelection('渋谷');
      recordStationSelection('新宿');
      recordStationSelection('新宿');
      expect(loadStationHistory().map(e => e.name)).toEqual(['新宿', '渋谷']);
    });

    it('壊れた値が入っていても履歴なしとして扱い、例外を投げない', () => {
      localStorage.setItem(STATION_HISTORY_STORAGE_KEY, '{壊れたJSON');
      expect(() => loadStationHistory()).not.toThrow();
      expect(loadStationHistory()).toEqual([]);
    });

    it('配列でない値や形の違う要素は取り除かれる', () => {
      localStorage.setItem(
        STATION_HISTORY_STORAGE_KEY,
        JSON.stringify([{ name: '新宿', count: 2, lastUsedAt: 1 }, { name: '欠け' }, 42]),
      );
      expect(loadStationHistory().map(e => e.name)).toEqual(['新宿']);
    });
  });

  describe('getFrequentStationNames', () => {
    it('回数の多い順に指定件数だけ返す', () => {
      const history = [
        { name: 'A', count: 1, lastUsedAt: 1 },
        { name: 'B', count: 5, lastUsedAt: 1 },
        { name: 'C', count: 3, lastUsedAt: 1 },
      ];
      expect(getFrequentStationNames(history, 2)).toEqual(['B', 'C']);
    });
  });

  describe('buildSuggestions', () => {
    const opts = { nearbyCount: 3, frequentCount: 2, total: 5 };
    const fallback = [s('東京'), s('新宿'), s('渋谷'), s('池袋'), s('品川')];

    it('よく使う駅が先に並び、そのあとに近くの駅が続く', () => {
      // 毎日使う駅は現在地から遠くても真っ先に出したいので履歴を最優先にする
      const nearby = [s('藤沢'), s('石上'), s('柳小路'), s('本鵠沼')];
      const history = [
        { name: '大宮', count: 9, lastUsedAt: 1 },
        { name: '千葉', count: 4, lastUsedAt: 1 },
      ];
      const all = [...nearby, s('大宮'), s('千葉')];
      const result = buildSuggestions(nearby, history, fallback, n => all.find(x => x.name === n), opts);
      expect(result.map(x => x.name)).toEqual(['大宮', '千葉', '藤沢', '石上', '柳小路']);
    });

    it('到着駅向けに nearbyCount=0 を渡すと近くの駅が出ない', () => {
      const nearby = [s('藤沢'), s('石上'), s('柳小路')];
      const history = [{ name: '大宮', count: 9, lastUsedAt: 1 }];
      const all = [...nearby, s('大宮')];
      const result = buildSuggestions(nearby, history, fallback, n => all.find(x => x.name === n), {
        ...opts, nearbyCount: 0,
      });
      // 履歴が先頭。残りは fallback（大きい駅）で埋まり、近隣は補充枠でしか出ない
      expect(result[0].name).toBe('大宮');
      expect(result.slice(0, 2).map(x => x.name)).not.toContain('石上');
    });

    it('近隣と履歴が重複しても同じ駅が二重に出ない', () => {
      const nearby = [s('藤沢'), s('石上'), s('柳小路')];
      const history = [
        { name: '藤沢', count: 9, lastUsedAt: 1 },
        { name: '大宮', count: 4, lastUsedAt: 1 },
      ];
      const all = [...nearby, s('大宮')];
      const result = buildSuggestions(nearby, history, fallback, n => all.find(x => x.name === n), opts);
      const names = result.map(x => x.name);
      expect(new Set(names).size).toBe(names.length);
      expect(names).toContain('大宮');
    });

    it('履歴が無いときは近隣駅と主要駅で5件まで埋まる', () => {
      const nearby = [s('藤沢'), s('石上')];
      const result = buildSuggestions(nearby, [], fallback, n => fallback.find(x => x.name === n), opts);
      expect(result).toHaveLength(5);
      expect(result.slice(0, 2).map(x => x.name)).toEqual(['藤沢', '石上']);
    });

    it('位置情報が無い（近隣が空）ときも履歴と主要駅で5件まで埋まる', () => {
      const history = [{ name: '大宮', count: 3, lastUsedAt: 1 }];
      const all = [...fallback, s('大宮')];
      const result = buildSuggestions([], history, fallback, n => all.find(x => x.name === n), opts);
      expect(result).toHaveLength(5);
      expect(result[0]!.name).toBe('大宮');
    });

    it('履歴にある駅が駅データ側に存在しない場合は無視される', () => {
      const history = [{ name: '存在しない駅', count: 99, lastUsedAt: 1 }];
      const result = buildSuggestions([], history, fallback, n => fallback.find(x => x.name === n), opts);
      expect(result.map(x => x.name)).not.toContain('存在しない駅');
      expect(result).toHaveLength(5);
    });

    it('候補が全く用意できない場合は空配列を返す', () => {
      expect(buildSuggestions([], [], [], () => undefined, opts)).toEqual([]);
    });
  });
});
