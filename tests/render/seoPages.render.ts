/**
 * 検索から入るページ（路線・ガイド）→ 地図 の導線。
 * 検索結果から来た人が、ページの地図を見て、ボタン1つでその路線だけの地図を開けるか（スマホ・PC）。
 */
import { test, expect, collectErrors } from './helpers';
import { CONTROL_SIZE } from '../../src/components/ui/atoms/controlSize';
import { MAP_EMBED_PHONE } from '../../src/components/ui/atoms/mapEmbed';

const CTA = 'a[data-seo-map-open]';

test('英語の路線ページ（JR奈良線）: 冒頭に実際の地図があり、ボタンからその路線だけの地図が英語で開く', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/en/lines/jr-nara-line');
  await expect(page).toHaveTitle(/^JR Nara Line Map: /);
  await expect(page.locator('h1')).toHaveText('JR Nara Line Map and Stations');
  await expect(page.locator('iframe').first()).toBeVisible();
  if (test.info().project.name === 'mobile') {
    // スマホでは枠もスマホの画面と同じ縦長（MAP_EMBED_PHONE: 幅は最大 390px・縦横比 9:17.5）
    const box = (await page.locator('.map-embed-frame').first().boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(MAP_EMBED_PHONE.maxWidthPx);
    expect(box.height / box.width).toBeCloseTo(17.5 / 9, 1);
  }
  // 埋め込みの地図も地図ページと同じに、表示していない路線を薄く描く（以前は埋め込みだけ出していなかった）
  const embed = page.frameLocator('iframe').first();
  await expect.poll(() => embed.locator('.leaflet-container path').count(), { timeout: 20_000 }).toBeGreaterThan(50);

  const cta = page.locator(CTA).first();
  await expect(cta).toBeVisible();
  // 指で押せる大きさ（操作部品の md と同じ高さ以上）
  expect((await cta.boundingBox())!.height).toBeGreaterThanOrEqual(CONTROL_SIZE.md.minHeight);

  await cta.click();
  await page.waitForURL(url => url.pathname === '/');
  const url = new URL(page.url());
  expect(url.searchParams.get('routes')).toBeTruthy();
  expect(url.searchParams.get('lang')).toBe('en');
  // 地図側: その1路線だけが表示されている
  await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 20_000 });
  await expect.poll(() => page.locator('.leaflet-container path').count(), { timeout: 20_000 }).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: /^1 lines?$/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test('札幌のガイド（日本語）: ボタンから地下鉄3路線とJR千歳線の地図が開く', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/guides/sapporo-train-map');
  await expect(page.locator('h1')).toHaveText('札幌の地下鉄・JR路線図');
  const cta = page.locator(CTA).first();
  await expect(cta).toBeVisible();
  await cta.click();
  await page.waitForURL(url => url.pathname === '/');
  await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: '4路線' })).toBeVisible();
  expect(errors).toEqual([]);
});
