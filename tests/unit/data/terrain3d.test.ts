/**
 * 立体（標高）表示のデータ（public/data/terrain3d-lines.json）と計算（utils/terrain3d.ts）のテスト。
 *
 * データは scripts/line-geometry/build-terrain3d.mts が data/kanto-line-geometry-2026-10/ から作る。
 * 路線との対応は名前ではなく駅の位置で決めているので、その対応が正しいか（駅が線形の近くにあるか）を確かめる。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { routes, type RouteKey } from '../../../src/data/routes';
import {
  selectTerrainRoutes, frameFor, toLocal, elevationNear, nearestOnPaths,
  parseGround, groundElevationAt, groundWindow, groundCellCenter, GROUND_WATER,
  type Terrain3DGroundMeta, type Terrain3DData,
} from '../../../src/utils/terrain3d';

const data = JSON.parse(readFileSync(join(__dirname, '../../../public/data/terrain3d-lines.json'), 'utf8')) as Terrain3DData;

describe('立体表示のデータ', () => {
  it('高さは地面の標高であることと、線形・標高の出典を持つ', () => {
    expect(data.meta.heightMeaning).toBe('terrain');
    expect(data.meta.heightReference).toBeTruthy();
    expect(data.meta.lineSource.license).toContain('ODbL');
    expect(data.meta.elevationSource.sourceName).toContain('Copernicus');
  });

  it('路線は実在するキーで、重複しない', () => {
    const keys = data.routes.map(r => r.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(routes[k], k).toBeDefined();
    expect(keys.length).toBeGreaterThanOrEqual(30);
  });

  it('すべての点が首都圏の範囲にあり、標高は数値（推測で埋めた値・欠損を描かない）', () => {
    for (const r of data.routes) for (const p of r.paths) {
      expect(p.length, r.key).toBeGreaterThanOrEqual(2);
      for (const [lat, lng, ele] of p) {
        expect(lat > 34 && lat < 37 && lng > 138 && lng < 142, `${r.key} ${lat},${lng}`).toBe(true);
        expect(Number.isFinite(ele), r.key).toBe(true);
        expect(ele > -50 && ele < 2000, `${r.key} ${ele}`).toBe(true);
      }
    }
  });

  it('対応付けた路線の駅は、9割以上が線形の近く（300m以内）にある', () => {
    for (const r of data.routes) {
      const stations = routes[r.key]!;
      // 間引いた線形は直線区間の頂点が少ないので、頂点ではなく線分までの距離で見る
      const near = stations.filter(s => nearestOnPaths([r], s.lat, s.lng)!.km <= 0.3);
      expect(near.length / stations.length, r.key).toBeGreaterThanOrEqual(0.9);
    }
  });

  it('湘南新宿ラインの2系統を取り違えない（高崎線・東海道線系統は小田原まで、宇都宮線・横須賀線系統は逗子まで）', () => {
    const takasakiTokaido = data.routes.find(r => r.key === 'jrShonanShinjukuTakasakiTokaido');
    const utsunomiyaYokosuka = data.routes.find(r => r.key === 'jrShonanShinjukuLine');
    const odawara = routes.jrShonanShinjukuTakasakiTokaido!.find(s => s.name === '小田原');
    if (takasakiTokaido && odawara) {
      expect(nearestOnPaths([takasakiTokaido], odawara.lat, odawara.lng)!.km).toBeLessThan(0.3);
    }
    if (utsunomiyaYokosuka && odawara) {
      expect(nearestOnPaths([utsunomiyaYokosuka], odawara.lat, odawara.lng)!.km).toBeGreaterThan(0.3);
    }
  });
});

describe('立体表示の計算', () => {
  it('表示中の路線のうち、データのある路線だけを表示中の順で返す', () => {
    const [a, b] = data.routes;
    const picked = selectTerrainRoutes(data, [b.key, 'nonexistent' as RouteKey, a.key]);
    expect(picked.map(r => r.key)).toEqual([b.key, a.key]);
  });

  it('原点は範囲の中心、東が +x・北が -z、高さは km×強調倍率', () => {
    const r = data.routes.find(x => x.key === 'yamanote')!;
    const frame = frameFor([r])!;
    const [x0, y0, z0] = toLocal(frame, frame.lat0, frame.lng0, 0, 10);
    expect([x0, y0, z0].map(v => Math.abs(v))).toEqual([0, 0, 0]);
    const [xE] = toLocal(frame, frame.lat0, frame.lng0 + 0.01, 0, 10);
    const [, , zN] = toLocal(frame, frame.lat0 + 0.01, frame.lng0, 0, 10);
    expect(xE).toBeGreaterThan(0);
    expect(zN).toBeLessThan(0);
    expect(toLocal(frame, frame.lat0, frame.lng0, 100, 10)[1]).toBeCloseTo(1); // 100m × 10倍 = 1km
  });

  it('駅の印の高さは、近くの線形の標高（近くに線形が無ければ null）', () => {
    const r = data.routes.find(x => x.key === 'yamanote')!;
    const [lat, lng, ele] = r.paths[0][0];
    expect(elevationNear([r], lat, lng)).toBe(ele);
    expect(elevationNear([r], 30, 130)).toBeNull();
  });

  it('線分の途中では、両端の標高を距離で按分した高さになる', () => {
    const route = { key: 'yamanote' as RouteKey, osmRelId: 0, osmName: '', paths: [[[35, 139, 10], [35, 139.01, 30]] as [number, number, number][]] };
    const mid = nearestOnPaths([route], 35, 139.005)!;
    expect(mid.km).toBeCloseTo(0, 5);
    expect(mid.elevationM).toBeCloseTo(20);
  });
});

const groundMeta = JSON.parse(readFileSync(join(__dirname, '../../../public/data/terrain3d-ground.json'), 'utf8')) as Terrain3DGroundMeta;
const groundBin = readFileSync(join(__dirname, '../../../public/data/terrain3d-ground.bin'));
const ground = parseGround(groundMeta, groundBin.buffer.slice(groundBin.byteOffset, groundBin.byteOffset + groundBin.byteLength));

describe('立体表示の地面', () => {
  it('線形と同じ Copernicus DEM で、高さの意味は地面', () => {
    expect(groundMeta.heightMeaning).toBe('terrain');
    expect(groundMeta.source.sourceName).toContain('Copernicus');
    expect(groundMeta.source.license).toContain('COPERNICUS');
    expect(data.meta.elevationSource.sourceName).toContain('Copernicus');
  });

  it('立体表示のすべての線形が格子の中に入る', () => {
    for (const r of data.routes) for (const p of r.paths) for (const [lat, lng] of p) {
      expect(groundElevationAt(ground, lat, lng), `${r.key} ${lat},${lng}`).not.toBeNull();
    }
  });

  it('標高は首都圏としてありうる範囲で、海は海として入っている', () => {
    let min = Infinity, max = -Infinity;
    for (const v of ground.elevation) { min = Math.min(min, v); max = Math.max(max, v); }
    expect(min).toBeGreaterThan(-50);
    expect(max).toBeLessThan(2600);
    const cell = (lat: number, lng: number) => {
      const r = Math.floor((groundMeta.latMax - lat) / groundMeta.stepDeg);
      const c = Math.floor((lng - groundMeta.lngMin) / groundMeta.stepDeg);
      return r * groundMeta.cols + c;
    };
    expect(ground.water[cell(35.55, 139.9)]).toBe(GROUND_WATER.ocean); // 東京湾
    expect(ground.water[cell(35.632, 139.27)]).toBe(GROUND_WATER.land); // 高尾
    expect(ground.elevation[cell(35.632, 139.27)]).toBeGreaterThan(100);
  });

  it('線形の標高と、同じ地点の地面（約500mの平均）は大きくずれない', () => {
    const diffs: number[] = [];
    for (const r of data.routes) for (const p of r.paths) for (const [lat, lng, ele] of p) {
      diffs.push(Math.abs(groundElevationAt(ground, lat, lng)! - ele));
    }
    diffs.sort((a, b) => a - b);
    expect(diffs[Math.floor(diffs.length / 2)]).toBeLessThan(10); // 中央値
  });
});

describe('地面の計算', () => {
  const meta = { latMax: 36, lngMin: 139, stepDeg: 0.5, rows: 2, cols: 2 } as Terrain3DGroundMeta;
  const buf = new ArrayBuffer(2 * 2 * 3);
  const v = new DataView(buf);
  [0, 100, 200, 300].forEach((e, i) => v.setInt16(i * 2, e, true));
  const g = parseGround(meta, buf);

  it('大きさが合わないデータは読まない', () => {
    expect(() => parseGround(meta, new ArrayBuffer(5))).toThrow();
  });

  it('格子の中心どうしの間は双一次補間、格子の外は null', () => {
    const [latA, lngA] = groundCellCenter(meta, 0, 0);
    const [latD, lngD] = groundCellCenter(meta, 1, 1);
    expect(groundElevationAt(g, latA, lngA)).toBeCloseTo(0);
    expect(groundElevationAt(g, latD, lngD)).toBeCloseTo(300);
    expect(groundElevationAt(g, (latA + latD) / 2, (lngA + lngD) / 2)).toBeCloseTo(150);
    expect(groundElevationAt(g, 40, 139.5)).toBeNull();
  });

  it('路線の範囲にかかる格子だけを切り出す', () => {
    const route = { key: 'yamanote' as RouteKey, osmRelId: 0, osmName: '', paths: [[[35.75, 139.25, 0], [35.6, 139.4, 0]] as [number, number, number][]] };
    expect(groundWindow(g, [route], 0)).toEqual({ r0: 0, r1: 1, c0: 0, c1: 1 });
  });
});
