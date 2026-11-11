import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const source = (path: string) => readFileSync(join(root, path), 'utf8');

describe('終電マップ試作は元の地図UI上で表示する', () => {
  it('独立SVGマップ/独立CSSを使わず元のLeafletレイヤーを利用する', () => {
    const map = source('src/components/RailwayMap.tsx');
    expect(map).toContain("get('experiment') === 'last-train'");
    expect(map).toContain('<MapContainer');
    expect(map).toContain('lastTrainFilterActive && mapViewMode');
    expect(map).toContain('renderStationMarker(st, rk');
    expect(map).toContain('DEMO_LINES.map(line =>');
    expect(existsSync(join(root, 'src/components/LastTrainDemo.tsx'))).toBe(false);
    expect(existsSync(join(root, 'src/styles/last-train-demo.css'))).toBe(false);
  });
  it('既存の到着駅検索・デザインアトムを使い、PC/スマホ/全画面で共通の操作を描画', () => {
    const station = source('src/components/StationSelector.tsx');
    const map = source('src/components/RailwayMap.tsx');
    const controls = source('src/components/LastTrainModeControls.tsx');
    expect(station).toContain('lastTrainDemoMode');
    expect(station).toContain('{extraContent}');
    expect(map.match(/extraContent={lastTrainTrialPanel}/g)?.length).toBe(3);
    expect(controls).toContain("import Button from './ui/atoms/Button'");
    expect(controls).toContain("import Slider from './ui/atoms/Slider'");
    expect(controls).toContain("import Select from './ui/atoms/Select'");
    expect(controls).not.toContain('<svg');
  });
  it('元の地図の通常アクセスはクエリ付き試作と独立している', () => {
    const page = source('src/pages/index.astro');
    expect(page).toContain('ThemeWrapper');
    const lab = source('src/pages/labs/last-train.astro');
    expect(lab).toContain('/?experiment=last-train');
    expect(lab).not.toContain('LastTrainDemoApp');
  });
});
