import type { Station } from './yamanote';

// 西武多摩川線: 武蔵境〜是政
export const seibuTamagawaLine: Station[] = [
  { name: "武蔵境",   lat: 35.703655, lng: 139.545135, timeToNext: 4 },
  { name: "新小金井", lat: 35.689310, lng: 139.530930, timeToNext: 3 },
  { name: "多磨",     lat: 35.675870, lng: 139.527400, timeToNext: 3 },
  { name: "白糸台",   lat: 35.660450, lng: 139.521700, timeToNext: 3 },
  { name: "競艇場前", lat: 35.651470, lng: 139.514480, timeToNext: 2 },
  { name: "是政",     lat: 35.645450, lng: 139.508630, timeToNext: 0 },
];
