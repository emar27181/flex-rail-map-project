/**
 * 表示中の路線をURLで共有できるようにするための、路線キー⇔短い略称コードの変換。
 *
 * 「URLを共有したら、その路線がONの状態で開ける」ようにしたい。
 * ただし490路線あるため、正式なキー名（`keihinTohoku`等）をそのまま並べると
 * URLが長くなりすぎる。各路線キーから4〜6文字程度の略称コードを機械的に
 * 生成し（例: `keihinTohoku` → `keitoh`）、それをURLの `routes` パラメータに
 * カンマ区切りで並べる。
 *
 * 「人間にも分かりやすく、ただ長くなりすぎないように」との指摘を受け、
 * 以前は各単語の頭文字1文字だけ（`keihinTohoku` → `kt`）だったのを、
 * 各単語の先頭3〜4文字に増やして見た目で路線名を推測しやすくした。
 * また「Line」「Main」のような路線名の識別に寄与しない語は、コード生成前に
 * 除外する（以前はこれらの頭文字がコードの1枠を無駄に消費し、
 * 例えば`ginzaLine`が`gl`のように本来の路線名が分かりにくくなっていた）。
 *
 * 略称コードは上記ルールで機械的に作り、衝突したら数字を足して一意にする
 * （キー名をアルファベット順に処理するため、路線の追加順序が変わっても
 * コードは変わらない。ただし、既存のキーと同じ略称になる新しいキーが
 * 「間に」追加された場合は、それより後ろの衝突コードがずれる可能性がある
 * ＝共有URLの互換性は将来にわたって完全には保証されない。壊れたコードは
 * 黙って無視する設計にしてあるので、古いURLを開いても路線が一部復元
 * されないだけで、エラーにはならない）。
 *
 * 選択路線数が多すぎるとURLも長くなるため、上限（15）を超える場合は
 * URLに書き出さない（＝無理に表示しない）。
 */
import { routes, type RouteKey } from '../data/routes';

export const VISIBLE_ROUTES_PARAM = 'routes';
export const MAX_URL_VISIBLE_ROUTES = 15;

/** コード生成上、路線名の識別に寄与しない語（頭文字だけ拾っても分かりやすさに繋がらない） */
const GENERIC_WORDS = new Set(['line', 'main']);

/** camelCaseの路線キーを単語に分割する（例: "keihinTohoku" → ["keihin","Tohoku"]） */
const splitWords = (key: string): string[] => key.match(/[A-Z]?[a-z0-9]+/g) || [key];

/**
 * コード生成に使う単語列。「Line」等の識別に寄与しない語を除く
 * （全単語が該当語だった場合のみ、除外前の単語列にフォールバックする）。
 */
const meaningfulWords = (key: string): string[] => {
  const words = splitWords(key);
  const filtered = words.filter(w => !GENERIC_WORDS.has(w.toLowerCase()));
  return filtered.length > 0 ? filtered : words;
};

/**
 * 単語の先頭3〜4文字から人間にも読めるベースコードを作る。
 * 単語が1つだけなら先頭4文字（例: "yamanote" → "yama"）、
 * 複数あれば先頭2語をそれぞれ先頭3文字ずつ（例: ["keihin","Tohoku"] → "keitoh"）。
 */
const baseCode = (key: string): string => {
  const words = meaningfulWords(key);
  if (words.length === 1) {
    return words[0].slice(0, 4).toLowerCase();
  }
  return words.slice(0, 2).map(w => w.slice(0, 3).toLowerCase()).join('');
};

const buildCodeMaps = (): { byKey: Record<string, string>; byCode: Record<string, string> } => {
  const byKey: Record<string, string> = {};
  const byCode: Record<string, string> = {};
  const sortedKeys = (Object.keys(routes) as RouteKey[]).slice().sort();
  for (const key of sortedKeys) {
    const base = baseCode(key) || 'r';
    let code = base;
    let suffix = 2;
    while (byCode[code]) {
      code = `${base}${suffix}`;
      suffix++;
    }
    byKey[key] = code;
    byCode[code] = key;
  }
  return { byKey, byCode };
};

const { byKey: ROUTE_CODE_BY_KEY, byCode: ROUTE_KEY_BY_CODE } = buildCodeMaps();

export const getRouteCode = (routeKey: RouteKey): string | undefined => ROUTE_CODE_BY_KEY[routeKey];

export const getRouteKeyFromCode = (code: string): RouteKey | undefined =>
  ROUTE_KEY_BY_CODE[code] as RouteKey | undefined;

/**
 * 表示中の路線をURLパラメータ用の文字列へ変換する。
 * 0件、または上限（15件）を超える場合は書き出さない（null）。
 */
export const encodeVisibleRoutesParam = (visibleRoutes: ReadonlySet<RouteKey>): string | null => {
  if (visibleRoutes.size === 0 || visibleRoutes.size > MAX_URL_VISIBLE_ROUTES) return null;
  const codes = Array.from(visibleRoutes)
    .map(key => ROUTE_CODE_BY_KEY[key])
    .filter((code): code is string => !!code);
  if (codes.length === 0) return null;
  return codes.join(',');
};

/**
 * URLパラメータの文字列から表示路線の集合を復元する。
 * 知らないコード（古いURLで路線が改名された場合など）は黙って無視する。
 * 有効な路線が1つも無ければ null（＝URL指定なしと同じ扱い）。
 */
export const decodeVisibleRoutesParam = (param: string | null | undefined): Set<RouteKey> | null => {
  if (!param) return null;
  const codes = param.split(',').map(c => c.trim()).filter(Boolean).slice(0, MAX_URL_VISIBLE_ROUTES);
  const keys = codes
    .map(code => ROUTE_KEY_BY_CODE[code])
    .filter((key): key is string => !!key) as RouteKey[];
  return keys.length > 0 ? new Set(keys) : null;
};

/** 初回マウント時にURLから表示路線を読み取る */
export const getInitialVisibleRoutesFromUrl = (): Set<RouteKey> | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return decodeVisibleRoutesParam(params.get(VISIBLE_ROUTES_PARAM));
  } catch {
    return null;
  }
};

/**
 * 現在の表示路線をURLへ反映する（`history.replaceState`、履歴は増やさない）。
 * 0件または上限超えのときはパラメータ自体を消す。
 */
export const syncVisibleRoutesToUrl = (visibleRoutes: ReadonlySet<RouteKey>): void => {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    const encoded = encodeVisibleRoutesParam(visibleRoutes);
    if (encoded) {
      url.searchParams.set(VISIBLE_ROUTES_PARAM, encoded);
    } else {
      url.searchParams.delete(VISIBLE_ROUTES_PARAM);
    }
    if (url.search !== window.location.search) {
      window.history.replaceState(window.history.state, '', url);
    }
  } catch {
    // URL操作に失敗しても表示は続ける
  }
};
