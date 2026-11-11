import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

describe('終電モードは元のUIだけで操作する（回帰防止）', () => {
  it('独立画面や専用の操作パネル・スライダー・追加CSSを作らない', () => {
    const map = read('src/components/RailwayMap.tsx');
    for (const obsolete of [
      'LastTrainDemoApp', 'LastTrainModeControls', 'lastTrainTrialPanel',
      'demoPlaying', 'demoInspectedStation', 'extraContent={lastTrainTrialPanel}',
    ]) expect(map, obsolete).not.toContain(obsolete);
    expect(existsSync(join(root, 'src/components/LastTrainModeControls.tsx'))).toBe(false);
    expect(existsSync(join(root, 'src/components/LastTrainDemo.tsx'))).toBe(false);
    expect(existsSync(join(root, 'src/styles/last-train-demo.css'))).toBe(false);
    expect(read('src/pages/labs/last-train.astro')).toContain('/?experiment=last-train');
  });
  it('同じStationSelectorと時刻入力で切り替え、元のLeaflet地図に結果を描く', () => {
    const map = read('src/components/RailwayMap.tsx');
    const selector = read('src/components/StationSelector.tsx');
    expect(map).toContain("get('experiment') === 'last-train'");
    expect(map).toContain('<MapContainer');
    expect(map).toContain('lastTrainFilterActive && mapViewMode');
    expect(map).toContain('renderStationMarker(st, rk');
    expect(map).toContain('demoNetwork?.lines.map(line =>');
    expect(map.match(/<StationSelector/g)?.length).toBe(3);
    expect(map.match(/onLastTrainModeChange={handleLastTrainModeChange}/g)?.length).toBe(3);
    expect(selector).toContain('onLastTrainModeChange(!lastTrainModeEnabled)');
    expect(selector).toContain('onDepartureTimeChange(e.target.value)');
    expect(selector).toContain("arrivalRef.current?.querySelector('input')?.focus()");
    expect(selector).not.toContain('extraContent');
    expect(selector).not.toContain('lt-inspected-station');
    expect(selector).not.toContain('<Slider');
    expect(selector).not.toContain('disabled={!arrival || !lastTrainDestinationSupported}');
  });
  it('元のサイトは試作モードがデフォルトでOFF', () => {
    const map = read('src/components/RailwayMap.tsx');
    expect(map).toContain('setLastTrainModeEnabled');
    expect(map).toContain('useState(false)');
    expect(read('src/pages/index.astro')).toContain('ThemeWrapper');
  });
});
