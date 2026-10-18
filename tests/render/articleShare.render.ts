import { test, expect } from './helpers';

for (const theme of ['light', 'dark']) {
  test(`記事の現在のフィルタをコピーして開く: ${theme}`, async ({ page, context }, info) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/articles/ueno-keisei-ueno-difference');
    await page.evaluate(value => document.documentElement.setAttribute('data-theme', value), theme);
    const demo = page.locator('figure[data-demo-id]').first();
    await demo.scrollIntoViewIfNeeded();
    const frame = demo.locator('iframe').contentFrame();
    await expect(frame.locator('.leaflet-container')).toBeVisible({ timeout: 30000 });
    await expect(frame.locator('#app-loading')).toBeHidden({ timeout: 30000 });
    const copy = demo.getByRole('button', { name: 'リンクをコピー' });
    await copy.click();
    await expect(demo.getByRole('status')).toHaveText('コピーしました');
    const original = await page.evaluate(() => navigator.clipboard.readText());
    expect(new URL(original).searchParams.has('embed')).toBe(false);
    expect(new URL(original).searchParams.get('routes')).toBeTruthy();
    // UIから路線を変更し、固定した記事URLではなく最新の状態がコピーされること。
    await frame.getByRole('button', { name: '4路線', exact: true }).click();
    await frame.locator('[data-legend-route="ginzaLine"]').click();
    await copy.click();
    const changed = await page.evaluate(() => navigator.clipboard.readText());
    expect(new URL(changed).searchParams.get('routes')).not.toBe(new URL(original).searchParams.get('routes'));
    expect(new URL(changed).searchParams.has('embed')).toBe(false);
    expect((await copy.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await demo.locator('.map-embed-actions').screenshot({ path: info.outputPath(`share-${theme}.png`) });
    await page.goto(changed);
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('#app-loading')).toBeHidden({ timeout: 30000 });
    expect(new URL(page.url()).searchParams.get('routes')).toBe(new URL(changed).searchParams.get('routes'));
  });
}
