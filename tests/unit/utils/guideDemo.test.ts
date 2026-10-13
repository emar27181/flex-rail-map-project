/**
 * ガイド（/guides/*）の冒頭の地図デモ（utils/guideDemo.ts）のテスト。
 * 京都・大阪・札幌・小田急・東京のすべてのガイド・すべての言語に、実際に触れる地図を置く。
 */
import { describe, it, expect } from 'vitest';
import { guides } from '../../../src/data/guides';
import { guideDemoRoutes, guideDemoSrc, guideDemoFitStations, GUIDE_DEMO_CITY_RADIUS_KM } from '../../../src/utils/guideDemo';
import { routes } from '../../../src/data/routes';
import { EMBED_PARAM } from '../../../src/utils/embedMode';

describe('ガイドの地図デモ', () => {
  it('すべてのガイドに、路線を絞った埋め込みの地図がある', () => {
    for (const g of guides) {
      const keys = guideDemoRoutes(g);
      expect(keys.length, `${g.lang} ${g.slug}`).toBeGreaterThan(0);
      const src = guideDemoSrc(g);
      expect(src, g.slug).toContain(`${EMBED_PARAM}=1`);
      expect(src, g.slug).toContain('routes=');
      expect(src, g.slug).toContain('center=');
      expect(src, g.slug).toContain(`lang=${g.lang}`);
    }
  });

  it('ガイドの CTA と同じ路線を出す（京都なら地下鉄2路線・京阪・JR奈良線）', () => {
    const kyoto = guides.find(g => g.slug === 'kyoto-train-map' && g.lang === 'ja')!;
    expect(guideDemoRoutes(kyoto)).toEqual(kyoto.ctaRoutes);
  });

  it('都市のガイドは街の中心付近で範囲を決める（京都は大阪・奈良まで広げない）', () => {
    const kyoto = guides.find(g => g.slug === 'kyoto-train-map' && g.lang === 'ja')!;
    const fit = guideDemoFitStations(kyoto).map(s => s.lat);
    // 淀屋橋（大阪）・奈良は入らない
    const yodoyabashi = routes.keihanMainLine!.find(s => s.name === '淀屋橋')!;
    expect(fit).not.toContain(yodoyabashi.lat);
    expect(GUIDE_DEMO_CITY_RADIUS_KM).toBeLessThan(20);
  });
});
