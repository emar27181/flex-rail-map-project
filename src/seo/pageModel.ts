/**
 * 検索向けページ（/lines/*, /stations/*, /data/*）の中身を、路線データ・駅統計・
 * 観光地データから組み立てる。ページ（src/pages/[...lang]/...）はここの結果を
 * 描くだけで、文章以外の値を自分で持たない。
 *
 * 方針:
 * - 値はすべて src/data から計算する。無いものは書かない（推測で埋めない）
 * - 駅は「駅名＋座標」で識別する（sameStation.ts）。駅名だけで引くと
 *   同名の別駅（長谷〈江ノ電〉と長谷〈播但線〉など）を混ぜてしまうため
 * - 駅統計は実データ（dataQuality: 'real'）のみ使う
 * - 情報量で Tier を決め、Tier A だけを index させる（src/data/seoPages.ts）
 */
import { routes, routeNames, routeColors, type RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import {
  PARAM_DATA_SOURCES, STAT_PARAMS, stationStatsData,
  type DataSource, type StatParamMeta, type StationStats,
} from '../data/stationStats';
import {
  MIN_STATIONS_FOR_DATA_PAGE, SEO_DATA_METRICS, SEO_LINE_KEYS, STATION_TIER_RULES,
} from '../data/seoPages';
import { TOURIST_SPOTS, type TouristSpot } from '../data/touristSpots';
import { THROUGH_SERVICES } from '../data/throughServices';
import { guides, guidePath, type GuideDefinition } from '../data/guides';
import { routeTranslations, stationTranslations } from '../utils/translation';
import { approxDistanceKm, isSameStation } from '../utils/sameStation';
import { countDistinctLines } from '../utils/effectiveLines';
import { getAllStations } from '../utils/allStations';

export type SeoLang = 'ja' | 'en';
export const SEO_LANGS: SeoLang[] = ['ja', 'en'];

/**
 * 駅統計の座標は小数1桁（約10km四方）に丸められているため、駅の座標と
 * 数km ずれる。同名の別駅は数十km以上離れているので、この距離以内なら同じ駅の統計とみなす
 */
const STATS_COORD_TOLERANCE_KM = 15;
/** 「近くの主要駅」に出す最大距離と件数 */
const NEARBY_MAX_KM = 10;
const NEARBY_COUNT = 5;

// ── URL ────────────────────────────────────────────────

const langPrefix = (lang: SeoLang) => (lang === 'ja' ? '' : `/${lang}`);
export type SeoHub = 'stations' | 'lines' | 'data';
export const hubPath = (hub: SeoHub, lang: SeoLang) => `${langPrefix(lang)}/${hub}`;
export const stationPath = (slug: string, lang: SeoLang) => `${hubPath('stations', lang)}/${slug}`;
export const linePath = (slug: string, lang: SeoLang) => `${hubPath('lines', lang)}/${slug}`;
export const dataPath = (slug: string, lang: SeoLang) => `${hubPath('data', lang)}/${slug}`;

/** 英語名 → URL用の英小文字とハイフン（"Meiji-jingumae" → "meiji-jingumae"） */
export function toSlug(en: string): string {
  return en
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── 型 ────────────────────────────────────────────────

export interface RealStat {
  key: keyof StationStats;
  value: number;
  meta: StatParamMeta;
  source?: DataSource;
}

export interface StationRefLink {
  name: string;
  nameEn: string;
  /** 駅ページがあるときだけ */
  slug?: string;
}

export interface AdjacentOnRoute {
  route: RouteKey;
  prev?: StationRefLink;
  next?: StationRefLink;
}

export type StationTier = 'A' | 'B' | 'C';

export interface SeoStation {
  slug: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  /** この駅を通る全路線（路線データの運行系統単位） */
  routes: RouteKey[];
  /** 同じ線路を走る系統を1本とした実質の路線数（乗換駅の判定） */
  effectiveLines: number;
  adjacent: AdjacentOnRoute[];
  stats: RealStat[];
  touristSpots: TouristSpot[];
  tier: StationTier;
  indexable: boolean;
  /** 地図でこの駅を出発駅にして開けるか（地図側が駅名で同じ駅を引けるときだけ） */
  mapFrom?: string;
}

export interface SeoLineStop {
  station: SeoStation;
  /** この駅で乗り換えられる他の路線 */
  transfers: RouteKey[];
}

export interface SeoLine {
  key: RouteKey;
  slug: string;
  name: string;
  nameEn: string;
  /** 路線色（路線データに無ければ undefined） */
  color?: string;
  stops: SeoLineStop[];
  /** 直通運転している相手の路線（系統ごと） */
  throughPartners: RouteKey[][];
  indexable: boolean;
}

export interface SeoDataRow {
  station: SeoStation;
  value: number;
}

export interface SeoLineSummary {
  line: SeoLine;
  count: number;
  median: number;
  max: SeoDataRow;
}

export interface SeoDataPage {
  slug: string;
  key: keyof StationStats;
  meta: StatParamMeta;
  source?: DataSource;
  /** 値の大きい順（higherIsBetter=false の指標は小さい順） */
  rows: SeoDataRow[];
  /** 対象範囲の駅のうち値が無い駅の数 */
  missingCount: number;
  byLine: SeoLineSummary[];
  indexable: boolean;
}

export interface ExcludedDataMetric {
  slug: string;
  meta: StatParamMeta;
  reason: 'estimated';
}

export interface SeoModel {
  stations: SeoStation[];
  lines: SeoLine[];
  dataPages: SeoDataPage[];
  excludedDataMetrics: ExcludedDataMetric[];
}

// ── 路線名 ────────────────────────────────────────────

export function routeName(key: RouteKey, lang: SeoLang): string {
  const ja = routeNames[key as keyof typeof routeNames] ?? key;
  return lang === 'ja' ? ja : (routeTranslations[ja] ?? ja);
}

export function stationName(s: { name: string; nameEn: string }, lang: SeoLang): string {
  return lang === 'ja' ? s.name : s.nameEn;
}

// ── 組み立て ──────────────────────────────────────────

const ROUTE_ENTRIES = Object.entries(routes) as Array<[RouteKey, Station[]]>;

/** 駅名 → その名前の駅が出てくる [路線, 駅列内の位置] */
function buildNameIndex(): Map<string, Array<{ route: RouteKey; index: number; station: Station }>> {
  const map = new Map<string, Array<{ route: RouteKey; index: number; station: Station }>>();
  for (const [route, list] of ROUTE_ENTRIES) {
    list.forEach((station, index) => {
      const arr = map.get(station.name) ?? [];
      arr.push({ route, index, station });
      map.set(station.name, arr);
    });
  }
  return map;
}

function realStatsOf(ref: { name: string; lat: number; lng: number }): RealStat[] {
  const stats = stationStatsData[ref.name];
  if (!stats || typeof stats.lat !== 'number' || typeof stats.lng !== 'number') return [];
  if (approxDistanceKm(stats.lat, stats.lng, ref.lat, ref.lng) > STATS_COORD_TOLERANCE_KM) return [];
  const out: RealStat[] = [];
  for (const meta of STAT_PARAMS) {
    if (meta.dataQuality !== 'real' || meta.key === 'routeCount') continue;
    const value = stats[meta.key];
    if (typeof value !== 'number' || !Number.isFinite(value)) continue;
    out.push({ key: meta.key, value, meta, source: PARAM_DATA_SOURCES[meta.key] });
  }
  return out;
}

function tierOf(effectiveLines: number, realStats: number, isTouristStation: boolean): StationTier {
  const { minLines, minRealStats } = STATION_TIER_RULES;
  if (realStats >= minRealStats && (effectiveLines >= minLines || isTouristStation)) return 'A';
  if (effectiveLines >= 2 || realStats > 0) return 'B';
  return 'C';
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function buildModel(): SeoModel {
  const nameIndex = buildNameIndex();

  // 1. 対象の駅（路線ページの路線の全駅＋観光地の最寄り駅）
  const refs: Array<{ name: string; lat: number; lng: number }> = [];
  const addRef = (s: Station) => {
    if (!refs.some(r => isSameStation(s, r))) refs.push({ name: s.name, lat: s.lat, lng: s.lng });
  };
  for (const key of SEO_LINE_KEYS) (routes[key] as Station[]).forEach(addRef);
  const touristByRef = new Map<string, TouristSpot[]>();
  for (const spot of TOURIST_SPOTS) {
    for (const ts of spot.stations) {
      const s = (routes[ts.route] as Station[] | undefined)?.find(x => x.name === ts.name);
      if (!s) continue; // テストで検出する
      addRef(s);
      const ref = refs.find(r => isSameStation(s, r))!;
      const k = `${ref.name}@${ref.lat},${ref.lng}`;
      touristByRef.set(k, [...(touristByRef.get(k) ?? []), spot]);
    }
  }

  // 2. 駅ごとの路線・隣の駅・実質路線数・統計
  const appStations = getAllStations();
  const usedSlugs = new Set<string>();
  const drafts = refs.map(ref => {
    const hits = (nameIndex.get(ref.name) ?? []).filter(h => isSameStation(h.station, ref));
    const routeKeys = [...new Set(hits.map(h => h.route))];
    const neighborSets = routeKeys.map(rk => {
      const set = new Set<string>();
      for (const h of hits.filter(x => x.route === rk)) {
        const list = routes[rk] as Station[];
        if (h.index > 0 && list[h.index - 1].name !== ref.name) set.add(list[h.index - 1].name);
        if (h.index < list.length - 1 && list[h.index + 1].name !== ref.name) set.add(list[h.index + 1].name);
      }
      return set;
    });
    const nameEn = stationTranslations[ref.name] ?? ref.name;
    let slug = toSlug(nameEn) || toSlug(ref.name);
    if (usedSlugs.has(slug)) slug = `${slug}-${toSlug(routeName(routeKeys[0], 'en'))}`;
    usedSlugs.add(slug);
    const stats = realStatsOf(ref);
    const touristSpots = touristByRef.get(`${ref.name}@${ref.lat},${ref.lng}`) ?? [];
    const effectiveLines = countDistinctLines(neighborSets);
    const tier = tierOf(effectiveLines, stats.length, touristSpots.length > 0);
    // 地図は駅名で最初に登録された駅を開くので、それが同じ駅のときだけ出発駅に指定できる
    const appStation = appStations.find(s => s.name === ref.name);
    const station: SeoStation = {
      slug, name: ref.name, nameEn, lat: ref.lat, lng: ref.lng,
      routes: routeKeys, effectiveLines, adjacent: [], stats, touristSpots, tier,
      indexable: tier === 'A',
      mapFrom: appStation && isSameStation(appStation, ref) ? ref.name : undefined,
    };
    return { station, hits };
  });
  const stations = drafts.map(d => d.station);

  const findStation = (s: { name: string; lat: number; lng: number }) =>
    stations.find(x => isSameStation(s, x));
  const linkOf = (s: Station): StationRefLink => ({
    name: s.name,
    nameEn: stationTranslations[s.name] ?? s.name,
    slug: findStation(s)?.slug,
  });
  for (const { station, hits } of drafts) {
    station.adjacent = station.routes.map(rk => {
      const h = hits.find(x => x.route === rk)!;
      const list = routes[rk] as Station[];
      return {
        route: rk,
        prev: h.index > 0 ? linkOf(list[h.index - 1]) : undefined,
        next: h.index < list.length - 1 ? linkOf(list[h.index + 1]) : undefined,
      };
    });
  }

  // 3. 路線
  const lines: SeoLine[] = SEO_LINE_KEYS.map(key => {
    const list = routes[key] as Station[];
    const stops: SeoLineStop[] = [];
    for (const s of list) {
      const station = findStation(s);
      if (!station || stops.some(x => x.station === station)) continue;
      stops.push({ station, transfers: station.routes.filter(r => r !== key) });
    }
    const throughPartners = THROUGH_SERVICES
      .filter(sv => sv.sections.some(sec => sec.route === key))
      .map(sv => [...new Set(sv.sections.map(sec => sec.route).filter(r => r !== key))])
      .filter(p => p.length > 0);
    const uniquePartners = throughPartners.filter(
      (p, i) => throughPartners.findIndex(q => q.join() === p.join()) === i,
    );
    const nameEn = routeName(key, 'en');
    return {
      key,
      slug: toSlug(nameEn),
      name: routeName(key, 'ja'),
      nameEn,
      color: routeColors[key as keyof typeof routeColors],
      stops,
      throughPartners: uniquePartners,
      indexable: stops.length >= 2,
    };
  });

  // 4. データ
  const dataPages: SeoDataPage[] = [];
  const excludedDataMetrics: ExcludedDataMetric[] = [];
  for (const m of SEO_DATA_METRICS) {
    const meta = STAT_PARAMS.find(p => p.key === m.statKey);
    if (!meta) continue;
    if (meta.dataQuality !== 'real') {
      excludedDataMetrics.push({ slug: m.slug, meta, reason: 'estimated' });
      continue;
    }
    const rows: SeoDataRow[] = [];
    for (const station of stations) {
      const stat = station.stats.find(s => s.key === m.statKey);
      if (stat) rows.push({ station, value: stat.value });
    }
    rows.sort((a, b) => (meta.higherIsBetter ? b.value - a.value : a.value - b.value));
    const byLine: SeoLineSummary[] = [];
    for (const line of lines) {
      const lineRows = rows.filter(r => line.stops.some(s => s.station === r.station));
      if (lineRows.length === 0) continue;
      byLine.push({ line, count: lineRows.length, median: median(lineRows.map(r => r.value)), max: lineRows[0] });
    }
    byLine.sort((a, b) => (meta.higherIsBetter ? b.median - a.median : a.median - b.median));
    dataPages.push({
      slug: m.slug, key: m.statKey, meta, source: PARAM_DATA_SOURCES[m.statKey],
      rows, missingCount: stations.length - rows.length, byLine,
      indexable: rows.length >= MIN_STATIONS_FOR_DATA_PAGE,
    });
  }

  return { stations, lines, dataPages, excludedDataMetrics };
}

let cache: SeoModel | null = null;
export function getSeoModel(): SeoModel {
  if (!cache) cache = buildModel();
  return cache;
}

// ── 内部リンク ────────────────────────────────────────

/** 近くの主要駅（index 対象の駅から距離順） */
export function nearbyMajorStations(station: SeoStation): SeoStation[] {
  return getSeoModel().stations
    .filter(s => s !== station && s.indexable)
    .map(s => ({ s, d: approxDistanceKm(s.lat, s.lng, station.lat, station.lng) }))
    .filter(x => x.d <= NEARBY_MAX_KM)
    .sort((a, b) => a.d - b.d)
    .slice(0, NEARBY_COUNT)
    .map(x => x.s);
}

export function lineByKey(key: RouteKey): SeoLine | undefined {
  return getSeoModel().lines.find(l => l.key === key);
}

/** その言語のガイドのうち、地図CTAでこれらの路線を開くもの */
export function guidesForRoutes(keys: RouteKey[], lang: SeoLang): Array<{ title: string; path: string }> {
  return guides
    .filter((g: GuideDefinition) => g.lang === lang && g.ctaRoutes?.some(r => keys.includes(r)))
    .map(g => ({ title: g.breadcrumbLabel, path: guidePath(g) }));
}

/** 駅ページの統計のうち、データのページがある指標 */
export function dataPageFor(key: keyof StationStats): SeoDataPage | undefined {
  return getSeoModel().dataPages.find(d => d.key === key);
}
