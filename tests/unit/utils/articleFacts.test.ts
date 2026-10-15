/**
 * 記事の文章に路線データの値を差し込む仕組み（src/utils/articleFacts.ts）。
 * 生成 AI が書いた原稿でも、データに無い駅・番号はここで止まる。
 */
import { describe, it, expect } from 'vitest';
import { findArticleStation, resolveArticleTokens } from '../../../src/utils/articleFacts';
import { getStationNumber } from '../../../src/data/stationNumbers';

describe('駅番号・駅名・路線名の差し込み', () => {
  it('駅番号は路線データの値、駅名・路線名は記事の言語の表記になる', () => {
    expect(resolveArticleTokens('{stationNumber:yamanote:渋谷}', 'en')).toBe(getStationNumber('yamanote', '渋谷'));
    expect(resolveArticleTokens('{station:yamanote:渋谷}', 'en')).toBe('Shibuya');
    expect(resolveArticleTokens('{station:yamanote:渋谷}', 'ja')).toBe('渋谷');
    expect(resolveArticleTokens('{line:yamanote}', 'en')).toBe('Yamanote Line');
    expect(resolveArticleTokens('{line:yamanote}', 'ja')).toBe('山手線');
  });

  it('同じ駅でも路線ごとの番号になる（渋谷: 山手線と銀座線）', () => {
    expect(resolveArticleTokens('{stationNumber:yamanote:渋谷} {stationNumber:ginzaLine:渋谷}', 'en'))
      .toBe(`${getStationNumber('yamanote', '渋谷')} ${getStationNumber('ginzaLine', '渋谷')}`);
  });

  it('路線に無い駅・番号の無い駅・無い路線は止める（推測の値を出さない）', () => {
    expect(() => resolveArticleTokens('{stationNumber:yamanote:梅田}', 'en')).toThrow(/駅「梅田」が無い/);
    expect(() => resolveArticleTokens('{station:noSuchLine:渋谷}', 'en')).toThrow();
    expect(() => resolveArticleTokens('{line:noSuchLine}', 'en')).toThrow(/路線データに無い/);
  });

  it('駅は路線と組で探す（同じ名前の別の駅を取り違えない）', () => {
    expect(findArticleStation({ name: '渋谷', route: 'yamanote' })).toBeDefined();
    expect(findArticleStation({ name: '梅田', route: 'yamanote' })).toBeUndefined();
  });
});
