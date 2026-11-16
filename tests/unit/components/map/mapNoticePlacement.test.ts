import { describe, it, expect } from 'vitest';
import { placeBelow } from '../../../../src/components/map/mapNoticePlacement';
import { noticePlacement, MESSAGE_NOTICE_DURATION_MS } from '../../../../src/components/map/mapNotice';
import { SNACKBAR_DURATION_MS } from '../../../../src/components/ui/molecules/Snackbar';

describe('noticePlacement（知らせを出す場所は種類で決める）', () => {
  it('駅選択パネルでの操作の結果（文の案内）は、操作した場所の近くに出す', () => {
    expect(noticePlacement({ kind: 'message', message: '到着駅を設定してください' })).toBe('near-input');
  });
  it('地図の線をタップした結果は、地図の下に出す', () => {
    expect(noticePlacement({ kind: 'routeToggle', routeKey: 'yamanote', shown: true })).toBe('bottom');
  });
  it('行動が必要な文は、短い知らせより長く出しておく', () => {
    expect(MESSAGE_NOTICE_DURATION_MS).toBeGreaterThan(SNACKBAR_DURATION_MS);
  });
});

describe('placeBelow（パネルのすぐ下に、左端をそろえて置く）', () => {
  const container = { left: 0, top: 0, right: 400, bottom: 800 };

  it('パネルの左端にそろえ、下に隙間を空け、幅はパネルを超えない', () => {
    const panel = { left: 10, top: 10, right: 290, bottom: 200 };
    expect(placeBelow(panel, container, 8, 240)).toEqual({ left: 10, top: 208, maxWidth: 280 });
  });

  it('パネルが狭くても、文が読める最小の幅は取る', () => {
    const panel = { left: 10, top: 10, right: 110, bottom: 60 };
    expect(placeBelow(panel, container, 8, 240).maxWidth).toBe(240);
  });

  it('地図の右端からはみ出さないよう、左端を内側へ寄せる', () => {
    const panel = { left: 300, top: 10, right: 390, bottom: 60 };
    const p = placeBelow(panel, container, 8, 240);
    expect(p.left + p.maxWidth).toBeLessThanOrEqual(400);
    expect(p.left).toBeGreaterThanOrEqual(0);
  });

  it('地図（親）の座標に直す（親が画面の途中から始まっていても）', () => {
    const offsetContainer = { left: 50, top: 100, right: 450, bottom: 900 };
    const panel = { left: 60, top: 110, right: 340, bottom: 300 };
    expect(placeBelow(panel, offsetContainer, 8, 240)).toEqual({ left: 10, top: 208, maxWidth: 280 });
  });

  it('地図より狭い画面では、最小の幅を地図の幅で止める', () => {
    const narrow = { left: 0, top: 0, right: 200, bottom: 600 };
    const p = placeBelow({ left: 0, top: 0, right: 100, bottom: 50 }, narrow, 8, 240);
    expect(p.maxWidth).toBe(200);
  });
});
