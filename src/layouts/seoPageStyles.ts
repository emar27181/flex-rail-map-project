/**
 * 駅・路線・データのページ（SeoPageLayout）の追加スタイル。
 *
 * 固定ページの staticPageCss とガイドの guideCss（パンくず・CTA・リンク一覧）を
 * 土台にし、ここでは表と路線チップだけを足す。値はすべてデザイントークンから取る。
 */
import { getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';
import { L } from '../components/legend/legendStyles';

const light = getThemeColors('light');
const dark = getThemeColors('dark');

/** 路線チップの色の印（路線色の丸）の直径 */
const SWATCH_SIZE = '10px';

export const seoPageCss = `
.seo-table-wrap { overflow-x: auto; margin: ${L.sp.md} 0 ${L.sp['2xl']}; }
.seo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: ${FS.body};
}
.seo-table th, .seo-table td {
  text-align: left;
  padding: ${L.sp.sm} ${L.sp.md};
  border-bottom: 1px solid ${light.borderLight};
  vertical-align: top;
}
.seo-table th { font-weight: bold; color: ${light.textSecondary}; white-space: nowrap; }
.seo-table td.num, .seo-table th.num { text-align: right; white-space: nowrap; }
/* 駅名は途中で折り返さない（「代官/山」のように切れると別の駅名に見える）。狭い画面では表が横に流れる */
.seo-table td.name { white-space: nowrap; }
body.dark .seo-table th, body.dark .seo-table td { border-bottom-color: ${dark.borderLight}; }
body.dark .seo-table th { color: ${dark.textSecondary}; }

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
