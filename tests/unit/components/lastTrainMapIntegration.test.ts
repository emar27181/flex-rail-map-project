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
    // 到着駅が未選択のときの案内は下の帯（知らせ）で出し、入力欄にはカーソルを移さない
    expect(selector).not.toContain("arrivalRef.current?.querySelector('input')?.focus()");
    expect(selector).not.toContain('extraContent');
    expect(selector).not.toContain('lt-inspected-station');
    expect(selector).not.toContain('<Slider');
    expect(selector).not.toContain('disabled={!arrival || !lastTrainDestinationSupported}');
  });
  it('終電モードの路線上限は通常の候補路線数設定をそのまま使い、固定30路線にしない', () => {
    const map = read('src/components/RailwayMap.tsx');
    expect(map).toContain('buildDestinationDemoNetwork(arrival.name, maxRouteRecommendations)');
    expect(map).toContain('[lastTrainDemo, arrival?.name, maxRouteRecommendations]');
    expect(map.split('const [maxRouteRecommendations, setMaxRouteRecommendations] = useState(DEFAULT_ROUTE_RECOMMENDATION_LIMIT)').length - 1).toBe(1);
    expect(map).toContain('ROUTE_RECOMMENDATION_LIMIT_OPTIONS.map(count =>');
    expect(map).toContain("import { DEFAULT_ROUTE_RECOMMENDATION_LIMIT, ROUTE_RECOMMENDATION_LIMIT_OPTIONS } from '../constants/routeRecommendationLimit'");
    expect(read('src/constants/routeRecommendationLimit.ts')).toContain('DEFAULT_ROUTE_RECOMMENDATION_LIMIT = 5');
    expect(map).toContain('onChange={(e) => setMaxRouteRecommendations(Number(e.target.value))}');
  });
  it('到着駅未設定の案内は既存のSnackbarを使い新規パネルを増やさない', () => {
    const map = read('src/components/RailwayMap.tsx');
    const selector = read('src/components/StationSelector.tsx');
    const i18n = read('src/utils/lastTrainDemoI18n.ts');
    // 知らせは useMapNotice の1か所で管理する（路線切替などと同じ帯。専用の状態・表示を作らない）
    expect(map).toContain("import MapNoticeSnackbar from './map/MapNoticeSnackbar'");
    expect(map).toContain('notifyMessage(lastTrainCopy(currentLanguage).chooseArrivalNotice)');
    expect(map).not.toContain('lastTrainArrivalNoticeId');
    expect(selector).toContain('onLastTrainModeChange(!lastTrainModeEnabled)');
    expect(i18n).toContain('終電モードを使用するには、到着駅を設定してください。');
    expect(map).not.toContain('LastTrainModeControls');
  });
  it('元のサイトは試作モードがデフォルトでOFF', () => {
    const map = read('src/components/RailwayMap.tsx');
    expect(map).toContain('setLastTrainModeEnabled');
    expect(map).toContain('useState(false)');
    expect(read('src/pages/index.astro')).toContain('ThemeWrapper');
  });
});
