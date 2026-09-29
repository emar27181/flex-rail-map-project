import { describe, it, expect } from 'vitest';
import { routes } from '../../../src/data/routes';
import { buildEffectiveLineCounts, countDistinctLines } from '../../../src/utils/effectiveLines';

const counts = buildEffectiveLineCounts(Object.entries(routes));

describe('実質の路線数（乗換駅の判定）', () => {
  it('隣の駅が同じ路線どうしは1本と数える', () => {
    expect(countDistinctLines([new Set(['A', 'C']), new Set(['A', 'C'])])).toBe(1);
  });

  it('片方がその駅で終わる（隣の駅が含まれる）路線は同じ線路とみなす', () => {
    expect(countDistinctLines([new Set(['A', 'C']), new Set(['A'])])).toBe(1);
  });

  it('別の方向へ分かれる路線があれば2本', () => {
    expect(countDistinctLines([new Set(['A', 'C']), new Set(['A', 'D'])])).toBe(2);
  });

  it('辻堂は東海道線と湘南新宿ラインが同じ線路を走るだけなので乗換駅ではない', () => {
    expect(counts.get('辻堂')).toBe(1);
  });

  it('藤沢は東海道線・湘南新宿ラインを1本にまとめ、小田急江ノ島線・江ノ電と合わせて3本', () => {
    expect(counts.get('藤沢')).toBe(3);
  });

  it('戸塚は東海道線と横須賀線（湘南新宿ライン）で隣の駅が違うので乗換駅', () => {
    expect(counts.get('戸塚')!).toBeGreaterThanOrEqual(2);
  });

  it('新宿のような大きな乗換駅は多いまま', () => {
    expect(counts.get('新宿')!).toBeGreaterThanOrEqual(5);
  });
});
