import { describe, it, expect } from 'vitest';
import { routes } from '../../../src/data/routes';
import { THROUGH_SERVICES } from '../../../src/data/throughServices';
import { getThroughReachableSections, resolveSectionRange } from '../../../src/utils/throughService';

const names = (segs: { name: string }[][] | undefined) => segs?.map(s => s.map(x => x.name));

describe('直通運転データ', () => {
  it('全区間の路線・端の駅が路線データに存在する（駅名の表記ゆれ・誤記を検出）', () => {
    const broken: string[] = [];
    for (const svc of THROUGH_SERVICES) {
      for (const sec of svc.sections) {
        if (!routes[sec.route]) broken.push(`${svc.id}: 路線 ${sec.route} が無い`);
        else if (!resolveSectionRange(sec)) broken.push(`${svc.id}: ${sec.route} ${sec.from ?? '(端)'}〜${sec.to ?? '(端)'}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('id が重複しない', () => {
    const ids = THROUGH_SERVICES.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('各系統は2路線以上をまたぐ', () => {
    for (const svc of THROUGH_SERVICES) {
      expect(new Set(svc.sections.map(s => s.route)).size, svc.id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('getThroughReachableSections', () => {
  it('藤沢（江ノ島線）からは小田原線の相模大野〜新宿に1本で行ける', () => {
    const r = getThroughReachableSections('藤沢');
    const oda = names(r.get('odakyuLine'));
    expect(oda).toHaveLength(1);
    expect(oda![0][0]).toBe('新宿');
    expect(oda![0][oda![0].length - 1]).toBe('相模大野');
    // 小田原方面へは直通しない
    expect(oda![0]).not.toContain('本厚木');
  });

  it('藤沢から千代田線へは直通しない（江ノ島線→小田原線→千代田線を連鎖させない）', () => {
    expect(getThroughReachableSections('藤沢').has('chiyodaLine')).toBe(false);
  });

  it('本厚木（相模大野より小田原側）からは江ノ島線に直通しない', () => {
    const r = getThroughReachableSections('本厚木');
    expect(r.has('odakyuEnoshimaLine')).toBe(false);
    expect(r.has('chiyodaLine')).toBe(true);
  });

  it('新宿（小田原線）からは江ノ島線・多摩線に直通する', () => {
    const r = getThroughReachableSections('新宿');
    expect(r.has('odakyuEnoshimaLine')).toBe(true);
    expect(r.has('odakyuTamaLine')).toBe(true);
  });

  it('駅自身が通る路線は結果に含めない（全区間を出すため）', () => {
    const r = getThroughReachableSections('相模大野');
    expect(r.has('odakyuLine')).toBe(false);
    expect(r.has('odakyuEnoshimaLine')).toBe(false);
  });

  it('同じ路線に複数系統から届く区間は重ねずにまとめる', () => {
    // 元町・中華街からは東上線（副都心線経由）と西武池袋線に行ける
    const r = getThroughReachableSections('元町・中華街');
    expect(names(r.get('tobuTojoLine'))).toHaveLength(1);
    expect(r.has('seibuIkebukuroLine')).toBe(true);
    // 路線データ上の副都心線は和光市〜渋谷の1区間にまとまる
    expect(names(r.get('fukutoshinLine'))).toHaveLength(1);
  });

  it('区間外の駅からはその系統に乗れない（逗子からは湘南新宿ライン高崎線系統の東海道線区間に出ない）', () => {
    const r = getThroughReachableSections('逗子');
    expect(r.has('jrUtsunomiyaLine')).toBe(true);
    expect(r.has('jrTakasakiLine')).toBe(false);
  });
});
