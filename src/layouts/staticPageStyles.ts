/**
 * 固定ページ（about / contact / faq / privacy / terms）の共通スタイル。
 *
 * この5ページは同じ68行の `<style>` を丸ごとコピーして持っていた。
 * 完全に同一だったため、色や余白を変えるには5箇所を直す必要があり、
 * 実際に hreflang のドメインは3ページだけ古いまま取り残されていた。
 *
 * ここでCSSを1本組み立て、値はすべてアプリ本体と同じ定義元から取る。
 * 静的ページだけ違う青・違う余白になる状態を作らないため。
 */
import { getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';
import { L } from '../components/legend/legendStyles';
import { CONTROL_SIZE } from '../components/ui/atoms/controlSize';

const light = getThemeColors('light');
const dark = getThemeColors('dark');

/** 「路線図に戻る」はボタンの形をしたリンクなので、操作部品の規格に合わせる */
const link = CONTROL_SIZE.md;

/** 本文の行間。読み物なのでUIより広めに取る */
const BODY_LINE_HEIGHT = 1.6;

/** 本文の最大幅。1行が長くなりすぎると読み返す位置を見失う */
const CONTENT_MAX_WIDTH = '800px';

/** 見出しの下線の太さ */
const HEADING_RULE_WIDTH = '2px';

export const staticPageCss = `
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}
body.light { background-color: ${light.background}; color: ${light.text}; }
body.dark  { background-color: ${dark.background};  color: ${dark.text}; }
body.dark h1, body.dark h2, body.dark h3 { color: ${dark.text}; }
body.dark footer {
  background-color: ${dark.surface} !important;
  border-top-color: ${dark.border} !important;
  color: ${dark.textSecondary} !important;
}

.container {
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
  padding: ${L.sp['3xl']};
  line-height: ${BODY_LINE_HEIGHT};
}

.page-title {
  font-size: ${FS.display};
  border-bottom: ${HEADING_RULE_WIDTH} solid ${light.primary};
  padding-bottom: ${L.sp.md};
  margin-bottom: ${L.sp['4xl']};
}
h2 {
  border-bottom: ${HEADING_RULE_WIDTH} solid ${light.primary};
  padding-bottom: ${L.sp.md};
  margin-bottom: ${L.sp['4xl']};
}
h3 {
  color: ${light.primary};
  margin-top: ${L.sp['5xl']};
  margin-bottom: ${L.sp.xl};
}
body.dark .page-title, body.dark h2 { border-bottom-color: ${dark.primary}; }
body.dark a { color: ${dark.primary}; }

ul { margin-left: ${L.sp['3xl']}; }
li { margin-bottom: ${L.sp.md}; }

a { color: ${light.primary}; text-decoration: none; }
a:hover { text-decoration: underline; }

/* ボタンの形をしたリンク。高さ・角丸・文字は操作部品の規格から取る */
.back-link {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  min-height: ${link.minHeight}px;
  padding: ${link.padding};
  margin-bottom: ${L.sp['3xl']};
  border-radius: ${link.radius};
  font-size: ${link.fontSize};
  background-color: ${light.primary};
  color: ${light.onPrimary};
  text-decoration: none;
}
.back-link:hover { background-color: ${light.primaryHover}; text-decoration: none; }
body.dark .back-link { background-color: ${dark.primary}; color: ${dark.onPrimary}; }
body.dark .back-link:hover { background-color: ${dark.primaryHover}; }

/* 本文中で囲みたいひとかたまり（連絡先など） */
.info-box {
  background-color: ${light.surface};
  border: 1px solid ${light.border};
  padding: ${L.sp['3xl']};
  border-radius: ${L.r.card};
  margin: ${L.sp['3xl']} 0;
}
body.dark .info-box {
  background-color: ${dark.surface};
  border-color: ${dark.border};
}

/* 囲みの中の見出し。囲みの上端との間に余白を作らない */
.info-box .box-title { margin-top: 0; }
`;
