/**
 * 描画テスト（npm run test:render）。ビルドした本番と同じファイル（astro preview）を実際のブラウザで開き、
 * 地図と立体表示が「描けているか」を確かめる。CI の render ジョブで PR ごとに動く。
 *
 * - ユニットテスト（jsdom）では WebGL も Leaflet の描画も動かないので、描画の不具合（真っ黒・点滅・重なり）はここで見る
 * - WebGL は GPU の無い CI でも描けるよう、ソフトウェア描画（SwiftShader）を使う
 * - 何をここで確かめるか・足すときの決まりは docs/render-tests.md
 */
import { defineConfig } from '@playwright/test';

const PORT = 4321;
// サンドボックスなど、Playwright のブラウザを別の場所に入れている環境では PW_CHROMIUM_PATH で渡す
const executablePath = process.env['PW_CHROMIUM_PATH'] || undefined;

export default defineConfig({
  testDir: './tests/render',
  testMatch: /.*\.render\.ts$/,
  fullyParallel: true,
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    locale: 'ja-JP',
    colorScheme: 'dark',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
    },
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: {
    // ビルド済みの dist を配る（npm run build の後に動かす）
    command: `npx astro preview --port ${PORT} --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env['CI'],
    timeout: 60_000,
  },
});
