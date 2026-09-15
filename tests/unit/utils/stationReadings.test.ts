/**
 * ひらがな検索がひらがな読みデータの無い駅（全体の9割以上）にも
 * ヒットすることを保証するテスト。
 *
 * `stationReadings` は約6,000駅中586駅分しか読みを持たない。漢字から
 * ひらがなを自動生成すると読み間違い（我孫子=あびこ等）を作りかねないため、
 * 代わりに全駅分ある英語表記（ローマ字）をひらがな入力から変換した
 * ローマ字と緩く比較する方式にした。長音表記の違い（「東京」の英語表記
 * "Tokyo" には長音記号が無い）を吸収できているかがポイント。
 */
import { describe, it, expect } from 'vitest';
import { hiraganaToRomaji, normalizeRomajiForMatch } from '../../../src/utils/stationReadings';

describe('hiraganaToRomaji', () => {
  it('基本的なひらがなをローマ字に変換する', () => {
    expect(hiraganaToRomaji('しぶや')).toBe('shibuya');
    expect(hiraganaToRomaji('よこはま')).toBe('yokohama');
  });

  it('拗音（きゃ等）を1音として変換する', () => {
    expect(hiraganaToRomaji('きょうと')).toBe('kyouto');
    expect(hiraganaToRomaji('しんじゅく')).toBe('shinjuku');
  });

  it('促音「っ」は次の子音を重ねる', () => {
    expect(hiraganaToRomaji('にっぽり')).toBe('nippori');
    expect(hiraganaToRomaji('さっぽろ')).toBe('sapporo');
  });

  it('変換表に無い文字（英数字等）はそのまま通す', () => {
    expect(hiraganaToRomaji('abc123')).toBe('abc123');
  });
});

describe('normalizeRomajiForMatch', () => {
  it('長音「おう」「うう」を1文字に詰める（英語表記の長音省略に合わせる）', () => {
    expect(normalizeRomajiForMatch('toukyou')).toBe('tokyo');
    expect(normalizeRomajiForMatch('kyouto')).toBe('kyoto');
  });

  it('promptで生成した長音以外の重複文字（促音由来）も1文字に丸める', () => {
    expect(normalizeRomajiForMatch('nippori')).toBe('nipori');
  });

  it('大文字・ハイフンを無視する', () => {
    expect(normalizeRomajiForMatch('Nishi-Shinjuku')).toBe('nishishinjuku');
  });
});

describe('ひらがな入力→ローマ字化した結果が英語表記に含まれる（検索照合の要）', () => {
  const matches = (hiraganaInput: string, englishName: string): boolean => {
    const term = normalizeRomajiForMatch(hiraganaToRomaji(hiraganaInput));
    const target = normalizeRomajiForMatch(englishName);
    return term.length > 0 && target.includes(term);
  };

  // stationReadings に読みデータが無い駅でも、英語表記経由でひらがな検索が
  // ヒットすることを確認する（実際にはreadingデータの有無を問わない一般ケース）
  it.each([
    ['とうきょう', 'Tokyo'],
    ['きょうと', 'Kyoto'],
    ['おおさか', 'Osaka'],
    ['よこすか', 'Yokosuka'],
    ['にっぽり', 'Nippori'],
    ['さっぽろ', 'Sapporo'],
    ['にししんじゅく', 'Nishi-shinjuku'],
  ])('「%s」で「%s」がヒットする', (hiraganaInput, englishName) => {
    expect(matches(hiraganaInput, englishName)).toBe(true);
  });

  it('部分入力（前方一致になる短い入力）でもヒットする', () => {
    expect(matches('とう', 'Tokyo')).toBe(true);
    expect(matches('しん', 'Shinjuku')).toBe(true);
  });

  it('明らかに別の駅名にはヒットしない', () => {
    expect(matches('よこはま', 'Tokyo')).toBe(false);
  });
});
