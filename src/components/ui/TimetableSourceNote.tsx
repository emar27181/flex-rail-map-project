/**
 * 時刻表の最終更新日・出典を軽く示す注記。
 *
 * 駅ツールチップの時刻表示は概算値（公式時刻表そのものではない）のため、
 * 利用者が実時刻と取り違えないよう、リストの一番上（読む前）に
 * 更新日と出典への軽いリンクを出す。以前はリストの一番下にだけ
 * あり、スクロールしないと目に入らなかった。
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
      opacity: 0.75,
      lineHeight: 1.4,
      display: 'flex',
      gap: L.sp.xs,
      flexWrap: 'wrap',
    }}>
      <span>{translateUI('lastUpdated', language)}: {updatedAt}</span>
      <a
        href="/about"
        style={{ color: 'inherit', textDecoration: 'underline' }}
        onClick={(e) => e.stopPropagation()}
      >
        {translateUI('dataSource', language)}: {source}
      </a>
    </div>
  );
}
