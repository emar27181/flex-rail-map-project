import { describe, it, expect } from 'vitest';
import {
  parseTimeParam, formatTimeParam, parseBasisParam, parseBalanceParam, parseTimesParam, readShareState, applyShareState, type ShareState,
} from '../../../src/utils/shareStateUrlParams';

const base: ShareState = { time: null, basis: 'departure', showTravelTimes: false, hasDeparture: false, mode: null, withCodes: [], balance: 0 };

describe('URLで共有する見せ方（時刻・所要時間・モード）', () => {
  it('時刻は 0830 でも 08:30 でも読め、書くときは「:」を省いた4桁。範囲外は読まない', () => {
    expect(parseTimeParam('0830')).toBe('08:30');
    expect(parseTimeParam('08:30')).toBe('08:30');
    expect(parseTimeParam('830')).toBe('08:30');
    expect(parseTimeParam('2359')).toBe('23:59');
    expect(parseTimeParam('2460')).toBeNull();
    expect(parseTimeParam('abc')).toBeNull();
    expect(parseTimeParam(null)).toBeNull();
    expect(formatTimeParam('08:05')).toBe('0805');
    expect(formatTimeParam('x')).toBeNull();
  });

  it('基準・所要時間・決め方の読み取り', () => {
    expect(parseBasisParam('arr')).toBe('arrival');
    expect(parseBasisParam('dep')).toBeNull();
    expect(parseBalanceParam('0')).toBe(0);
    expect(parseBalanceParam('4')).toBe(4);
    expect(parseBalanceParam('5')).toBeNull();
    expect(parseBalanceParam('x')).toBeNull();
    expect(parseTimesParam('1')).toBe(true);
    expect(parseTimesParam('0')).toBe(false);
    expect(parseTimesParam('yes')).toBeNull();
    expect(readShareState('?time=0830&basis=arr&bal=3&times=0')).toEqual({ time: '08:30', basis: 'arrival', balance: 3, times: false });
    expect(readShareState('')).toEqual({ time: null, basis: null, balance: null, times: null });
  });

  it('既定の値は書かない（URLを短く保つ）', () => {
    expect(applyShareState(new URLSearchParams('from=shinjuku'), base).toString()).toBe('from=shinjuku');
    // 出発駅があるときの所要時間ON（既定）も書かない
    expect(applyShareState(new URLSearchParams(), { ...base, hasDeparture: true, showTravelTimes: true }).toString()).toBe('');
  });

  it('既定と違うときだけ書く: 時刻・到着基準・所要時間（OFF/ON）・モード・決め方', () => {
    expect(applyShareState(new URLSearchParams(), { ...base, time: '08:30', basis: 'arrival' }).toString()).toBe('time=0830&basis=arr');
    expect(applyShareState(new URLSearchParams(), { ...base, hasDeparture: true, showTravelTimes: false }).toString()).toBe('times=0');
    expect(applyShareState(new URLSearchParams(), { ...base, hasDeparture: false, showTravelTimes: true }).toString()).toBe('times=1');
    const meeting = applyShareState(new URLSearchParams(), { ...base, mode: 'meeting', withCodes: ['tokyo', 'yokohama'], balance: 2 });
    expect(meeting.get('mode')).toBe('meeting');
    expect(meeting.get('with')).toBe('tokyo,yokohama');
    expect(meeting.get('bal')).toBe('2');
    // 集合駅でなければ with・bal は消える
    const cleared = applyShareState(new URLSearchParams('mode=meeting&with=tokyo&bal=2'), base);
    expect(cleared.toString()).toBe('');
  });

  it('出発駅・到着駅・経由駅（from/to/via）には触らない', () => {
    const p = applyShareState(new URLSearchParams('from=a&to=b&via=c'), { ...base, time: '07:00' });
    expect(p.get('from')).toBe('a');
    expect(p.get('to')).toBe('b');
    expect(p.get('via')).toBe('c');
    expect(p.get('time')).toBe('0700');
  });
});
