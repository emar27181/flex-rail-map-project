import type { CSSProperties } from 'react';
import { L } from '../../legend/legendStyles';
import { POINT_MARKER, pointMarkerStyle } from '../atoms/pointMarker';
import { textBadgeStyle } from '../atoms/textBadge';

function applyStyle(element: HTMLElement, style: CSSProperties) {
  for (const [property, value] of Object.entries(style)) {
    if (value === undefined) continue;
    // 数値はこの部品では幅・高さだけ。CSSの単位なし数値は文字の規則が担当する。
    const cssValue = typeof value === 'number' && ['width', 'height'].includes(property) ? `${value}px` : String(value);
    element.style.setProperty(property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`), cssValue);
  }
}

/** 投影した1点に、印と小ラベルを載せる。駅・Three.js・世界座標を知らない。 */
export function anchoredPointLabel(text: string, color: string, theme: 'light' | 'dark'): HTMLDivElement {
  const root = document.createElement('div');
  Object.assign(root.style, { position: 'relative', width: '0', height: '0', pointerEvents: 'none' });
  const point = document.createElement('span');
  point.setAttribute('aria-hidden', 'true');
  applyStyle(point, pointMarkerStyle(color, theme));
  Object.assign(point.style, { position: 'absolute', left: `${-POINT_MARKER.diameterPx / 2}px`, top: `${-POINT_MARKER.diameterPx / 2}px` });
  const label = document.createElement('span');
  label.textContent = text;
  applyStyle(label, textBadgeStyle(color, theme));
  Object.assign(label.style, { position: 'absolute', left: '0', bottom: `${POINT_MARKER.diameterPx / 2 + parseFloat(L.sp.xs)}px`, transform: 'translateX(-50%)' });
  root.append(point, label);
  return root;
}
