/** Lightweight desktop regression guard for overlays.
 * Checks only the 3D panel when present, avoiding false positives from
 * intentional map/tooltip overlaps. The test does not take screenshots.
 */
import { test, expect } from '@playwright/test';

test('desktop floating controls stay inside viewport without covering source control', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    localStorage.setItem('cookieConsent', JSON.stringify({ necessary: true, analytics: false, advertising: false }));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.leaflet-container', { timeout: 15000 });
  const panels = page.locator('[data-testid="terrain3d-controls"]');
  if (await panels.count()) {
    const box = await panels.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
    expect(box!.y + box!.height).toBeLessThanOrEqual(800);
    const source = panels.locator('[data-testid="map-source-disclosure"] summary');
    if (await source.count()) {
      await expect(source).toBeVisible();
      await source.click();
      await expect(panels.locator('[data-testid="map-source-disclosure"]')).toHaveAttribute('open', '');
    }
  }
});
