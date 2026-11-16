/**
 * 集合駅を探すモード: 既存の駅選択パネルの中だけで完結する（別パネル・別の入力欄を増やさない）。
 * 出発駅 + 常に出ている出発駅の入力欄（出発駅欄と同じ緑・同じ幅・同じ文言）で2駅以上そろうと候補が出て、選ぶと既存の到着駅に入る。
 */
import { test, expect, collectErrors, clickMode, modeIsOn, modeTag } from './helpers';

test('集合駅モード: 出発駅を追加すると候補が出て、選ぶと既存の到着駅に入る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  const stationInputs = page.locator('input.station-input-filled');
  const inputsBefore = await stationInputs.count();

  // 表示モードは「表示切替」パネルの表示設定の上にある
  await modeTag(page, '集合駅を探す');
  const groups = page.locator('[data-mode-section] [role="group"]');
  await expect(groups).toHaveCount(1);
  await page.getByRole('button', { name: 'ほかの表示モード' }).click();
  await expect(groups).toHaveCount(2);
  const tags = (index: number) => groups.nth(index).locator('[data-tag]').evaluateAll(
    elements => elements.map(element => element.getAttribute('data-tag')),
  );
  expect(await tags(0)).toEqual(['meeting', 'lastTrain', 'heatmap', 'rideLog']);
  expect(await tags(1)).toEqual(['trainDemo', 'terrain3d', 'bubble', 'schematic']);
  await clickMode(page, '集合駅を探す');
  expect(await modeIsOn(page, '集合駅を探す')).toBe(true);
  // 出発駅が1つのうちは案内だけ
  await expect(page.locator('[data-meeting-results]')).toContainText('2駅以上そろえると');

  // 出発駅の入力欄は、ボタンを押さなくても最初から出ている（出発駅欄と同じ文言「駅名入力」）
  await expect(page.getByRole('button', { name: '出発駅を追加' })).toHaveCount(0);
  await expect(page.locator('[data-meeting-add]')).toHaveCount(1);
  const add = page.locator('[data-meeting-add] input');
  await expect(add).toBeVisible();
  await expect(add).toHaveAttribute('placeholder', '駅名入力');
  await expect(add).toHaveAccessibleName('出発駅を追加');
  await add.fill('東京');
  await page.locator('[data-station-option="東京"]').first().click();

  const results = page.locator('[data-meeting-results]');
  const cards = results.locator('[data-meeting-candidate]');
  await expect(cards).toHaveCount(3);
  await expect(results).not.toContainText('駅をクリックすると到着駅に設定します');
  const more = results.getByRole('button', { name: /さらに表示/ });
  for (const count of [8, 13, 15]) {
    await more.click();
    await expect(cards).toHaveCount(count);
  }
  await expect(more).toHaveCount(0);
  await results.getByRole('button', { name: '折りたたむ' }).click();
  await expect(cards).toHaveCount(3);
  await expect(results).toContainText('最大');
  await expect(results).toContainText('新宿');
  await expect(results).toContainText('東京');
  // 追加した出発駅は出発駅欄と同じ部品の欄（1つ）。次の欄が増えるだけで、別のパネル・入力欄は作らない
  await expect(page.locator('[data-meeting-extra]')).toHaveCount(1);
  expect(await stationInputs.count()).toBe(inputsBefore + 2);

  // 候補を押すと到着駅に入る
  const first = results.getByRole('button').first();
  const name = await first.getAttribute('data-meeting-candidate');
  expect(name).toBeTruthy();
  await first.click();
  await expect(stationInputs.nth(1)).toHaveValue(name!);
  // 集合駅が決まると、出発駅ごとに使う路線が出る（新宿・東京の2人分）
  const routesBlock = page.locator('[data-meeting-routes]');
  await expect(routesBlock).toBeVisible();
  await expect(routesBlock.locator('[data-meeting-route]')).toHaveCount(2);
  await expect(routesBlock.locator('[data-meeting-route="新宿"]')).toContainText('分');
  // 時刻欄は元からある1つだけ（集合駅用の時刻欄は作らない）
  await expect(page.locator('input[type="time"]')).toHaveCount(1);

  // OFFで通常表示に戻る（候補の欄が消える）
  await clickMode(page, '集合駅を探す');
  await expect(page.locator('[data-meeting-results]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('集合駅モード: 追加した出発駅も出発駅欄と同じ緑の欄で、入れるたびに次の欄が真下に出る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await clickMode(page, '集合駅を探す');

  const extras = page.locator('[data-meeting-extra]');
  const add = page.locator('[data-meeting-add]');
  await expect(extras).toHaveCount(0);
  await expect(add).toHaveCount(1);

  const addOne = async (name: string) => {
    await page.locator('[data-meeting-add] input').fill(name);
    await page.locator(`[data-station-option="${name}"]`).first().click();
  };
  // 1つ入れると、次の欄は真下に出る
  await addOne('東京');
  await expect(extras).toHaveCount(1);
  const pos1 = await page.evaluate(() => {
    const e = document.querySelector('[data-meeting-extra]')!.getBoundingClientRect();
    const a = document.querySelector('[data-meeting-add]')!.getBoundingClientRect();
    return { extraBottom: e.bottom, addTop: a.top, extraLeft: e.left, addLeft: a.left };
  });
  expect(pos1.addTop).toBeGreaterThan(pos1.extraBottom);
  expect(pos1.addLeft).toBeCloseTo(pos1.extraLeft);
  await addOne('横浜');
  await addOne('渋谷');
  await expect(extras).toHaveCount(3);
  await expect(add).toHaveCount(1);
  // 行ごとの見出し・番号は立てない
  await expect(page.locator('[data-meeting-origin-rows] label')).toHaveCount(0);
  await expect(extras.nth(0).locator('input')).toHaveValue('東京');
  await expect(extras.nth(2).locator('input')).toHaveValue('渋谷');

  // 色は出発駅欄と同じ緑（追加の欄も、入力待ちの欄も）。点線にしない
  const colors = await page.evaluate(() => {
    const bg = (el: Element) => getComputedStyle(el).backgroundColor;
    const main = document.querySelector('input.station-input-filled') as HTMLInputElement; // 出発駅欄
    const extra = document.querySelector('[data-meeting-extra] input') as HTMLInputElement;
    const addInput = document.querySelector('[data-meeting-add] input') as HTMLInputElement;
    return { main: bg(main), extra: bg(extra), add: bg(addInput), addStyle: getComputedStyle(addInput).borderTopStyle };
  });
  expect(colors.extra).toBe(colors.main);
  expect(colors.add).toBe(colors.main);
  expect(colors.addStyle).toBe('solid');

  // 4人分の所要時間が候補に並び、集合駅を決めると4人それぞれのルートと使う路線が並ぶ
  await expect(page.locator('[data-meeting-results]')).toContainText('渋谷');
  await page.locator('[data-meeting-results]').getByRole('button').first().click();
  // ルートは上位3つだけ見せ、4つ目からは折りたたみ
  await expect(page.locator('[data-meeting-route]')).toHaveCount(3);
  await page.locator('[data-meeting-routes]').getByRole('button', { name: /さらに表示/ }).click();
  await expect(page.locator('[data-meeting-route]')).toHaveCount(4);

  // ×で欄が減る
  await extras.nth(0).locator('button').click();
  await expect(extras).toHaveCount(2);
  await expect(extras.nth(0).locator('input')).toHaveValue('横浜');
  expect(errors).toEqual([]);
});

for (const width of [1280, 390, 360]) {
  test(`集合駅モード: 追加の出発駅は出発駅欄と同じ幅・同じ位置にそろう（${width}px）`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/?mode=meeting&from=shinjuku&with=tokyo,yokohama');
    await expect(page.locator('[data-meeting-add]')).toBeVisible();
    const m = await page.evaluate(() => {
      const box = (el: Element) => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, width: r.width, top: r.top }; };
      const inputs = [...document.querySelectorAll('input.station-input-filled')];
      const departure = box(inputs[0]);          // 出発駅欄
      const arrival = box(inputs[1]);            // 到着駅欄
      const extras = [...document.querySelectorAll('[data-meeting-extra] input')].map(box);
      const add = box(document.querySelector('[data-meeting-add] input')!);
      const actions = box(document.querySelector('[data-station-actions]')!);
      return { departure, arrival, extras, add, actions };
    });
    for (const field of [...m.extras, m.add]) {
      expect(Math.abs(field.left - m.departure.left)).toBeLessThanOrEqual(1);
      expect(Math.abs(field.width - m.departure.width)).toBeLessThanOrEqual(1);
    }
    expect(m.extras[1].top).toBeGreaterThan(m.extras[0].top);
    expect(m.add.top).toBeGreaterThan(m.extras[1].top);
    expect(m.extras[0].top).toBeGreaterThan(m.arrival.top);
    expect(m.add.top).toBeLessThan(m.actions.top);
  });
}

test('集合駅モード: 出発駅を1つ追加した状態で開くと、次の欄が真下に出る', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/?mode=meeting&from=shinjuku&with=tokyo');
  await expect(page.locator('[data-meeting-add]')).toBeVisible();
  const pos = await page.evaluate(() => {
    const e = document.querySelector('[data-meeting-extra] input')!.getBoundingClientRect();
    const a = document.querySelector('[data-meeting-add] input')!.getBoundingClientRect();
    return { extraBottom: e.bottom, addTop: a.top, extraLeft: e.left, addLeft: a.left };
  });
  expect(pos.addTop).toBeGreaterThan(pos.extraBottom);
  expect(pos.addLeft).toBeCloseTo(pos.extraLeft);
});

for (const lang of ['ja', 'en', 'zh', 'ko'] as const) {
  test(`集合駅モード: 追加の出発駅の欄の案内は、出発駅欄（未入力）と同じ文言（${lang}）`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`/?mode=meeting&from=shinjuku&lang=${lang}`);
    const add = page.locator('[data-meeting-add] input');
    await expect(add).toBeVisible();
    // 到着駅欄（未入力）の案内と同じ文言
    const arrivalPlaceholder = await page.locator('input.station-input-filled').nth(1).getAttribute('placeholder');
    await expect(add).toHaveAttribute('placeholder', arrivalPlaceholder!);
    // 文字が欄の幅に収まる（出発駅欄と同じ幅なので、出発駅欄が収まっていれば収まる）
    const fit = await add.evaluate((el: HTMLInputElement) => {
      const cs = getComputedStyle(el);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const text = ctx.measureText(el.placeholder).width;
      const inner = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return { text: Math.round(text), inner: Math.round(inner), placeholder: el.placeholder };
    });
    expect(fit.text, JSON.stringify(fit)).toBeLessThanOrEqual(fit.inner);
  });
}

test('集合駅モード: 時刻の入力は「時刻を表示」ボタンの下（候補より上）にあり、地図は路線の上に区間の所要時間を出す（駅アイコンの下には書かない）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?mode=meeting&from=shinjuku&with=tokyo');
  await expect(page.locator('[data-meeting-results]')).toBeVisible();
  // 到着駅を決める（候補の先頭）と時刻を表示・時刻欄が出る
  await page.locator('[data-meeting-results]').getByRole('button').first().click();
  const timeButton = page.getByRole('button', { name: '時刻を表示' });
  await expect(timeButton).toBeVisible();
  const timeInput = page.locator('input[type="time"]');
  await expect(timeInput).toHaveCount(1);
  const [b, t, r] = await Promise.all([
    timeButton.boundingBox(), timeInput.boundingBox(), page.locator('[data-meeting-results]').boundingBox(),
  ]);
  expect(t!.y).toBeGreaterThan(b!.y);
  expect(t!.y).toBeLessThan(r!.y);
  // ルートの行に「出発 → 到着」の時刻
  await expect(page.locator('[data-meeting-route-clock]').first()).toHaveText(/\d\d:\d\d → \d\d:\d\d/);
  // 駅アイコンの下には時間を書かない。出発駅ごとの所要時間は、路線の上の丸いバッジ（区間の時間）で出る
  await expect.poll(() => page.locator('.time-text-section').count(), { timeout: 20_000 }).toBeGreaterThan(0);
  expect(await page.locator('.leaflet-marker-icon', { hasText: /(新宿|東京) \d+分/ }).count()).toBe(0);
  expect(errors).toEqual([]);
});

test('駅選択パネルを閉じても、出発駅・到着駅は2行目に小さく残る（集合駅では出発駅が並ぶ）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=tokyo');
  const panel = page.locator('[data-station-selector]').first();
  await expect(panel.locator('input.station-input-filled').first()).toBeVisible();
  await expect(panel.locator('[data-station-summary]')).toHaveCount(0);
  // 閉じる（見出しを押す）
  await panel.getByRole('heading').first().click();
  await expect(panel.locator('input.station-input-filled')).toHaveCount(0);
  const summary = panel.locator('[data-station-summary]');
  await expect(summary).toBeVisible();
  await expect(summary).toContainText('新宿');
  await expect(summary).toContainText('東京');
  // 札の前に「出発駅」「到着駅」の語がある（札の色だけでは、何の駅か分からない）
  await expect(summary.locator('[data-summary-group="departure"]')).toContainText('出発駅');
  await expect(summary.locator('[data-summary-group="arrival"]')).toContainText('到着駅');
  // 見出しの下（2行目）にある
  const [h, s] = await Promise.all([panel.getByRole('heading').first().boundingBox(), summary.boundingBox()]);
  expect(s!.y).toBeGreaterThan(h!.y + h!.height - 1);
  // 開き直すと2行目は消える
  await panel.getByRole('heading').first().click();
  await expect(panel.locator('[data-station-summary]')).toHaveCount(0);

  // 集合駅モード: 出発駅が複数並ぶ
  await page.goto('/?mode=meeting&from=shinjuku&with=yokohama');
  const panel2 = page.locator('[data-station-selector]').first();
  await panel2.getByRole('heading').first().click();
  const summary2 = panel2.locator('[data-station-summary]');
  await expect(summary2).toContainText('新宿');
  await expect(summary2).toContainText('横浜');
  await expect(summary2.locator('[data-summary-group="departure"]')).toContainText('出発駅');
  await expect(summary2.locator('[data-summary-group="arrival"]')).toContainText('未設定');
  expect(errors).toEqual([]);
});

test('集合駅モード: 集合駅を決める前でも、出発駅それぞれから候補の駅（仮の到着駅）への路線に、それぞれの出発駅から増える所要時間が出る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?mode=meeting&from=shinjuku&with=fujisawa');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  // 到着駅は未設定。間の路線（小田急線など）に区間の時間バッジが出る
  await expect.poll(() => page.locator('.time-text-section').count(), { timeout: 20_000 }).toBeGreaterThan(3);
  const texts = (await page.locator('.time-text-section').allInnerTexts()).map(Number);
  // 両端（新宿側・藤沢側）から数字が増えるので、小さい数字が複数ある（1つの出発駅からの累計だけなら小さい数字は1つ）
  expect(texts.filter(n => n <= 8).length).toBeGreaterThanOrEqual(2);
  await expect(page.locator('[data-meeting-results]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('駅のツールチップ: いま出発駅・到着駅の駅には、駅名の横に「出発駅」「到着駅」の札が出る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=shibuya');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  const open = async (name: string) => {
    await page.locator('.special-station-marker-inline', { hasText: name }).first().click({ force: true });
  };
  await expect.poll(() => page.locator('.special-station-marker-inline').count(), { timeout: 20_000 }).toBeGreaterThan(1);
  await open('渋谷');
  await expect(page.locator('[data-station-role="arrival"]')).toHaveText('到着駅');
  await expect(page.locator('[data-station-role="departure"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('集合駅モード: 集合駅を決める前に、ほかの路線を表示に足しても画面が落ちない（到着駅が無くても描ける）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?mode=meeting&from=shinjuku&with=fujisawa');
  await expect.poll(() => page.locator('.time-text-section').count(), { timeout: 20_000 }).toBeGreaterThan(3);
  // 地図の薄い線（いま描いている小田急線ではない路線）をタップして、表示に足す（スマホでは確認なしで足される）
  const point = await page.evaluate(() => {
    const container = document.querySelector('.leaflet-container') as unknown as { _leaflet_map?: { latLngToContainerPoint: (p: [number, number]) => { x: number; y: number } } };
    const map = container._leaflet_map;
    if (!map) return null;
    // 渋谷駅のあたり（山手線などの薄い線が通る）
    const p = map.latLngToContainerPoint([35.6586, 139.7016]);
    const rect = (document.querySelector('.leaflet-container') as HTMLElement).getBoundingClientRect();
    return { x: rect.left + p.x, y: rect.top + p.y };
  });
  expect(point).not.toBeNull();
  await page.mouse.click(point!.x, point!.y);
  await page.waitForTimeout(1500);
  // 画面が残っている（駅選択パネルが見える）。例外も出ていない
  await expect(page.locator('[data-station-selector]').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('集合駅モード: 候補の駅は到着駅と同じ赤の駅名札で地図に出て、タップすると出発駅ごとの所要時間がツールチップに出る（駅アイコンの下には書かない）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?mode=meeting&from=shinjuku&with=yokohama');
  await expect(page.locator('[data-meeting-results]')).toBeVisible();
  // 候補（上位5つ）が、到着駅と同じ赤の札で出る
  const results = page.locator('[data-meeting-results]');
  await results.getByRole('button', { name: /さらに表示/ }).click();
  const candidateNames = await results.locator('[data-meeting-candidate]').evaluateAll(
    cards => cards.map(card => card.getAttribute('data-meeting-candidate')!),
  );
  expect(candidateNames).toHaveLength(8);
  const plates = page.locator('.special-station-marker-inline');
  await expect.poll(async () => {
    let found = 0;
    for (const name of candidateNames) found += (await plates.filter({ hasText: name }).count()) > 0 ? 1 : 0;
    return found;
  }, { timeout: 20_000 }).toBeGreaterThanOrEqual(3);
  const firstMarker = page.locator('.special-station-marker-inline, .station-marker')
    .filter({ has: page.getByText(candidateNames[0], { exact: true }) });
  await expect(firstMarker).toHaveCount(1);
  await expect(firstMarker.locator('div').first()).toHaveCSS('background-color', 'rgb(244, 67, 54)');
  // 駅アイコンの下には出発駅ごとの時間を出さない
  expect(await page.locator('.leaflet-marker-icon', { hasText: /(新宿|横浜) \d+分/ }).count()).toBe(0);
  // 候補の札をタップ → ツールチップに出発駅ごとの所要時間と最大
  await plates.filter({ hasText: candidateNames[0] }).first().click({ force: true });
  const detail = page.locator('[data-meeting-times]');
  await expect(detail).toBeVisible();
  await expect(detail.locator('[data-meeting-times-row="新宿"]')).toContainText('分');
  await expect(detail.locator('[data-meeting-times-row="横浜"]')).toContainText('分');
  await expect(detail).toContainText('最大');
  expect(errors).toEqual([]);
});

test('集合駅モード: 3人以上のときだけ「集合駅の決め方」の5段階スライダーが出て、動かすと候補が入れ替わる', async ({ page }) => {
  const errors = collectErrors(page);
  // 2人: 出ない
  await page.goto('/?mode=meeting&from=shinjuku&with=yokohama');
  await expect(page.locator('[data-meeting-results]')).toBeVisible();
  await expect(page.locator('[data-end-labeled-slider]')).toHaveCount(0);
  // 3人: 出る（両端の言葉つき・5段階）
  await page.goto('/?mode=meeting&from=shinjuku&with=yokohama,ikebukuro');
  const slider = page.locator('[data-end-labeled-slider]');
  await expect(slider).toBeVisible();
  await expect(slider).toContainText('全員が同じくらい');
  await expect(slider).toContainText('多い人に寄せる');
  await expect(slider.locator('[data-slider-stop]')).toHaveCount(5);
  const input = slider.getByRole('slider');
  await expect(input).toHaveAttribute('max', '4');
  await expect(input).toHaveAttribute('step', '1');
  const names = () => page.locator('[data-meeting-candidate]').evaluateAll(
    cards => cards.map(card => card.getAttribute('data-meeting-candidate')),
  );
  const fair = await names();
  await input.focus();
  await input.press('ArrowRight');
  await expect(input).toHaveValue('1');
  await input.press('End');
  await expect(input).toHaveValue('4');
  await expect.poll(async () => (await names()).join(',')).not.toBe(fair.join(','));
  expect(await names()).toHaveLength(3);
  expect(errors).toEqual([]);
});

test('集合駅モード: 畳んだ駅選択パネルにも、到着駅候補の上位3つが到着駅と同じ配色でコンパクトに出て、押すと到着駅になる', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?mode=meeting&from=shinjuku&with=yokohama');
  const panel = page.locator('[data-station-selector]').first();
  await expect(page.locator('[data-meeting-results]')).toBeVisible();
  await panel.getByRole('heading').first().click();
  const group = panel.locator('[data-summary-group="candidates"]');
  await expect(group).toBeVisible();
  await expect(group).toContainText('到着駅候補');
  // 上位3つの札 + 「他12」
  await expect(group.getByRole('button')).toHaveCount(3);
  await expect(group).toContainText('他12');
  // 札を押すと、その駅が到着駅になり、候補の札は到着駅の札に変わる
  const firstCandidate = group.getByRole('button').first();
  const first = (await firstCandidate.innerText()).trim();
  const background = await firstCandidate.evaluate(el => getComputedStyle(el).backgroundColor);
  await firstCandidate.click();
  const arrivalGroup = panel.locator('[data-summary-group="arrival"]');
  await expect(arrivalGroup).toContainText(first);
  await expect(arrivalGroup.getByText(first, { exact: true })).toHaveCSS('background-color', background);
  await expect(panel.locator('[data-summary-group="candidates"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('集合駅の候補は1駅につき1枚のカード。所要時間からも選べる', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?mode=meeting&from=shinjuku&with=yokohama');
  const cards = page.locator('[data-meeting-candidate]');
  await expect(cards).toHaveCount(3);
  const card = cards.first();
  await expect(card).toHaveRole('button');
  await expect(card).toHaveAccessibleName(/^1\. /);
  await expect(card).toHaveAccessibleDescription(/最大.*新宿.*横浜/);
  await expect(card).not.toHaveCSS('background-color', 'rgb(244, 67, 54)');
  const stationName = (await card.getAttribute('data-meeting-candidate'))!;
  const stationChip = card.getByText(stationName, { exact: true });
  await expect(stationChip).toHaveCSS('background-color', /^rgba\(244, 67, 54, 0\.\d+\)$/);
  await expect(card).toHaveCSS('border-top-style', 'none');
  await expect(card).toHaveCSS('border-inline-start-style', 'none');
  const restingSurface = await card.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(restingSurface).not.toBe('rgba(0, 0, 0, 0)');
  const times = card.locator('[data-meeting-origin-time]');
  await expect(times).toHaveCount(2);
  await expect(times.first()).toContainText('新宿');
  await expect(times.first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(times.first().getByText('新宿', { exact: true })).toHaveCSS('background-color', /^rgba\(76, 175, 80, 0\.\d+\)$/);
  await times.first().click();
  await expect(card).toHaveAttribute('aria-current', 'true');
  await expect(card).toHaveCSS('border-inline-start-style', 'none');
  await expect(card).not.toHaveCSS('background-color', restingSurface);
  await expect(card.locator('svg.lucide-check')).toBeVisible();
  await expect(stationChip).toBeVisible();
  expect(errors).toEqual([]);
});

test('集合駅モード: 出発駅を集合駅に選んだときも、到着駅の札が1枚だけ出る', async ({ page }) => {
  await page.goto('/?mode=meeting&from=shibuya&with=ebisu');
  const candidate = page.locator('[data-meeting-candidate="恵比寿"]');
  await expect(candidate).toBeVisible();
  const markers = page.locator('.special-station-marker-inline, .station-marker')
    .filter({ has: page.getByText('恵比寿', { exact: true }) });
  await expect(markers).toHaveCount(1);
  await expect(markers.locator('div').first()).toHaveCSS('background-color', 'rgb(244, 67, 54)');
  await candidate.click();
  await expect(candidate).toHaveAttribute('aria-current', 'true');
  await expect(markers).toHaveCount(1);
  await expect(markers.locator('div').first()).toHaveCSS('background-color', 'rgb(244, 67, 54)');
});
