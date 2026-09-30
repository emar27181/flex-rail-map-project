import { describe, it, expect } from 'vitest';
import { averageTime, stationTimeLinesHtml, timeLineWidth, toTimeLines } from '../../../../src/components/map/stationTimeLabel';

describe('駅ラベルの時刻行', () => {
  it('文字列1つは1行、配列は路線ごとの行として扱う', () => {
    expect(toTimeLines('23:09')).toEqual([{ time: '23:09' }]);
    expect(toTimeLines(undefined)).toEqual([]);
    expect(toTimeLines([{ time: '23:24', color: '#f68b1e' }, { time: '23:29', color: '#0067c0' }])).toHaveLength(2);
  });

  it('路線が複数のときは1路線1行で、路線色の印を付ける', () => {
    const html = stationTimeLinesHtml([{ time: '23:24', color: '#f68b1e' }, { time: '23:29', color: '#0067c0' }], 9);
    expect(html.match(/<div /g)).toHaveLength(2);
    expect(html).toContain('#f68b1e');
    expect(html).toContain('23:29');
  });

  it('印の分だけ行の幅を広く見積もる', () => {
    const est = (t: string) => t.length * 5;
    expect(timeLineWidth({ time: '23:24', color: '#000' }, est)).toBeGreaterThan(timeLineWidth({ time: '23:24' }, est));
  });
});

describe('時刻の平均（路線ごとの時刻を1つにまとめる）', () => {
  it('分単位で平均して四捨五入する', () => {
    expect(averageTime(['23:24', '23:29', '23:32', '23:24'])).toBe('23:27');
  });

  it('0時をまたいでも平均が正しい', () => {
    expect(averageTime(['23:58', '00:02'])).toBe('00:00');
  });

  it('1つならそのまま、無ければ undefined', () => {
    expect(averageTime(['09:05'])).toBe('09:05');
    expect(averageTime([])).toBeUndefined();
  });
});
