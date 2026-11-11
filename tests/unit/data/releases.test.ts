/**
 * 更新履歴（src/data/releases.ts）の決まりを確かめる。番号の付け方・時刻・説明の書き方は docs/release-process.md。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { RELEASES } from '../../../src/data/releases';

const parse = (v: string) => v.split('.').map(Number) as [number, number, number];

describe('更新履歴', () => {
  it('バージョンは major.minor.patch の形', () => {
    for (const r of RELEASES) expect(r.version, r.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('新しい順に並び、1つ前の版から決まりどおりに番号が上がっている（新機能は真ん中、それ以外は右端）', () => {
    const oldest = RELEASES[RELEASES.length - 1];
    expect(oldest.version).toBe('1.0.0');
    for (let i = RELEASES.length - 2; i >= 0; i--) {
      const prev = parse(RELEASES[i + 1].version);
      const next = RELEASES[i];
      const want = next.kind === 'feat' ? `${prev[0]}.${prev[1] + 1}.0` : `${prev[0]}.${prev[1]}.${prev[2] + 1}`;
      expect(next.version, `${RELEASES[i + 1].version} の次（${next.kind}, PR ${next.prs.join(',')}）`).toBe(want);
    }
  });

  it('公開した時刻は新しい順で、まだ main に入っていない版（null）は先頭だけ', () => {
    RELEASES.slice(1).forEach(r => expect(r.releasedAt, r.version).not.toBeNull());
    const times = RELEASES.map(r => r.releasedAt).filter((t): t is string => t !== null);
    for (const t of times) expect(Number.isNaN(Date.parse(t)), t).toBe(false);
    for (let i = 1; i < times.length; i++) expect(times[i - 1] >= times[i], `${times[i - 1]} → ${times[i]}`).toBe(true);
  });

  it('変更点は日本語と英語の両方があり、数がそろっている', () => {
    for (const r of RELEASES) {
      expect(r.notes.ja.length, r.version).toBeGreaterThan(0);
      expect(r.notes.en.length, r.version).toBe(r.notes.ja.length);
      for (const n of [...r.notes.ja, ...r.notes.en]) expect(n.trim(), r.version).not.toBe('');
    }
  });

  it('同じ PR が2つの版に入っていない', () => {
    const all = RELEASES.flatMap(r => r.prs);
    expect(new Set(all).size).toBe(all.length);
  });

  it('package.json のバージョンは更新履歴の先頭と同じ', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.version).toBe(RELEASES[0].version);
  });
});
