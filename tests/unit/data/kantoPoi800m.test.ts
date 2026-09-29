import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import stationStatsRaw from '../../../src/data/station-stats-data.json';

/**
 * 首都圏駅周辺の施設数（半径800m）の取り込み（scripts/merge-kanto-poi-800m.mts）の結果を固定する。
 * 取り込みをやり直したり、別の版で上書きしたりしたときに、保留にした駅に値が入っていないか、
 * 取り込んだ駅の項目が欠けていないかを確かめる。
 */
const DIR = 'data/kanto-poi-800m-2026-09';
const validation = JSON.parse(readFileSync(`${DIR}/validation.json`, 'utf-8')) as {
  counts: { input: number; applied: number; alreadyApplied: number; held: number };
  held: { station: string; reason: string }[];
  applied: string[];
};
const fill = JSON.parse(readFileSync(`${DIR}/station-stats-data.kanto800.fill.json`, 'utf-8')) as Record<string, Record<string, number>>;
const stats = stationStatsRaw as Record<string, Record<string, unknown>>;

describe('首都圏駅周辺の施設数（800m）の取り込み', () => {
  it('入力のすべての駅が「取り込み」か「保留（理由つき）」のどちらかになっている', () => {
    const { input, applied, alreadyApplied, held } = validation.counts;
    expect(applied + alreadyApplied + held).toBe(input);
    expect(validation.applied.length + validation.held.length).toBe(Object.keys(fill).length);
    for (const h of validation.held) expect(h.reason.trim(), h.station).not.toBe('');
  });

  it('取り込んだ駅には、受け取った値がそのまま入っている', () => {
    for (const name of validation.applied) {
      for (const [k, v] of Object.entries(fill[name])) expect(stats[name]?.[k], `${name} ${k}`).toBe(v);
    }
  });

  it('保留にした駅には、受け取った値を入れていない（同名の別の駅に値が出ないように）', () => {
    for (const { station } of validation.held) {
      const values = fill[station];
      const same = Object.entries(values).every(([k, v]) => stats[station]?.[k] === v);
      expect(same, station).toBe(false);
    }
  });
});
