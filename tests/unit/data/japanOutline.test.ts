/**
 * 日本の輪郭（JAPAN_OUTLINE）と実際の駅座標の整合性テスト
 *
 * 過去に起きた問題:
 * - 輪郭は面積の大きい上位5島のリングだけを採用していたため、
 *   お台場・豊洲などの埋立地（りんかい線・ゆりかもめ・東京モノレールが
 *   通る）が独立した小さなリングとして切り捨てられ、路線が輪郭の外
 *   （海側）に見えていた
 * - 修正後、全国の実データ（全路線・約7,900駅）に対して「輪郭の外」が
 *   0件であることを確認したが、以後の路線データ追加で再発しないよう
 *   このテストで固定する
 */

import { describe, it, expect } from 'vitest';
import { routes } from '../../../src/data/routes';
import { JAPAN_OUTLINE } from '../../../src/data/japanOutline';

// レイキャスティング法による point-in-polygon 判定
function pointInPolygon(lat: number, lng: number, poly: readonly [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [latI, lngI] = poly[i];
    const [latJ, lngJ] = poly[j];
    const intersect =
      lngI > lng !== lngJ > lng &&
      lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI;
    if (intersect) inside = !inside;
  }
  return inside;
}

function insideAnyIsland(lat: number, lng: number): boolean {
  return Object.values(JAPAN_OUTLINE).some((ring) => pointInPolygon(lat, lng, ring));
}

describe('JAPAN_OUTLINE', () => {
  it('主要5島を含んでいる', () => {
    expect(JAPAN_OUTLINE.honshu).toBeDefined();
    expect(JAPAN_OUTLINE.hokkaido).toBeDefined();
    expect(JAPAN_OUTLINE.kyushu).toBeDefined();
    expect(JAPAN_OUTLINE.shikoku).toBeDefined();
    expect(JAPAN_OUTLINE.okinawa).toBeDefined();
  });

  it('全路線の全駅が、いずれかの島のポリゴンの内側にある（＝路線が海側にはみ出さない）', () => {
    const outside: string[] = [];

    for (const [routeKey, stations] of Object.entries(routes)) {
      for (const s of stations) {
        if (!insideAnyIsland(s.lat, s.lng)) {
          outside.push(`${routeKey}: ${s.name} (${s.lat}, ${s.lng})`);
        }
      }
    }

    expect(outside).toEqual([]);
  });
});
