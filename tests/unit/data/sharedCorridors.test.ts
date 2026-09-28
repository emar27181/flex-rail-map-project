import { describe, it, expect } from 'vitest';
import { routes, routeColors } from '../../../src/data/routes';
import { SHARED_CORRIDORS, MIN_CORRIDOR_COLOR_DISTANCE } from '../../../src/data/sharedCorridors';
import { colorDistance } from '../../../src/utils/colorDistance';

describe('並走区間の路線色', () => {
  it('並走区間に挙げた路線はすべて存在する', () => {
    for (const c of SHARED_CORRIDORS) {
      for (const rk of c.routes) expect(routes[rk], `${c.id}: ${rk}`).toBeDefined();
    }
  });

  it('同じ区間を走る路線どうしは見分けられる色になっている', () => {
    const tooClose: string[] = [];
    for (const c of SHARED_CORRIDORS) {
      for (let i = 0; i < c.routes.length; i++) {
        for (let j = i + 1; j < c.routes.length; j++) {
          const a = c.routes[i], b = c.routes[j];
          const d = colorDistance(routeColors[a], routeColors[b]);
          if (d < MIN_CORRIDOR_COLOR_DISTANCE) {
            tooClose.push(`${c.id}: ${a}(${routeColors[a]}) / ${b}(${routeColors[b]}) ΔE=${d.toFixed(1)}`);
          }
        }
      }
    }
    expect(tooClose).toEqual([]);
  });
});

describe('colorDistance', () => {
  it('同色は0、白黒は100', () => {
    expect(colorDistance('#F68B1E', '#F68B1E')).toBe(0);
    expect(colorDistance('#000000', '#FFFFFF')).toBeCloseTo(100, 0);
  });
});
