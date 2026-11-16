import type { ReactNode } from 'react';
import { Check, Circle } from 'lucide-react';
import { SEMANTIC } from '../../../constants/ui';
import Chip from './Chip';

interface Props {
  label: string;
  theme: 'light' | 'dark';
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export default function SettingToggle({ label, theme, checked, onChange, icon, disabled }: Props) {
  return <Chip
    theme={theme}
    size="sm"
    color={SEMANTIC.primary}
    selected={checked}
    disabled={disabled}
    label={label}
    icon={icon ?? (checked ? <Check /> : <Circle />)}
    onClick={() => onChange(!checked)}
    styleOverride={{ alignSelf: 'flex-start' }}
  />;
}
