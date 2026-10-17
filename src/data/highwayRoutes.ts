/** Shared transport layer definitions. Demo coverage is deliberately limited. */
import { routeColors } from './routes';
export const HIGHWAY_SOURCE = {
  endpoint: 'https://overpass.kumi.systems/api/interpreter',
  bounds: [35.35,138.85,36.25,140.10] as const,
  timeoutSeconds: 90,
  source: 'OpenStreetMap contributors (ODbL)',
  sourceUrl: 'https://www.openstreetmap.org/copyright',
} as const;
export const HIGHWAY_ROUTES = [
  {id:'tomei',name:'東名高速道路',aliases:['東名高速道路','東名高速'],color:routeColors.jrTokaidoMainLine},
  {id:'chuo',name:'中央自動車道',aliases:['中央自動車道','中央道'],color:routeColors.chuo},
  {id:'kanetsu',name:'関越自動車道',aliases:['関越自動車道','関越道'],color:routeColors.jrTakasakiLine},
] as const;
export function highwayQuery() {
  const {bounds,timeoutSeconds}=HIGHWAY_SOURCE;
  const bbox=bounds.join(',');
  const names=HIGHWAY_ROUTES.flatMap(r=>r.aliases).join('|');
  return `[out:json][timeout:${timeoutSeconds}];(way["highway"="motorway"]["name"~"${names}"](${bbox});node["highway"="motorway_junction"](${bbox}););out geom;`;
}
