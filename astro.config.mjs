// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import seoSitemap from './src/integrations/seoSitemap.ts';

/**
 * ビルドした時刻とコミット。設定パネルの「バージョン」と /version.json（更新の確認）で使う（src/utils/appVersion.ts）。
 * コミットは Netlify のビルドなら COMMIT_REF、手元では空
 */
const BUILT_AT = new Date().toISOString();
const COMMIT = (process.env.COMMIT_REF || '').slice(0, 7);

// https://astro.build/config
export default defineConfig({
  vite: {
    define: {
      __APP_BUILT_AT__: JSON.stringify(BUILT_AT),
      __APP_COMMIT__: JSON.stringify(COMMIT),
    },
  },
  // seoSitemap: ビルド後に sitemap.xml を自動生成し、canonical・hreflang 等を検証する
  integrations: [react(), seoSitemap()]
});