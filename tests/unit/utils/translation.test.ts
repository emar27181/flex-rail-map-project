import { describe, it, expect } from 'vitest';
import { uiTranslations, uiChinese, uiKorean } from '../../../src/utils/translation';

describe('翻訳キー完全性', () => {
  const jaEnKeys = Object.keys(uiTranslations);
  const zhKeys = Object.keys(uiChinese);
  const koKeys = Object.keys(uiKorean);

  it('中国語(uiChinese)に不足しているキーがない', () => {
    const missing = jaEnKeys.filter(k => !zhKeys.includes(k));
    if (missing.length > 0) {
      console.warn('uiChinese に未登録のキー:', missing);
    }
    expect(missing).toHaveLength(0);
  });

  it('韓国語(uiKorean)に不足しているキーがない', () => {
    const missing = jaEnKeys.filter(k => !koKeys.includes(k));
    if (missing.length > 0) {
      console.warn('uiKorean に未登録のキー:', missing);
    }
    expect(missing).toHaveLength(0);
  });

  it('中国語(uiChinese)に孤立キー（uiTranslationsにない）がない', () => {
    const orphan = zhKeys.filter(k => !jaEnKeys.includes(k));
    if (orphan.length > 0) {
      console.warn('uiChinese の孤立キー:', orphan);
    }
    expect(orphan).toHaveLength(0);
  });

  it('韓国語(uiKorean)に孤立キー（uiTranslationsにない）がない', () => {
    const orphan = koKeys.filter(k => !jaEnKeys.includes(k));
    if (orphan.length > 0) {
      console.warn('uiKorean の孤立キー:', orphan);
    }
    expect(orphan).toHaveLength(0);
  });
});
