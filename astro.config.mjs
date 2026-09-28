// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import seoSitemap from './src/integrations/seoSitemap.ts';

// https://astro.build/config
export default defineConfig({
  // seoSitemap: ビルド後に sitemap.xml を自動生成し、canonical・hreflang 等を検証する
  integrations: [react(), seoSitemap()]
});