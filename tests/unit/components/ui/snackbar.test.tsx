/**
 * 操作の結果を画面の下に短く知らせる帯（ui/molecules/Snackbar）と、
 * 地図の線をタップして路線を切り替えたときの知らせ（map/RouteToggleSnackbar）のテスト。
 *
 * 2026-11: 指の端末では線に路線名の吹き出しを出さないため、タップでどの路線を切り替えたか分からなかった。
 * 帯は1行だけ（「元に戻す」は付けない。同じ線をもう一度押せば戻る）。
 */
// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Snackbar, { SNACKBAR_DURATION_MS } from '../../../../src/components/ui/molecules/Snackbar';
import RouteToggleSnackbar from '../../../../src/components/map/RouteToggleSnackbar';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const renderSnackbar = (props: Partial<React.ComponentProps<typeof Snackbar>> = {}) => {
  const onClose = vi.fn();
  const onAction = vi.fn();
  render(
    <Snackbar theme="dark" message="知らせ" actionLabel="元に戻す" onAction={onAction} onClose={onClose} closeLabel="閉じる" bottom="0px" {...props} />,
  );
  return { onClose, onAction };
};

describe('Snackbar', () => {
  it('読み上げで知らせる（role="status"）', () => {
    renderSnackbar();
    expect(screen.getByRole('status').textContent).toContain('知らせ');
  });

  it('決まった時間で自動で消える', () => {
    const { onClose } = renderSnackbar();
    act(() => { vi.advanceTimersByTime(SNACKBAR_DURATION_MS - 1); });
    expect(onClose).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('指やマウスが乗っている間は消さない（押そうとしている間に消えない）', () => {
    const { onClose } = renderSnackbar();
    fireEvent.pointerEnter(screen.getByRole('status'));
    act(() => { vi.advanceTimersByTime(SNACKBAR_DURATION_MS * 3); });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.pointerLeave(screen.getByRole('status'));
    act(() => { vi.advanceTimersByTime(SNACKBAR_DURATION_MS); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('操作を押すと onAction を呼んで閉じる。× でも閉じる', () => {
    const { onAction, onClose } = renderSnackbar();
    fireEvent.click(screen.getByText('元に戻す'));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText('閉じる'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('操作の文言が無ければ操作のボタンを出さない', () => {
    renderSnackbar({ actionLabel: undefined, onAction: undefined });
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('閉じるボタンの名前が無ければ×も出さない', () => {
    renderSnackbar({ actionLabel: undefined, onAction: undefined, closeLabel: undefined });
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('RouteToggleSnackbar', () => {
  const base = { routeName: '山手線', routeColor: '#9ACD32', theme: 'dark' as const, bottom: '0px', onClose: () => {} };

  it('どの路線をどうしたかを、表示する言語で1行に出す', () => {
    const { rerender } = render(<RouteToggleSnackbar {...base} notice={{ id: 1, routeKey: 'yamanote', shown: false }} language="japanese" />);
    expect(screen.getByRole('status').textContent).toBe('山手線を非表示にしました');
    rerender(<RouteToggleSnackbar {...base} notice={{ id: 2, routeKey: 'yamanote', shown: true }} language="english" />);
    expect(screen.getByRole('status').textContent).toBe('Showing Yamanote Line');
  });

  it('「元に戻す」も×も出さない（同じ線をもう一度押せば戻るので、帯は文だけ）', () => {
    render(<RouteToggleSnackbar {...base} notice={{ id: 1, routeKey: 'yamanote', shown: false }} language="japanese" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('2行に折り返さず、長い路線名は路線名だけを省略して「を非表示にしました」を残す', () => {
    render(<RouteToggleSnackbar {...base} routeName="東武伊勢崎線（スカイツリーライン）" notice={{ id: 1, routeKey: 'tobuIsesaki', shown: false }} language="japanese" />);
    const bar = screen.getByRole('status');
    expect(bar.style.whiteSpace).toBe('nowrap');
    const name = bar.querySelector('[data-route-name]') as HTMLElement;
    expect(name.style.textOverflow).toBe('ellipsis');
    expect(name.style.minWidth).toBe('0px');
    const suffix = name.nextElementSibling as HTMLElement;
    expect(suffix.textContent).toBe('を非表示にしました');
    expect(suffix.style.flexShrink).toBe('0');
  });
});

describe('地図の線をタップして切り替えたときに知らせる（RailwayMap.tsx）', () => {
  const src = readFileSync(join(__dirname, '../../../../src/components/RailwayMap.tsx'), 'utf8');

  it('表示中の線・薄い線のどちらをタップして切り替えても知らせる', () => {
    expect(src).toMatch(/setVisibleRoutes\(newVisibleRoutes\);\s*noticeRouteToggle\(routeKey, newVisibleRoutes\.has\(routeKey\)\);/);
    expect(src).toMatch(/setVisibleRoutes\(prev => new Set\(\[\.\.\.prev, rKey\]\)\);\s*noticeRouteToggle\(rKey, true\);/);
    // 知らせの表示は MapNoticeSnackbar の1か所（種類ごとの見た目はその中で分ける）
    expect(src).toContain('<MapNoticeSnackbar');
  });
});

describe('Snackbar の multiline（文末を切らない）', () => {
  it('multiline は折り返しを許し（2行まで）、文を overflow で隠さない。既定は1行', () => {
    const { rerender } = render(<Snackbar theme="dark" bottom="10px" message="とても長い案内の文" onClose={() => {}} />);
    const single = document.querySelector('[data-snackbar-message]') as HTMLElement;
    expect(single.style.whiteSpace).toBe('nowrap');
    expect(single.style.overflow).toBe('hidden');

    rerender(<Snackbar theme="dark" bottom="10px" message="とても長い案内の文" onClose={() => {}} multiline />);
    const multi = document.querySelector('[data-snackbar-message]') as HTMLElement;
    expect(multi.style.whiteSpace).toBe('normal');
    expect(multi.style.overflow).toBe('');
    const bar = document.querySelector('[data-snackbar]') as HTMLElement;
    expect(bar.style.whiteSpace).toBe('normal');
  });

  it('文だけの知らせ（MapNoticeSnackbar）は multiline で出す（案内の文末を切らない）', () => {
    const src = readFileSync(join(__dirname, '../../../../src/components/map/MapNoticeSnackbar.tsx'), 'utf8');
    expect(src).toMatch(/<Snackbar[\s\S]*?multiline/);
  });
});
