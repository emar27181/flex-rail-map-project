import { describe, expect, it } from 'vitest';
import { parseDisplayUrlParams } from '../../../src/utils/mapDisplayUrlParam';

describe('shareable map display URL', () => {
  it('supports 3D versions and ground appearance', () => {
    expect(parseDisplayUrlParams('?view=terrain3d&terrainVersion=v1&ground=0&groundStyle=elevation')).toEqual({
      view: 'terrain3d', terrainVersion: 'v1', ground: false, groundStyle: 'elevation',
    });
  });
  it('supports bubble and heatmap indicators independently', () => {
    expect(parseDisplayUrlParams('?view=bubble&heatmap=1&heatmapParam=cafeCount')).toEqual({
      view: 'bubble', heatmap: true, heatmapParam: 'cafeCount',
    });
  });
  it('ignores invalid and unknown values instead of guessing', () => {
    expect(parseDisplayUrlParams('?view=madeup&heatmap=yes&heatmapParam=unknown&ground=no&terrainVersion=v3')).toEqual({});
  });
  it('keeps existing defaults when not supplied', () => {
    expect(parseDisplayUrlParams('')).toEqual({});
  });
});
