import type { Station } from './yamanote';
import { jrUtsunomiyaLine } from './jr-kanto-additional';
import { jrTakasakiLine } from './jr-takasaki-line';
import { jrTokaidoMainLine } from './jr-tokaido-main-line';

/**
 * 湘南新宿ラインは2つの運行系統に分かれている（北と南の組み合わせは交差しない）。
 *   - 宇都宮線 ⇔ 横須賀線（宇都宮・小金井 〜 逗子・大船）
 *   - 高崎線 ⇔ 東海道線（高崎・籠原・前橋 〜 小田原・国府津・平塚）
 * 以前は大宮〜逗子の1本しか無く、藤沢・平塚など東海道線の駅に
 * 湘南新宿ラインが来ていることが地図から分からなかった。
 *
 * 大宮〜大船の共通区間はここで1回だけ持ち、宇都宮線・高崎線・東海道線の
 * 区間は各路線データの駅（座標・所要時間）をそのまま使う。座標を書き写すと
 * 片方だけ直して食い違うため。系統ごとの始発・行先は serviceSystems.ts。
 */
const shonanShinjukuCore: Station[] = [
  { name: '大宮', lat: 35.906435, lng: 139.624370, timeToNext: 5 },
  { name: '浦和', lat: 35.858565, lng: 139.657145, timeToNext: 8 },
  { name: '赤羽', lat: 35.777524, lng: 139.721260, timeToNext: 8 },
  { name: '池袋', lat: 35.727660, lng: 139.710830, timeToNext: 5 },
  { name: '新宿', lat: 35.690110, lng: 139.700610, timeToNext: 4 },
  { name: '渋谷', lat: 35.659450, lng: 139.701035, timeToNext: 2 },
  { name: '恵比寿', lat: 35.646680, lng: 139.710125, timeToNext: 3 },
  { name: '大崎', lat: 35.619945, lng: 139.728245, timeToNext: 4 },
  { name: '西大井', lat: 35.601766, lng: 139.721636, timeToNext: 5 },
  { name: '武蔵小杉', lat: 35.574875, lng: 139.663382, timeToNext: 3 },
  { name: '新川崎', lat: 35.551588, lng: 139.671604, timeToNext: 10 },
  { name: '横浜', lat: 35.465407, lng: 139.622253, timeToNext: 3 },
  { name: '保土ケ谷', lat: 35.447220, lng: 139.600370, timeToNext: 3 },
  { name: '東戸塚', lat: 35.430008, lng: 139.556504, timeToNext: 5 },
  { name: '戸塚', lat: 35.400099, lng: 139.534413, timeToNext: 6 },
  { name: '大船', lat: 35.352520, lng: 139.531393, timeToNext: 5 },
  { name: '北鎌倉', lat: 35.337940, lng: 139.544565, timeToNext: 4 },
  { name: '鎌倉', lat: 35.319271, lng: 139.550427, timeToNext: 4 },
  { name: '逗子', lat: 35.2974702, lng: 139.578421 },
];

const indexOf = (stations: Station[], name: string): number => {
  const i = stations.findIndex(s => s.name === name);
  if (i < 0) throw new Error(`湘南新宿ラインの組み立て: ${name} が見つからない`);
  return i;
};

/**
 * 駅列 from〜to を切り出す。from が to より後ろなら逆順にし、
 * timeToNext（次の駅までの分）も逆向きに付け替える。
 * 末尾の駅の timeToNext は、つなぐ相手側で決めるので外す。
 */
function sliceStations(stations: Station[], from: string, to: string): Station[] {
  const a = indexOf(stations, from);
  const b = indexOf(stations, to);
  if (a <= b) {
    const seg = stations.slice(a, b + 1);
    return seg.map((s, i) => (i === seg.length - 1 ? { ...s, timeToNext: undefined } : s));
  }
  const seg = stations.slice(b, a + 1);
  return seg
    .slice()
    .reverse()
    .map((s, i) => ({ ...s, timeToNext: i < seg.length - 1 ? seg[seg.length - 2 - i].timeToNext : undefined }));
}

/** 前の区間の末尾駅と次の区間の先頭駅が同じ駅なら1つにまとめてつなぐ */
function joinAt(head: Station[], tail: Station[]): Station[] {
  const last = head[head.length - 1];
  const [first, ...rest] = tail;
  return [...head.slice(0, -1), { ...last, timeToNext: first.timeToNext }, ...rest];
}

/** 宇都宮線 ⇔ 横須賀線の系統（宇都宮〜大宮〜新宿〜大船〜逗子） */
export const jrShonanShinjukuLine: Station[] = joinAt(
  sliceStations(jrUtsunomiyaLine, '宇都宮', '大宮'),
  shonanShinjukuCore,
);

/** 高崎線 ⇔ 東海道線の系統（高崎〜大宮〜新宿〜大船〜小田原） */
export const jrShonanShinjukuTakasakiTokaido: Station[] = joinAt(
  joinAt(
    sliceStations(jrTakasakiLine, '高崎', '大宮'),
    sliceStations(shonanShinjukuCore, '大宮', '大船'),
  ),
  sliceStations(jrTokaidoMainLine, '大船', '小田原'),
);
