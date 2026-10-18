import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyLinkHtml, COPY_LINK_SCRIPT } from '../../../../src/components/ui/atoms/copyLink';

afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); });
function setup() {
  document.body.innerHTML = copyLinkHtml({ copy: 'Copy', copied: 'Copied', failed: 'Failed' });
  const button = document.querySelector<HTMLButtonElement>('button')!;
  const getUrl = vi.fn(() => 'https://example.com/?routes=yama&lang=en');
  new Function('button', 'getUrl', `${COPY_LINK_SCRIPT}; bindCopyLink(button, getUrl);`)(button, getUrl);
  return { button, getUrl };
}
describe('copy link atom', () => {
  it('uses Lucide, gets the current URL on each click and announces success without changing the label', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const { button, getUrl } = setup();
    expect(button.hidden).toBe(false);
    expect(button.querySelector('svg')).not.toBeNull();
    button.click();
    await vi.waitFor(() => expect(document.querySelector('[role=status]')?.textContent).toBe('Copied'));
    getUrl.mockReturnValue('https://example.com/?routes=ginz');
    button.click();
    expect(writeText).toHaveBeenLastCalledWith('https://example.com/?routes=ginz');
    expect(button.textContent).toBe('Copy');
  });
  it('falls back when clipboard permission is denied and reports failure honestly', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: vi.fn(() => false) });
    const { button } = setup();
    button.click();
    await vi.waitFor(() => expect(document.querySelector('[role=status]')?.textContent).toBe('Failed'));
    expect(document.querySelector('textarea')).toBeNull();
    expect(document.activeElement).toBe(button);
  });
  it('supports browsers without Clipboard API', () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: vi.fn(() => true) });
    setup().button.click();
    expect(document.querySelector('[role=status]')?.textContent).toBe('Copied');
  });
});
