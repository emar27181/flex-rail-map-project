/**
 * 出発駅・到着駅として選ばれた回数を localStorage に記録する。
 *
 * 未入力時の候補を「近くの駅」だけで埋めると、現在地から離れた
 * よく使う駅（自宅・職場の最寄りなど）に毎回入力が必要になる。
 * 選択回数を覚えておき、候補の一部を履歴から埋めるために使う。
 */

export const STATION_HISTORY_STORAGE_KEY = 'frm-station-history';

/** 保存する駅数の上限。無制限に増やすと localStorage を圧迫するため */
const MAX_HISTORY_ENTRIES = 100;

export interface StationHistoryEntry {
  /** 駅名（日本語表記。翻訳前のキー） */
  name: string;
  /** 選択された回数 */
  count: number;
  /** 最後に選択した時刻（ミリ秒）。同数のときの並び替えに使う */
  lastUsedAt: number;
}

const isEntry = (v: unknown): v is StationHistoryEntry => {
  if (typeof v !== 'object' || v === null) return false;
  const e = v as Partial<StationHistoryEntry>;
  return typeof e.name === 'string' && typeof e.count === 'number' && typeof e.lastUsedAt === 'number';
};

export const loadStationHistory = (): StationHistoryEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STATION_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEntry);
  } catch {
    // 壊れた値が入っていても履歴なしとして扱う（機能は落とさない）
    return [];
  }
};

const saveStationHistory = (entries: StationHistoryEntry[]): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STATION_HISTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // 容量超過やプライベートモードでも動作を止めない
  }
};

/**
 * 駅が選択されたことを記録し、更新後の履歴を返す。
 * 回数の多い順に保持し、上限を超えた分は末尾から捨てる。
 */
export const recordStationSelection = (name: string): StationHistoryEntry[] => {
  const history = loadStationHistory();
  const existing = history.find(e => e.name === name);
  if (existing) {
    existing.count += 1;
    existing.lastUsedAt = Date.now();
  } else {
    history.push({ name, count: 1, lastUsedAt: Date.now() });
  }
  history.sort((a, b) => (b.count - a.count) || (b.lastUsedAt - a.lastUsedAt));
  const trimmed = history.slice(0, MAX_HISTORY_ENTRIES);
  saveStationHistory(trimmed);
  return trimmed;
};

/** 選択回数の多い順に駅名を返す */
export const getFrequentStationNames = (history: StationHistoryEntry[], limit: number): string[] =>
  [...history]
    .sort((a, b) => (b.count - a.count) || (b.lastUsedAt - a.lastUsedAt))
    .slice(0, limit)
    .map(e => e.name);

/**
 * 未入力時に出す候補を組み立てる。
 *
 * 先頭は「近くの駅 nearbyCount 件 + よく使う駅 frequentCount 件」。
 * 重複は取り除き、片方が足りない場合はもう片方で埋める。
 * それでも total に満たない場合は fallback（主要駅）で補う。
 */
export const buildSuggestions = <T extends { name: string }>(
  nearby: T[],
  history: StationHistoryEntry[],
  fallback: T[],
  findByName: (name: string) => T | undefined,
  options: { nearbyCount: number; frequentCount: number; total: number },
): T[] => {
  const { nearbyCount, frequentCount, total } = options;
  const picked: T[] = [];
  const seen = new Set<string>();

  const push = (s: T | undefined) => {
    if (!s || seen.has(s.name)) return;
    seen.add(s.name);
    picked.push(s);
  };

  nearby.slice(0, nearbyCount).forEach(push);
  getFrequentStationNames(history, frequentCount + nearbyCount)
    .map(findByName)
    .filter((s): s is T => !!s && !seen.has(s.name))
    .slice(0, frequentCount)
    .forEach(push);

  // 上位5件の枠が埋まらなかった分を、近隣 → 主要駅 の順で補う
  for (const s of nearby) {
    if (picked.length >= total) break;
    push(s);
  }
  for (const s of fallback) {
    if (picked.length >= total) break;
    push(s);
  }
  return picked.slice(0, total);
};
