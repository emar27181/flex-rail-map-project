import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: (process.env['TEST_URL'] ?? 'http://localhost:8080'),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['iPhone 12 Pro'] },
    },
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      // mobile-layout.test.ts はモバイル端末コンテキスト（タッチ・セーフエリア・
      // デバイス解像度）を前提に書かれており、デスクトップブラウザで動かすと
      // アプリの不具合ではない失敗が出る。ファイル内でビューポートを切り替えて
      // デスクトップ幅の挙動も検証しているため、mobile-chrome側だけで実行すれば足りる。
      testIgnore: /mobile-layout\.test\.ts$/,
    },
  ],
  webServer: process.env['TEST_URL']
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:8080',
        reuseExistingServer: true,
        timeout: 30000,
      },
});
