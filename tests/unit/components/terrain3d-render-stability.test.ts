import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('Terrain3D camera rendering stability', () => {
  const source = readFileSync(new URL('../../../src/components/Terrain3DView.tsx', import.meta.url), 'utf8');

  it('uses a precision-aware depth buffer', () => {
    expect(source).toContain('logarithmicDepthBuffer: true');
  });

  it('does not move the camera clipping planes on every animation frame', () => {
    const start = source.indexOf('const render = () =>');
    const end = source.indexOf('render();', start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    const loop = source.slice(start, end);
    expect(loop).not.toMatch(/camera\.(near|far)\s*=/);
    expect(loop).not.toContain('camera.updateProjectionMatrix()');
  });
});
