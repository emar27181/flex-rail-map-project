import { describe, it, expect } from 'vitest';
import { buildHreflangLinks, canonicalUrl, hreflangCode } from '../../../src/config/seo';

describe('hreflang', () => {
  it('中国語版は URL を /zh/ のまま、hreflang は zh-CN にする', () => {
    const links = buildHreflangLinks(
      [{ lang: 'ja', path: '/guides/a' }, { lang: 'zh', path: '/zh/guides/a' }, { lang: 'ko', path: '/ko/guides/a' }],
      'ja',
    );
    expect(links).toEqual([
      { hreflang: 'ja', href: canonicalUrl('/guides/a') },
      { hreflang: 'zh-CN', href: canonicalUrl('/zh/guides/a') },
      { hreflang: 'ko', href: canonicalUrl('/ko/guides/a') },
      { hreflang: 'x-default', href: canonicalUrl('/guides/a') },
    ]);
    expect(hreflangCode('en')).toBe('en');
  });

  it('1言語しか無いページには hreflang を出さない', () => {
    expect(buildHreflangLinks([{ lang: 'ja', path: '/a' }], 'ja')).toEqual([]);
  });
});
