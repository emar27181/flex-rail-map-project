import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { anchoredPointLabel } from '../../../../src/components/ui/molecules/anchoredPointLabel';
import { POINT_MARKER } from '../../../../src/components/ui/atoms/pointMarker';
import { textBadgeStyle } from '../../../../src/components/ui/atoms/textBadge';
import { FS, SEMANTIC } from '../../../../src/constants/ui';
import { L } from '../../../../src/components/legend/legendStyles';
import { filledLabelColors, meetsContrast } from '../../../../src/utils/contrast';

describe('投影した点の小さな印とラベル', () => {
  it.each(['light', 'dark'] as const)('%s: 出発・到着の印は外径6pxで中心が投影位置と一致する', theme => {
    for (const color of [SEMANTIC.departure, SEMANTIC.arrival]) {
      const root = anchoredPointLabel('東京', color, theme);
      const [point, label] = Array.from(root.children) as HTMLElement[];
      expect(root.style.width).toBe('0px');
      expect(root.style.height).toBe('0px');
      expect(root.style.pointerEvents).toBe('none');
      expect(point.style.width).toBe(`${POINT_MARKER.diameterPx}px`);
      expect(point.style.height).toBe(`${POINT_MARKER.diameterPx}px`);
      expect(point.style.boxSizing).toBe('border-box');
      expect(point.style.left).toBe(`${-POINT_MARKER.diameterPx / 2}px`);
      expect(point.style.top).toBe(point.style.left);
      expect(label.style.bottom).toBe(`${POINT_MARKER.diameterPx / 2 + parseFloat(L.sp.xs)}px`);
      expect(label.style.fontSize).toBe(FS.caption);
      expect(label.style.fontFamily).toBe('inherit');
      expect(label.textContent).toBe('東京');
    }
  });

  it('文字はHTMLとして解釈せず、多言語・長い駅名でも印の寸法を変えない', () => {
    for (const text of ['Tokyo', '東京', '도쿄', '<img src=x onerror=alert(1)>']) {
      const root = anchoredPointLabel(text, SEMANTIC.departure, 'light');
      expect(root.querySelector('img')).toBeNull();
      expect(root.children[1].textContent).toBe(text);
      expect((root.children[0] as HTMLElement).style.width).toBe('6px');
      expect((root.children[1] as HTMLElement).style.whiteSpace).toBe('nowrap');
    }
  });

  it('小ラベルの文字・余白・色は既存トークンとコントラスト規則を使う', () => {
    const style = textBadgeStyle(SEMANTIC.departure, 'dark');
    const colors = filledLabelColors(SEMANTIC.departure, 'dark');
    expect(style.fontSize).toBe(FS.caption);
    expect(style.padding).toBe(`${L.sp.xxs} ${L.sp.xs}`);
    expect(style.borderRadius).toBe(L.r.control);
    expect(style.backgroundColor).toBe(colors.background);
    expect(style.color).toBe(colors.text);
    expect(meetsContrast(colors.background, colors.text)).toBe(true);
  });

  it('立体表示は共通部品だけを使い、巨大な球と独自の駅名styleを復活させない', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/Terrain3DView.tsx'), 'utf8');
    // The new station icons are intentionally world-sized meshes instead of 6px CSS points.
    // Shared marker geometry and label styles must remain centralized.
    expect(source).toContain('STATION_DIAMETER_KM');
    expect(source).toContain('THREE.InstancedMesh');
    expect(source).toContain('textBadgeStyle(');
    expect(source).toContain('plainTextLabelStyle(');
    expect(source).not.toMatch(/MARKER_RATIO|Object\\.assign\\(label\\.style/);
  });
});
