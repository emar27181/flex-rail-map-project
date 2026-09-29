import React, { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdSenseAd from '../../../src/components/AdSenseAd';
import StickyBottomAd from '../../../src/components/StickyBottomAd';

vi.mock('../../../src/contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
  getThemeColors: () => ({ surface: '', border: '', shadow: '' }),
}));
vi.mock('../../../src/components/ui/atoms/IconButton', () => ({
  default: ({ label, onClick }: { label: string; onClick: React.MouseEventHandler }) =>
    <button onClick={onClick}>{label}</button>,
}));

beforeEach(() => {
  localStorage.clear();
  Reflect.deleteProperty(window, 'adsbygoogle');
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('AdSense loading lifecycle', () => {
  it('queues before the script loads, once per slot even in StrictMode', () => {
    const { rerender } = render(<StrictMode><AdSenseAd adSlot="test" /></StrictMode>);
    expect(window.adsbygoogle).toHaveLength(1);
    rerender(<StrictMode><AdSenseAd adSlot="test" /></StrictMode>);
    expect(window.adsbygoogle).toHaveLength(1);
    render(<AdSenseAd adSlot="second" />);
    expect(window.adsbygoogle).toHaveLength(2);
  });

  it('shows a sticky ad filled after more than five seconds', async () => {
    vi.useFakeTimers();
    const { container } = render(<StrictMode><StickyBottomAd adSlot="test" /></StrictMode>);
    const slot = container.querySelector('ins')!;
    const wrapper = slot.parentElement!.parentElement!;
    expect(wrapper.style.visibility).toBe('hidden');
    expect(window.adsbygoogle).toHaveLength(1);
    await act(async () => {
      vi.advanceTimersByTime(10000);
      slot.setAttribute('data-ad-status', 'filled');
    });
    expect(wrapper.style.visibility).toBe('visible');
    fireEvent.click(screen.getByText('広告を閉じる'));
    expect(wrapper.style.visibility).toBe('hidden');
    expect(localStorage.getItem('stickyAdDismissed')).toBe('true');
  });

  it('leaves an unfilled ad hidden', async () => {
    const { container } = render(<StickyBottomAd adSlot="test" />);
    const slot = container.querySelector('ins')!;
    await act(async () => { slot.setAttribute('data-ad-status', 'unfilled'); });
    expect(slot.parentElement!.parentElement!.style.visibility).toBe('hidden');
  });

  it('does not request a previously dismissed sticky ad', () => {
    localStorage.setItem('stickyAdDismissed', 'true');
    render(<StickyBottomAd adSlot="test" />);
    expect(window.adsbygoogle).toBeUndefined();
  });

  it('can load and close an ad when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { container } = render(<StickyBottomAd adSlot="test" />);
    const slot = container.querySelector('ins')!;
    await act(async () => { slot.setAttribute('data-ad-status', 'filled'); });
    expect(slot.parentElement!.parentElement!.style.visibility).toBe('visible');
    fireEvent.click(screen.getByText('広告を閉じる'));
    expect(slot.parentElement!.parentElement!.style.visibility).toBe('hidden');
  });
});
