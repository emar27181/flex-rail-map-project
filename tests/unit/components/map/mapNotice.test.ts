import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { nextMapNotice, type MapNotice } from '../../../../src/components/map/mapNotice';

describe('nextMapNotice', () => {
  it('新しい知らせは前のものを置き換え、id が進む（同じ内容でも数え直せる）', () => {
    const a = nextMapNotice(null, { kind: 'routeToggle', routeKey: 'yamanote', shown: false });
    expect(a).toEqual({ kind: 'routeToggle', routeKey: 'yamanote', shown: false, id: 1 });
    const b: MapNotice = nextMapNotice(a, { kind: 'message', message: '到着駅を設定してください' });
    expect(b).toEqual({ kind: 'message', message: '到着駅を設定してください', id: 2 });
    expect(nextMapNotice(b, { kind: 'message', message: '到着駅を設定してください' }).id).toBe(3);
  });
});

describe('知らせは1か所で管理する（再発防止）', () => {
  const map = readFileSync('src/components/RailwayMap.tsx', 'utf8');
  const selector = readFileSync('src/components/StationSelector.tsx', 'utf8');

  it('RailwayMap は知らせの状態を useMapNotice だけで持ち、Snackbar を直接組まない', () => {
    expect(map).toContain('useMapNotice()');
    expect(map).not.toMatch(/import\s+Snackbar\b/);
    expect(map).not.toMatch(/import\s+RouteToggleSnackbar\b/);
    expect(map).not.toContain('<Snackbar');
    // 知らせごとの別の状態を作らない
    expect(map).not.toMatch(/useState[^;]*Notice/);
    // 表示の置き場所は1つ
    expect(map.match(/<MapNoticeSnackbar/g)?.length).toBe(1);
  });

  it('到着駅が無いときの終電モードの案内は、入力欄にカーソルを移さず知らせで出す', () => {
    const handler = map.slice(map.indexOf('const handleLastTrainModeChange'));
    expect(handler.slice(0, 600)).toContain('notifyMessage(');
    const button = selector.slice(selector.indexOf('onLastTrainModeChange(!lastTrainModeEnabled)') - 600, selector.indexOf('onLastTrainModeChange(!lastTrainModeEnabled)') + 100);
    expect(button).not.toContain('focus()');
    expect(button).not.toContain('setShowArrivalResults');
  });
});
