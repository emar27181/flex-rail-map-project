/**
 * 時刻表の最終更新日・出典を軽く示す注記。
 *
 * 駅ツールチップの時刻表示は概算値（公式時刻表そのものではない）のため、
 * 利用者が実時刻と取り違えないよう、リストの一番上（読む前）に
 * 更新日と出典への軽いリンクを出す。以前はリストの一番下にだけ
 * あり、スクロールしないと目に入らなかった。
 *
 * 出典の詳しい文章（TIMETABLE_SOURCE.title 等）はリンクのtitle属性
 * （ホバーで見える）とリスト最下部の但し書きに任せ、ここでは
 * 「出典」の一語だけにする。以前は出典の説明文をそのまま表示していて、
 * 狭い右カラムでは2〜3行に折り返し、時刻を読む前の領域を取りすぎていた。
 */
import { translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';
import { FS } from '../../constants/ui';
import { L } from '../legend/legendStyles';
import { getThemeColors } from '../../contexts/ThemeContext';

export interface TimetableSourceNoteProps {
  updatedAt: string;
  source: string;
  theme: 'light' | 'dark';
  language: Language;
}

export default function TimetableSourceNote({ updatedAt, source, theme, language }: TimetableSourceNoteProps) {
  const colors = getThemeColors(theme);

  return (
    <div style={{
      padding: `${L.sp.xxs} ${L.sp.md}`,
      borderBottom: `1px solid ${colors.borderLight}`,
      fontSize: FS.caption,
      color: colors.textSecondary,
      opacity: 0.6,
      lineHeight: 1.3,
      display: 'flex',
      alignItems: 'baseline',
      gap: L.sp.xxs,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {translateUI('lastUpdated', language)}: {updatedAt}
      </span>
      <span aria-hidden>・</span>
      {/* 出典の詳しい文章はホバーのtitleに任せ、リンク自体は「出典」の一語だけにする */}
      <a
        href="/about"
        title={source}
        style={{ color: 'inherit', textDecoration: 'underline', flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {translateUI('dataSource', language)}
      </a>
    </div>
  );
}
