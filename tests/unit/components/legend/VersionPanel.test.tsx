/**
 * 設定パネルのいちばん下の「バージョン」（components/legend/VersionPanel.tsx）のテスト。
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import VersionPanel, { VERSION_HISTORY_INITIAL, VERSION_HISTORY_STEP } from '../../../../src/components/legend/VersionPanel';
import { RELEASES } from '../../../../src/data/releases';

const open = (r: ReturnType<typeof render>) => fireEvent.click(r.getByRole('button', { name: /バージョン/ }));

describe('VersionPanel', () => {
  beforeEach(() => localStorage.clear());

  it('見出しにいまの版を出し、開くと更新履歴を新しい順に少しだけ出す', () => {
    const r = render(<VersionPanel theme="light" language="japanese" />);
    expect(r.getByRole('button', { name: /バージョン/ }).textContent).toContain(RELEASES[0].version);
    open(r);
    const items = r.container.querySelectorAll('[data-release]');
    expect(items).toHaveLength(VERSION_HISTORY_INITIAL);
    expect(items[0].getAttribute('data-release')).toBe(RELEASES[0].version);
    expect(items[1].textContent).toContain(RELEASES[1].notes.ja[0]);
  });

  it('「さらに表示」で少しずつ広げる', () => {
    const r = render(<VersionPanel theme="dark" language="japanese" />);
    open(r);
    fireEvent.click(r.getByRole('button', { name: /さらに表示/ }));
    expect(r.container.querySelectorAll('[data-release]')).toHaveLength(VERSION_HISTORY_INITIAL + VERSION_HISTORY_STEP);
  });

  it('更新を確認して最新なら「最新です」と確認した時刻を出し、再読み込みは出さない', async () => {
    const check = vi.fn(async () => ({ status: 'latest' as const, checkedAt: '2026-11-10T12:34:00Z' }));
    const r = render(<VersionPanel theme="light" language="japanese" check={check} />);
    open(r);
    await act(async () => { fireEvent.click(r.getByRole('button', { name: /更新を確認/ })); });
    const status = r.getByRole('status');
    expect(status.textContent).toContain('最新です');
    expect(status.textContent).toContain('最終確認');
    expect(r.queryByRole('button', { name: /再読み込み/ })).toBeNull();
  });

  it('新しい版があれば番号と再読み込みを出し、押すと読み込み直す。結果は次に開いたときも残る', async () => {
    const check = vi.fn(async () => ({ status: 'available' as const, checkedAt: '2026-11-10T12:34:00Z', latest: { version: '9.0.0', builtAt: null, commit: null } }));
    const reload = vi.fn();
    const r = render(<VersionPanel theme="light" language="japanese" check={check} reload={reload} />);
    open(r);
    await act(async () => { fireEvent.click(r.getByRole('button', { name: /更新を確認/ })); });
    expect(r.getByRole('status').textContent).toContain('9.0.0');
    fireEvent.click(r.getByRole('button', { name: /再読み込み/ }));
    expect(reload).toHaveBeenCalledTimes(1);
    r.unmount();

    const again = render(<VersionPanel theme="light" language="japanese" />);
    open(again);
    expect(again.getByRole('status').textContent).toContain('9.0.0');
  });

  it('英語の画面では英語の変更点を出す', () => {
    const r = render(<VersionPanel theme="light" language="english" />);
    fireEvent.click(r.getByRole('button', { name: /Version/ }));
    expect(r.container.querySelectorAll('[data-release]')[1].textContent).toContain(RELEASES[1].notes.en[0]);
  });
});
