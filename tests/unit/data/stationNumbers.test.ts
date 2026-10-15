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

  it('公式資料に基づく江ノ電のEN01〜EN15を返す', () => {
    expect(getStationNumber('enoshimaElectricRailway', '藤沢')).toBe('EN01');
    expect(getStationNumber('enoshimaElectricRailway', '江ノ島')).toBe('EN06');
    expect(getStationNumber('enoshimaElectricRailway', '鎌倉')).toBe('EN15');
  });

  it('東急世田谷線のSG01〜SG10を返す', () => {
    expect(getStationNumber('tokyuSetagayaLine', '三軒茶屋')).toBe('SG01');
    expect(getStationNumber('tokyuSetagayaLine', '世田谷')).toBe('SG05');
    expect(getStationNumber('tokyuSetagayaLine', '下高井戸')).toBe('SG10');
  });

  it('京成押上線は公式確認済みの5駅のみ番号を返す', () => {
    expect(getStationNumber('keiseiOshiageLine', '押上')).toBe('KS45');
    expect(getStationNumber('keiseiOshiageLine', '京成曳舟')).toBe('KS46');
    expect(getStationNumber('keiseiOshiageLine', '八広')).toBe('KS47');
    expect(getStationNumber('keiseiOshiageLine', '四ツ木')).toBe('KS48');
    expect(getStationNumber('keiseiOshiageLine', '青砥')).toBe('KS09');
    // Existing route data calls this station 立石, but the official name is 京成立石.
    expect(getStationNumber('keiseiOshiageLine', '立石')).toBeUndefined();
  });

  it('都電荒川線の公式全30停留場の番号を返す', () => {
    expect(getStationNumber('todenArakawaLine', '三ノ輪橋')).toBe('SA01');
    expect(getStationNumber('todenArakawaLine', '熊野前')).toBe('SA09');
    expect(getStationNumber('todenArakawaLine', '王子駅前')).toBe('SA16');
    expect(getStationNumber('todenArakawaLine', '鬼子母神前')).toBe('SA27');
    expect(getStationNumber('todenArakawaLine', '早稲田')).toBe('SA30');
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
