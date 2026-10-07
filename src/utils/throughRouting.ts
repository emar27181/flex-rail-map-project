/**
 * 直通運転（src/data/throughServices.ts）を経路検索に使う。
 *
 * 路線データは路線ごとに分かれているため、経路検索は「東海道線 → 東京で高崎線」を
 * 乗り換え1回と数え、東海道線（〜東京）と宇都宮線（上野〜）のように駅を共有しない
 * 直通はそもそも経路にできなかった（藤沢 → 宇都宮で上野東京ラインが出なかった）。
 *
 * ここでは系統ごとに次を求める。
 * - 接続点: 2つの区間が共有する駅（同名・同じ駅）。そこで列車がそのまま次の路線へ入る
 * - 橋渡し: 区間どうしが駅を共有しないとき（路線データに間の線が無い）、両端の駅を
 *   両方含む別の路線データがあれば、その区間を同じ列車の続きとして使う
 *   （東海道線の東京 → 宇都宮線の上野は、高崎線データの東京〜上野）。
 *   所要時間もその路線データから取り、推測した値は使わない
 *
 * 連鎖は推論しない（docs/through-services.md の収録方針）。乗り換えなしとみなすのは、
 * 1つの系統の区間の中だけを走る区間が続くときに限る。
 */
import { routes, type RouteKey } from '../data/routes';
import { THROUGH_SERVICES, type ThroughService } from '../data/throughServices';
import type { Station } from '../data/yamanote';
import { isSameStation, approxDistanceKm } from './sameStation';
import { resolveSectionRange, type RouteStations } from './throughSection';
import { legTime } from './legTime';


/** 橋渡しに使う両端の駅の最大距離（km）。路線データの欠けを埋めるだけなので短い区間に限る */
export const THROUGH_BRIDGE_MAX_KM = 10;

/** 1つの系統の中で、1つの路線を走る区間 */
interface ResolvedSection {
  route: RouteKey;
  /** 路線データの添字の範囲 [start, end] */
  range: [number, number];
}

interface JunctionLink {
  kind: 'junction';
  /** 共有する駅の名前（区間 a・b の両方にある） */
  stations: string[];
}

interface BridgeLink {
  kind: 'bridge';
  /** 区間 a 側の端の駅（a の路線データの添字） */
  fromIndex: number;
  /** 区間 b 側の端の駅（b の路線データの添字） */
  toIndex: number;
  /** 間をつなぐ路線データと、その中の添字 */
  via: RouteKey;
  viaFrom: number;
  viaTo: number;
}

type Link = JunctionLink | BridgeLink;

export interface ResolvedService {
  id: string;
  sections: ResolvedSection[];
  /** links.get(`${a}>${b}`): 区間 a から区間 b への接続 */
  links: Map<string, Link>;
}

const inRange = (section: ResolvedSection, index: number) => index >= section.range[0] && index <= section.range[1];

function indexOf(stations: Station[], station: { name: string; lat: number; lng: number }): number {
  return stations.findIndex(s => isSameStation(s, station));
}

/** 橋渡しの範囲 [vf, vt] が、系統のその路線の区間と端の1駅でしか重ならないか */
function outsideOwnSections(
  service: ThroughService,
  via: RouteKey,
  vf: number,
  vt: number,
  routeStations: RouteStations,
): boolean {
  const lo = Math.min(vf, vt);
  const hi = Math.max(vf, vt);
  for (const sec of service.sections) {
    if (sec.route !== via) continue;
    const range = resolveSectionRange(sec, routeStations);
    if (!range) continue;
    const overlap = Math.min(hi, range[1]) - Math.max(lo, range[0]);
    if (overlap > 0) return false;
  }
  return true;
}

/**
 * a・b の路線と同じ直通系統に出てくる路線（同じ線路を走る仲間）。
 * 橋渡しの路線はこれを優先する（東京〜上野は常磐線データより高崎線データで描く）
 */
function relatedRoutes(services: ThroughService[], a: RouteKey, b: RouteKey): Set<RouteKey> {
  const out = new Set<RouteKey>();
  for (const s of services) {
    const rs = s.sections.map(x => x.route);
    if (rs.includes(a) || rs.includes(b)) rs.forEach(r => out.add(r));
  }
  return out;
}

function findBridge(
  service: ThroughService,
  a: ResolvedSection,
  b: ResolvedSection,
  routeStations: RouteStations,
  allServices: ThroughService[],
): BridgeLink | null {
  const sa = routeStations[a.route]!;
  const sb = routeStations[b.route]!;
  const own = new Set(service.sections.map(s => s.route));
  const related = relatedRoutes(allServices, a.route, b.route);
  let best: (BridgeLink & { km: number; time: number; rank: number }) | null = null;
  for (const ia of new Set(a.range)) {
    for (const ib of new Set(b.range)) {
      const ea = sa[ia];
      const eb = sb[ib];
      const km = approxDistanceKm(ea.lat, ea.lng, eb.lat, eb.lng);
      if (km > THROUGH_BRIDGE_MAX_KM) continue;
      for (const via of Object.keys(routeStations) as RouteKey[]) {
        const sv = routeStations[via]!;
        const vf = indexOf(sv, ea);
        const vt = indexOf(sv, eb);
        if (vf < 0 || vt < 0 || vf === vt) continue;
        // 系統自身の路線は、その区間の外側へ延ばすときだけ使える（都営新宿線の新宿 → 京王線データの
        // 新宿〜笹塚）。区間の内側を通ると、走らない経路（米原で折り返して湖西線へ等）を作ってしまう
        if (own.has(via) && !outsideOwnSections(service, via, vf, vt, routeStations)) continue;
        const time = legTime(sv, vf, vt);
        const rank = related.has(via) ? 0 : 1;
        const better = !best
          || km < best.km
          || (km === best.km && (rank < best.rank || (rank === best.rank && time < best.time)));
        if (better) best = { kind: 'bridge', fromIndex: ia, toIndex: ib, via, viaFrom: vf, viaTo: vt, km, time, rank };
      }
    }
  }
  if (!best) return null;
  const { km: _km, time: _time, rank: _rank, ...link } = best;
  return link;
}

export function resolveService(
  service: ThroughService,
  routeStations: RouteStations = routes,
  allServices: ThroughService[] = THROUGH_SERVICES,
): ResolvedService {
  const sections: ResolvedSection[] = [];
  for (const sec of service.sections) {
    const range = resolveSectionRange(sec, routeStations);
    if (range) sections.push({ route: sec.route, range });
  }
  const links = new Map<string, Link>();
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const a = sections[i];
      const b = sections[j];
      const sa = routeStations[a.route]!;
      const sb = routeStations[b.route]!;
      const shared = sa
        .slice(a.range[0], a.range[1] + 1)
        .filter(st => { const k = indexOf(sb, st); return k >= 0 && inRange(b, k); })
        .map(st => st.name);
      if (shared.length > 0) {
        links.set(`${i}>${j}`, { kind: 'junction', stations: shared });
        links.set(`${j}>${i}`, { kind: 'junction', stations: shared });
        continue;
      }
      const bridge = findBridge(service, a, b, routeStations, allServices);
      if (bridge) {
        links.set(`${i}>${j}`, bridge);
        links.set(`${j}>${i}`, {
          ...bridge, fromIndex: bridge.toIndex, toIndex: bridge.fromIndex, viaFrom: bridge.viaTo, viaTo: bridge.viaFrom,
        });
      }
    }
  }
  return { id: service.id, sections, links };
}

let cache: { services: ThroughService[]; routeStations: RouteStations; resolved: ResolvedService[] } | null = null;

/** 系統をすべて解決したもの（同じ入力なら使い回す） */
export function resolveServices(
  services: ThroughService[] = THROUGH_SERVICES,
  routeStations: RouteStations = routes,
): ResolvedService[] {
  if (cache && cache.services === services && cache.routeStations === routeStations) return cache.resolved;
  const resolved = services.map(s => resolveService(s, routeStations, services));
  cache = { services, routeStations, resolved };
  return resolved;
}

// ── 見つかった経路の乗り換えを直通に直す ──────────────────────────────

/** 経路の区間（routeFinder の RouteSegment のうち、ここで使うもの） */
export interface ThroughLeg {
  routeKey: RouteKey | 'walking';
  stations: Station[];
  isWalkingTransfer?: boolean;
}

/** 区間（の全駅）が系統のどの区間の中に収まっているか（区間の添字の一覧） */
function sectionsContaining(service: ResolvedService, leg: ThroughLeg, routeStations: RouteStations): number[] {
  if (leg.routeKey === 'walking' || leg.isWalkingTransfer || leg.stations.length === 0) return [];
  const stations = routeStations[leg.routeKey];
  if (!stations) return [];
  const first = indexOf(stations, leg.stations[0]);
  const last = indexOf(stations, leg.stations[leg.stations.length - 1]);
  if (first < 0 || last < 0) return [];
  return service.sections
    .map((sec, i) => (sec.route === leg.routeKey && inRange(sec, first) && inRange(sec, last) ? i : -1))
    .filter(i => i >= 0);
}

/** prev から next へ、系統 service の接続点でそのまま乗り継げるか */
function continuesIn(service: ResolvedService, prev: ThroughLeg, next: ThroughLeg, routeStations: RouteStations): boolean {
  const end = prev.stations[prev.stations.length - 1];
  const start = next.stations[0];
  if (!end || !start || !isSameStation(start, end)) return false;
  const from = sectionsContaining(service, prev, routeStations);
  const to = sectionsContaining(service, next, routeStations);
  for (const a of from) {
    for (const b of to) {
      const link = service.links.get(`${a}>${b}`);
      if (link?.kind === 'junction' && link.stations.includes(end.name)) return true;
    }
  }
  return false;
}

/**
 * 各区間が前の区間から直通（乗り換えなし）で続くか。
 * 返り値の i 番目が true なら、区間 i は区間 i-1 と同じ列車（0番目は常に false）。
 *
 * 連鎖は推論しない: 直通が続く間は同じ系統でなければならない
 * （江ノ島線→小田原線→千代田線は、代々木上原で乗り換えになる）。
 */
export function throughContinuations(
  legs: ThroughLeg[],
  services: ResolvedService[] = resolveServices(),
  routeStations: RouteStations = routes,
): boolean[] {
  const out = legs.map(() => false);
  let running: ResolvedService[] | null = null;
  for (let i = 1; i < legs.length; i++) {
    const candidates = services.filter(s => continuesIn(s, legs[i - 1], legs[i], routeStations));
    const carried: ResolvedService[] = running ? candidates.filter(s => running!.includes(s)) : candidates;
    if (carried.length > 0) {
      out[i] = true;
      running = carried;
    } else {
      running = null;
    }
  }
  return out;
}

// ── 1本で行ける経路を作る ─────────────────────────────────────────────

/** 直通の経路の1区間。through は前の区間から同じ列車で続くこと */
export interface ThroughTripLeg {
  routeKey: RouteKey;
  fromIndex: number;
  toIndex: number;
  through: boolean;
}

export interface ThroughTrip {
  serviceId: string;
  legs: ThroughTripLeg[];
  totalTime: number;
}

/** 組み合わせが爆発しないよう、1系統あたりに試す経路の上限 */
const MAX_PLANS_PER_SERVICE = 400;

/**
 * departure から arrival へ、直通列車1本（乗り換えなし）で行ける経路。
 * 系統ごとに最短の1件を返す。同じ路線だけで行ける場合（直通を使わない）は含めない。
 */
export function findThroughTrips(
  departure: Station,
  arrival: Station,
  services: ResolvedService[] = resolveServices(),
  routeStations: RouteStations = routes,
): ThroughTrip[] {
  const trips: ThroughTrip[] = [];
  for (const service of services) {
    const best = bestTripInService(service, departure, arrival, routeStations);
    if (best) trips.push(best);
  }
  return trips;
}

function bestTripInService(
  service: ResolvedService,
  departure: Station,
  arrival: Station,
  routeStations: RouteStations,
): ThroughTrip | null {
  const where = (st: Station) => service.sections
    .map((sec, i) => ({ i, idx: indexOf(routeStations[sec.route]!, st) }))
    .filter(({ i, idx }) => idx >= 0 && inRange(service.sections[i], idx));
  const starts = where(departure);
  const ends = where(arrival);
  if (starts.length === 0 || ends.length === 0) return null;

  let best: ThroughTrip | null = null;
  let tried = 0;

  const finish = (legs: ThroughTripLeg[]) => {
    const kept = legs.filter(l => l.fromIndex !== l.toIndex);
    if (kept.length < 2) return; // 1路線で行けるなら直通の経路ではない
    // 先頭の区間は乗車。それ以外は前から同じ列車で続く
    const normalized = kept.map((l, i) => ({ ...l, through: i > 0 }));
    if (revisits(normalized, routeStations)) return;
    const totalTime = normalized.reduce((t, l) => t + legTime(routeStations[l.routeKey]!, l.fromIndex, l.toIndex), 0);
    if (!best || totalTime < best.totalTime) best = { serviceId: service.id, legs: normalized, totalTime };
  };

  const walk = (sec: number, idx: number, legs: ThroughTripLeg[], seen: Set<number>) => {
    if (tried++ > MAX_PLANS_PER_SERVICE) return;
    const route = service.sections[sec].route;
    for (const end of ends) {
      if (end.i === sec && seen.size > 1) finish([...legs, { routeKey: route, fromIndex: idx, toIndex: end.idx, through: false }]);
    }
    service.sections.forEach((_, next) => {
      if (seen.has(next)) return;
      const link = service.links.get(`${sec}>${next}`);
      if (!link) return;
      const nextRoute = service.sections[next].route;
      const seenNext = new Set(seen).add(next);
      if (link.kind === 'junction') {
        for (const name of link.stations) {
          const here = routeStations[route]!.findIndex((s, k) => s.name === name && inRange(service.sections[sec], k));
          const there = routeStations[nextRoute]!.findIndex((s, k) => s.name === name && inRange(service.sections[next], k));
          if (here < 0 || there < 0) continue;
          walk(next, there, [...legs, { routeKey: route, fromIndex: idx, toIndex: here, through: false }], seenNext);
        }
      } else {
        walk(next, link.toIndex, [
          ...legs,
          { routeKey: route, fromIndex: idx, toIndex: link.fromIndex, through: false },
          { routeKey: link.via, fromIndex: link.viaFrom, toIndex: link.viaTo, through: true },
        ], seenNext);
      }
    });
  };

  for (const start of starts) walk(start.i, start.idx, [], new Set([start.i]));
  return best;
}

/**
 * 前の区間で通った駅をもう一度通る（引き返す）経路か。区間の境目の駅は数えない。
 * 1つの区間の中の重複は見ない（路線データに同じ駅が2回入っている所がある。
 * 学研都市線の津田・鴻池新田など）
 */
function revisits(legs: ThroughTripLeg[], routeStations: RouteStations): boolean {
  const seen = new Set<string>();
  for (const [i, leg] of legs.entries()) {
    const stations = routeStations[leg.routeKey]!;
    const lo = Math.min(leg.fromIndex, leg.toIndex);
    const hi = Math.max(leg.fromIndex, leg.toIndex);
    const names = new Set(stations.slice(lo, hi + 1).map(s => s.name));
    if (i > 0) names.delete(stations[leg.fromIndex].name);
    for (const n of names) if (seen.has(n)) return true;
    names.forEach(n => seen.add(n));
  }
  return false;
}
