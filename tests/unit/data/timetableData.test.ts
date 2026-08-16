/**
 * 時刻表データと路線データの整合性テスト。
 *
 * 時刻表に路線データへ存在しない駅名が入っていると、その駅の
 * ツールチップは「時刻データなし」のまま静かに壊れる（画面上は
 * 何も起きないので気づけない）。実際に南武線の「国立」、
 * ゆりかもめの「中央広場前」など、路線に無い駅が混入していた。
 */
import { describe, it, expect } from 'vitest';
import { routes } from '../../../src/data/routes';
import { timetableLines, TIMETABLE_SOURCE, getNextDepartures } from '../../../src/data/timetableData';

describe('時刻表データ', () => {
  it('時刻表の駅名はすべて路線データに存在する', () => {
    const problems: string[] = [];
    for (const line of timetableLines) {
      const route = (routes as Record<string, Array<{ name: string }>>)[line.key];
      if (!route) {
        problems.push(`${line.key}: 対応する路線データが無い`);
        continue;
      }
      const names = new Set(route.map(s => s.name));
      for (const dir of line.directions) {
        for (const s of dir.stations) {
          if (!names.has(s.name)) problems.push(`${line.key} [${dir.label}] ${s.name}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('各路線は2方向ぶんのデータを持つ', () => {
    // getDirectionIndex が [下り, 上り] の2要素前提で方向を判定するため
    const bad = timetableLines.filter(l => l.directions.length !== 2).map(l => l.key);
    expect(bad).toEqual([]);
  });

  it('駅の累計所要時間は進行方向に沿って増加する', () => {
    const bad: string[] = [];
    for (const line of timetableLines) {
      for (const dir of line.directions) {
        for (let i = 1; i < dir.stations.length; i++) {
          if (dir.stations[i].offset < dir.stations[i - 1].offset) {
            bad.push(`${line.key} [${dir.label}] ${dir.stations[i - 1].name}→${dir.stations[i].name}`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('路線キーが重複していない', () => {
    const keys = timetableLines.map(l => l.key);
    expect(keys.length).toBe(new Set(keys).size);
  });

  it('最終更新日は YYYY-MM-DD 形式で入っている', () => {
    const bad = timetableLines
      .filter(l => !/^\d{4}-\d{2}-\d{2}$/.test(l.updatedAt))
      .map(l => `${l.key}: ${l.updatedAt}`);
    expect(bad).toEqual([]);
  });

  it('出典の但し書きが定義されている', () => {
    expect(TIMETABLE_SOURCE.title).not.toBe('');
    expect(TIMETABLE_SOURCE.note).toContain('公式時刻表');
  });

  describe('今回追加した首都圏の路線', () => {
    const added = [
      'jrShonanShinjukuLine', 'minatomirai', 'tobuNodaLine', 'jrSagamiLine',
      'jrTsurumiLine', 'seibuTamagawaLine', 'keikyuZushiLine', 'tokyuKodomoLine',
      'seibuChichibuLine', 'tobuOgoseLine', 'ryutetsuLine',
    ];

    it.each(added)('%s は時刻表を持つ', key => {
      expect(timetableLines.some(l => l.key === key)).toBe(true);
    });

    it('湘南新宿ラインの武蔵小杉から発車時刻を取得できる', () => {
      // 武蔵小杉のツールチップで「乗車路線ですが時刻データなし」になっていた駅
      const deps = getNextDepartures('jrShonanShinjukuLine', '武蔵小杉', 0, '10:00', 3);
      expect(deps.length).toBe(3);
      expect(deps[0].time >= '10:00').toBe(true);
      // 発車時刻は昇順に並ぶ
      expect(deps[0].time <= deps[1].time).toBe(true);
    });

    it('みなとみらい線の両方向から発車時刻を取得できる', () => {
      expect(getNextDepartures('minatomirai', 'みなとみらい', 0, '10:00', 2).length).toBe(2);
      expect(getNextDepartures('minatomirai', 'みなとみらい', 1, '10:00', 2).length).toBe(2);
    });
  });
});
