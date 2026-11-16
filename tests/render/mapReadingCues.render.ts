import { expect, overlaps, test } from './helpers';

test('駅選択を閉じても未設定の駅を示し、動きを減らす設定に従う', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?to=tokyo');
  const panel = page.locator('[data-station-selector]').first();
  const indicator = panel.locator('.disclosure-indicator').first();
  await expect(indicator).toHaveCSS('transition-duration', '0s');
  await panel.getByRole('heading').first().click();
  await expect(panel.locator('[data-summary-group="departure"]')).toContainText('未設定');
  await expect(panel.locator('[data-summary-group="arrival"]')).toContainText('東京');
});

test('縮尺はズームに追従し、通常表示と全画面の地図内に出典と収まる', async ({ page }) => {
  await page.goto('/?from=fujisawa&to=tokyo');
  const map = page.locator('.leaflet-container').first();
  const footer = page.locator('[data-map-footer]');
  const scale = footer.locator('[data-map-scale]');
  const reference = footer.getByRole('link', { name: '© OpenStreetMap contributors' });
  await expect(scale).toBeVisible();
  await expect(reference).toBeVisible();
  await expect(page.locator('.leaflet-control-attribution')).toHaveCount(0);
  await expect(footer.getByRole('status')).toContainText('時刻・所要時間は推定');
  const before = await scale.textContent();
  await map.evaluate(el => {
    const leaflet = (el as unknown as { _leaflet_map: { getZoom(): number; setZoom(z: number): void } })._leaflet_map;
    leaflet.setZoom(leaflet.getZoom() + 2);
  });
  await expect(scale).not.toHaveText(before!);

  const checkBounds = async () => {
    const [m, b, s, r] = await Promise.all([map.boundingBox(), footer.boundingBox(), scale.boundingBox(), reference.boundingBox()]);
    expect(b!.x).toBeGreaterThan(m!.x);
    expect(b!.x + b!.width).toBeLessThanOrEqual(m!.x + m!.width);
    expect(b!.y + b!.height).toBeLessThanOrEqual(m!.y + m!.height);
    expect(overlaps(s!, r!)).toBe(false);
  };
  await checkBounds();
  await page.getByRole('button', { name: /全画面.*(解除|終了)|縮小/ }).first().click();
  await expect(scale).toBeVisible();
  await expect(footer.getByRole('status')).toContainText('時刻・所要時間は推定');
  await checkBounds();
});

test('終電がある区間だけを実線にし、試作表記は駅選択を閉じても見える', async ({ page }) => {
  await page.goto('/?mode=last-train&to=tokyo&time=00%3A37');
  const notice = page.locator('[data-map-data-notice]');
  await expect(notice).toContainText('架空ダイヤ');
  const available = page.locator('path.last-train-available').first();
  const unavailable = page.locator('path.last-train-inactive').first();
  await expect(available).toHaveAttribute('stroke-opacity', '1');
  await expect(available).not.toHaveAttribute('stroke-dasharray', /\d/);
  await expect(unavailable).toHaveAttribute('stroke-dasharray', /\d/);
  await page.locator('[data-station-selector]').first().getByRole('heading').first().click();
  await expect(notice).toBeVisible();
});
