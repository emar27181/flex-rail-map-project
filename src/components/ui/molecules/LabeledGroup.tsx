/**
 * 見出しの語（小さな文字）と、それに続く札・チップの並び（モレキュール）。
 *
 * 畳んだ駅選択パネルの2行目で、「出発駅 [藤沢][船橋]　到着駅 [東京]」のように、色つきの札が何の駅かを
 * 文言で示すために使う（2026-11-14 ユーザー指示: 札だけでは、閉じたときに出発駅・到着駅だと分からない）。
 * 見出しと札は折り返しても離れない（1つのまとまりとして次の行へ落ちる）。何が並ぶか（駅など）は知らない。
 */
import React from 'react';
import type { ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';

export interface LabeledGroupProps {
  theme: 'light' | 'dark';
  /** 見出しの語 */
  label: string;
  /** 目印用（テストなど） */
  dataAttr?: Record<string, string>;
  children: ReactNode;
}

const LabeledGroup: React.FC<LabeledGroupProps> = ({ theme, label, dataAttr, children }) => {
  const colors = getThemeColors(theme);
  return (
    <span {...dataAttr} style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: L.sp.xs, minWidth: 0 }}>
      <span style={{ fontSize: FS.caption, color: colors.textSecondary, whiteSpace: 'nowrap' }}>{label}</span>
      {children}
    </span>
  );
};

export default LabeledGroup;
