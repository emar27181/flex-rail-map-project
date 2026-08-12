import { describe, it, expect } from 'vitest';
import { uiTranslations, uiChinese, uiKorean, stationTranslations, routeTranslations } from '../../../src/utils/translation';
import { routes } from '../../../src/data/routes';
import { stationTranslationsChinese, stationTranslationsKorean } from '../../../src/utils/stationTranslationsCJK';

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

describe('英語表記のカバレッジ', () => {
  /**
   * 路線データ上の全駅に英語表記が存在することを保証する。
   * 新しい路線・駅を追加した際、英訳の追加を忘れると英語UIで
   * 日本語のまま表示されてしまうため、ここで検出する。
   */
  it('全ての駅に stationTranslations のエントリがある', () => {
    const missing: string[] = [];
    const seen = new Set<string>();
    for (const stations of Object.values(routes)) {
      for (const s of stations) {
        if (seen.has(s.name)) continue;
        seen.add(s.name);
        if (!stationTranslations[s.name]) missing.push(s.name);
      }
    }
    expect(
      missing.length,
      `英語表記が未登録の駅(${missing.length}件, 先頭20件): ${missing.slice(0, 20).join(', ')}`
    ).toBe(0);
  });
});

describe('中国語・韓国語 駅名表記の健全性', () => {
  /**
   * 中国語（簡体字）の値に、日本語の新字体がそのまま残っていることが
   * 実際にあった（例: 目黒→"目黒", 高円寺→"高円寺", 稲毛→"稲毛"）。
   * これらは中国語には存在しない字形なので、簡体字に直す必要がある。
   * 日中で字形が異なる代表的な文字を機械的に検出する。
   *
   * 「辻」「峠」「畑」「込」など簡体字に対応字形が無い国字は、
   * 日本語表記のまま残すのが正しいためここでは対象外にしている。
   */
  const JP_SHINJITAI_TO_SIMPLIFIED: Record<string, string> = {
    巣: '巢', 鴨: '鸭', 黒: '黑', 円: '圆', 郷: '乡', 稲: '稻',
    浜: '滨', 経: '经', 楽: '乐', 沢: '泽', 巻: '卷', 戸: '户',
    馬: '马', 駅: '站', 桜: '樱', 塩: '盐', 亀: '龟', 蔵: '藏',
    渋: '涩', 岡: '冈', 竜: '龙', 発: '发', 関: '关', 図: '图',
    総: '总', 転: '转', 権: '权', 実: '实', 気: '气', 満: '满',
  };

  it('中国語の値に日本語の新字体が残っていない', () => {
    const bad: string[] = [];
    for (const [ja, zh] of Object.entries(stationTranslationsChinese)) {
      for (const [jp, sc] of Object.entries(JP_SHINJITAI_TO_SIMPLIFIED)) {
        if (zh.includes(jp)) bad.push(`${ja}=${zh} (${jp}→${sc})`);
      }
    }
    expect(bad.length, `日本語字形が残っている: ${bad.slice(0, 15).join(', ')}`).toBe(0);
  });

  it('中国語の値にかなが残っていない', () => {
    // 「・」(U+30FB) はカタカナブロックだが区切り記号として正当なので除外する
    const KANA = /[ぁ-ゟ゠-ヿ]/u;
    const bad = Object.entries(stationTranslationsChinese)
      .filter(([, v]) => KANA.test(v.replace(/・/g, '')));
    expect(bad.length, `かなが残っている: ${bad.slice(0, 10).map(([k, v]) => `${k}=${v}`).join(', ')}`).toBe(0);
  });

  it('韓国語の値がハングル（と記号）で構成されている', () => {
    // 同名駅の区別に全角括弧を使っているエントリがあるため許可する
    // 例: あびこ = 아비코（난카이）
    const ALLOWED = /^[가-힣ㄱ-ㅎㅏ-ㅣ0-9 \-.·・()（）]+$/u;
    const bad = Object.entries(stationTranslationsKorean).filter(([, v]) => !ALLOWED.test(v));
    expect(bad.length, `ハングル以外を含む: ${bad.slice(0, 10).map(([k, v]) => `${k}=${v}`).join(', ')}`).toBe(0);
  });
});

describe('stationTranslations の値の健全性', () => {
  /**
   * 大量の駅名翻訳を手作業で追記する際、値の側が壊れていても
   * TypeScript の型チェック（string であればOK）では検出できない。
   * 実際に、式を書いてしまった `"Kour<キリル文字>".replace(...)` や、
   * 日本語が残ったままのエントリが混入しかけたことがある。
   * 英字表記として妥当な文字だけで構成されていることを機械的に検証する。
   */
  const entries = Object.entries(stationTranslations);

  it('値に日本語（かな・漢字）が残っていない', () => {
    const JAPANESE = /[぀-ヿ一-鿿]/;
    const bad = entries.filter(([, v]) => JAPANESE.test(v));
    expect(bad.length, `日本語が残っている: ${bad.slice(0, 10).map(([k, v]) => `${k}=${v}`).join(', ')}`).toBe(0);
  });

  it('値がラテン文字・数字・記号のみで構成されている（キリル文字等の混入がない）', () => {
    // 許可: 英数字, 空白, ハイフン, ピリオド, アポストロフィ, 丸括弧, スラッシュ, アンパサンド
    const ALLOWED = /^[A-Za-z0-9 \-.'()\/&]+$/;
    const bad = entries.filter(([, v]) => !ALLOWED.test(v));
    expect(bad.length, `想定外の文字を含む: ${bad.slice(0, 10).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ')}`).toBe(0);
  });

  it('値が空文字やプレースホルダになっていない', () => {
    const bad = entries.filter(([, v]) => v.trim().length === 0 || v.includes('undefined') || v.includes('TODO'));
    expect(bad.length, `不正な値: ${bad.slice(0, 10).map(([k, v]) => `${k}=${v}`).join(', ')}`).toBe(0);
  });
});
