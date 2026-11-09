/**
 * アプリ（Flutter）に渡すデータを、今のリポジトリの一次情報から組み立てる（docs/app/flutter-app-spec.md の 4.1）。
 *
 * - 値は書き写さない。路線・駅・翻訳・時刻表・デザインの値は、Web が使っているモジュールをそのまま読む
 * - 翻訳が無いものは null にする（日本語名や英語で埋めない。CLAUDE.md「推測で訳さない」と同じ）
 * - 経路の正解データ（golden）も同じデータから作る。アプリの Dart 版の経路探索が、Web と同じ答えを
 *   出すかを確かめるために使う（データと正解が同じ版なので、データを直しても食い違わない）
 *
 * 書き出しは scripts/app-data/export.mts（npm run app:data）。中身の検査は tests/unit/scripts/appData.test.ts。
 */
import { createHash } from 'node:crypto';
import { routes, routeColors, routeNames, type RouteKey } from '../../src/data/routes';
import { walkingTransfers } from '../../src/data/walkingTransfers';
import { THROUGH_SERVICES } from '../../src/data/throughServices';
import { timetableLines, TIMETABLE_SOURCE } from '../../src/data/timetableData';
import { routeTranslations, stationTranslations, uiTranslations, uiChinese, uiKorean } from '../../src/utils/translation';
import { stationTranslationsChinese, stationTranslationsKorean } from '../../src/utils/stationTranslationsCJK';
import { getRouteCode } from '../../src/utils/routeUrlCodes';
import { encodeStationParam } from '../../src/utils/stationUrlParams';
import { FS, SEMANTIC, NEUTRAL, TARGET } from '../../src/constants/ui';
import { L } from '../../src/components/legend/legendStyles';
import { getThemeColors } from '../../src/contexts/ThemeContext';
import { RouteFinder } from '../../src/utils/routeFinder';

/** アプリのデータの形の版。形を変えたら上げる（アプリはこれを見て読めるかを決める） */
export const APP_DATA_SCHEMA_VERSION = 1;

type LocalizedName = { ja: string; en: string | null; zh: string | null; ko: string | null };

/**
 * 翻訳の表を直接引く（translateStation などの表示用の関数は、訳が無いと英語や日本語で埋めるため使わない）。
 * 表に無いものは null。表示するときにどの言語で埋めるかはアプリが決める
 */
const fromTables = (ja: string, tables: { en?: Record<string, string>; zh?: Record<string, string>; ko?: Record<string, string> }): LocalizedName => ({
  ja,
  en: tables.en?.[ja] ?? null,
  zh: tables.zh?.[ja] ?? null,
  ko: tables.ko?.[ja] ?? null,
});

export function buildRoutes() {
  return (Object.keys(routes) as RouteKey[]).map(key => ({
    key,
    code: getRouteCode(key) ?? null,
    // 路線名の中国語・韓国語の表はまだ無い（Web は英語で表示している）ので null
    name: fromTables(routeNames[key] ?? key, { en: routeTranslations }),
    color: routeColors[key] ?? null,
    stations: routes[key].map(s => ({
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      ...(s.timeToNext !== undefined ? { timeToNext: s.timeToNext } : {}),
      ...(s.isExpress !== undefined ? { isExpress: s.isExpress } : {}),
    })),
  }));
}

/**
 * 駅の一覧。経路探索（routeFinder.ts）と同じく、駅は名前で1つにまとめる。
 * 座標は最初に出てきた路線のものを使う（同名の駅は同じ場所として扱う、今の Web と同じ）
 */
export function buildStations() {
  const byName = new Map<string, { name: LocalizedName; lat: number; lng: number; slug: string | null; routes: RouteKey[] }>();
  for (const key of Object.keys(routes) as RouteKey[]) {
    for (const s of routes[key]) {
      const found = byName.get(s.name);
      if (found) {
        if (!found.routes.includes(key)) found.routes.push(key);
        continue;
      }
      byName.set(s.name, {
        name: fromTables(s.name, { en: stationTranslations, zh: stationTranslationsChinese, ko: stationTranslationsKorean }),
        lat: s.lat,
        lng: s.lng,
        slug: encodeStationParam(s.name),
        routes: [key],
      });
    }
  }
  return [...byName.values()];
}

export function buildTranslations() {
  const ui: Record<string, { ja: string; en: string; zh: string | null; ko: string | null }> = {};
  for (const [key, t] of Object.entries(uiTranslations)) {
    ui[key] = { ja: t.japanese, en: t.english, zh: uiChinese[key] ?? null, ko: uiKorean[key] ?? null };
  }
  return { ui };
}

export function buildTimetables() {
  return { source: TIMETABLE_SOURCE, lines: timetableLines };
}

export function buildTransfers() {
  return { walking: walkingTransfers, through: THROUGH_SERVICES };
}

/** デザインの値（色・文字の大きさ・余白・角の丸み・押せる大きさ）。アプリはここから ThemeData を作る */
export function buildTokens() {
  return {
    fontSize: FS,
    spacing: L.sp,
    radius: L.r,
    target: { ...TARGET, app: 48 },
    semantic: SEMANTIC,
    neutral: NEUTRAL,
    theme: { light: getThemeColors('light'), dark: getThemeColors('dark') },
  };
}

/**
 * 経路の正解データ。主な駅どうしの組と、決まった種から選んだ組について、今の routeFinder の答えを残す。
 * 乱数は使わない（毎回同じ組になるよう、駅の並びから一定の間隔で選ぶ）
 */
export const GOLDEN_MAJOR_STATIONS = [
  '東京', '新宿', '渋谷', '池袋', '品川', '上野', '横浜', '大宮', '千葉', '立川',
  '藤沢', '川崎', '北千住', '押上', '秋葉原', '新橋', '吉祥寺', '武蔵小杉', '町田', '八王子',
] as const;

export function buildRouteGolden({ extraPairs = 80, maxResults = 5 } = {}) {
  const finder = new RouteFinder();
  const stations = buildStations();
  const byName = new Map(stations.map(s => [s.name.ja, s]));
  const pairs: [string, string][] = [];
  const majors = GOLDEN_MAJOR_STATIONS.filter(n => byName.has(n));
  for (let i = 0; i < majors.length; i++) {
    for (let j = i + 1; j < majors.length; j += 3) pairs.push([majors[i], majors[j]]);
  }
  // 関東の駅（主な駅を通る路線の駅）から一定の間隔で選ぶ
  const kanto = stations.filter(s => s.lat > 34.9 && s.lat < 36.9 && s.lng > 138.9 && s.lng < 140.9).map(s => s.name.ja);
  const step = Math.max(1, Math.floor(kanto.length / (extraPairs + 1)));
  for (let k = 0; k < extraPairs; k++) {
    const a = kanto[(k * step) % kanto.length];
    const b = kanto[(k * step * 7 + Math.floor(kanto.length / 2)) % kanto.length];
    if (a && b && a !== b) pairs.push([a, b]);
  }
  const toStation = (name: string) => { const s = byName.get(name)!; return { name, lat: s.lat, lng: s.lng }; };
  return {
    maxResults,
    cases: pairs.map(([from, to]) => ({
      from,
      to,
      results: finder.findRoutes(toStation(from), toStation(to), maxResults).map(r => ({
        totalTime: r.totalTime,
        transfers: r.transfers,
        segments: r.segments.map(seg => ({
          routeKey: seg.routeKey,
          from: seg.stations[0]?.name ?? null,
          to: seg.stations[seg.stations.length - 1]?.name ?? null,
          time: seg.time,
          ...(seg.through ? { through: true } : {}),
          ...(seg.isWalkingTransfer ? { walking: true } : {}),
        })),
      })),
    })),
  };
}

const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');

/** 書き出すファイルの名前と中身（JSON の文字列）、それと manifest.json */
export function buildAppDataFiles({ generatedAt = new Date().toISOString(), goldenPairs = 80 } = {}) {
  const files: Record<string, unknown> = {
    'routes.json': buildRoutes(),
    'stations.json': buildStations(),
    'translations.json': buildTranslations(),
    'timetables.json': buildTimetables(),
    'transfers.json': buildTransfers(),
    'tokens.json': buildTokens(),
    'route-golden.json': buildRouteGolden({ extraPairs: goldenPairs }),
  };
  const text: Record<string, string> = Object.fromEntries(Object.entries(files).map(([name, v]) => [name, JSON.stringify(v)]));
  const entries = Object.fromEntries(Object.entries(text).map(([name, t]) => [name, { sha256: sha256(t), bytes: Buffer.byteLength(t) }]));
  // 版はデータの中身から決める（中身が同じなら同じ版。アプリは版が変わったときだけ取り直す）
  const version = sha256(Object.values(entries).map(e => e.sha256).join('')).slice(0, 12);
  const manifest = { schemaVersion: APP_DATA_SCHEMA_VERSION, version, generatedAt, files: entries };
  return { files: { ...text, 'manifest.json': JSON.stringify(manifest, null, 1) }, manifest };
}
