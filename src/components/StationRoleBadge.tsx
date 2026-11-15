/**
 * 駅の役割の札（「出発駅」「到着駅」）。駅の名前の横に添えて、その駅がいま出発駅・到着駅に
 * なっていることを、初見でも分かるようにする（2026-11-14 ユーザー指示: 駅のツールチップに文言が無かった）。
 *
 * 色は入力欄・地図の駅の印と同じ役割の色（出発=緑・到着=赤。`ROLE_FIELD_COLOR` = `SEMANTIC`）。
 * 見た目は `ColorChip`、文言は既存の `departureStation` / `arrivalStation`。駅の判定は呼び出し側で行い、ここは見せるだけ。
 */
import React from 'react';
import ColorChip from './ui/ColorChip';
import { ROLE_FIELD_COLOR, type FieldRole } from './ui/molecules/RoleField';
import { translateUI, type Language } from '../utils/translation';

export interface StationRoleBadgeProps {
  role: FieldRole;
  theme: 'light' | 'dark';
  language: Language;
}

const StationRoleBadge: React.FC<StationRoleBadgeProps> = ({ role, theme, language }) => (
  <span data-station-role={role} style={{ display: 'inline-flex' }}>
    <ColorChip color={ROLE_FIELD_COLOR[role]} theme={theme} bold>
      {translateUI(role === 'departure' ? 'departureStation' : 'arrivalStation', language)}
    </ColorChip>
  </span>
);

export default StationRoleBadge;
