/**
 * 検索流入向けガイドページ（/guides/*, /en/guides/*）の追加スタイル。
 *
 * 固定ページ共通の `staticPageCss`（.container, .back-link, .info-box 等）
 * をベースに使い、ここではガイドページ特有の部品（パンくず・CTA・
 * 検索意図への直接回答・関連ガイド一覧）だけを足す。値はすべて
 * staticPageStyles.ts と同じ定義元（デザイントークン）から取る。
 */
import { getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';
import { L } from '../components/legend/legendStyles';

const light = getThemeColors('light');
const dark = getThemeColors('dark');

export const guideCss = `
.breadcrumb {
  font-size: ${FS.caption};
  color: ${light.textSecondary};
  margin-bottom: ${L.sp['2xl']};
}
body.dark .breadcrumb { color: ${dark.textSecondary}; }
.breadcrumb a { color: inherit; text-decoration: underline; }

/* 検索意図への直接回答。本文より少し強調する */
.lede {
  font-size: ${FS.title};
  line-height: 1.7;
  margin-bottom: ${L.sp['3xl']};
}

/* CTAは.back-linkと同じ「塗りの主要ボタン」を使い、ここでは配置だけ足す */
.cta-block {
  margin: ${L.sp['4xl']} 0;
  padding: ${L.sp['3xl']};
  border-radius: ${L.r.card};
  background-color: ${light.surface};
  border: 1px solid ${light.border};
  text-align: center;
}
body.dark .cta-block { background-color: ${dark.surface}; border-color: ${dark.border}; }
.cta-block .back-link { margin-bottom: ${L.sp.md}; font-size: ${FS.input}; }
.cta-block .cta-note {
  margin: 0;
  font-size: ${FS.caption};
  color: ${light.textSecondary};
}
body.dark .cta-block .cta-note { color: ${dark.textSecondary}; }

.related-list { list-style: none; margin: 0; padding: 0; }
.related-list li { margin-bottom: ${L.sp.md}; }
.related-list a {
  display: block;
  padding: ${L.sp.lg} ${L.sp.xl};
  border-radius: ${L.r.control};
  border: 1px solid ${light.border};
  background-color: ${light.surface};
}
body.dark .related-list a { border-color: ${dark.border}; background-color: ${dark.surface}; }
.related-list a:hover { text-decoration: none; border-color: ${light.primary}; }
body.dark .related-list a:hover { border-color: ${dark.primary}; }
`;
