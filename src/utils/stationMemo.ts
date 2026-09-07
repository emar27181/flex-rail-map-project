/**
 * 「誰の最寄り駅がどこか」のメモ。
 *
 * 待ち合わせや幹事をするとき、参加者それぞれの最寄り駅を覚えておいて
 * 「全員が乗れる路線はどれか」を知りたい、という用途のための機能。
 *
 * 保存先はブラウザの localStorage のみ。人の名前を扱うので、
 * 外部に送らず端末の中だけに置く。
 */
import { routes } from '../data/routes';
import type { RouteKey } from '../data/routes';

export const STATION_MEMO_KEY = 'frm-station-memos';

export interface StationMemo {
  id: string;
  /** 人の名前・呼び名 */
  name: string;
  /** 最寄り駅名（路線データ上の駅名と一致していれば路線を引ける） */
  stationName: string;
  /** 「会社の同期」「サークル」などの自由記入 */
  note?: string;
  /** 並び順を安定させるための登録時刻 */
  createdAt: number;
}

/** 入力途中の値。id と createdAt は保存側で付ける */
export type StationMemoDraft = Pick<StationMemo, 'name' | 'stationName'> &
  Partial<Pick<StationMemo, 'note'>>;

// ── 駅名 → 路線キー ────────────────────────────────────────────────

let stationRouteCache: Map<string, RouteKey[]> | null = null;

/**
 * 駅名から、その駅を通る路線キーを引く。
 *
 * 全路線を毎回なめると 490路線 × 6000駅 になるため、初回に索引を作る
 * （路線データは静的なので作り直す必要がない）。
 */
export function routeKeysForStation(stationName: string): RouteKey[] {
  if (!stationRouteCache) {
    stationRouteCache = new Map();
    (Object.entries(routes) as Array<[RouteKey, Array<{ name: string }>]>)
      .forEach(([routeKey, stationList]) => {
        stationList.forEach(station => {
          const list = stationRouteCache!.get(station.name);
          if (list) {
            // 同じ路線に同名の駅が複数回現れても1回だけ数える
            if (!list.includes(routeKey)) list.push(routeKey);
          } else {
            stationRouteCache!.set(station.name, [routeKey]);
          }
        });
      });
  }
  return stationRouteCache.get(stationName) ?? [];
}

/** データに無い駅名が登録されると路線が引けないので、呼び出し側で警告するために使う */
export function isKnownStation(stationName: string): boolean {
  return routeKeysForStation(stationName).length > 0;
}

// ── 保存 ──────────────────────────────────────────────────────────

const isMemo = (value: unknown): value is StationMemo => {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return typeof m.id === 'string'
    && typeof m.name === 'string'
    && typeof m.stationName === 'string'
    && typeof m.createdAt === 'number';
};

/**
 * 保存済みのメモを読む。
 * 壊れた保存値で画面が真っ白になるより、空で立ち上がるほうがよいので
 * 例外は握りつぶし、形の合わない要素は落とす。
 */
export function loadMemos(): StationMemo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STATION_MEMO_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMemo);
  } catch {
    return [];
  }
}

export function saveMemos(memos: StationMemo[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STATION_MEMO_KEY, JSON.stringify(memos));
  } catch {
    // 保存できなくても操作は続けられるようにする
  }
}

const newId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // randomUUID が無い環境向けに下のフォールバックへ落ちる
  }
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

/** 追加した新しい配列を返す（元の配列は変更しない） */
export function addMemo(memos: StationMemo[], draft: StationMemoDraft): StationMemo[] {
  const name = draft.name.trim();
  const stationName = draft.stationName.trim();
  if (!name || !stationName) return memos;
  const note = draft.note?.trim();
  return [...memos, {
    id: newId(),
    name,
    stationName,
    ...(note ? { note } : {}),
    createdAt: Date.now(),
  }];
}

export function removeMemo(memos: StationMemo[], id: string): StationMemo[] {
  return memos.filter(m => m.id !== id);
}

export function updateMemo(
  memos: StationMemo[],
  id: string,
  patch: Partial<StationMemoDraft>,
): StationMemo[] {
  return memos.map(m => {
    if (m.id !== id) return m;
    const next = { ...m };
    if (patch.name !== undefined && patch.name.trim()) next.name = patch.name.trim();
    if (patch.stationName !== undefined && patch.stationName.trim()) {
      next.stationName = patch.stationName.trim();
    }
    if (patch.note !== undefined) {
      const note = patch.note.trim();
      if (note) next.note = note;
      else delete next.note;
    }
    return next;
  });
}

// ── 検索・絞り込み ─────────────────────────────────────────────────

/**
 * 名前・駅名・メモ・路線名のどれかに当たれば一致とみなす。
 *
 * 路線名も見るのは「山手線の人」を引きたいことがあるため。
 * 表示言語によって路線名が変わるので、ラベルは呼び出し側から渡してもらう。
 */
export function matchesQuery(
  memo: StationMemo,
  query: string,
  routeLabels: string[] = [],
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [memo.name, memo.stationName, memo.note ?? '', ...routeLabels];
  return haystack.some(text => text.toLowerCase().includes(q));
}

export function filterMemos(
  memos: StationMemo[],
  query: string,
  routeLabelsOf: (memo: StationMemo) => string[] = () => [],
): StationMemo[] {
  if (!query.trim()) return memos;
  return memos.filter(m => matchesQuery(m, query, routeLabelsOf(m)));
}

// ── 共通の路線 ────────────────────────────────────────────────────

export interface SharedRoute {
  routeKey: RouteKey;
  /** この路線が最寄り駅を通る人数 */
  count: number;
  /** その人たちの id（誰が乗れるのかを出すため） */
  memoIds: string[];
}

export interface SharedRouteSummary {
  /** 対象にした人数 */
  total: number;
  /** 人数の多い順。同数なら路線キーの並び（＝路線データの定義順）を保つ */
  routes: SharedRoute[];
  /** 全員の最寄り駅を通る路線だけ */
  everyone: RouteKey[];
}

/**
 * 対象の人たちの最寄り駅を通る路線を、人数の多い順にまとめる。
 *
 * 「全員が乗れる路線」だけを出すと、住んでいる場所が離れていると
 * ほぼ必ず空になって何も分からない。そこで人数付きの一覧にし、
 * 全員ぶんに当たったものを everyone として別に取り出す。
 */
export function summarizeSharedRoutes(memos: StationMemo[]): SharedRouteSummary {
  const byRoute = new Map<RouteKey, string[]>();
  const order: RouteKey[] = [];

  memos.forEach(memo => {
    routeKeysForStation(memo.stationName).forEach(routeKey => {
      const ids = byRoute.get(routeKey);
      if (ids) {
        if (!ids.includes(memo.id)) ids.push(memo.id);
      } else {
        byRoute.set(routeKey, [memo.id]);
        order.push(routeKey);
      }
    });
  });

  const routeList: SharedRoute[] = order.map(routeKey => ({
    routeKey,
    count: byRoute.get(routeKey)!.length,
    memoIds: byRoute.get(routeKey)!,
  }));

  // 人数の多い順。同数のときは最初に現れた順を保つ（安定ソート）
  routeList.sort((a, b) => b.count - a.count);

  return {
    total: memos.length,
    routes: routeList,
    everyone: memos.length === 0
      ? []
      : routeList.filter(r => r.count === memos.length).map(r => r.routeKey),
  };
}
