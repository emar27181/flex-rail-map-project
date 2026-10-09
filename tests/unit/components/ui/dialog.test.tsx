import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LocationPermissionDialog from '../../../../src/components/LocationPermissionDialog';

afterEach(cleanup);
describe('位置情報の許可ダイアログ', () => {
  it.each(['light', 'dark'] as const)('%sで既存ボタンと設定案内・再取得を表示する', theme => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) { this.open = true; });
    HTMLDialogElement.prototype.close = vi.fn();
    const retry = vi.fn(), close = vi.fn();
    render(<LocationPermissionDialog open theme={theme} language="japanese" denied supported onRetry={retry} onClose={close} />);
    expect(screen.getByRole('dialog', { name: '位置情報の許可' })).toBeTruthy();
    expect(screen.getByText(/以前に拒否した場合/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '再取得' }));
    expect(retry).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(close).toHaveBeenCalledOnce();
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: true, cancelable: true }));
    expect(close).toHaveBeenCalledTimes(2);
  });

  it('未対応環境には再取得を出さない', () => {
    render(<LocationPermissionDialog open theme="light" language="english" denied={false} supported={false} onRetry={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
  });
});
