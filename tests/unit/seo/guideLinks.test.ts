import { describe, it, expect } from 'vitest';
import { routes } from '../../../src/data/routes';
import { guides } from '../../../src/data/guides';
import { getSeoModel, type SeoLang } from '../../../src/seo/pageModel';
import { getRouteCode } from '../../../src/utils/routeUrlCodes';

const model = getSeoModel();
const LANG_PREFIX = /^\/(en|zh|ko)(?=\/)/;

/** サイト内のパスが、実際に作っているページか */
function pageExists(href: string): boolean {
  const path = href.split(/[?#]/)[0];
  const lang = (path.match(LANG_PREFIX)?.[1] ?? 'ja') as SeoLang;
  const rest = path.replace(LANG_PREFIX, '');
  const [, kind, slug] = rest.split('/');
  if (kind === 'guides') return !slug || guides.some(g => g.lang === lang && g.slug === slug);
  if (kind === 'lines') return !slug || model.lines.some(l => l.slug === slug);
  if (kind === 'stations') return !slug || model.stations.some(s => s.slug === slug && s.langs.includes(lang));
  return true; // 記事・固定ページはここでは確かめない
}

describe('ガイドのリンクと地図CTA', () => {
  it('関連リンクの駅・路線・ガイドのページは実在する（その言語版がある）', () => {
    for (const g of guides) {
      for (const r of g.related) expect(pageExists(r.href), `${g.lang}/${g.slug} → ${r.href}`).toBe(true);
    }
  });

  it('CTA で開く路線は路線データにあり、URL のコードがある', () => {
    for (const g of guides) {
      const all = [...(g.ctaRoutes ?? []), ...g.sections.flatMap(s => s.cta?.routes ?? [])];
      for (const r of all) {
        expect(routes[r], `${g.slug}: ${r}`).toBeDefined();
        expect(getRouteCode(r), `${g.slug}: ${r}`).toBeDefined();
      }
    }
  });

  it('同じ slug のガイドは4言語そろっているか、そろっていなくても相互にリンクしている', () => {
    for (const g of guides) {
      const others = guides.filter(x => x.slug === g.slug && x.lang !== g.lang);
      for (const o of others) {
        const target = o.lang === 'ja' ? `/guides/${o.slug}` : `/${o.lang}/guides/${o.slug}`;
        expect(g.related.some(r => r.href === target), `${g.lang}/${g.slug} → ${target}`).toBe(true);
      }
    }
  });
});
