/**
 * UIサイズ規約のテスト
 *
 * 過去に起きた問題:
 * - 入力欄のフォントサイズが12pxで、iOS Safari がフォーカス時に
 *   ページを自動拡大していた（駅名や時刻を入力するたびに発生）
 * - ソートボタン(20px)・全表示/全非表示(22px)・フッターリンク(14px)が
 *   WCAG 2.2 AA の達成基準 2.5.8「ターゲットサイズ(最小)」24px を下回っていた
 */

import { describe, it, expect } from 'vitest';
import { FS, TARGET } from '../../../src/constants/ui';

const px = (v: string) => parseFloat(v);

describe('FS（フォントサイズ規約）', () => {
  it('入力欄はiOS Safariの自動ズーム閾値である16pxを下回らない', () => {
    expect(px(FS.input)).toBeGreaterThanOrEqual(16);
  });

  it('サイズ階層が sectionTitle > base > label > helper > tiny > micro の順になっている', () => {
    const order = [FS.sectionTitle, FS.base, FS.label, FS.helper, FS.tiny, FS.micro].map(px);
    for (let i = 1; i < order.length; i++) {
      expect(order[i]).toBeLessThan(order[i - 1]);
    }
  });

  it('すべてのサイズがpx単位で定義されている', () => {
    for (const [key, value] of Object.entries(FS)) {
      expect(value, `FS.${key}`).toMatch(/^\d+(\.\d+)?px$/);
    }
  });
});

describe('TARGET（ターゲットサイズ規約）', () => {
  it('最小値がWCAG 2.2 AA (2.5.8) の24pxを満たす', () => {
    expect(TARGET.min).toBeGreaterThanOrEqual(24);
  });

  it('タッチ推奨値がApple HIGの44ptを満たす', () => {
    expect(TARGET.touch).toBeGreaterThanOrEqual(44);
  });

  it('タッチ推奨値は最小値以上である', () => {
    expect(TARGET.touch).toBeGreaterThanOrEqual(TARGET.min);
  });
});
