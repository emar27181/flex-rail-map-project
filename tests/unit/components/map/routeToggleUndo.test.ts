import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('路線の切り替えの「元に戻す」（配線）', () => {
  const map = readFileSync('src/components/RailwayMap.tsx', 'utf8');
  const notice = readFileSync('src/components/map/MapNoticeSnackbar.tsx', 'utf8');

  it('知らせの表示が「元に戻す」を RouteToggleSnackbar に渡し、RailwayMap が切り替える前の状態に戻す', () => {
    expect(notice).toContain('onUndo=');
    expect(notice).toContain('onUndoRouteToggle');
    expect(map).toContain('onUndoRouteToggle={undoRouteToggle}');
    const fn = map.slice(map.indexOf('const undoRouteToggle'), map.indexOf('const [clickedRoute'));
    // 表示した路線は非表示に、非表示にした路線は表示に戻す
    expect(fn).toContain('n.shown');
    expect(fn).toContain('next.delete(key)');
    expect(fn).toContain('new Set([...prev, key])');
  });

  it('線をタップして足した路線（もともと一覧に無かった）は、元に戻すと一覧からも外す', () => {
    expect(map).toContain('const wasAvailable = availableRoutes.has(rKey);');
    expect(map).toContain('noticeRouteToggle(rKey, true, !wasAvailable);');
    expect(map).toContain('n.removeFromAvailable');
  });
});
