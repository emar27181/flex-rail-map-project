/**
 * いま動いているサイトのバージョン・ビルドの時刻と、新しい版が出ているかの確認。
 *
 * バージョンと更新履歴は src/data/releases.ts（先頭が今の版）。ビルドの時刻とコミットは astro.config.mjs が
 * ビルドのときに埋め込む。新しい版が出ているかは、サーバーの /version.json（src/pages/version.json.ts、
 * 同じビルドで作られる）を取りに行き、バージョンかビルドの時刻が違えば「新しい版がある」とする。
 */
import { RELEASES, type Release } from '../data/releases';

declare const __APP_BUILT_AT__: string | undefined;
declare const __APP_COMMIT__: string | undefined;

/** いま公開している版（更新履歴の先頭） */
export const CURRENT_RELEASE: Release = RELEASES[0];
export const CURRENT_VERSION = CURRENT_RELEASE.version;

/** このビルドを作った時刻（ISO 8601）。テストなどビルドを通さないときは null */
export const BUILT_AT: string | null = typeof __APP_BUILT_AT__ === 'string' && __APP_BUILT_AT__ ? __APP_BUILT_AT__ : null;
/** このビルドのコミット（先頭7文字）。手元のビルドでは null */
export const BUILD_COMMIT: string | null = typeof __APP_COMMIT__ === 'string' && __APP_COMMIT__ ? __APP_COMMIT__ : null;

/** /version.json の中身 */
export interface VersionInfo {
  version: string;
  builtAt: string | null;
  commit: string | null;
}

export const VERSION_INFO: VersionInfo = { version: CURRENT_VERSION, builtAt: BUILT_AT, commit: BUILD_COMMIT };

/** 更新の確認の結果 */
export type UpdateCheckResult =
  | { status: 'latest'; checkedAt: string }
  | { status: 'available'; checkedAt: string; latest: VersionInfo }
  | { status: 'failed'; checkedAt: string };

/** サーバーにある版が、いま動いている版と違うか（番号が同じでも、ビルドし直していれば新しい） */
export function isNewerBuild(running: VersionInfo, server: VersionInfo): boolean {
  if (server.version !== running.version) return compareVersions(server.version, running.version) > 0;
  return !!(server.builtAt && running.builtAt && server.builtAt > running.builtAt);
}

/** バージョン番号を比べる（a が新しければ正、同じなら 0、古ければ負） */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/**
 * サーバーの /version.json を取りに行き、新しい版があるかを返す。
 * Service Worker や HTTP のキャッシュに古い版が残っていても確かめられるよう、キャッシュを使わない
 */
export async function checkForUpdate(
  fetcher: typeof fetch = fetch,
  running: VersionInfo = VERSION_INFO,
  now: () => Date = () => new Date(),
): Promise<UpdateCheckResult> {
  try {
    const res = await fetcher(`/version.json?t=${now().getTime()}`, { cache: 'no-store' });
    const checkedAt = now().toISOString();
    if (!res.ok) return { status: 'failed', checkedAt };
    const server = await res.json() as VersionInfo;
    if (typeof server?.version !== 'string') return { status: 'failed', checkedAt };
    return isNewerBuild(running, server) ? { status: 'available', checkedAt, latest: server } : { status: 'latest', checkedAt };
  } catch {
    return { status: 'failed', checkedAt: now().toISOString() };
  }
}

const LOCALES: Record<string, string> = { japanese: 'ja-JP', english: 'en-US', chinese: 'zh-CN', korean: 'ko-KR' };

/** 日時を「2026/11/10 21:40」のように、見ている人の時間帯で出す */
export function formatDateTime(iso: string, language: string, timeZone?: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALES[language] ?? 'ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, timeZone,
  }).format(d);
}

/** 画面の言語に合わせた変更点（中国語・韓国語は英語） */
export function releaseNotes(release: Release, language: string): string[] {
  return language === 'japanese' ? release.notes.ja : release.notes.en;
}
