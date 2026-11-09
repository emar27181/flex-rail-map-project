/**
 * アプリ（Flutter）に渡すデータの検査（scripts/app-data/buildAppData.ts, docs/app/flutter-app-spec.md の 4.1）。
 *
 * 固定したいこと:
 * - 路線・駅・翻訳・デザインの値が、Web の一次情報からそのまま組み立てられている（抜け・食い違いが無い）
 * - 訳が無いものは null（英語や日本語で埋めて「訳がある」ように見せない）
 * - 経路の正解データが、つながった経路として書き出される
 * - 中身が同じなら版も同じ（アプリは版が変わったときだけ取り直す）
 */
import { describe, it, expect } from 'vitest';
import { routes, type RouteKey } from '../../../src/data/routes';
import { stationTranslationsKorean } from '../../../src/utils/stationTranslationsCJK';
import { getWalkingTime } from '../../../src/data/walkingTransfers';
import {
  APP_DATA_SCHEMA_VERSION, buildAppDataFiles, buildRouteGolden, buildRoutes, buildStations, buildTokens, buildTranslations,
} from '../../../scripts/app-data/buildAppData';

describe('路線（routes.json）', () => {
  const list = buildRoutes();

  it('Web の路線をすべて、URL の路線コード・色・英語名つきで書き出す', () => {
    expect(list.map(r => r.key).sort()).toEqual((Object.keys(routes) as RouteKey[]).sort());
    for (const r of list) {
      expect(r.code, r.key).toBeTruthy();
      expect(r.color, r.key).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(r.name.en, r.key).toBeTruthy();
      expect(r.stations.length, r.key).toBeGreaterThan(1);
    }
    expect(new Set(list.map(r => r.code)).size).toBe(list.length);
  });

  it('路線名の中国語・韓国語は表が無いので null（英語で埋めない）', () => {
    expect(list.every(r => r.name.zh === null && r.name.ko === null)).toBe(true);
  });
});

describe('駅（stations.json）', () => {
  const list = buildStations();
  const byName = new Map(list.map(s => [s.name.ja, s]));

  it('路線に出てくる駅をすべて、名前で1つにまとめて書き出す（経路探索と同じまとめ方）', () => {
    expect(byName.size).toBe(list.length);
    for (const [key, stations] of Object.entries(routes)) {
      for (const st of stations) {
        expect(byName.get(st.name)?.routes, `${key} ${st.name}`).toContain(key);
      }
    }
  });

  it('URL で使う英語の slug がある', () => {
    expect(byName.get('渋谷')?.slug).toBe('shibuya');
    expect(list.every(s => s.slug)).toBe(true);
  });

  it('韓国語の訳が表に無い駅は null（Web の表示のように英語で埋めない）', () => {
    const missing = list.find(s => !stationTranslationsKorean[s.name.ja]);
    expect(missing).toBeTruthy();
    expect(missing!.name.ko).toBeNull();
    expect(missing!.name.en).toBeTruthy();
  });
});

describe('翻訳・デザインの値', () => {
  it('画面の文言は日本語と英語がそろっている', () => {
    for (const [key, t] of Object.entries(buildTranslations().ui)) {
      expect(t.ja, key).toBeTruthy();
      expect(t.en, key).toBeTruthy();
    }
  });

  it('アプリの押せる大きさは 48 以上、文字は 12 以上', () => {
    const tokens = buildTokens();
    expect(tokens.target.app).toBeGreaterThanOrEqual(48);
    for (const [name, size] of Object.entries(tokens.fontSize)) {
      if (typeof size === 'string' && size.endsWith('px')) expect(parseFloat(size), name).toBeGreaterThanOrEqual(12);
    }
    expect(Object.keys(tokens.theme)).toEqual(['light', 'dark']);
  });
});

describe('経路の正解データ（route-golden.json）', () => {
  const golden = buildRouteGolden({ extraPairs: 6 });

  it('主な駅どうしの組を含み、どの組も候補は最大件数以内', () => {
    expect(golden.cases.some(c => c.from === '東京' && c.to === '新宿')).toBe(true);
    for (const c of golden.cases) expect(c.results.length).toBeLessThanOrEqual(golden.maxResults);
  });

  it('候補は出発駅から到着駅までつながった区間の列（徒歩の乗り換えは区間にならず、駅名が飛ぶ）', () => {
    // routeFinder は徒歩の乗り換え（東京↔大手町、秋葉原↔岩本町など）を区間として持たず、次の区間がその駅から始まる。
    // 東京→新宿の候補が「丸ノ内線 大手町→新宿」から始まることもある。Dart 版もこの形をそのまま再現する
    const joined = (a: string | null, b: string | null) => !!a && !!b && (a === b || getWalkingTime(a, b) !== null);
    for (const c of golden.cases) {
      for (const r of c.results) {
        const s = r.segments;
        const label = `${c.from}→${c.to} ${s.map(x => `${x.from}-${x.to}`).join(' ')}`;
        expect(joined(c.from, s[0].from), label).toBe(true);
        expect(joined(s[s.length - 1].to, c.to), label).toBe(true);
        for (let i = 1; i < s.length; i++) expect(joined(s[i - 1].to, s[i].from), label).toBe(true);
        expect(Number.isFinite(r.totalTime)).toBe(true);
      }
    }
  });
});

describe('書き出し全体（manifest.json）', () => {
  it('中身が同じなら版も同じ。ファイルごとの大きさとハッシュを持つ', () => {
    const a = buildAppDataFiles({ generatedAt: 'x', goldenPairs: 2 });
    const b = buildAppDataFiles({ generatedAt: 'y', goldenPairs: 2 });
    expect(a.manifest.version).toBe(b.manifest.version);
    expect(a.manifest.schemaVersion).toBe(APP_DATA_SCHEMA_VERSION);
    expect(Object.keys(a.files).sort()).toEqual([
      'manifest.json', 'route-golden.json', 'routes.json', 'stations.json', 'timetables.json', 'tokens.json', 'transfers.json', 'translations.json',
    ]);
    for (const e of Object.values(a.manifest.files)) {
      expect(e.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(e.bytes).toBeGreaterThan(0);
    }
  });
});
