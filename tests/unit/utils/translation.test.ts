import { describe, it, expect } from 'vitest';
import { uiTranslations, uiChinese, uiKorean, stationTranslations, routeTranslations } from '../../../src/utils/translation';
import { routes } from '../../../src/data/routes';

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

describe('stationTranslations / routeTranslations の取り違え検出', () => {
  /**
   * 過去に起きた問題:
   * stationTranslations と routeTranslations はどちらも
   * `{ [key: string]: string }` という同一の型を持つため、駅名の翻訳を
   * routeTranslations に誤って挿入しても TypeScript の型チェックでは
   * 検出できなかった（値は文字列同士で型が一致するため）。
   * "JR神戸線": "JR Kobe Line" という路線名エントリを目印にして挿入した際、
   * それが実は routeTranslations 内にあったため、683件の駅名翻訳が
   * 丸ごと誤ったオブジェクトに入り、翻訳が一切効かなくなっていた。
   *
   * この2つのオブジェクトは実データ（routes / routeNames）と比較すれば
   * 機械的に取り違えを検出できるため、ここで検証する。
   */
  const stationNames = new Set<string>();
  for (const stations of Object.values(routes)) {
    for (const s of stations) stationNames.add(s.name);
  }

  it('stationTranslations のキーが実在の駅名である（路線名の混入がない）', () => {
    // 廃駅・改称等で route データ側にのみ無くなった既存キーが一定数あるため
    // 完全ゼロは求めないが、路線名の混入（今回は683件規模）のような
    // 大量の不整合が発生していないことを保証する
    const invalid = Object.keys(stationTranslations).filter(k => !stationNames.has(k));
    expect(invalid.length, `駅データに存在しないキー(先頭10件): ${invalid.slice(0, 10).join(', ')}`).toBeLessThan(150);
  });

  it('routeTranslations に実在の駅名だけからなるキーが紛れ込んでいない', () => {
    // 駅名としても存在しうる路線名（例: 私鉄の駅名と同じ表記）は除外しつつ、
    // 明らかな駅名由来のキー（数十件規模の混入）が無いことだけを保証する
    const suspicious = Object.keys(routeTranslations).filter(k => stationNames.has(k));
    expect(suspicious.length, `駅名の可能性があるキー: ${suspicious.slice(0, 10).join(', ')}`).toBeLessThan(5);
  });
});
