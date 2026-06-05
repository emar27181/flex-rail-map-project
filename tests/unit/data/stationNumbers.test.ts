import { describe, it, expect } from 'vitest';
import { getStationNumber, getAnyStationNumber } from '../../../src/data/stationNumbers';

describe('getStationNumber', () => {
  it('山手線の駅番号を正しく返す', () => {
    expect(getStationNumber('yamanote', '渋谷')).toBe('JY05');
    expect(getStationNumber('yamanote', '新宿')).toBe('JY08');
    expect(getStationNumber('yamanote', '東京')).toBe('JY24');
  });

  it('新京成線のくぬぎ山を返す（今回追加）', () => {
    expect(getStationNumber('shinkeisei', 'くぬぎ山')).toBe('SL09');
  });

  it('南武線の川崎を返す（今回追加）', () => {
    expect(getStationNumber('jrNanbuLine', '川崎')).toBe('JN01');
    expect(getStationNumber('jrNanbuLine', '立川')).toBe('JN26');
  });

  it('武蔵野線の府中本町を返す（今回追加）', () => {
    expect(getStationNumber('jrMusashinoLine', '府中本町')).toBe('JM01');
    expect(getStationNumber('jrMusashinoLine', '西船橋')).toBe('JM25');
  });

  it('京葉線の東京を返す（今回追加）', () => {
    expect(getStationNumber('jrKeiyo', '東京')).toBe('JE01');
    expect(getStationNumber('jrKeiyo', '舞浜')).toBe('JE07');
  });

  it('日暮里舎人ライナーの駅番号を返す（今回追加）', () => {
    expect(getStationNumber('nipporiToneriLiner', '日暮里')).toBe('NT01');
    expect(getStationNumber('nipporiToneriLiner', '見沼代親水公園')).toBe('NT13');
  });

  it('存在しない駅はundefinedを返す', () => {
    expect(getStationNumber('yamanote', '存在しない駅')).toBeUndefined();
  });

  it('存在しない路線キーはundefinedを返す', () => {
    expect(getStationNumber('yamanote', '存在しない駅')).toBeUndefined();
  });
});

describe('getAnyStationNumber', () => {
  it('路線指定なしで渋谷の番号を返す', () => {
    const code = getAnyStationNumber('渋谷');
    expect(code).toBeDefined();
    expect(typeof code).toBe('string');
  });

  it('存在しない駅はundefinedを返す', () => {
    expect(getAnyStationNumber('架空の駅')).toBeUndefined();
  });
});
