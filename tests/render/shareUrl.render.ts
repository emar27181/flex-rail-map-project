/**
 * URLで見せ方を共有する: 時刻（time）・基準（basis）・所要時間の表示（times）・モード（mode / with / bal）。
 * 既定の値はURLに書かない（短く保つ）。開いたときに読み、変わるたびに履歴を増やさず書き戻す。
 */
import { test, expect, collectErrors, clickMode } from './helpers';

test('URLの time・basis で、開いたときから出発/到着の基準の時刻が入る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=tokyo&time=0830&basis=arr');
  await expect(page.locator('input[type="time"]').first()).toHaveValue('08:30');
  await expect(page.getByRole('radio', { name: '到着' }).or(page.getByRole('button', { name: '到着', exact: true })).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('時刻を変えると time が、到着基準にすると basis=arr がURLに書かれ、既定の値は書かれない', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=tokyo');
  await expect(page.locator('input[type="time"]').first()).toBeVisible();
  // 触るまでは time を書かない（既定は「いま」）
  expect(new URL(page.url()).searchParams.has('time')).toBe(false);
  await page.locator('input[type="time"]').first().fill('09:15');
  await expect.poll(() => new URL(page.url()).searchParams.get('time')).toBe('0915');
  await page.getByText('到着', { exact: true }).first().click();
  await expect.poll(() => new URL(page.url()).searchParams.get('basis')).toBe('arr');
  // 出発駅があるときの所要時間ONは既定なので、times は書かない
  expect(new URL(page.url()).searchParams.has('times')).toBe(false);
  expect(errors).toEqual([]);
});

test('所要時間の表示: 出発駅があるときのOFFだけ times=0 と書かれ、開き直しても出ない', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=tokyo&times=0');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.waitForTimeout(1500);
  expect(new URL(page.url()).searchParams.get('times')).toBe('0');
  // 所要時間のバッジ（路線の上の数字）が出ていない
  expect(await page.locator('.time-text, .time-text-section').count()).toBe(0);
  expect(errors).toEqual([]);
});

test('集合駅モード: mode・with・bal がURLに書かれ、そのURLで開き直すと同じ状態になる', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await clickMode(page, '集合駅を探す');
  await expect.poll(() => new URL(page.url()).searchParams.get('mode')).toBe('meeting');
  expect(new URL(page.url()).searchParams.has('bal')).toBe(false);
  // 開き直し（from + with + bal）
  await page.goto('/?mode=meeting&from=shinjuku&with=yokohama,ikebukuro&bal=3');
  await expect(page.locator('[data-end-labeled-slider] input')).toHaveValue('3');
  expect(new URL(page.url()).searchParams.get('bal')).toBe('3');
  expect(new URL(page.url()).searchParams.get('with')).toBe('yokohama,ikebukuro');
  expect(errors).toEqual([]);
});
