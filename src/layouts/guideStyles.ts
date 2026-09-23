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

/* FAQ（GuideLayoutのFAQセクション。表示内容はJSON-LDのFAQPageと完全一致させる） */
.faq-list { margin: 0; padding: 0; }
.faq-item {
  padding: ${L.sp.lg} 0;
  border-bottom: 1px solid ${light.borderLight};
}
body.dark .faq-item { border-color: ${dark.borderLight}; }
.faq-item:last-child { border-bottom: none; }
.faq-question {
  margin: 0 0 ${L.sp.xs} 0;
  font-size: ${FS.input};
  font-weight: bold;
}
.faq-answer {
  margin: 0;
  font-size: ${FS.body};
  line-height: 1.7;
  color: ${light.textSecondary};
}
body.dark .faq-answer { color: ${dark.textSecondary}; }

/* Map Preview / Visual（GuideLayoutのslot="visual"に各ガイドページが渡す簡易図解） */
.guide-visual {
  margin: ${L.sp['3xl']} 0;
  padding: ${L.sp['2xl']};
  border-radius: ${L.r.card};
  border: 1px solid ${light.border};
  background-color: ${light.surfaceElevated};
}
body.dark .guide-visual { border-color: ${dark.border}; background-color: ${dark.surfaceElevated}; }
.guide-visual-caption {
  margin: ${L.sp.md} 0 0 0;
  font-size: ${FS.caption};
  color: ${light.textSecondary};
  text-align: center;
}
body.dark .guide-visual-caption { color: ${dark.textSecondary}; }

/* シンプルな路線カラーチップ（実データのroutesColorsをそのまま使う） */
.route-chip-row { display: flex; flex-wrap: wrap; gap: ${L.sp.md}; justify-content: center; }
.route-chip {
  display: inline-flex; align-items: center; gap: ${L.sp.xs};
  padding: ${L.sp.xs} ${L.sp.lg};
  border-radius: ${L.r.pill};
  font-size: ${FS.caption};
  font-weight: bold;
  color: #fff;
}
.route-chip-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

/* 小田急の分岐図（駅を縦一列に並べ、分岐駅だけ横に支線を出す） */
.branch-diagram { display: flex; flex-direction: column; align-items: stretch; }
.branch-diagram-station {
  display: flex; align-items: center; gap: ${L.sp.lg};
  padding: ${L.sp.xxs} 0;
  font-size: ${FS.body};
}
.branch-diagram-dot {
  flex-shrink: 0;
  width: 10px; height: 10px; border-radius: 50%;
  background-color: var(--branch-color, ${light.primary});
  border: 2px solid ${light.surfaceElevated};
  box-shadow: 0 0 0 2px var(--branch-color, ${light.primary});
}
body.dark .branch-diagram-dot { border-color: ${dark.surfaceElevated}; }
.branch-diagram-line {
  width: 2px; height: ${L.sp.xl}; margin-left: 4px;
  background-color: var(--branch-color, ${light.primary});
}
.branch-diagram-branch {
  margin-left: ${L.sp['3xl']};
  padding-left: ${L.sp.xl};
  border-left: 2px solid var(--branch-color, ${light.primary});
}
.branch-diagram-branch-label {
  font-size: ${FS.caption};
  color: ${light.textSecondary};
  margin: ${L.sp.xs} 0 ${L.sp.xxs} ${L.sp['3xl']};
}
body.dark .branch-diagram-branch-label { color: ${dark.textSecondary}; }
`;
