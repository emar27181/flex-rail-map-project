/**
 * バージョンの比較と「更新を確認」（src/utils/appVersion.ts）のテスト。
 */
import { describe, it, expect, vi } from 'vitest';
import { checkForUpdate, compareVersions, formatDateTime, isNewerBuild, releaseNotes, CURRENT_VERSION } from '../../../src/utils/appVersion';
import { RELEASES } from '../../../src/data/releases';

const running = { version: '1.34.0', builtAt: '2026-11-10T12:00:00.000Z', commit: 'abc1234' };
const now = () => new Date('2026-11-10T13:00:00.000Z');
const respond = (body: unknown, ok = true) => vi.fn(async () => ({ ok, json: async () => body }) as Response);

describe('compareVersions', () => {
  it('番号を数として比べる（1.10.0 は 1.9.0 より新しい）', () => {
    expect(compareVersions('1.10.0', '1.9.0')).toBeGreaterThan(0);
    expect(compareVersions('1.9.9', '1.10.0')).toBeLessThan(0);
    expect(compareVersions('2.0.0', '1.99.99')).toBeGreaterThan(0);
    expect(compareVersions('1.34.0', '1.34.0')).toBe(0);
  });
});

describe('isNewerBuild', () => {
  it('サーバーの番号が新しければ新しい版がある', () => {
    expect(isNewerBuild(running, { ...running, version: '1.35.0' })).toBe(true);
  });
  it('番号が同じでも、あとでビルドし直していれば新しい版がある', () => {
    expect(isNewerBuild(running, { ...running, builtAt: '2026-11-10T12:30:00.000Z' })).toBe(true);
  });
  it('同じビルド・古い番号なら新しい版は無い', () => {
    expect(isNewerBuild(running, running)).toBe(false);
    expect(isNewerBuild(running, { ...running, version: '1.33.6' })).toBe(false);
  });
});

describe('checkForUpdate', () => {
  it('キャッシュを使わずに /version.json を取りに行き、同じなら「最新」', async () => {
    const fetcher = respond(running);
    const r = await checkForUpdate(fetcher as unknown as typeof fetch, running, now);
    expect(r).toEqual({ status: 'latest', checkedAt: '2026-11-10T13:00:00.000Z' });
    expect(fetcher).toHaveBeenCalledWith(expect.stringMatching(/^\/version\.json\?t=\d+$/), { cache: 'no-store' });
  });

  it('新しい版があれば、その番号を返す', async () => {
    const latest = { ...running, version: '1.35.0' };
    const r = await checkForUpdate(respond(latest) as unknown as typeof fetch, running, now);
    expect(r).toEqual({ status: 'available', checkedAt: '2026-11-10T13:00:00.000Z', latest });
  });

  it('通信に失敗した・中身がおかしいときは「確認できなかった」', async () => {
    const offline = vi.fn(async () => { throw new Error('offline'); });
    expect((await checkForUpdate(offline as unknown as typeof fetch, running, now)).status).toBe('failed');
    expect((await checkForUpdate(respond({}, false) as unknown as typeof fetch, running, now)).status).toBe('failed');
    expect((await checkForUpdate(respond({ nope: 1 }) as unknown as typeof fetch, running, now)).status).toBe('failed');
  });
});

describe('表示', () => {
  it('いまの版は更新履歴の先頭', () => {
    expect(CURRENT_VERSION).toBe(RELEASES[0].version);
  });
  it('時刻は分まで出す', () => {
    expect(formatDateTime('2026-11-10T12:34:00Z', 'japanese', 'Asia/Tokyo')).toBe('2026/11/10 21:34');
  });
  it('日本語の画面は日本語、それ以外は英語の変更点', () => {
    expect(releaseNotes(RELEASES[0], 'japanese')).toBe(RELEASES[0].notes.ja);
    expect(releaseNotes(RELEASES[0], 'korean')).toBe(RELEASES[0].notes.en);
  });
});
