import type { CSSProperties } from 'react';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { CONTROL_BORDER_WIDTH } from './controlSize';

export default function ScaleBar({ label, widthPx, style }: { label: string; widthPx: number; style?: CSSProperties }) {
  const border = `${CONTROL_BORDER_WIDTH}px solid currentColor`;
  return (
    <span data-map-scale style={{ ...style, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: FS.caption }}>
      {label}
      <span aria-hidden style={{ width: widthPx, height: L.sp.xs, borderInline: border, borderBottom: border, boxSizing: 'border-box' }} />
    </span>
  );
}
