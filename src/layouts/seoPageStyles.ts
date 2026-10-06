/**
 * 駅・路線・データのページ（SeoPageLayout）の追加スタイル。
 *
 * 固定ページの staticPageCss とガイドの guideCss（パンくず・CTA・リンク一覧）を
 * 土台にし、ここでは表（ResponsiveTable の規格に色を渡す）と路線チップだけを足す。値はすべてデザイントークンから取る。
 */
import { getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';
import { L } from '../components/legend/legendStyles';
import { RESPONSIVE_TABLE_CSS } from '../components/ui/atoms/responsiveTable';
import { MAP_EMBED_CSS } from '../components/ui/atoms/mapEmbed';
import { CODE_BADGE_CSS } from '../components/ui/atoms/codeBadge';
import { shadow } from '../components/ui/atoms/shadow';

const light = getThemeColors('light');
const dark = getThemeColors('dark');

/** 路線チップの色の印（路線色の丸）の直径 */
const SWATCH_SIZE = '10px';

export const seoPageCss = `
/* 表の見せ方（スマホ・タブレット・PC）は ResponsiveTable の規格（ui/atoms/responsiveTable.ts）。ここでは色だけを渡す */
${RESPONSIVE_TABLE_CSS}
${MAP_EMBED_CSS}
${CODE_BADGE_CSS}
/* 部品の色（表・埋め込み）とページの差し色（路線のページは路線色。SeoPageLayout の accent） */
body {
  --rt-border: ${light.borderLight}; --rt-muted: ${light.textSecondary}; --rt-hover: ${light.surfaceHover};
  --me-border: ${light.border}; --me-surface: ${light.surface}; --me-shadow: ${shadow('raised', 'light')}; --me-muted: ${light.textSecondary};
  --page-accent: var(--page-accent-light);
}
body.dark {
  --rt-border: ${dark.borderLight}; --rt-muted: ${dark.textSecondary}; --rt-hover: ${dark.surfaceHover};
  --me-border: ${dark.border}; --me-surface: ${dark.surface}; --me-shadow: ${shadow('raised', 'dark')}; --me-muted: ${dark.textSecondary};
  --page-accent: var(--page-accent-dark);
}
/* 表の順番の数字も差し色にする */
.rtable .rt-index { color: var(--page-accent, inherit); font-weight: bold; }

.seo-chips { display: flex; flex-wrap: wrap; gap: ${L.sp.xs} ${L.sp.md}; margin: ${L.sp.md} 0; padding: 0; list-style: none; }
.seo-chip {
  display: inline-flex;
  align-items: center;
  gap: ${L.sp.xs};
  padding: ${L.sp.xxs} ${L.sp.md};
  border-radius: ${L.r.control};
  border: 1px solid ${light.border};
  font-size: ${FS.body};
}
body.dark .seo-chip { border-color: ${dark.border}; }
.seo-swatch {
  display: inline-block;
  width: ${SWATCH_SIZE};
  height: ${SWATCH_SIZE};
  border-radius: ${L.r.pill};
  flex-shrink: 0;
}

.seo-note {
  font-size: ${FS.caption};
  color: ${light.textSecondary};
  line-height: 1.6;
}
body.dark .seo-note { color: ${dark.textSecondary}; }

.seo-lang-switch { font-size: ${FS.caption}; margin-top: ${L.sp['4xl']}; }
`;
