/**
 * 表示路線をURLで共有する機能のテスト。
 *
 * - 全490路線が一意な短い略称コードを持つこと
 * - エンコード/デコードの往復が一致すること
 * - 0件・上限超え（15件超）はURLに書き出さないこと
 * - 知らないコードは無視して壊れないこと（路線が改名/削除された古いURL対策）
 *
 * `window.location`/`history` を使うため jsdom 環境で実行する。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { routes, type RouteKey } from '../../../src/data/routes';
import {
  VISIBLE_ROUTES_PARAM,
  MAX_URL_VISIBLE_ROUTES,
  getRouteCode,
  getRouteKeyFromCode,
  encodeVisibleRoutesParam,
  decodeVisibleRoutesParam,
  getInitialVisibleRoutesFromUrl,
  syncVisibleRoutesToUrl,
} from '../../../src/utils/routeUrlCodes';

const allKeys = Object.keys(routes) as RouteKey[];

describe('路線キー ⇔ 略称コード', () => {
  it('全路線が略称コードを持つ', () => {
    for (const key of allKeys) {
      expect(getRouteCode(key)).toBeTruthy();
    }
  });

  it('略称コードは全路線で重複しない', () => {
    const codes = allKeys.map(key => getRouteCode(key));
    expect(new Set(codes).size).toBe(allKeys.length);
  });

  it('略称コードから元の路線キーへ戻せる（往復一致）', () => {
    for (const key of allKeys) {
      const code = getRouteCode(key)!;
      expect(getRouteKeyFromCode(code)).toBe(key);
    }
  });

  it('略称コードは短い（10文字未満）', () => {
    for (const key of allKeys) {
      expect(getRouteCode(key)!.length).toBeLessThan(10);
    }
  });

  it('実データ例: keihinTohoku, yamanote, chuo は異なるコードを持つ', () => {
    const a = getRouteCode('keihinTohoku' as RouteKey);
    const b = getRouteCode('yamanote' as RouteKey);
    const c = getRouteCode('chuo' as RouteKey);
    expect(new Set([a, b, c]).size).toBe(3);
  });
});

describe('encodeVisibleRoutesParam / decodeVisibleRoutesParam', () => {
  it('少数路線ならエンコードでき、デコードすると同じ集合に戻る', () => {
    const sample = new Set<RouteKey>(allKeys.slice(0, 5));
    const encoded = encodeVisibleRoutesParam(sample);
    expect(encoded).toBeTruthy();
    const decoded = decodeVisibleRoutesParam(encoded);
    expect(decoded).toEqual(sample);
  });

  it('0件のときはnull（URLに書き出さない）', () => {
    expect(encodeVisibleRoutesParam(new Set())).toBeNull();
  });

  it(`上限（${MAX_URL_VISIBLE_ROUTES}件）を超えるときはnull（無理に表示しない）`, () => {
    const many = new Set<RouteKey>(allKeys.slice(0, MAX_URL_VISIBLE_ROUTES + 1));
    expect(encodeVisibleRoutesParam(many)).toBeNull();
  });

  it(`上限ぴったり（${MAX_URL_VISIBLE_ROUTES}件）はエンコードできる`, () => {
    const exact = new Set<RouteKey>(allKeys.slice(0, MAX_URL_VISIBLE_ROUTES));
    expect(encodeVisibleRoutesParam(exact)).toBeTruthy();
  });

  it('空文字列・nullはデコードでnullになる', () => {
    expect(decodeVisibleRoutesParam(null)).toBeNull();
    expect(decodeVisibleRoutesParam('')).toBeNull();
  });

  it('知らないコードが混ざっていても無視して壊れない', () => {
    const validCode = getRouteCode(allKeys[0])!;
    const decoded = decodeVisibleRoutesParam(`${validCode},zzz999,unknown`);
    expect(decoded).toEqual(new Set([allKeys[0]]));
  });

  it('全部知らないコードのときはnull', () => {
    expect(decodeVisibleRoutesParam('zzz999,unknown')).toBeNull();
  });
});

describe('URLとの同期（getInitialVisibleRoutesFromUrl / syncVisibleRoutesToUrl）', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('URLにroutesパラメータが無ければnull', () => {
    expect(getInitialVisibleRoutesFromUrl()).toBeNull();
  });

  it('URLのroutesパラメータから表示路線を復元できる', () => {
    const sample = new Set<RouteKey>(allKeys.slice(10, 13));
    const encoded = encodeVisibleRoutesParam(sample)!;
    window.history.replaceState({}, '', `/?${VISIBLE_ROUTES_PARAM}=${encoded}`);
    expect(getInitialVisibleRoutesFromUrl()).toEqual(sample);
  });

  it('syncVisibleRoutesToUrlで書き込んだ内容をgetInitialVisibleRoutesFromUrlで読み戻せる', () => {
    const sample = new Set<RouteKey>(allKeys.slice(20, 24));
    syncVisibleRoutesToUrl(sample);
    expect(window.location.search).toContain(VISIBLE_ROUTES_PARAM);
    expect(getInitialVisibleRoutesFromUrl()).toEqual(sample);
  });

  it('0件で同期するとURLからroutesパラメータが消える', () => {
    syncVisibleRoutesToUrl(new Set(allKeys.slice(0, 2)));
    expect(window.location.search).toContain(VISIBLE_ROUTES_PARAM);
    syncVisibleRoutesToUrl(new Set());
    expect(window.location.search).not.toContain(VISIBLE_ROUTES_PARAM);
  });

  it('他のクエリパラメータ（言語設定など）は保持したまま routes だけ書き換える', () => {
    window.history.replaceState({}, '', '/?lang=english');
    syncVisibleRoutesToUrl(new Set(allKeys.slice(0, 2)));
    expect(window.location.search).toContain('lang=english');
    expect(window.location.search).toContain(VISIBLE_ROUTES_PARAM);
  });
});
